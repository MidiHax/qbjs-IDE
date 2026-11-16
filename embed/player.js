/* The embedded QBJS player: runs one program and shows only its screen.
 *
 * embed/player.html is loaded in an iframe by the page that embeds the program, and is driven by
 * postMessage. Every message, both ways, is an object { qbjsPlayer: 1, type, ... }.
 *
 * From the embedding page:
 *   load      { zip?, zipName?, program?: { name, data }, files?: [{ path, data }], main?,
 *               args?, persist?, saved?: { files, deleted }, autostart?, scale?, showErrors? }
 *             Replaces the file system: first the zip's files (a package, see unzip), then
 *             files, then the program. data and zip are ArrayBuffers, typed arrays or strings.
 *             The program is written to main (a path) or to program.name in the root (default
 *             main.bas), as given. Without a program, main names one of the files, or for a
 *             zip the program is chosen as chooseMain says. Program text (and $INCLUDE files,
 *             and programs RUN starts) is read as UTF-8, or as code page 437 if it isn't
 *             valid UTF-8 (see sourceText).
 *             args: COMMAND$ (default: the package's qbjs.json args).
 *             persist: report changed files (see files below); saved: what an earlier files
 *             message reported, laid over the package and program (deleted files removed).
 *             scale: 'fit' (default), 'none' or a number.
 *             Without autostart, a Run cover is shown.
 *   run       Compiles and runs the program (restarting it if it is running).
 *   stop      Stops it.
 *   scale     { scale }                 Changes the scaling ('fit', 'none' or a number).
 *   writeFile { path, data }            Writes a file (before run, say).
 *   readFile  { path, requestId }       Answered with file { requestId, path, data | null }.
 *
 * To the embedding page:
 *   ready     { version }               The engine is loaded; send load.
 *   loaded    { path, manifest }        After load. manifest: the package's qbjs.json, if any.
 *   started   { path }                  The program (or one started by RUN "name") starts.
 *   ended     { reason }                'end', 'stop', 'compile-error' or 'error'.
 *   error     { phase, line, file, text }  phase: 'compile', 'run' or 'load'.
 *   message   { kind, line, file, text }   Compiler warnings ('warn') and what the program
 *                                       writes with _ECHO, _LOGINFO etc.
 *   resize    { width, height }         The size of the program's screen, in its own pixels.
 *   file      { requestId, path, data } Answer to readFile (data is null if there is no file).
 *   title     { title }                 The program called _TITLE.
 *   files     { files: [{ path, data }], deleted: [path] }   With persist: every file that
 *             differs from what load gave (new or changed), and the ones deleted. Sent when
 *             the program ends and every few seconds while it runs, if anything changed.
 *             The host keeps it and passes it back as saved in the next load.
 *
 * Plain iframe form (no script on the embedding page): the settings come from the URL, the
 * query string and the #fragment (the fragment wins), and the player fetches the files itself:
 *   player.html?src=URL&main=…&args=…&name=…&scale=…&autostart&controls&show-errors=off
 *   player.html?package=URL#code=…    code: the program, raw-deflated and base64url-encoded
 * A relative src or package is relative to the engine's root (where index.html is). The
 * combining rules are the element's (embed/qb-embed.js), with code for the inline source.
 * Messages still go to parent, and a parent may still send load, run and stop.
 *
 * Security: the program runs as JavaScript, so the player must run with an opaque origin
 * (iframe sandbox="allow-scripts" without allow-same-origin). Then a program can't reach the
 * embedding page, nor the IDE's files if the player is served from the IDE's site. If the
 * player finds it isn't sandboxed (no sandbox attribute, or the page opened on its own), it
 * loads no engine and instead shows a sandboxed copy of itself, passing messages through.
 */
