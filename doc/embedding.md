Embedding programs in other web pages
=====================================

A QBasic program can run on any web page, showing only its screen: no editor, no menus. The
engine is the IDE's own (the QBJS compiler and runtime), so a program that runs in the IDE runs
the same way embedded.

There are two ways in:

* **The `<qb-program>` element**, for pages that can load a script. It takes the program
  written in the page, a `.bas` file, or a `.zip` package; it has methods and events, and can
  keep the files a program writes.
* **A plain `<iframe>` or a link**, for pages that can't run scripts (many blogs, wikis and
  forums) and for sharing: the settings go in the URL of `embed/player.html`, and a short
  program can travel in the link itself.

Both run the program in a sandboxed frame, so it can't touch the page around it.

**See it working:** `embed/demo.html` shows every form below, each with the HTML that makes
it. Open it from a web server (see [Hosting](#hosting-the-engine)), not as a file.

In the examples, `https://HOST/qb64-ide/` stands for wherever the engine is served.


The `<qb-program>` element
--------------------------

Load the script once, then use the element as often as you like:

```html
<script src="https://HOST/qb64-ide/embed/qb-embed.js" defer></script>
```

### The program written in the page

```html
<qb-program width="640" height="400" controls>
<script type="text/x-qbasic">
INPUT "What is your name"; n$
PRINT "Hello, "; n$
</script>
</qb-program>
```

Put the program in a `<script type="text/x-qbasic">`: the browser keeps it as raw text, so
`<`, `>` and `&` need no escaping and it doesn't show before the script loads. A `<template>`
or plain text inside the element also works (then `<` and `&` must be written as `&lt;` and
`&amp;`). The common indentation is removed, so the program can be indented with the HTML.

### A `.bas` file

```html
<qb-program src="games/snake.bas" autostart></qb-program>
```

`src` is fetched by the page, so a relative URL is relative to the page, and a file on the
same site needs nothing special. A file on another site must be served with CORS
(`Access-Control-Allow-Origin`), or the browser won't let the page read it; the player then
says so.

### A package

```html
<qb-program src="games/adventure.zip" controls></qb-program>
```

A package is a `.zip` holding the program and the files it uses (data, `$INCLUDE` files,
other programs it `RUN`s, `Import` libraries). `src` takes either a `.bas` or a `.zip`; they
are told apart by content, not by name. The files go into the program's file system, so
`OPEN "levels/1.dat"` finds `levels/1.dat` in the zip.

Which program runs:

1. the `main` attribute, if given (`main="tools/editor.bas"`);
2. otherwise `main` in the zip's `qbjs.json`;
3. otherwise the only `.bas` file in the zip;
4. otherwise `main.bas`, `index.bas`, or a `.bas` named like the zip (`adventure.bas` in
   `adventure.zip`);
5. otherwise it's an error that lists the programs, so the author can pick one with `main`.

If everything in the zip is inside one folder (as when zipping a folder), that folder is
removed from the paths, unless `main` names it.

An optional `qbjs.json` at the top of the zip:

```json
{
  "main": "adventure.bas",
  "title": "The Cave",
  "args": "--easy"
}
```

`title` is shown in the controls bar until the program sets its own with `_TITLE`; `args` is
what `COMMAND$` returns (the `args` attribute replaces it).

Limits: 5000 files and 50 MB unpacked. File names are cleaned, so a zip can't write outside
its own folder.

### A program with a package of files

The program and its files can come separately: the program inline (or a `.bas` in `src`), and
the files from `package`.

```html
<qb-program package="census-data.zip">
<script type="text/x-qbasic">
OPEN "people.dat" FOR INPUT AS #1
...
</script>
</qb-program>
```

The program is written to the top folder (or to `main`, if given), over any file of that name
in the package. `src` and `package` can't both be zips.

### Attributes

| Attribute | Meaning |
|---|---|
| `src` | URL of a `.bas` file or a `.zip` package |
| `package` | URL of a `.zip` whose files the program (inline, or a `.bas` `src`) runs with |
| `main` | In a package, the program to run. With inline or `.bas` source, the path to write it to (it starts in that folder) |
| `name` | File name for the program (default: the `src` file name, or `main.bas`). `COMMAND$(0)` returns it |
| `width`, `height` | Size of the box. A number is pixels; anything else is a CSS length (`100%`, `30em`). Default 640 × 400. The controls bar is added below |
| `scale` | `fit` (default): the program's screen is scaled to fit the box, keeping its shape. `none` or a number: the box takes the program's screen size, times the number |
| `autostart` | Run at once. Without it, a Run button covers the screen until the reader clicks it |
| `controls` | A bar under the screen: the program's title, Run, Stop, Restart and Full screen |
| `args` | What `COMMAND$` returns (default: the package's `qbjs.json` `args`) |
| `persist` | A key: the files the program writes are kept in this browser under that key, and given back next time (see [Keeping files](#keeping-files)) |
| `show-errors` | `off` or `false`: don't show errors over the screen (the events still fire) |
| `allow-downloads` | Let the program save files to the reader's computer (`FS.DownloadFile`) |
| `engine` | URL of `player.html` (default: next to `qb-embed.js`) |

Changing `src`, `package`, `main`, `name`, `args` or `persist` reloads the program; changing
the size, `scale` or `controls` takes effect at once.

The screen is drawn crisp (no smoothing) at any scale. The element is `display: inline-block`
by default; a page may set it to `block` or give it a `max-width`. Its parts can be styled from
the page as `qb-program::part(screen)` and `qb-program::part(controls)`.

The reader clicks the screen (or presses Run) to give it the keyboard. Keys then go to the
program, not the page.

### Methods and properties

```js
const p = document.querySelector('qb-program');

await p.load({ source: 'PRINT "Hi"', name: 'hi.bas' });  // replace the program
await p.load({ src: 'other.zip', main: 'b.bas' });        // or load another file
const { reason } = await p.run();   // runs (restarting if running); resolves when it ends
p.stop();
const data = await p.readFile('scores.txt');   // the file's bytes, or null if there's no such file
await p.writeFile('level.dat', 'text or bytes');
p.fullscreen();
await p.clearSaved();               // forget what persist kept

p.screenSize     // { width, height } of the program's screen, in its own pixels
p.programTitle   // what the program set with _TITLE
```

`load` takes `source`, `src`, `package`, `name`, `main` and `args` (the same meanings as the
attributes) and resolves with the program's path, or rejects with the reason it couldn't load.
`src` and `package` may also be a `Blob`, `ArrayBuffer` or typed array instead of a URL: a file
the reader picked, say. `run` resolves with `reason`: `'end'`, `'stop'`, `'compile-error'` or
`'error'`.

### Events

All bubble, with their data in `event.detail`:

| Event | `detail` | When |
|---|---|---|
| `qb-ready` | `{ path, manifest }` | the program is loaded and can run (`manifest`: the package's `qbjs.json`) |
| `qb-start` | `{ path }` | it starts, or a program it `RUN`s starts |
| `qb-end` | `{ reason }` | it ends: `'end'`, `'stop'`, `'compile-error'` or `'error'` |
| `qb-error` | `{ phase, line, file, message }` | `phase`: `'load'`, `'compile'` or `'run'` |
| `qb-message` | `{ kind, line, file, message }` | compiler warnings, and what the program writes with `_ECHO`, `_LOGINFO` and so on |
| `qb-resize` | `{ width, height }` | the program's screen changed size (`SCREEN`, `_NEWIMAGE`) |
| `qb-title` | `{ title }` | the program called `_TITLE` |
| `qb-saved` | `{ files, deleted }` | with `persist`: changed files were stored (their paths) |

```js
p.addEventListener('qb-message', (e) => console.log(e.detail.message));
p.addEventListener('qb-end', (e) => console.log('ended:', e.detail.reason));
```

### Keeping files

Each run starts from the files it was given: what a program writes is gone when the page
reloads. With `persist="some-key"`, the files the program creates, changes or deletes are kept
in the reader's browser (the page's IndexedDB) under that key, and laid over the package the
next time the page loads. Use a different key for each program on a site. `clearSaved()`
forgets them. They are saved when the program ends and every few seconds while it runs.

This is per browser and per site: another reader, or the same reader in another browser,
starts fresh. Empty folders are not kept.


A plain `<iframe>` or a link
----------------------------

Where the page can't load scripts, use `embed/player.html` directly:

```html
<iframe src="https://HOST/qb64-ide/embed/player.html?src=https://example.com/game.zip&autostart&controls"
        width="640" height="430"
        sandbox="allow-scripts allow-pointer-lock"
        allow="fullscreen; gamepad; autoplay"></iframe>
```

Keep the `sandbox` attribute exactly as shown: it is what keeps the program away from the page
(the player wraps itself in a sandboxed frame if it's missing, but don't rely on that). Add
`allow-downloads` to `sandbox` to let the program save files.

The settings are in the URL, after `?` or `#` (when both have one, `#` wins):

| Parameter | Meaning |
|---|---|
| `src`, `package`, `main`, `name`, `args` | as the element's attributes |
| `code` | the program itself, compressed (see below), in place of inline source |
| `scale` | `fit` (default), `none` or a number, as for the element; the frame keeps the size the page gives it |
| `autostart`, `controls` | present means on (`&autostart`); `=0`, `false`, `off` or `no` means off |
| `show-errors` | `off` hides the error box |

Some differences from the element:

* the player fetches the files itself, so even files on the engine's own site come
  cross-origin and need CORS;
* a relative `src` or `package` is relative to the engine's folder (where `index.html` is),
  not the embedding page: `src=embed/demo/bounce.bas`;
* there is no `persist`;
* the frame doesn't change size with the program's screen, so the program is scaled into
  whatever size the page gave it. With `controls`, make the frame 30 pixels taller for the bar.

### Shareable links

A program short enough can be put in the link itself, so nothing is stored anywhere:

```
https://HOST/qb64-ide/embed/player.html#autostart&controls&code=VY89C4MwGIT3...
```

Opened on its own, the link fills the window and the tab takes the program's `_TITLE`. The same
URL works as an `<iframe>` `src`. Put `code` after `#`: the fragment isn't sent to the server,
and links can be longer there. A program of a few lines makes a link of a few hundred
characters.

`code` is the program's text as UTF-8, compressed with raw deflate and written in base64url
(`-` and `_`, without `=`). In a browser, with [pako](https://github.com/nodeca/pako) (the
engine has it in `qbjs/util/`):

```js
function encodeCode(text) {
  const bytes = pako.deflateRaw(new TextEncoder().encode(text));
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
const link = 'https://HOST/qb64-ide/embed/player.html#autostart&code=' + encodeCode(source);
```

In Node: `zlib.deflateRawSync(Buffer.from(source)).toString('base64')`, with the same
replacements. The demo page has a link maker.

### Talking to a plain iframe

A page that can run a little script, but doesn't want `qb-embed.js`, can still drive the frame
with `postMessage`. Every message is an object `{ qbjsPlayer: 1, type, ... }`:

```js
frame.contentWindow.postMessage({ qbjsPlayer: 1, type: 'run' }, '*');
addEventListener('message', (e) => {
  if (e.source === frame.contentWindow && e.data.qbjsPlayer === 1) console.log(e.data.type, e.data);
});
```

It sends `ready`, `loaded`, `started`, `ended`, `error`, `message`, `resize`, `title`; it takes
`load`, `run`, `stop`, `scale`, `readFile` and `writeFile`. The full list is at the top of
`embed/player.js`.


Program text
------------

Source files are read as UTF-8, or, if they aren't valid UTF-8, as code page 437 (files saved
by QBasic or QB64 with box-drawing characters). Either way, `CHR$(201)` and `"╔"` are the same
character. This applies to the program, its `$INCLUDE` files and the programs it `RUN`s.


Security
--------

A program is compiled to JavaScript and run, so it is treated as untrusted code:

* It runs in a sandboxed iframe without `allow-same-origin`, which gives it an origin of its
  own that matches nothing. It can't read or change the embedding page, its cookies or
  storage, nor, if the engine is served from the IDE's site, the IDE's files.
* It can still do what any web page can: draw, play sound, and fetch from servers that allow
  it. It can't open pop-ups or navigate the page.
* Saving files to the reader's computer needs `allow-downloads`, which is off by default.
* With `persist`, the files are stored by the embedding page (`qb-embed.js`), not by the
  program, and only the ones the program wrote in its own file system.

Embed programs you trust, as you would any script.


Hosting the engine
------------------

Serve the whole project folder from a web server (it has no build step). The embedded player
needs:

* `embed/` (`qb-embed.js`, `player.html`, `player.js`, `player.css`);
* `qbjs/` (compiler, runtime, fonts, pako, JSZip), `gx/` and `lib/`, at the same relative
  places as for the IDE;
* **the header `Access-Control-Allow-Origin: *` on all of them.** The player runs in a
  sandboxed frame with an origin of its own, so even the engine's own fonts and `lib/` files
  are cross-origin to it. GitHub Pages sends this header; elsewhere, set it in the server's
  configuration.

Pages that embed programs then point at that copy: `<script src="https://HOST/qb64-ide/embed/qb-embed.js">`.


Limits
------

* Touch positions are off when the screen is scaled (mouse positions are right).
* Browsers only allow full screen after a click or key press from the reader, so use the
  Full screen button (or `fullscreen()` from a click handler).
* The plain iframe form can't keep files (`persist`).
