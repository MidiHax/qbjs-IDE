/* <qb-program>: runs a QBasic program on any web page, showing only its screen.
 *
 *   <script src="https://HOST/qb64-ide/embed/qb-embed.js" defer></script>
 *
 *   <qb-program width="640" height="400">
 *   <script type="text/x-qbasic">
 *   PRINT "Hello"
 *   </script>
 *   </qb-program>
 *
 *   <qb-program src="games/snake.bas" autostart></qb-program>
 *
 * The program runs in embed/player.html, in a sandboxed iframe (see embed/player.js), so it
 * can't reach this page. This script only gathers the program, fetches src from this page
 * (so relative URLs are relative to this page, and files on this site need no CORS), and
 * passes messages. Guide: doc/embedding.md.
 *
 * Attributes
 *   src          URL of a .bas file or a .zip package (told apart by content)
 *   package      URL of a .zip whose files a .bas src (or the inline program) runs with
 *   name         file name for the program (default: the src file name, or main.bas)
 *   main         the program's path: in a package, the one to run (default: qbjs.json's main,
 *                the only .bas, or main.bas / index.bas / <zip name>.bas); with inline or .bas
 *                source, where to write it (it starts in that folder)
 *   width/height size of the box (default 640 x 400); a number is pixels, else any CSS length
 *   scale        fit (default): scale the screen into the box; none or a number: the box
 *                follows the program's screen size (times the number)
 *   autostart    run at once, without the Run cover
 *   controls     show a bar under the screen: the program's _TITLE, Run, Stop, Restart, Full screen
 *   args         COMMAND$ (default: the package's qbjs.json args)
 *   persist      a key: the files the program changes are kept in this page's browser storage
 *                (IndexedDB) under that key, and given back the next time it loads
 *   show-errors  "off" or "false": don't show errors over the screen (events still fire)
 *   allow-downloads  let the program save files to the reader's computer (FS.DownloadFile)
 *   engine       URL of player.html (default: next to this script)
 *
 * Inline source goes in <script type="text/x-qbasic"> (kept as raw text, so < and & are safe),
 * or a <template>, or plain text in the element. Common indentation is removed.
 *
 * Methods: run(), stop(), load({ source?, src?, package?, name?, main?, args? }), readFile(path),
 *          writeFile(path, data), fullscreen(), clearSaved()
 * Properties: screenSize { width, height }, programTitle (what the program set with _TITLE)
 * Events (bubbling, detail in brackets):
 *   qb-ready   { path, manifest }        the program is loaded and can run (manifest: qbjs.json)
 *   qb-start   { path }                  it (or a program it RUNs) starts
 *   qb-end     { reason }                'end', 'stop', 'compile-error' or 'error'
 *   qb-error   { phase, line, file, message }   phase: 'load', 'compile' or 'run'
 *   qb-message { kind, line, file, message }    compiler warnings, _ECHO, _LOG...
 *   qb-resize  { width, height }         the program's screen size
 *   qb-title   { title }                 the program called _TITLE
 *   qb-saved   { files, deleted }        with persist: changed files were stored (paths)
 */