(() => {
'use strict';

const VERSION = 1;
const INNER = 'qbjs-player-sandboxed';
const $ = (id) => document.getElementById(id);
const hasParent = window.parent !== window;

function post(type, data, transfer) {
  if (hasParent) window.parent.postMessage(Object.assign({ qbjsPlayer: 1, type }, data), '*', transfer || []);
}
function isMessage(data) { return data && typeof data === 'object' && data.qbjsPlayer === 1 && typeof data.type === 'string'; }

// ---------------------------------------------------------------- sandbox check
if (self.origin !== 'null') {
  if (window.name === INNER) {
    // we are the copy that should have been sandboxed: the browser didn't do it
    $('notice').textContent = 'This browser cannot run the program safely (no iframe sandbox).';
    $('notice').hidden = false;
    post('error', { phase: 'load', line: 0, file: '', text: 'The player could not be sandboxed.' });
    return;
  }
  const inner = document.createElement('iframe');
  inner.name = INNER;
  inner.setAttribute('sandbox', 'allow-scripts allow-pointer-lock');
  inner.setAttribute('allow', 'fullscreen; gamepad; autoplay; clipboard-write');
  inner.title = document.title;
  inner.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0';
  inner.src = location.href;
  document.body.replaceChildren(inner);
  addEventListener('message', (e) => {
    if (!isMessage(e.data)) return;
    if (e.source === inner.contentWindow) {
      // a page opened on its own (a shared link) takes the program's title for its tab
      if (e.data.type === 'title' && e.data.title) document.title = e.data.title;
      if (e.data.type === 'loaded' && e.data.manifest && e.data.manifest.title) document.title = e.data.manifest.title;
      post(e.data.type, e.data);
    }
    else if (hasParent && e.source === window.parent) inner.contentWindow.postMessage(e.data, '*');
  });
  // keyboard focus goes on to the program
  addEventListener('focus', () => inner.focus());
  return;
}

// ---------------------------------------------------------------- engine
const ENGINE = [
  'qbjs/util/pako.2.1.0.min.js', 'qbjs/util/jszip.min.js', 'qbjs/vfs.js', 'gx/gx.js',
  'qbjs/qb.js', 'qbjs/qb2js.js', 'qbjs/runner.js',
];
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error('Could not load ' + src));
    document.body.appendChild(s);
  });
}

const fontsReady = Promise.all([
  document.fonts.load('16px dosvga'),
  document.fonts.load('8px dosvga8'),
]).catch(() => {});

// ---------------------------------------------------------------- text
// The runtime keeps strings in Unicode: CHR$(201) is "╔" (U+2554), and ASC maps it back to 201.
// So the compiler is given the program as Unicode text. A file that is valid UTF-8 (with or
// without a BOM) is read as UTF-8; anything else is code page 437, as DOS files are, and its
// bytes 128-255 become the characters they show on a DOS screen.
const CP437_HI = 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ';

function toBytes(data) {
  if (data == null) return new Uint8Array(0);
  if (typeof data === 'string') return new TextEncoder().encode(data);
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  throw new Error('File data must be an ArrayBuffer, a typed array or a string.');
}

function sourceText(bytes) {
  if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) bytes = bytes.subarray(3);
  try { return new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch { /* not UTF-8 */ }
  let s = '';
  for (const b of bytes) s += b < 0x80 ? String.fromCharCode(b) : CP437_HI[b - 0x80];
  return s;
}

// ---------------------------------------------------------------- file system
function normPath(p) {
  const parts = [];
  for (const s of String(p).replaceAll('\\', '/').split('/')) {
    if (!s || s === '.') continue;
    if (s === '..') parts.pop(); else if (/^[A-Za-z]:$/.test(s) && !parts.length) continue; else parts.push(s);
  }
  return '/' + parts.join('/');
}
function ensureDir(parts) {
  const vfs = GX.vfs();
  let dir = vfs.rootDirectory();
  for (const s of parts) {
    let next = vfs.findChild(dir, s);
    if (next && next.type !== vfs.DIRECTORY) throw new Error(`"${s}" is a file, not a folder.`);
    if (!next) next = vfs.createDirectory(s, dir);
    dir = next;
  }
  return dir;
}
function writeFile(path, bytes) {
  const vfs = GX.vfs();
  const parts = normPath(path).split('/').filter(Boolean);
  if (!parts.length) throw new Error('No file name.');
  const dir = ensureDir(parts.slice(0, -1));
  const name = parts[parts.length - 1];
  let f = vfs.findChild(dir, name);
  if (f && f.type === vfs.DIRECTORY) throw new Error(`"${name}" is a folder.`);
  if (!f) f = vfs.createFile(name, dir);
  f.data = new ArrayBuffer(0);
  // a copy, so the caller's buffer can be reused or transferred
  vfs.writeData(f, bytes.slice().buffer, 0);
  return vfs.fullPath(f);
}
function findFile(path) {
  const vfs = GX.vfs();
  const f = vfs.getNode(normPath(path));
  return f && f.type === vfs.FILE ? f : null;
}
function readFile(path) {
  const f = findFile(path);
  return f ? f.data.slice(0) : null;
}

