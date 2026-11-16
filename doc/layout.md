Layout
------
| Path | What it is |
|---|---|
| `index.html`, `app.js`, `app.css` | The IDE |
| `records.js` | `TYPE` parsing and record layout for the Record Editor |
| `crt.css` | CRT Vibe theme |
| `qbjs/` | QBJS compiler (`qb2js.js`), runtime (`qb.js`), file system (`vfs.js`), compile-and-run loop shared by the IDE and the embedded player (`runner.js`), fonts, CodeMirror, JSZip, pako, and the QBJS licenses |
| `embed/` | Embedding programs in other web pages (guide: `doc/embedding.md`; every form live in `demo.html`, with its programs in `demo/`). `qb-embed.js` defines `<qb-program>` (inline source, a `.bas` or `.zip` package in `src`; attributes, methods and events at the top of the file). It shows `player.html`, which runs one program in a sandboxed iframe and shows only its screen, driven by `postMessage` (protocol at the top of `player.js`). `player.html` also works without the script, as a plain `<iframe>` or a shareable link, with the settings in its URL (`?src=…`, `#code=…`; see the top of `player.js`). The host serving it must send `Access-Control-Allow-Origin: *` (the sandboxed page loads the fonts and `lib/` cross-origin). |
| `gx/` | QBJS game/graphics engine. Must stay at the site root: the runtime loads its font images from `gx/` relative to the page. |
| `lib/` | QBJS `Import` libraries (`lib/web/console.bas` etc.). Must stay at the site root for the same reason. |
| `tools/qb2js.bas` | Source of the QBJS compiler, written in QBJS BASIC. `qbjs/qb2js.js` is built from it. |
| `tools/qbc.js` | Command-line compiler (Node). Rebuilds the compiler, or compiles a program for inspection. |
| `tests/random/` | RANDOM/BINARY file test programs, with reference output and data files from QB64 |
| `tests/types/` | Fixed-length string, record copy and text file test programs, with reference output from QB64 |
| `tests/errors/` | `ON ERROR` test programs, with reference output from QB64 |
| `tests/run/` | `RUN` and file name test programs (upload the folder), with expected output |
| `tests/input/` | `INPUT #` and `WRITE #` test programs, with reference output from QB64 |
| `tests/print/` | `SPC`/`TAB` and `PRINT` test program, with reference output |
| `tests/if/` | One-line `IF` test program, with reference output from QB64 |
| `tests/data/` | `DATA` and `READ` test program, with reference output from QB64 |
| `tests/names/` | Variable names with type suffixes (`k`, `k$`, `k%`), with reference output from QB64 |
| `tests/functions/` | FUNCTIONs returning a `TYPE`, and `FUNCTION f AS type` without parentheses, with expected output checked by hand (QB64 can't run it) |
| `tests/goto/` | `GOTO`, `GOSUB`, line number and `RESUME label` test programs, with reference output from QB64 |
| `tests/records/` | Unit tests for `records.js` (`node tests/records/records-test.js`) |
| `tests/viewprint/` | `VIEW PRINT` and bottom-line scrolling test programs, with reference output from QB64 |