(() => {
'use strict';
if (customElements.get('qb-program')) return;

const SCRIPT_URL = document.currentScript && document.currentScript.src;
const DEFAULT_ENGINE = SCRIPT_URL ? new URL('player.html', SCRIPT_URL).href : null;

// ---------------------------------------------------------------- helpers
// Removes the common leading indentation, and blank lines at the start and end
function dedent(text) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  let indent = null;
  for (const l of lines) {
    if (!l.trim()) continue;
    const n = l.match(/^[ \t]*/)[0].length;
    if (indent === null || n < indent) indent = n;
  }
  return lines.map((l) => l.slice(indent || 0)).join('\n') + '\n';
}

function isZip(bytes) {
  return bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4B &&
    ((bytes[2] === 3 && bytes[3] === 4) || (bytes[2] === 5 && bytes[3] === 6));
}

async function toBytes(value) {
  if (value instanceof Blob) return new Uint8Array(await value.arrayBuffer());
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  throw new Error('src must be a URL, a Blob, an ArrayBuffer or a typed array.');
}

async function fetchBytes(url) {
  let res;
  try { res = await fetch(url); } catch {
    throw new Error(`Can't load ${url}: the server can't be reached, or doesn't allow this site to read the file (CORS).`);
  }
  if (!res.ok) throw new Error(`Can't load ${url}: ${res.status} ${res.statusText}`.trim());
  return new Uint8Array(await res.arrayBuffer());
}

function fileNameOf(url) {
  try {
    const seg = decodeURIComponent(new URL(url).pathname.split('/').pop() || '');
    return /^[^\\/:*?"<>|]+$/.test(seg) ? seg : '';
  } catch { return ''; }
}

function cssLength(value, fallback, extra) {
  let v = value == null || value === '' ? fallback + 'px'
    : /^\d+(\.\d+)?$/.test(value.trim()) ? value.trim() + 'px' : value;
  if (extra) v = /^\d+(\.\d+)?px$/.test(v) ? parseFloat(v) + extra + 'px' : `calc(${v} + ${extra}px)`;
  return v;
}

// ---------------------------------------------------------------- persist storage
// The files a program changed, per persist key, in this page's IndexedDB: { files, deleted }.
const DB_NAME = 'qb-embed', STORE = 'saved';
let dbPromise = null;
function openDb() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}
async function storage(mode, fn) {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const req = fn(tx.objectStore(STORE));
      tx.oncomplete = () => resolve(req.result);
      tx.onerror = tx.onabort = () => reject(tx.error);
    });
  } catch (err) {
    // private browsing, storage blocked: the program still runs, its files just aren't kept
    if (!storage.warned) { storage.warned = true; console.warn('<qb-program>: browser storage is not available, so persist does nothing.', err); }
    return undefined;
  }
}
const savedGet = (key) => storage('readonly', (st) => st.get(key));
const savedPut = (key, value) => storage('readwrite', (st) => st.put(value, key));
const savedDelete = (key) => storage('readwrite', (st) => st.delete(key));

const BAR_HEIGHT = 30;

// ---------------------------------------------------------------- message routing
// One listener for all players on the page; each player is known by its iframe's window.
const players = new Map(); // iframe contentWindow -> QbProgram
addEventListener('message', (e) => {
  const el = players.get(e.source);
  if (el && e.data && typeof e.data === 'object' && e.data.qbjsPlayer === 1) el._onPlayerMessage(e.data);
});

const STYLE = `
/* the column (screen, then bar) is .box, so a page that sets display on qb-program can't break it */
:host { display: inline-block; position: relative; vertical-align: top; background: #000; contain: content; }
.box { display: flex; flex-direction: column; width: 100%; height: 100%; }
:host([hidden]) { display: none; }
:host(:focus-within) { outline: 2px solid Highlight; outline: 2px solid -webkit-focus-ring-color; outline-offset: 1px; }
.screen { position: relative; flex: 1; min-height: 0; }
iframe { display: block; width: 100%; height: 100%; border: 0; }
.bar { display: flex; align-items: center; gap: 4px; flex: none; height: ${BAR_HEIGHT}px; box-sizing: border-box; padding: 0 4px 0 8px;
  background: #1b1b1f; color: #ddd; font: 13px/1 system-ui, sans-serif; }
.bar[hidden] { display: none; }
.title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bar button { font: inherit; color: inherit; background: #2c2c33; border: 1px solid #45454d; border-radius: 4px; padding: 4px 8px; cursor: pointer; }
.bar button:hover:not(:disabled) { background: #3a3a43; }
.bar button:disabled { opacity: 0.4; cursor: default; }
.bar button:focus-visible { outline: 2px solid Highlight; outline-offset: 1px; }
.error { position: absolute; left: 0; right: 0; bottom: 0; max-height: 50%; overflow: auto; margin: 0;
  padding: 8px 12px; background: #600; color: #fff; font: 14px/1.4 system-ui, sans-serif; white-space: pre-wrap; }
.error[hidden] { display: none; }
`;