// ---------------------------------------------------------------- packages
const MAX_FILES = 5000;
const MAX_BYTES = 50 * 1024 * 1024;   // unpacked

// Unpacks a zip into the (empty) file system. Paths are cleaned: "..", drive letters and
// leading slashes can't leave the root (zip-slip), and __MACOSX/ and .DS_Store are skipped.
// If every file sits in one top folder ("game/..."), that folder becomes the root, unless
// main names a path inside it. Returns the paths of the files written.
async function unzip(data, main) {
  let zip;
  try { zip = await JSZip.loadAsync(toBytes(data)); } catch { throw new Error('The package is not a readable zip file.'); }
  const items = Object.values(zip.files)
    .filter((z) => !/(^|\/)__MACOSX\//i.test(z.name) && !/(^|\/)\.DS_Store$/i.test(z.name))
    .map((z) => ({ z, parts: normPath(z.name).split('/').filter(Boolean) }))
    .filter((i) => i.parts.length);
  if (items.length > MAX_FILES) throw new Error(`The package has more than ${MAX_FILES} files.`);

  const files = items.filter((i) => !i.z.dir);
  const top = files.length ? files[0].parts[0] : null;
  let strip = !!top && files.every((i) => i.parts.length > 1 && i.parts[0].toLowerCase() === top.toLowerCase());
  if (strip && main) {
    const m = normPath(main).split('/').filter(Boolean);
    if (m.length > 1 && m[0].toLowerCase() === top.toLowerCase()) strip = false;
  }
  if (strip) for (const i of items) i.parts = i.parts.slice(1);

  // sizes as the zip declares them first, so a zip bomb is refused before it is inflated
  let declared = 0;
  for (const i of files) declared += (i.z._data && i.z._data.uncompressedSize) || 0;
  const tooBig = () => new Error(`The package is too big (over ${MAX_BYTES / 1048576} MB unpacked).`);
  if (declared > MAX_BYTES) throw tooBig();

  let total = 0;
  const written = [];
  for (const i of items) {
    if (!i.parts.length) continue;
    if (i.z.dir) { ensureDir(i.parts); continue; }
    const bytes = await i.z.async('uint8array');
    total += bytes.length;
    if (total > MAX_BYTES) throw tooBig();
    written.push(writeFile('/' + i.parts.join('/'), bytes));
  }
  return written;
}

// The program to run in a package, when load gives none: main; else qbjs.json's main; else
// the only .bas file; else main.bas, index.bas or one named like the zip, in the root.
function chooseMain(paths, main, manifest, zipName) {
  if (main) return normPath(main);
  if (manifest && manifest.main) return normPath(manifest.main);
  const bas = paths.filter((p) => /\.bas$/i.test(p));
  if (bas.length === 1) return bas[0];
  const stem = zipName ? String(zipName).replace(/\.[^.]*$/, '') : '';
  for (const want of ['main.bas', 'index.bas', stem && stem + '.bas']) {
    if (!want) continue;
    const hit = bas.find((p) => p.toLowerCase() === '/' + want.toLowerCase());
    if (hit) return hit;
  }
  if (!bas.length) throw new Error('The package has no .bas program.');
  const list = bas.slice(0, 6).map((p) => p.slice(1)).join(', ') + (bas.length > 6 ? ', …' : '');
  throw new Error(`The package has several programs (${list}). Choose one with main="…".`);
}

function readManifest() {
  const data = readFile('/qbjs.json');
  if (!data) return null;
  try { return JSON.parse(new TextDecoder().decode(data)); } catch { throw new Error('qbjs.json in the package is not valid JSON.'); }
}

// ---------------------------------------------------------------- screen
let scaleMode = 'fit';
let lastSize = '';
function fitScreen() {
  const canvas = $('gx-canvas');
  if (!canvas) return;
  const w = canvas.width, h = canvas.height;
  let f = 1;
  const box = $('gx-container');
  if (scaleMode === 'fit') f = Math.min(box.clientWidth / w, box.clientHeight / h) || 1;
  else if (Number(scaleMode) > 0) f = Number(scaleMode);
  canvas.style.transform = `translate(-50%, -50%) scale(${f})`;
  const size = w + 'x' + h;
  if (size !== lastSize) { lastSize = size; post('resize', { width: w, height: h }); }
}
addEventListener('resize', fitScreen);
// SCREEN, WIDTH and _NEWIMAGE resize the canvas while the program runs
setInterval(fitScreen, 200);

function focusScreen() { ($('gx-canvas') || $('gx-container')).focus(); }

// ---------------------------------------------------------------- errors
let showErrors = true;
function showError(text) {
  if (!showErrors) return;
  const box = $('error');
  box.textContent = box.hidden ? text : box.textContent + '\n' + text;
  box.hidden = false;
}
function clearError() { $('error').hidden = true; $('error').textContent = ''; }
function baseName(p) { return String(p).slice(String(p).lastIndexOf('/') + 1); }

// ---------------------------------------------------------------- persist
// With persist, the host keeps the files the program changed (in its own storage) and gives
// them back in the next load as saved. Writes always give a file a new ArrayBuffer (vfs.js
// writeData), so a file whose buffer is still the one it was loaded with is unchanged.
let persist = false;
let baseline = new Map();       // path -> ArrayBuffer, as loaded
let lastReported = new Map();   // path -> ArrayBuffer, at the last report

function snapshot() {
  const vfs = GX.vfs();
  const out = new Map();
  (function walk(dir) {
    for (const n of vfs.getChildren(dir)) {
      if (n.type === vfs.DIRECTORY) walk(n);
      else out.set(vfs.fullPath(n), n.data);
    }
  })(vfs.rootDirectory());
  return out;
}
function sameBytes(a, b) {
  if (a === b) return true;
  if (!a || !b || a.byteLength !== b.byteLength) return false;
  const x = new Uint8Array(a), y = new Uint8Array(b);
  for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return false;
  return true;
}
function sameRefs(a, b) {
  if (a.size !== b.size) return false;
  for (const [k, v] of a) if (b.get(k) !== v) return false;
  return true;
}
function applySaved(saved) {
  const vfs = GX.vfs();
  for (const p of saved.deleted || []) {
    const f = findFile(p);
    if (f) vfs.removeFile(f, f.parent);
  }
  for (const f of saved.files || []) writeFile(f.path, toBytes(f.data));
}
function reportFiles() {
  if (!persist) return;
  const now = snapshot();
  if (sameRefs(now, lastReported)) return;
  lastReported = now;
  const files = [], deleted = [];
  for (const [path, data] of now) {
    if (!sameBytes(baseline.get(path), data)) files.push({ path, data: data.slice(0) });
  }
  for (const path of baseline.keys()) if (!now.has(path)) deleted.push(path);
  post('files', { files, deleted }, files.map((f) => f.data));
}
setInterval(() => { if (current) reportFiles(); }, 3000);

// ---------------------------------------------------------------- run / stop
let program = null;   // { path, source }
let current = null;   // the promise of the run in progress

async function stop() {
  if (!current) return;
  QBRunner.stop();
  await current;
}

async function run() {
  if (!program) return;
  $('cover').hidden = true;
  await stop();
  clearError();
  const { path, source, args } = program;
  const fileOf = (file, label) => file || label || path;
  current = QBRunner.run({
    source, path,
    ready: fontsReady,
    decodeSource: sourceText,
    args,
    onTitle: (title) => { post('title', { title }); setBarTitle(title); },
    onCompileMessage: (kind, line, text, file) => {
      const where = fileOf(file);
      if (kind === 'error') {
        post('error', { phase: 'compile', line, file: where, text });
        showError(`Error in ${baseName(where)} line ${line}: ${text}`);
      } else post('message', { kind, line, file: where, text });
    },
    onMessage: (kind, text, line, file, label) => post('message', { kind, line, file: fileOf(file, label), text }),
    onStart: (js, cwd, label) => {
      post('started', { path: label || path });
      updateBar();
      setTimeout(() => { fitScreen(); focusScreen(); }, 0);
    },
  }).then((result) => {
    if (result.reason === 'error') {
      const where = fileOf(result.file);
      post('error', { phase: 'run', line: result.line, file: where, text: result.message });
      showError(`Error in ${baseName(where)}${result.line ? ' line ' + result.line : ''}: ${result.message}`);
    }
    post('ended', { reason: result.reason });
    reportFiles();
    return result;
  }).finally(() => { current = null; updateBar(); });
  updateBar();
  return current;
}

async function load(msg) {
  await stop();
  clearError();
  $('notice').hidden = true;
  showErrors = msg.showErrors !== false;
  scaleMode = msg.scale === undefined ? 'fit' : String(msg.scale);
  program = null;
  persist = false;
  GX.vfs().reset();
  const paths = msg.zip ? await unzip(msg.zip, msg.main) : [];
  const manifest = msg.zip ? readManifest() : null;
  for (const f of msg.files || []) writeFile(f.path, toBytes(f.data));
  let next;
  if (msg.program) {
    const path = msg.main ? normPath(msg.main) : normPath(msg.program.name || 'main.bas');
    const bytes = toBytes(msg.program.data);
    next = { path: writeFile(path, bytes), source: sourceText(bytes) };
  } else {
    const main = msg.zip ? chooseMain(paths, msg.main, manifest, msg.zipName) : msg.main;
    if (!main) throw new Error('load needs a program, or main naming one of the files.');
    const f = findFile(main);
    if (!f) throw new Error('No program at ' + normPath(main).slice(1) + (msg.zip ? ' in the package.' : '.'));
    next = { path: GX.vfs().fullPath(f), source: sourceText(new Uint8Array(f.data)) };
  }
  next.args = msg.args != null ? String(msg.args) : (manifest && manifest.args != null ? String(manifest.args) : '');
  // persist: changes are measured from the files as loaded, before the saved ones go on top
  baseline = snapshot();
  lastReported = baseline;
  if (msg.saved) applySaved(msg.saved);
  persist = !!msg.persist;
  program = next;
  post('loaded', { path: program.path, manifest });
  setBarTitle((manifest && manifest.title) || '');
  updateBar();
  if (msg.autostart) run();
  else { $('cover').hidden = false; $('cover').focus(); }
}

$('cover').addEventListener('click', () => run());

// ---------------------------------------------------------------- controls bar (URL form)
// The element draws its own bar; this one is for the plain iframe form (&controls).
function setBarTitle(title) { $('bar-title').textContent = title || ''; }
function updateBar() {
  if ($('bar').hidden) return;
  const running = !!current;
  $('bar-run').disabled = !program || running;
  $('bar-stop').disabled = !running;
  $('bar-restart').disabled = !program;
}
$('bar').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b || b.disabled) return;
  if (b.id === 'bar-run' || b.id === 'bar-restart') run();
  else if (b.id === 'bar-stop') stop();
  else if (b.id === 'bar-full') {
    // the program's screen goes full screen, as with _FULLSCREEN and the IDE's button
    if ($('gx-canvas')) GX.fullScreen(true);
  }
});
function showBar() {
  $('bar').hidden = false;
  document.body.classList.add('with-bar');
  $('bar-full').disabled = !document.fullscreenEnabled;
  updateBar();
  fitScreen();
}