class QbProgram extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'package', 'name', 'main', 'args', 'persist', 'width', 'height', 'scale', 'controls',
      'autostart', 'show-errors', 'allow-downloads', 'engine'];
  }

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${STYLE}</style>
      <div class="box">
      <div class="screen" part="screen"><p class="error" role="alert" hidden></p></div>
      <div class="bar" part="controls" hidden>
        <span class="title"></span>
        <button type="button" data-act="run" title="Run">&#9654; Run</button>
        <button type="button" data-act="stop" title="Stop">&#9632; Stop</button>
        <button type="button" data-act="restart" title="Restart">&#8635; Restart</button>
        <button type="button" data-act="fullscreen" title="Full screen" aria-label="Full screen">&#x26F6;</button>
      </div>
      </div>`;
    this._errorBox = root.querySelector('.error');
    this._bar = root.querySelector('.bar');
    this._bar.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b || b.disabled) return;
      const act = b.dataset.act;
      if (act === 'run' || act === 'restart') this.run();
      else if (act === 'stop') this.stop();
      else if (act === 'fullscreen') this.fullscreen();
    });
    root.addEventListener('fullscreenchange', () => this._applySize());
    document.addEventListener('fullscreenchange', () => this._applySize());
    this._loaded = false;         // the player has a program
    this._running = false;
    this._title = '';
    this._frame = null;
    this._ready = false;          // the player sent ready
    this._queue = [];             // messages waiting for ready
    this._requests = new Map();   // readFile requestId -> resolve
    this._nextRequest = 1;
    this._runWaiters = [];        // run() promises waiting for qb-end
    this._override = null;        // what load() set, instead of the attributes
    this._loadToken = 0;
    this._screen = null;          // { width, height } from the player
  }

  connectedCallback() {
    this._applySize();
    this._updateBar();
    if (!this._frame) this._createFrame();
    // the inline source is only complete once the element's children are parsed
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._reloadQuietly(), { once: true });
    } else this._reloadQuietly();
  }

  disconnectedCallback() {
    // removing the element ends its program
    this._removeFrame();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this.isConnected) return;
    if (name === 'width' || name === 'height' || name === 'scale' || name === 'controls') {
      this._applySize();
      this._updateBar();
      return;
    }
    if (name === 'engine' || name === 'allow-downloads') { this._removeFrame(); this._createFrame(); }
    if (name === 'src' || name === 'package') this._override = null;
    this._scheduleReload();
  }

  // ---------------------------------------------------------------- public API
  run() {
    return new Promise((resolve) => {
      this._runWaiters.push(resolve);
      this._send({ type: 'run' });
    });
  }

  stop() { this._send({ type: 'stop' }); }

  // { source } or { src } (a URL, Blob, ArrayBuffer or typed array), with name and main
  load(options) {
    this._override = Object.assign({}, options);
    return this._reload();
  }

  readFile(path) {
    return new Promise((resolve) => {
      const requestId = this._nextRequest++;
      this._requests.set(requestId, resolve);
      this._send({ type: 'readFile', path: String(path), requestId });
    });
  }

  writeFile(path, data) { this._send({ type: 'writeFile', path: String(path), data }); }

  /** The program's screen size, once it has one */
  get screenSize() { return this._screen ? Object.assign({}, this._screen) : null; }

  /** What the program set with _TITLE (or the package's qbjs.json title) */
  get programTitle() { return this._title; }

  /** Shows the program full screen (call it from a click or key press) */
  fullscreen() {
    if (this._frame && this._frame.requestFullscreen) return this._frame.requestFullscreen().catch(() => {});
    return Promise.resolve();
  }

  /** Forgets the files kept for the persist key; the next load starts from the package again */
  clearSaved() {
    const key = this.getAttribute('persist');
    return key ? savedDelete(key) : Promise.resolve();
  }

  // ---------------------------------------------------------------- iframe
  _engineUrl() {
    const attr = this.getAttribute('engine');
    if (attr) return new URL(attr, document.baseURI).href;
    return DEFAULT_ENGINE;
  }

  _createFrame() {
    const url = this._engineUrl();
    if (!url) { this._fail('load', 'Set the engine attribute to the URL of player.html.'); return; }
    const f = document.createElement('iframe');
    // no allow-same-origin: the program gets an opaque origin and can't reach this page
    f.setAttribute('sandbox', 'allow-scripts allow-pointer-lock' + (this.hasAttribute('allow-downloads') ? ' allow-downloads' : ''));
    f.setAttribute('allow', 'fullscreen; gamepad; autoplay; clipboard-write');
    f.setAttribute('loading', 'lazy');
    f.title = this.getAttribute('title') || this.getAttribute('aria-label') || 'QBasic program';
    f.src = url;
    this._errorBox.before(f);
    this._frame = f;
    this._ready = false;
    players.set(f.contentWindow, this);
  }

  _removeFrame() {
    if (!this._frame) return;
    players.delete(this._frame.contentWindow);
    this._frame.remove();
    this._frame = null;
    this._ready = false;
    this._sentScale = undefined;
    this._queue = [];
    for (const resolve of this._requests.values()) resolve(null);
    this._requests.clear();
  }

  _send(msg, transfer) {
    msg = Object.assign({ qbjsPlayer: 1 }, msg);
    if (this._ready && this._frame) this._frame.contentWindow.postMessage(msg, '*', transfer || []);
    else this._queue.push([msg, transfer]);
  }

  // ---------------------------------------------------------------- size
  _applySize() {
    const configured = (this.getAttribute('scale') || 'fit').trim();
    const bar = this.hasAttribute('controls') ? BAR_HEIGHT : 0;
    if (configured !== 'fit' && this._screen) {
      const n = Number(configured) > 0 ? Number(configured) : 1;
      this.style.width = this._screen.width * n + 'px';
      this.style.height = this._screen.height * n + bar + 'px';
    } else {
      this.style.width = cssLength(this.getAttribute('width'), 640);
      this.style.height = cssLength(this.getAttribute('height'), 400, bar);
    }
    // full screen always scales to fit the screen
    const full = !!this._frame && this.shadowRoot.fullscreenElement === this._frame;
    const scale = full ? 'fit' : configured;
    if (this._ready && scale !== this._sentScale) { this._sentScale = scale; this._send({ type: 'scale', scale }); }
  }

  _updateBar() {
    this._bar.hidden = !this.hasAttribute('controls');
    const btn = (act) => this._bar.querySelector(`[data-act="${act}"]`);
    btn('run').disabled = !this._loaded || this._running;
    btn('stop').disabled = !this._running;
    btn('restart').disabled = !this._loaded;
    btn('fullscreen').disabled = !this._frame || !document.fullscreenEnabled;
    this._bar.querySelector('.title').textContent = this._title;
  }

  // ---------------------------------------------------------------- loading
  _scheduleReload() {
    if (this._reloadPending) return;
    this._reloadPending = true;
    queueMicrotask(() => { this._reloadPending = false; this._reloadQuietly(); });
  }

  // a reload nobody awaits: failures are reported by qb-error (and the error box)
  _reloadQuietly() { this._reload().catch(() => {}); }

  _inlineSource() {
    const script = this.querySelector('script[type="text/x-qbasic"]');
    if (script) return dedent(script.textContent);
    const tpl = this.querySelector('template');
    if (tpl) return dedent(tpl.content.textContent);
    const text = this.textContent;
    return text.trim() ? dedent(text) : null;
  }

  // Gathers the program (inline or src) and sends load. Returns a promise that settles when
  // the player has loaded it (resolves with its path) or loading failed (rejects).
  async _reload() {
    const token = ++this._loadToken;
    this._clearError();
    const o = this._override || {};
    const srcValue = o.src !== undefined ? o.src : (o.source !== undefined ? null : this.getAttribute('src'));
    const inline = o.source !== undefined ? String(o.source) : (this._override ? null : this._inlineSource());
    const packageValue = o.package !== undefined ? o.package : (this._override ? null : this.getAttribute('package'));
    const nameAttr = o.name !== undefined ? o.name : this.getAttribute('name');
    const args = o.args !== undefined ? o.args : this.getAttribute('args');
    const persistKey = this.getAttribute('persist');
    const main = o.main !== undefined ? o.main : this.getAttribute('main');

    // a URL (relative to this page), or bytes: { url, bytes }
    const get = async (value) => {
      const url = typeof value === 'string' ? new URL(value, document.baseURI).href : null;
      return { url, bytes: url ? await fetchBytes(url) : await toBytes(value) };
    };

    let program = null, zip = null, zipName = '';
    try {
      // The package (a zip, from src or package) supplies the files; the program is a .bas
      // src, else the inline source, else chosen in the package by the player.
      if (srcValue) {
        const { url, bytes } = await get(srcValue);
        if (token !== this._loadToken) return null;
        if (isZip(bytes)) { zip = bytes; zipName = url ? fileNameOf(url) : ''; }
        else {
          if (inline !== null) console.warn('<qb-program>: src is a .bas file, so the inline program is ignored.', this);
          program = { name: nameAttr || (url && fileNameOf(url)) || 'main.bas', data: bytes };
        }
      }
      if (packageValue) {
        if (zip) throw new Error('Both src and package are zip files: use src or package for the zip, not both.');
        const { url, bytes } = await get(packageValue);
        if (token !== this._loadToken) return null;
        if (!isZip(bytes)) throw new Error(`The package${url ? ' ' + url : ''} is not a zip file.`);
        zip = bytes;
        zipName = url ? fileNameOf(url) : '';
      }
      if (!program && inline !== null) program = { name: nameAttr || 'main.bas', data: inline };
      if (!program && !zip) {
        // nothing to run (yet): an empty element waiting for load()
        return null;
      }
    } catch (err) {
      if (token === this._loadToken) this._fail('load', err.message);
      throw err;
    }

    const msg = {
      type: 'load',
      autostart: this.hasAttribute('autostart'),
      scale: (this.getAttribute('scale') || 'fit').trim(),
      showErrors: !/^(off|false|no|0)$/i.test(this.getAttribute('show-errors') || ''),
    };
    if (program) msg.program = program;
    if (zip) { msg.zip = zip.slice().buffer; msg.zipName = zipName; }
    if (main) msg.main = main;
    if (args != null) msg.args = String(args);
    this._sentScale = msg.scale;
    if (persistKey) {
      msg.persist = true;
      const saved = await savedGet(persistKey);
      if (token !== this._loadToken) return null;
      if (saved) msg.saved = saved;
    }
    this._screen = null;
    this._loaded = false;
    this._running = false;
    this._updateBar();
    this._applySize();
    this._send(msg);
    if (this._loadWaiter) this._loadWaiter.resolve(null); // replaced by this load
    return new Promise((resolve, reject) => { this._loadWaiter = { token, resolve, reject }; });
  }

  // ---------------------------------------------------------------- from the player
  _onPlayerMessage(m) {
    switch (m.type) {
      case 'ready':
        this._ready = true;
        for (const [msg, transfer] of this._queue.splice(0)) this._frame.contentWindow.postMessage(msg, '*', transfer || []);
        break;
      case 'loaded':
        this._loaded = true;
        this._running = false;
        this._setTitle((m.manifest && m.manifest.title) || '', false);
        if (this._loadWaiter) { this._loadWaiter.resolve(m.path); this._loadWaiter = null; }
        this._emit('qb-ready', { path: m.path, manifest: m.manifest || null });
        break;
      case 'started':
        this._running = true;
        this._updateBar();
        this._clearError();
        this._emit('qb-start', { path: m.path });
        break;
      case 'ended':
        this._running = false;
        this._updateBar();
        for (const resolve of this._runWaiters.splice(0)) resolve({ reason: m.reason });
        this._emit('qb-end', { reason: m.reason });
        break;
      case 'error':
        if (m.phase === 'load') { this._loaded = false; this._running = false; this._updateBar(); }
        if (m.phase === 'load' && this._loadWaiter) { this._loadWaiter.reject(new Error(m.text)); this._loadWaiter = null; }
        this._emit('qb-error', { phase: m.phase, line: m.line, file: m.file, message: m.text });
        break;
      case 'message':
        this._emit('qb-message', { kind: m.kind, line: m.line, file: m.file, message: m.text });
        break;
      case 'resize':
        this._screen = { width: m.width, height: m.height };
        this._applySize();
        this._emit('qb-resize', { width: m.width, height: m.height });
        break;
      case 'title':
        this._setTitle(m.title, true);
        break;
      case 'files': {
        const key = this.getAttribute('persist');
        if (!key) break;
        savedPut(key, { files: m.files, deleted: m.deleted })
          .then(() => this._emit('qb-saved', { files: m.files.map((f) => f.path), deleted: m.deleted.slice() }));
        break;
      }
      case 'file': {
        const resolve = this._requests.get(m.requestId);
        if (resolve) { this._requests.delete(m.requestId); resolve(m.data ? new Uint8Array(m.data) : null); }
        break;
      }
    }
  }

  _setTitle(title, fromProgram) {
    this._title = String(title || '');
    if (this._frame) this._frame.title = this._title || this.getAttribute('title') || this.getAttribute('aria-label') || 'QBasic program';
    this._updateBar();
    if (fromProgram) this._emit('qb-title', { title: this._title });
  }

  _emit(type, detail) {
    this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true }));
  }

  // an error found here (fetching src), before the player sees the program
  _fail(phase, message) {
    if (!/^(off|false|no|0)$/i.test(this.getAttribute('show-errors') || '')) {
      this._errorBox.textContent = message;
      this._errorBox.hidden = false;
    }
    this._emit('qb-error', { phase, line: 0, file: '', message });
  }

  _clearError() { this._errorBox.hidden = true; this._errorBox.textContent = ''; }
}

customElements.define('qb-program', QbProgram);
})();