// ---------------------------------------------------------------- URL form
function readParams() {
  const p = new URLSearchParams(location.search);
  for (const [k, v] of new URLSearchParams(location.hash.replace(/^#/, ''))) p.set(k, v);
  return p;
}
// present means on (&autostart, &autostart=1); 0, false, off and no mean off
function flag(p, name, dflt) {
  if (!p.has(name)) return dflt;
  return !/^(0|false|off|no)$/i.test(p.get(name));
}
function isZip(b) {
  return b.length >= 4 && b[0] === 0x50 && b[1] === 0x4B && ((b[2] === 3 && b[3] === 4) || (b[2] === 5 && b[3] === 6));
}
function fileNameOf(url) {
  try {
    const seg = decodeURIComponent(new URL(url).pathname.split('/').pop() || '');
    return /^[^\\/:*?"<>|]+$/.test(seg) ? seg : '';
  } catch { return ''; }
}
async function fetchBytes(value) {
  const url = new URL(value, document.baseURI).href;
  let res;
  try { res = await fetch(url); } catch {
    throw new Error(`Can't load ${url}: the server doesn't allow other sites to read this file (CORS), or can't be reached.`);
  }
  if (!res.ok) throw new Error(`Can't load ${url}: ${res.status} ${res.statusText}`.trim());
  return { url, bytes: new Uint8Array(await res.arrayBuffer()) };
}
// code=: the program, raw-deflated and base64url-encoded (see encodeCode in the design notes)
function decodeCode(text) {
  try {
    let b64 = text.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
    while (b64.length % 4) b64 += '=';
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return pako.inflateRaw(bytes);
  } catch {
    throw new Error('The code in the link is damaged (it should be deflated and base64url-encoded).');
  }
}

// Builds a load message from the URL, with the element's combining rules
async function loadFromUrl(p) {
  const msg = {
    autostart: flag(p, 'autostart', false),
    scale: p.get('scale') || 'fit',
    showErrors: flag(p, 'show-errors', true),
  };
  if (p.has('main')) msg.main = p.get('main');
  if (p.has('args')) msg.args = p.get('args');
  const name = p.get('name');
  const code = p.has('code') ? decodeCode(p.get('code')) : null;
  if (p.has('src')) {
    const { url, bytes } = await fetchBytes(p.get('src'));
    if (isZip(bytes)) { msg.zip = bytes; msg.zipName = fileNameOf(url); }
    else {
      if (code) console.warn('QBasic player: src is a .bas file, so code is ignored.');
      msg.program = { name: name || fileNameOf(url) || 'main.bas', data: bytes };
    }
  }
  if (p.has('package')) {
    if (msg.zip) throw new Error('Both src and package are zip files: use src or package for the zip, not both.');
    const { url, bytes } = await fetchBytes(p.get('package'));
    if (!isZip(bytes)) throw new Error(`The package ${url} is not a zip file.`);
    msg.zip = bytes;
    msg.zipName = fileNameOf(url);
  }
  if (!msg.program && code) msg.program = { name: name || 'main.bas', data: code };
  await load(msg);
}


async function onMessage(e) {
  if (!hasParent || e.source !== window.parent || !isMessage(e.data)) return;
  const msg = e.data;
  try {
    switch (msg.type) {
      case 'load': await load(msg); break;
      case 'run': await run(); break;
      case 'stop': await stop(); break;
      case 'scale': scaleMode = msg.scale === undefined ? 'fit' : String(msg.scale); fitScreen(); break;
      case 'writeFile': writeFile(msg.path, toBytes(msg.data)); reportFiles(); break;
      case 'readFile': {
        const data = readFile(msg.path);
        post('file', { requestId: msg.requestId, path: msg.path, data }, data ? [data] : []);
        break;
      }
    }
  } catch (err) {
    post('error', { phase: 'load', line: 0, file: '', text: err.message });
    showError(err.message);
  }
}

(async () => {
  try {
    for (const src of ENGINE) await loadScript(src);
  } catch (err) {
    post('error', { phase: 'load', line: 0, file: '', text: err.message });
    $('notice').textContent = err.message;
    $('notice').hidden = false;
    return;
  }
  addEventListener('message', onMessage);
  const params = readParams();
  if (flag(params, 'controls', false)) showBar();
  post('ready', { version: VERSION });
  if (['src', 'package', 'code'].some((k) => params.has(k))) {
    // plain iframe form, or a shared link
    $('notice').textContent = 'Loading…';
    $('notice').hidden = false;
    try { await loadFromUrl(params); } catch (err) {
      $('notice').hidden = true;
      post('error', { phase: 'load', line: 0, file: '', text: err.message });
      showErrors = flag(params, 'show-errors', true);
      showError(err.message);
    }
    return;
  }
  // opened on its own (directly, or as the sandboxed copy inside a page opened on its own)
  const standalone = !hasParent || (window.name === INNER && window.parent.parent === window.parent);
  if (standalone) {
    $('notice').textContent = 'QBasic player: no program to run. Embed this page and send it a program, or give it one in the address (?src=… or #code=…).';
    $('notice').hidden = false;
  }
})();
})();
