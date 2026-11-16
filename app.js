/* QB64 IDE: editor, runner and virtual file system UI around the QBJS engine
 * (qbjs/qb2js.js compiler, qbjs/qb.js + gx/gx.js runtime, qbjs/vfs.js file system).
 */
(() => {
'use strict';

const $ = (id) => document.getElementById(id);
const vfs = GX.vfs();

const STARTER = `' Welcome to the QB64 IDE!
' Press Run (Ctrl+R or F5) to try this program.

CLS
COLOR 11
PRINT "Hello, World!"
COLOR 7
PRINT
INPUT "What is your name"; n$
PRINT "Nice to meet you, "; n$; "!"
PRINT
FOR i = 1 TO 15
    COLOR i
    PRINT STRING$(i * 2, 219)
NEXT i
COLOR 7
`;

// ---------------------------------------------------------------- storage
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem('qb64ide.' + key); return v === null ? fallback : JSON.parse(v); }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('qb64ide.' + key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  },
};

function debounce(fn, ms) {
  let t = 0;
  const d = (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  d.flush = () => { clearTimeout(t); fn(); };
  return d;
}

// ---------------------------------------------------------------- VFS persistence (IndexedDB)
const DB_NAME = 'qb64ide', DB_STORE = 'vfs', DB_KEY = 'tree';
let dbPromise = null;

function openDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(DB_STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

async function dbGet() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(DB_STORE).objectStore(DB_STORE).get(DB_KEY);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbPut(value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(value, DB_KEY);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

function serializeVFS() {
  const out = [];
  (function walk(dir) {
    for (const n of vfs.getChildren(dir)) {
      if (n.type === vfs.DIRECTORY) { out.push({ path: vfs.fullPath(n), dir: true }); walk(n); }
      else out.push({ path: vfs.fullPath(n), data: n.data.slice(0) });
    }
  })(vfs.rootDirectory());
  return out;
}

let loadingVFS = false;
async function loadVFS() {
  let entries;
  try { entries = await dbGet(); } catch (e) { console.warn('VFS storage unavailable', e); return; }
  if (!Array.isArray(entries)) return;
  loadingVFS = true;
  try {
    for (const e of entries) {
      if (e.dir) ensureDir(e.path);
      else {
        const f = vfs.createFile(baseName(e.path), ensureDir(parentPath(e.path)));
        f.data = e.data instanceof ArrayBuffer ? e.data : new ArrayBuffer(0);
      }
    }
  } finally { loadingVFS = false; }
}

const saveVFS = debounce(() => {
  dbPut(serializeVFS()).catch((e) => console.warn('Could not save files', e));
}, 400);
const refreshFilesSoon = debounce(() => { if (currentTab === 'files') renderFiles(); }, 250);

// Every change to the VFS (from the IDE or from a running program) schedules a save.
for (const m of ['createFile', 'createDirectory', 'writeData', 'writeText', 'renameNode', 'removeFile', 'removeDirectory', 'reset']) {
  const orig = vfs[m];
  vfs[m] = function (...args) {
    const r = orig.apply(this, args);
    if (!loadingVFS) { saveVFS(); refreshFilesSoon(); }
    return r;
  };
}
addEventListener('pagehide', () => saveVFS.flush());
document.addEventListener('visibilitychange', () => { if (document.hidden) saveVFS.flush(); });

// ---------------------------------------------------------------- path helpers
const RESERVED = new Set(['name', 'type', 'data', 'parent', 'toString', '__proto__', 'constructor', 'prototype', 'hasOwnProperty', 'valueOf']);
const BAD_CHARS = /[\\:*?"<>|\x00-\x1f]/;

function normPath(p) {
  const parts = [];
  for (const s of p.replaceAll('\\', '/').split('/')) {
    if (!s || s === '.') continue;
    if (s === '..') parts.pop(); else parts.push(s);
  }
  return '/' + parts.join('/');
}
function joinPath(dir, name) { return normPath(dir + '/' + name); }
function parentPath(p) { p = normPath(p); return p.slice(0, p.lastIndexOf('/')) || '/'; }
function baseName(p) { p = normPath(p); return p.slice(p.lastIndexOf('/') + 1); }
function extOf(p) { const b = baseName(p).toLowerCase(); const i = b.lastIndexOf('.'); return i > 0 ? b.slice(i + 1) : ''; }

function nameError(name) {
  if (!name) return 'Enter a name.';
  if (name === '.' || name === '..') return 'That name is not allowed.';
  if (BAD_CHARS.test(name)) return 'Names cannot contain \\ : * ? " < > |';
  if (RESERVED.has(name)) return `"${name}" is reserved. Choose another name.`;
  if (name.length > 100) return 'That name is too long.';
  return '';
}
function pathError(p) {
  const parts = p.replaceAll('\\', '/').split('/').filter((s) => s && s !== '.');
  if (!parts.length) return 'Enter a name.';
  for (const s of parts) { if (s === '..') continue; const e = nameError(s); if (e) return e; }
  return '';
}

function getNode(p) { return vfs.getNode(normPath(p)); }
function ensureDir(p) {
  let node = vfs.rootDirectory();
  for (const s of normPath(p).split('/').filter(Boolean)) {
    let next = vfs.findChild(node, s);
    if (!next || next.type !== vfs.DIRECTORY) {
      if (next) throw new Error(`"${s}" is a file, not a folder.`);
      next = vfs.createDirectory(s, node);
    }
    node = next;
  }
  return node;
}

function bytesToText(buf) {
  const view = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < view.length; i += 8192) s += String.fromCharCode.apply(null, view.subarray(i, i + 8192));
  return s;
}
function textToBytes(text) { return vfs.textToData(text); }

function writeTextFile(p, text) {
  p = normPath(p);
  const dir = ensureDir(parentPath(p));
  let f = vfs.findChild(dir, baseName(p));
  if (f && f.type === vfs.DIRECTORY) throw new Error('A folder with that name already exists.');
  if (!f) f = vfs.createFile(baseName(p), dir);
  f.data = new ArrayBuffer(0);
  vfs.writeData(f, textToBytes(text), 0);
  return f;
}
// The folder a program's relative paths start from: its own folder, or the root when it is untitled
function programFolder(path) {
  const dir = path && getNode(parentPath(path));
  return dir && dir.type === vfs.DIRECTORY ? dir : vfs.rootDirectory();
}

function readTextFile(p) { const f = getNode(p); return f && f.type === vfs.FILE ? bytesToText(f.data) : null; }

function looksBinary(buf) {
  const v = new Uint8Array(buf, 0, Math.min(buf.byteLength, 4096));
  let ctrl = 0;
  for (const b of v) { if (b === 0) return true; if (b < 9 || (b > 13 && b < 32)) ctrl++; }
  return v.length > 0 && ctrl / v.length > 0.1;
}

function downloadBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function fmtSize(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1024 / 1024).toFixed(1) + ' MB';
}

// ---------------------------------------------------------------- dialog
const dlg = $('dlg');
function ask({ title, message = '', value, okText = 'OK', cancelText = 'Cancel', danger = false, validate }) {
  return new Promise((resolve) => {
    $('dlg-title').textContent = title;
    $('dlg-msg').textContent = message;
    $('dlg-msg').hidden = !message;
    const input = $('dlg-input');
    const hasInput = value !== undefined;
    input.hidden = !hasInput;
    input.value = hasInput ? value : '';
    $('dlg-error').hidden = true;
    const ok = $('dlg-ok');
    ok.textContent = okText;
    ok.className = 'crt-btn ' + (danger ? 'crt-btn-danger' : 'crt-btn-primary');
    $('dlg-cancel').textContent = cancelText;
    $('dlg-cancel').hidden = cancelText === null;

    const onOk = (e) => {
      if (hasInput && validate) {
        const err = validate(input.value.trim());
        if (err) { e.preventDefault(); $('dlg-error').textContent = err; $('dlg-error').hidden = false; input.focus(); }
      }
    };
    ok.addEventListener('click', onOk);
    dlg.addEventListener('close', () => {
      ok.removeEventListener('click', onOk);
      if (dlg.returnValue !== 'ok') resolve(null);
      else resolve(hasInput ? input.value.trim() : true);
    }, { once: true });
    dlg.returnValue = '';
    dlg.showModal();
    if (hasInput) {
      input.focus();
      const dot = input.value.lastIndexOf('.');
      input.setSelectionRange(0, dot > 0 ? dot : input.value.length);
    } else ok.focus();
  });
}
const confirmBox = (title, message, okText = 'OK', danger = false) => ask({ title, message, okText, danger });
const alertBox = (title, message) => ask({ title, message, cancelText: null });

// ---------------------------------------------------------------- tabs
let currentTab = 'code';
let debug = null; // the debugging session (see the debugger section)
function showTab(name) {
  currentTab = name;
  const inc = name === 'include';
  for (const b of document.querySelectorAll('.app-tab')) {
    b.setAttribute('aria-selected', String(b.dataset.tab === name && (!inc || !!incActive && b === incActive.tab)));
  }
  for (const p of document.querySelectorAll('.app-panel')) p.hidden = p.id !== 'panel-' + name;
  updateRunButtons();
  if (name === 'code' || inc) {
    // the outline pane belongs to whichever code editor is shown
    const host = $('panel-' + name).querySelector('.app-code');
    for (const id of ['outline', 'watch']) if ($(id).parentElement !== host) host.appendChild($(id));
    refreshOutline(); refreshOutline.flush();
  }
  if (inc) incEditor.refresh();
  updateTitle();
  if (name === 'code') { editor.refresh(); }
  if (name === 'fileeditor') { fileEditor.refresh(); }
  if (name === 'files') renderFiles();
  if (name === 'output') resizeScreen();
}
for (const b of document.querySelectorAll('.app-tab')) b.addEventListener('click', () => showTab(b.dataset.tab)); // include tabs add their own

// Include files don't run: no Run or Debug on their tabs. While debugging, Stop and the step
// buttons are shown on every tab, since a step can stop in an include file.
function updateRunButtons() {
  const inc = currentTab === 'include';
  $('btn-run').hidden = inc;
  $('btn-debug').hidden = inc;
  $('btn-stop').hidden = inc && !debug;
  $('sep-run').hidden = inc && !debug;
  $('dbg-controls').hidden = !debug;
}

function resizeScreen() {
  const c = $('gx-container');
  if (c.clientWidth) QB.resize(c.clientWidth, c.clientHeight);
}
addEventListener('resize', resizeScreen);

// ---------------------------------------------------------------- editors
const tabKeys = {
  Tab: (cm) => cm.somethingSelected() ? cm.indentSelection('add') : cm.replaceSelection('    ', 'end'),
  'Shift-Tab': (cm) => cm.indentSelection('subtract'),
};
const BP_GUTTER = 'qb-breakpoints';
const editor = CodeMirror($('editor'), {
  mode: 'qbjs', theme: 'crt', lineNumbers: true, styleActiveLine: true, gutters: [BP_GUTTER, 'CodeMirror-linenumbers'],
  indentUnit: 4, tabSize: 4, indentWithTabs: false, extraKeys: tabKeys,
});
const fileEditor = CodeMirror($('file-editor'), {
  mode: 'text/plain', theme: 'crt', lineNumbers: true, styleActiveLine: true,
  indentUnit: 4, tabSize: 4, extraKeys: tabKeys,
});

// Breakpoints are gutter markers on the editors' lines, so they move with the text as it is
// edited. A file that is not in an editor (another program, a closed include tab) keeps its
// breakpoint line numbers in bpSaved until it is opened again. They are not kept on reload.
const bpSaved = new Map(); // path -> [line numbers]
function bpMarker() {
  const d = document.createElement('div');
  d.className = 'qb-bp-dot';
  d.title = 'Breakpoint (click to remove)';
  return d;
}
function toggleBreakpoint(cm, line) {
  const info = cm.lineInfo(line);
  if (!info) return;
  const on = !(info.gutterMarkers && info.gutterMarkers[BP_GUTTER]);
  cm.setGutterMarker(line, BP_GUTTER, on ? bpMarker() : null);
  if (debug) sendBreakpoints();
}
function docBreakpoints(doc) { // 1-based line numbers
  const lines = [];
  let n = 0;
  doc.eachLine((h) => { n++; if (h.gutterMarkers && h.gutterMarkers[BP_GUTTER]) lines.push(n); });
  return lines;
}
function saveBreakpoints(cm, path) {
  const lines = docBreakpoints(cm.getDoc());
  if (lines.length) bpSaved.set(path, lines); else bpSaved.delete(path);
}
function restoreBreakpoints(cm, path) {
  for (const l of bpSaved.get(path) || []) if (l <= cm.lineCount()) cm.setGutterMarker(l - 1, BP_GUTTER, bpMarker());
  bpSaved.delete(path);
}

// The program in the main editor
let progPath = null;     // VFS path, or null when untitled
let savedText = '';      // text as last saved / opened, for the modified marker
let untitledName = 'untitled.bas';

function isDirty() { return editor.getValue() !== savedText; }
function updateTitle() {
  const inc = typeof incActive !== 'undefined' && currentTab === 'include' && incActive;
  const name = inc ? incActive.path : progPath || untitledName;
  const dirty = inc ? incDirty(incActive) : isDirty();
  $('file-badge').textContent = name + (dirty ? ' *' : '');
  $('file-badge').title = inc ? 'Include file in the editor' : 'Program in the editor';
  document.title = baseName(name) + (dirty ? ' *' : '') + ' - QB64 IDE';
}
const saveBuffer = debounce(() => store.set('buffer', { path: progPath, untitledName, text: editor.getValue(), savedText }), 400);
editor.on('changes', () => { updateTitle(); saveBuffer(); clearErrorMarks(); });

function setProgram(text, path, name) {
  saveBreakpoints(editor, progPath || '');
  editor.setValue(text);
  editor.clearHistory();
  progPath = path;
  savedText = text;
  restoreBreakpoints(editor, progPath || '');
  if (name) untitledName = name;
  updateTitle();
  saveBuffer();
}

async function confirmDiscard() {
  if (!isDirty()) return true;
  return !!(await confirmBox('Unsaved changes', `${progPath || untitledName} has unsaved changes. Discard them?`, 'Discard', true));
}

function defaultSaveName() {
  return progPath || joinPath(fsCwd, untitledName);
}

async function saveProgram(forceAs = false) {
  if (isRunning()) return false;
  let path = progPath;
  if (!path || forceAs) {
    const answer = await ask({
      title: 'Save Program As', message: 'File name (use folder/name.bas to save into a folder):',
      value: defaultSaveName().replace(/^\//, ''), okText: 'Save',
      validate: (v) => {
        const e = pathError(v); if (e) return e;
        const n = getNode(withBasExt(v));
        if (n && n.type === vfs.DIRECTORY) return 'A folder with that name already exists.';
        return '';
      },
    });
    if (!answer) return false;
    path = normPath(withBasExt(answer));
    const existing = getNode(path);
    if (existing && path !== progPath &&
        !(await confirmBox('Replace file?', `${path} already exists. Replace it?`, 'Replace', true))) return false;
  }
  try { writeTextFile(path, editor.getValue()); }
  catch (e) { await alertBox('Save failed', e.message); return false; }
  progPath = path;
  savedText = editor.getValue();
  updateTitle();
  saveBuffer();
  flashStatus('Saved ' + path);
  return true;
}
function withBasExt(p) { return extOf(p) ? p : p + '.bas'; }

// The toolbar's File menu (disk icon) runs the hidden File commands, so they keep one place
// for their handlers and their disabled state (while a program runs).
attachMenu($('btn-file'), () => [
  ['New', () => $('btn-new').click(), false, $('btn-new').disabled],
  ['Save', () => $('btn-save').click(), false, $('btn-save').disabled, 'Ctrl+S'],
  ['Save As…', () => $('btn-saveas').click(), false, $('btn-saveas').disabled, 'Ctrl+Shift+S'],
  ['Download', () => $('btn-download').click(), false, $('btn-download').disabled],
  ['Open from Computer…', () => $('btn-open').click(), false, $('btn-open').disabled],
]);
$('btn-save').addEventListener('click', () => (currentTab === 'include' && incActive ? saveInclude(incActive, false) : saveProgram(false)));
$('btn-saveas').addEventListener('click', () => (currentTab === 'include' && incActive ? saveInclude(incActive, true) : saveProgram(true)));
$('btn-new').addEventListener('click', async () => {
  if (isRunning() || !(await confirmDiscard())) return;
  setProgram('', null, 'untitled.bas');
  showTab('code');
  editor.focus();
});
$('btn-download').addEventListener('click', () => {
  if (currentTab === 'include' && incActive) {
    downloadBlob(new Blob([textToBytes(incActive.doc.getValue())], { type: 'text/plain' }), baseName(incActive.path));
    return;
  }
  downloadBlob(new Blob([textToBytes(editor.getValue())], { type: 'text/plain' }), baseName(progPath || untitledName));
});
$('btn-open').addEventListener('click', async () => {
  if (isRunning() || !(await confirmDiscard())) return;
  $('open-input').value = '';
  $('open-input').click();
});
$('open-input').addEventListener('change', async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  setProgram(bytesToText(await f.arrayBuffer()), null, f.name);
  showTab('code');
});

function openProgram(path) {
  setProgram(readTextFile(path) ?? '', normPath(path));
  showTab('code');
  editor.focus();
}

// ---------------------------------------------------------------- file editor (non-program files)
let fePath = null, feSaved = '';
function openFileEditor(path) {
  fePath = normPath(path);
  feSaved = readTextFile(fePath) ?? '';
  const ext = extOf(fePath);
  fileEditor.setOption('mode', ['bi', 'bm', 'bas', 'inc'].includes(ext) ? 'qbjs' : 'text/plain');
  fileEditor.setValue(feSaved);
  fileEditor.clearHistory();
  updateFileEditorLabel();
  document.querySelector('.app-tab[data-tab="fileeditor"]').hidden = false;
  showTab('fileeditor');
  fileEditor.focus();
}
function updateFileEditorLabel() {
  const dirty = fileEditor.getValue() !== feSaved;
  $('fileeditor-label').textContent = (fePath ? baseName(fePath) : '') + (dirty ? ' *' : '');
  $('fileeditor-path').textContent = fePath || '';
}
fileEditor.on('changes', updateFileEditorLabel);
function saveFileEditor() {
  if (!fePath) return;
  try { writeTextFile(fePath, fileEditor.getValue()); }
  catch (e) { alertBox('Save failed', e.message); return; }
  feSaved = fileEditor.getValue();
  updateFileEditorLabel();
  flashStatus('Saved ' + fePath);
}
async function closeFileEditor(force = false) {
  if (!force && fileEditor.getValue() !== feSaved &&
      !(await confirmBox('Unsaved changes', `${fePath} has unsaved changes. Discard them?`, 'Discard', true))) return;
  fePath = null;
  document.querySelector('.app-tab[data-tab="fileeditor"]').hidden = true;
  if (currentTab === 'fileeditor') showTab('files');
}
$('fe-save').addEventListener('click', saveFileEditor);
$('fe-close').addEventListener('click', () => closeFileEditor());

// ---------------------------------------------------------------- include tabs
// Double-clicking an $INCLUDE in the outline opens the file in a tab of its own, after the
// standard tabs and in a different colour. Its editor works like the program's (highlighting,
// keyword capitals, outline), but Run and Stop are hidden there: Save, Save As and Download
// apply to the include file. Each tab keeps its own document (undo, cursor). The tabs are not
// kept when the page is reloaded.
const incEditor = CodeMirror($('inc-editor'), {
  mode: 'qbjs', theme: 'crt', lineNumbers: true, styleActiveLine: true, gutters: [BP_GUTTER, 'CodeMirror-linenumbers'],
  indentUnit: 4, tabSize: 4, indentWithTabs: false, extraKeys: tabKeys,
});
const incTabs = [];   // { path, doc, saved, tab }
let incActive = null; // the tab shown in the include panel

const incDirty = (t) => t.doc.getValue() !== t.saved;
function incLabel(t) {
  t.tab.querySelector('.app-tab-name').textContent = baseName(t.path) + (incDirty(t) ? ' *' : '');
  t.tab.title = t.path + ' (include file)';
}

function openIncludeTab(path) {
  let t = incTabs.find((x) => x.path === path);
  if (!t) {
    const text = readTextFile(path) ?? '';
    t = { path, saved: text, doc: CodeMirror.Doc(text, 'qbjs') };
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'crt-btn app-tab app-tab-inc';
    b.setAttribute('role', 'tab');
    b.dataset.tab = 'include';
    const name = document.createElement('span');
    name.className = 'app-tab-name';
    const x = document.createElement('span');
    x.className = 'app-tab-x';
    x.textContent = '×';
    x.title = 'Close';
    b.append(name, x);
    b.addEventListener('click', (e) => { if (e.target === x) closeIncludeTab(t); else showInclude(t); });
    b.addEventListener('auxclick', (e) => { if (e.button === 1) { e.preventDefault(); closeIncludeTab(t); } }); // middle click
    t.tab = b;
    document.querySelector('.app-tabs').appendChild(b);
    incTabs.push(t);
    incLabel(t);
    showInclude(t);
    restoreBreakpoints(incEditor, path);
    return;
  }
  showInclude(t);
}

function showInclude(t) {
  incActive = t;
  if (incEditor.getDoc() !== t.doc) incEditor.swapDoc(t.doc);
  showTab('include');
  incEditor.focus();
}

async function closeIncludeTab(t, force = false) {
  if (!force && incDirty(t) &&
      !(await confirmBox('Unsaved changes', `${t.path} has unsaved changes. Discard them?`, 'Discard', true))) return;
  const i = incTabs.indexOf(t);
  if (i < 0) return;
  incTabs.splice(i, 1);
  t.tab.remove();
  bpSaved.set(t.path, docBreakpoints(t.doc));
  if (incActive !== t) return;
  incActive = null;
  incEditor.swapDoc(CodeMirror.Doc('', 'qbjs'));
  const next = incTabs[i] || incTabs[i - 1];
  if (currentTab === 'include') { if (next) showInclude(next); else showTab('code'); }
}

async function saveInclude(t, saveAs = false) {
  let path = t.path;
  if (saveAs) {
    const answer = await ask({
      title: 'Save Include File As', message: 'File name (use folder/name.bi to save into a folder):',
      value: t.path.replace(/^\//, ''), okText: 'Save',
      validate: (v) => {
        const e = pathError(v); if (e) return e;
        const n = getNode(v);
        if (n && n.type === vfs.DIRECTORY) return 'A folder with that name already exists.';
        if (incTabs.some((o) => o !== t && o.path === vfs.fullPath(n || {}))) return 'That file is open in another tab.';
        return '';
      },
    });
    if (!answer) return false;
    path = normPath(answer);
    const existing = getNode(path);
    if (existing && vfs.fullPath(existing) !== t.path &&
        !(await confirmBox('Replace file?', `${path} already exists. Replace it?`, 'Replace', true))) return false;
  }
  try { writeTextFile(path, t.doc.getValue()); }
  catch (e) { await alertBox('Save failed', e.message); return false; }
  const node = getNode(path);
  t.path = node ? vfs.fullPath(node) : path;
  t.saved = t.doc.getValue();
  incLabel(t);
  updateTitle();
  flashStatus('Saved ' + t.path);
  return true;
}

incEditor.on('changes', () => { if (incActive) incLabel(incActive); updateTitle(); });
addEventListener('beforeunload', (e) => {
  if (incTabs.some(incDirty) || (rec && rec.dirty)) { e.preventDefault(); e.returnValue = ''; }
});

// ---------------------------------------------------------------- record editor
// Edits a RANDOM file record by record. A dialog picks the TYPE of the records, from the TYPEs
// in the program and its $INCLUDE files, or from a pasted TYPE definition ("Custom"), and the
// record length. The fields are made from the TYPE's layout (records.js), nested TYPEs as
// indented groups. Changes are kept in a copy of the file until Save File.
let rec = null; // { path, typeName, custom, layout, recLen, data (Uint8Array), length, index, dirty }
const R = window.QBRecords;

// $INCLUDE file names in a program's comments
function includeNames(text) {
  const names = [];
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*\$INCLUDE\s*:\s*(?:'([^']*)'?|"([^"]*)"?|(\S+))/i.exec(splitComment(line)[1]);
    const n = m && (m[1] || m[2] || m[3] || '').trim();
    if (n) names.push(n);
  }
  return names;
}

// The TYPEs of the program in the editor and of the files it includes (and they include),
// read from open include tabs first so unsaved edits count.
function programTypes() {
  const types = new Map(), consts = new Map(), seen = new Set();
  const folder = vfs.fullPath(programFolder(progPath));
  (function scan(text, label) {
    R.parseTypes(text, types, consts, label);
    for (const name of includeNames(text)) {
      const rel = name.replaceAll('\\', '/');
      const node = getNode(rel.startsWith('/') ? rel : joinPath(folder, rel));
      if (!node || node.type !== vfs.FILE) continue;
      const path = vfs.fullPath(node);
      if (seen.has(path)) continue;
      seen.add(path);
      const tab = incTabs.find((t) => t.path === path);
      scan(tab ? tab.doc.getValue() : bytesToText(node.data), baseName(path));
    }
  })(editor.getValue(), baseName(progPath || untitledName));
  return types;
}

// The record TYPE for a custom definition: the last TYPE in the text. Its nested TYPEs may
// come from the text or from the program.
function customType(text) {
  const own = R.parseTypes(text);
  if (!own.size) return { error: 'No TYPE ... END TYPE found.' };
  const all = programTypes();
  for (const [k, v] of own) all.set(k, v);
  const name = [...own.values()].pop().name;
  return { name, types: all, layout: R.layoutType(name, all) };
}

// Shows the dialog; resolves to { typeName, custom, layout, recLen } or null.
function chooseRecordType(path, prev) {
  return new Promise((resolve) => {
    const d = $('rec-dlg'), sel = $('rec-dlg-type'), text = $('rec-dlg-text'), len = $('rec-dlg-len');
    const node = getNode(path), fileSize = node ? node.data.byteLength : 0;
    const types = programTypes();
    const remembered = prev || store.get('recTypes', {})[path] || {};
    $('rec-dlg-file').textContent = `${path} (${fileSize} bytes)`;
    sel.textContent = '';
    for (const t of types.values()) {
      const lay = R.layoutType(t.name, types);
      const o = new Option(lay.error ? `${t.name} (${lay.error})` : `${t.name}: ${lay.size} bytes (${t.source})`, t.name);
      o.disabled = !!lay.error;
      sel.appendChild(o);
    }
    sel.appendChild(new Option('Custom: paste a TYPE definition', '*custom'));
    const usable = [...sel.options].filter((o) => !o.disabled);
    if (remembered.custom) { sel.value = '*custom'; text.value = remembered.custom; }
    else if (remembered.typeName && types.has(remembered.typeName.toUpperCase())) sel.value = types.get(remembered.typeName.toUpperCase()).name;
    else {
      // first time for this file: the largest TYPE whose size divides the file size, as a guess
      const fits = [...types.values()].map((t) => R.layoutType(t.name, types))
        .map((lay, k) => ({ lay, name: [...types.values()][k].name }))
        .filter(({ lay }) => !lay.error && lay.size && fileSize && fileSize % lay.size === 0)
        .sort((a, b) => b.lay.size - a.lay.size);
      sel.value = fits.length ? fits[0].name : usable[0].value;
    }
    let lenTouched = !!remembered.recLen;
    len.value = remembered.recLen || '';

    let current = null; // { typeName, custom, layout }
    const update = () => {
      const custom = sel.value === '*custom';
      $('rec-dlg-custom').hidden = !custom;
      let err = '';
      if (custom) {
        const c = customType(text.value);
        current = c.error ? null : { typeName: c.name, custom: text.value, layout: c.layout };
        err = c.error || (c.layout.error ? c.layout.error : '');
      } else {
        const lay = R.layoutType(sel.value, types);
        current = { typeName: types.get(sel.value.toUpperCase()).name, custom: '', layout: lay };
        err = lay.error;
      }
      if (err) current = null;
      if (current && !lenTouched) len.value = current.layout.size;
      const recLen = Math.floor(+len.value);
      if (!err && current) {
        if (!(recLen >= current.layout.size && recLen <= 32767)) err = `The record length must be from ${current.layout.size} (the size of ${current.typeName}) to 32767.`;
      }
      let info = '';
      if (current && !err) {
        const fields = current.layout.items.filter((i) => i.kind === 'field').length;
        const full = Math.floor(fileSize / recLen), part = fileSize % recLen;
        info = `${current.typeName}: ${fields} field${fields === 1 ? '' : 's'}, ${current.layout.size} bytes per record.\n` +
          (fileSize ? `The file holds ${full} record${full === 1 ? '' : 's'}` + (part ? ` and part of another (${part} bytes).` : '.') : 'The file is empty.');
      }
      $('rec-dlg-info').textContent = info;
      $('rec-dlg-error').textContent = err;
      $('rec-dlg-error').hidden = !err;
      $('rec-dlg-ok').disabled = !!err || !current;
    };
    sel.onchange = () => { lenTouched = false; update(); if (sel.value === '*custom') text.focus(); };
    text.oninput = () => { lenTouched = false; update(); };
    len.oninput = () => { lenTouched = true; update(); };
    d.onclose = () => {
      sel.onchange = text.oninput = len.oninput = d.onclose = null;
      if (d.returnValue !== 'ok' || !current) { resolve(null); return; }
      const result = { ...current, recLen: Math.floor(+len.value) };
      const all = store.get('recTypes', {});
      all[path] = { typeName: result.typeName, custom: result.custom, recLen: result.recLen };
      store.set('recTypes', all);
      resolve(result);
    };
    update();
    d.returnValue = '';
    d.showModal();
    (sel.value === '*custom' ? text : sel).focus();
  });
}

async function openRecordEditor(path, retype = false) {
  path = normPath(path);
  if (!retype && rec && rec.path !== path && rec.dirty &&
      !(await confirmBox('Unsaved changes', `${rec.path} has unsaved changes. Discard them?`, 'Discard', true))) return;
  const keep = retype && rec && rec.path === path ? rec : null;
  const choice = await chooseRecordType(path, keep && { typeName: keep.typeName, custom: keep.custom, recLen: keep.recLen });
  if (!choice) return;
  if (keep) Object.assign(rec, choice, { index: 0 });  // read the same bytes (with any changes) another way
  else {
    const node = getNode(path);
    if (!node || node.type !== vfs.FILE) { await alertBox('File not found', path); return; }
    rec = { path: vfs.fullPath(node), ...choice, data: new Uint8Array(node.data.slice(0)), length: node.data.byteLength, index: 0, dirty: false };
  }
  document.querySelector('.app-tab[data-tab="records"]').hidden = false;
  setRecordDirty(rec.dirty);
  buildRecordFields();
  showRecord(0);
  showTab('records');
}

const recCount = () => (rec.length ? Math.ceil(rec.length / rec.recLen) : 0);

// a DataView over record i, zero-filled where it runs past the end of the file
function recordView(i) {
  const start = i * rec.recLen, size = rec.layout.size;
  if (start + size <= rec.length) return new DataView(rec.data.buffer, rec.data.byteOffset + start, size);
  const tmp = new Uint8Array(size);
  if (start < rec.length) tmp.set(rec.data.subarray(start, rec.length));
  return new DataView(tmp.buffer);
}

// makes the file at least n bytes long (new bytes are 0), as PUT does
function recordGrow(n) {
  if (n > rec.data.length) {
    const d = new Uint8Array(Math.max(n, rec.data.length * 2));
    d.set(rec.data.subarray(0, rec.length));
    rec.data = d;
  }
  if (n > rec.length) { rec.data.fill(0, rec.length, n); rec.length = n; }
}

function recordLabel(i) {
  const f = rec.layout.items.find((it) => it.base === 'STRING');
  const preview = f && i < 3000 ? R.readField(recordView(i), f.offset, f).trim().slice(0, 24) : '';
  return String(i + 1) + (preview ? ' · ' + preview : '');
}

function buildRecordFields() {
  const box = $('rec-fields');
  box.textContent = '';
  $('rec-path').textContent = rec.path;
  $('rec-typeinfo').textContent = `TYPE ${rec.typeName}${rec.custom ? ' (custom)' : ''} · ${rec.layout.size} bytes` +
    (rec.recLen !== rec.layout.size ? ` · LEN ${rec.recLen}` : '');
  for (const it of rec.layout.items) {
    if (it.kind === 'group') {
      const g = document.createElement('div');
      g.className = 'rec-group';
      g.style.setProperty('--d', it.depth);
      const n = document.createElement('span'); n.textContent = it.name;
      const t = document.createElement('span'); t.className = 'rec-type'; t.textContent = 'AS ' + it.type;
      g.append(n, t);
      box.appendChild(g);
      continue;
    }
    const id = 'recf-' + it.path.replace(/\W/g, '_');
    const name = document.createElement('label');
    name.className = 'rec-name';
    name.htmlFor = id;
    name.style.setProperty('--d', it.depth);
    name.textContent = it.name;
    name.title = `${it.path}: bytes ${it.offset + 1}-${it.offset + it.size} of the record`;
    const type = document.createElement('span');
    type.className = 'rec-type';
    type.textContent = it.type;
    const cell = document.createElement('div');
    cell.className = 'rec-cell';
    const input = document.createElement('input');
    input.className = 'crt-field';
    input.id = id;
    input.spellcheck = false;
    input.autocomplete = 'off';
    if (it.base === 'STRING') input.maxLength = it.size;
    else input.inputMode = /SINGLE|DOUBLE/.test(it.base) ? 'decimal' : 'numeric';
    const err = document.createElement('span');
    err.className = 'rec-err';
    err.hidden = true;
    input.addEventListener('input', () => {
      const msg = R.checkField(it, input.value);
      input.classList.toggle('bad', !!msg);
      err.textContent = msg; err.hidden = !msg;
      if (msg) return;
      recordGrow(rec.index * rec.recLen + rec.layout.size);
      R.writeField(new DataView(rec.data.buffer), rec.data.byteOffset + rec.index * rec.recLen + it.offset, it, input.value);
      input.classList.add('changed');
      setRecordDirty(true);
      const opt = $('rec-select').options[rec.index];
      if (opt) opt.textContent = recordLabel(rec.index);
    });
    input.dataset.path = it.path;
    cell.append(input, err);
    box.append(name, type, cell);
  }
}

function showRecord(i) {
  const n = recCount();
  rec.index = Math.max(0, Math.min(i, Math.max(n - 1, 0)));
  const sel = $('rec-select');
  if (sel.options.length !== n || sel.dataset.path !== rec.path + '|' + rec.recLen + '|' + rec.typeName) {
    sel.textContent = '';
    for (let k = 0; k < n; k++) sel.appendChild(new Option(recordLabel(k), k));
    sel.dataset.path = rec.path + '|' + rec.recLen + '|' + rec.typeName;
  }
  sel.value = String(rec.index);
  sel.disabled = !n;
  $('rec-prev').disabled = rec.index <= 0;
  $('rec-next').disabled = rec.index >= n - 1;
  const part = rec.length % rec.recLen;
  $('rec-count').textContent = `of ${n}` + (part && rec.index === n - 1 && rec.length - rec.index * rec.recLen < rec.layout.size ? ' (this record is cut short in the file)' : '');
  $('rec-note').hidden = !!n;
  $('rec-note').textContent = n ? '' : 'The file is empty. Add Record creates record 1.';
  $('rec-fields').hidden = !n;
  if (!n) return;
  const view = recordView(rec.index);
  for (const it of rec.layout.items) {
    if (it.kind !== 'field') continue;
    const input = document.getElementById('recf-' + it.path.replace(/\W/g, '_'));
    input.value = R.readField(view, it.offset, it);
    input.classList.remove('bad', 'changed');
    input.nextSibling.hidden = true;
  }
}

function setRecordDirty(d) {
  rec.dirty = d;
  $('records-label').textContent = 'Records: ' + baseName(rec.path) + (d ? ' *' : '');
}

function saveRecordFile() {
  if (!rec) return;
  if (document.querySelector('#rec-fields .bad')) {
    alertBox('Not saved', 'Some fields have values that cannot be stored (marked in red). Fix or undo them first.');
    return;
  }
  try {
    const p = normPath(rec.path);
    const dir = ensureDir(parentPath(p));
    let f = vfs.findChild(dir, baseName(p));
    if (f && f.type === vfs.DIRECTORY) throw new Error('A folder with that name already exists.');
    if (!f) f = vfs.createFile(baseName(p), dir);
    f.data = new ArrayBuffer(0);
    vfs.writeData(f, rec.data.slice(0, rec.length).buffer, 0);
  } catch (e) { alertBox('Save failed', e.message); return; }
  setRecordDirty(false);
  for (const el of document.querySelectorAll('#rec-fields .changed')) el.classList.remove('changed');
  flashStatus('Saved ' + rec.path);
}

async function closeRecordEditor(force = false) {
  if (!rec) return;
  if (!force && rec.dirty &&
      !(await confirmBox('Unsaved changes', `${rec.path} has unsaved changes. Discard them?`, 'Discard', true))) return;
  rec = null;
  document.querySelector('.app-tab[data-tab="records"]').hidden = true;
  if (currentTab === 'records') showTab('files');
}

$('rec-select').addEventListener('change', (e) => showRecord(+e.target.value));
$('rec-prev').addEventListener('click', () => showRecord(rec.index - 1));
$('rec-next').addEventListener('click', () => showRecord(rec.index + 1));
$('rec-add').addEventListener('click', () => {
  const n = recCount();
  recordGrow(n * rec.recLen + rec.layout.size);
  setRecordDirty(true);
  showRecord(n);
  const first = $('rec-fields').querySelector('input');
  if (first) first.focus();
});
$('rec-save').addEventListener('click', saveRecordFile);
$('rec-close').addEventListener('click', () => closeRecordEditor());
$('rec-retype').addEventListener('click', () => rec && openRecordEditor(rec.path, true));
// Enter in the dialog opens (the form's first button is Cancel, which a plain Enter would press)
$('rec-dlg').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') {
    e.preventDefault();
    if (!$('rec-dlg-ok').disabled) $('rec-dlg-ok').click();
  }
});

// ---------------------------------------------------------------- messages
let errorMarks = [];
function clearErrorMarks() {
  for (const h of errorMarks) editor.removeLineClass(h, 'background', 'cm-error-line');
  errorMarks = [];
}
function clearMessages() {
  programMessages = 0;
  $('msg-rows').innerHTML = '';
  $('msg-table').hidden = true;
  $('msg-empty').hidden = false;
  $('msg-count').hidden = true;
  clearErrorMarks();
}
// kind: "error" and "warn" (the compiler, runtime errors), or what the program wrote with
// _ECHO ("echo") and _LOGTRACE / _LOGINFO / _LOGWARN / _LOGERROR ("trace", "info",
// "logwarn", "logerror"). module is the file for a line in an include file (or in a program
// started with RUN); a click on the row opens it at that line.
const MSG_KINDS = {
  error: ['ERROR', 'error'], warn: ['WARN', 'warn'], echo: ['ECHO', 'echo'], trace: ['TRACE', 'trace'],
  info: ['INFO', 'info'], logwarn: ['WARN', 'warn log'], logerror: ['ERROR', 'error log'],
};
// The program's own messages (_ECHO, _LOG...). A program that writes many in a loop would
// make the tab slow, so after MAX_PROGRAM_MESSAGES the rest are only counted (they still go
// to the browser's console).
const MAX_PROGRAM_MESSAGES = 2000;
let programMessages = 0;
function programMessage(kind, text, line, file, runLabel) {
  programMessages++;
  if (programMessages <= MAX_PROGRAM_MESSAGES) { addMessage(kind, line, text, file || runLabel); return; }
  let more = $('msg-more');
  if (!more) {
    more = document.createElement('tr');
    more.id = 'msg-more';
    more.className = 'more';
    more.innerHTML = '<td></td><td></td><td></td>';
    $('msg-rows').appendChild(more);
  }
  more.lastChild.textContent = `${programMessages - MAX_PROGRAM_MESSAGES} more messages from the program are not shown here (the browser's console has them all).`;
}
function addMessage(kind, line, text, module) {
  const [label, cls] = MSG_KINDS[kind] || MSG_KINDS.warn;
  const tr = document.createElement('tr');
  tr.className = cls;
  const cells = [label, module ? `${module}:${line}` : (line > 0 ? String(line) : ''), text];
  for (const c of cells) { const td = document.createElement('td'); td.textContent = c; tr.appendChild(td); }
  if (!module && line > 0) {
    tr.addEventListener('click', () => gotoLine(line));
    if (kind === 'error') {
      const h = editor.addLineClass(line - 1, 'background', 'cm-error-line');
      if (h) errorMarks.push(h);
    }
  } else if (module && line > 0) {
    tr.addEventListener('click', async () => {
      await openInclude(module);
      if (currentTab === 'include') jumpTo(incEditor, line);
    });
  }
  $('msg-rows').appendChild(tr);
  $('msg-table').hidden = false;
  $('msg-empty').hidden = true;
  const rows = $('msg-rows').children.length;
  const errs = $('msg-rows').querySelectorAll('tr.error').length;
  const badge = $('msg-count');
  badge.textContent = rows;
  badge.classList.toggle('warn', errs === 0);
  badge.hidden = false;
}
function gotoLine(line) {
  showTab('code');
  jumpTo(editor, line);
}
function jumpTo(cm, line) {
  cm.setCursor({ line: line - 1, ch: 0 });
  const top = cm.charCoords({ line: line - 1, ch: 0 }, 'local').top;
  cm.scrollTo(null, top - cm.getScrollerElement().offsetHeight / 2);
  cm.focus();
}
// the code editor in front: the program's, or the include file's on an include tab
function activeCode() { return currentTab === 'include' && incActive ? incEditor : editor; }

// ---------------------------------------------------------------- outline
// The right-hand pane of the Code tab lists the program's SUBs, FUNCTIONs, TYPEs, constants,
// labels and imports. It comes from a quick scan of the text (parseOutline), not the
// compiler, so it updates as you type and also works while the program has errors.
const OUTLINE_GROUPS = [
  ['import', 'Imports'], ['type', 'Types'], ['const', 'Constants'],
  ['sub', 'Subs'], ['function', 'Functions'], ['label', 'Labels'],
];
// words that end with ':' at the start of a statement but are not labels ("ELSE: x = 1")
const NOT_LABELS = new Set(['ELSE', 'END', 'CASE', 'THEN', 'DO', 'LOOP', 'NEXT', 'WEND', 'REM', 'PRINT', 'CLS',
  'BEEP', 'RETURN', 'STOP', 'SYSTEM', 'RANDOMIZE', 'RESTORE', 'RESUME', 'CLOSE', 'RUN', 'EXIT']);

// splits a line into code and comment, at the first ' or REM outside a string
function splitComment(line) {
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') quoted = !quoted;
    else if (!quoted) {
      if (c === "'") return [line.slice(0, i), line.slice(i + 1)];
      if ((c === 'R' || c === 'r') && (i === 0 || /[\s:]/.test(line[i - 1])) && /^REM(\s|$)/i.test(line.slice(i))) {
        return [line.slice(0, i), line.slice(i + 3)];
      }
    }
  }
  return [line, ''];
}

// splits at commas that are outside quotes and parentheses
function splitTopLevel(text) {
  const parts = [];
  let depth = 0, quoted = false, start = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') quoted = !quoted;
    else if (!quoted && c === '(') depth++;
    else if (!quoted && c === ')') depth--;
    else if (!quoted && depth === 0 && c === ',') { parts.push(text.slice(start, i)); start = i + 1; }
  }
  parts.push(text.slice(start));
  return parts;
}

function parseOutline(text) {
  const lines = text.split(/\r?\n/);
  const items = [];
  const stmts = [];          // [line number, code] outside $IF JAVASCRIPT blocks
  let inJs = false;
  for (let i = 0; i < lines.length; i++) {
    const [code, comment] = splitComment(lines[i]);
    const t = code.trim();
    const u = t.toUpperCase();
    if (inJs) { if (/^\$END/.test(u)) inJs = false; continue; }
    if (/^\$IF\s+JAVASCRIPT\b/.test(u)) { inJs = true; continue; }
    // '$INCLUDE: 'file.bi' (QB64), or without quotes ('$include:vars.bas), which QBJS also accepts
    const inc = /^\s*\$INCLUDE\s*:\s*(?:'([^']*)'?|"([^"]*)"?|(\S+))/i.exec(comment);
    const incName = inc && (inc[1] || inc[2] || inc[3] || '').trim();
    if (incName) items.push({ kind: 'import', name: incName, detail: '$INCLUDE', line: i + 1 });
    if (t) stmts.push([i + 1, t]);
  }

  // names that GOTO, GOSUB, RESTORE, ... jump to, so line numbers can be listed only when used
  const targets = new Set();
  const handlers = new Set();
  for (const [, t] of stmts) {
    const s = t.replace(/"[^"]*"?/g, '""');
    for (const m of s.matchAll(/\bGO(?:TO|SUB)\s+([^:]+)/gi)) {
      for (const part of m[1].split(',')) { const w = /^\s*([A-Za-z][\w.]*|\d+)/.exec(part); if (w) targets.add(w[1].toUpperCase()); }
    }
    for (const m of s.matchAll(/\b(?:RESTORE|RESUME|RETURN|THEN|ELSE)\s+([A-Za-z][\w.]*|\d+)/gi)) targets.add(m[1].toUpperCase());
    for (const m of s.matchAll(/\bON\s+ERROR\s+GOTO\s+([A-Za-z][\w.]*|\d+)/gi)) handlers.add(m[1].toUpperCase());
  }
  targets.delete('NEXT'); targets.delete('0');

  let inProc = null, inType = null;
  for (const [ln, text0] of stmts) {
    let t = text0;
    // a label at the start of the line: "name:" or a line number used by a jump
    let m = /^([A-Za-z][\w.]*):(?!=)\s*/.exec(t);
    if (m && (!NOT_LABELS.has(m[1].toUpperCase()) || targets.has(m[1].toUpperCase()))) {
      const up = m[1].toUpperCase();
      items.push({ kind: 'label', name: m[1], line: ln,
        detail: handlers.has(up) ? 'error handler' : (inProc ? 'in ' + inProc : '') });
      t = t.slice(m[0].length);
    } else if ((m = /^(\d+)(?=[\s:]|$):?\s*/.exec(t))) {
      if (targets.has(m[1])) {
        items.push({ kind: 'label', name: m[1], line: ln,
          detail: handlers.has(m[1]) ? 'error handler' : (inProc ? 'in ' + inProc : '') });
      }
      t = t.slice(m[0].length);
    }
    if (!t) continue;
    const u = t.toUpperCase();

    if (inType) {
      if (/^END\s+TYPE\b/.test(u)) { inType.detail = inType.fields + (inType.fields === 1 ? ' field' : ' fields'); inType = null; }
      else inType.fields += splitTopLevel(t.replace(/^AS\s+\S+(\s*\*\s*\S+)?\s+/i, '')).length;
      continue;
    }
    if ((m = /^(SUB|FUNCTION)\s+([A-Za-z_][\w.]*[$%&!#~`]*)\s*(\(([^)]*)\))?/i.exec(t))) {
      const params = (m[4] || '').replace(/\s+/g, ' ').trim();
      items.push({ kind: m[1].toLowerCase(), name: m[2], detail: params ? '(' + params + ')' : '', line: ln });
      inProc = m[2];
    } else if (/^END\s+(SUB|FUNCTION)\b/.test(u)) {
      inProc = null;
    } else if ((m = /^TYPE\s+([A-Za-z_]\w*)\s*$/i.exec(t))) {
      inType = { kind: 'type', name: m[1], detail: '', line: ln, fields: 0 };
      items.push(inType);
    } else if ((m = /^IMPORT\s+(\w+)\s+FROM\s+"([^"]*)"/i.exec(t))) {
      items.push({ kind: 'import', name: m[1], detail: m[2], line: ln });
    } else if (/^CONST\s/i.test(u)) {
      for (const part of splitTopLevel(t.slice(5))) {
        const c = /^\s*([A-Za-z_][\w.]*[$%&!#~`]*)\s*=\s*(.*?)\s*$/.exec(part);
        if (c) items.push({ kind: 'const', name: c[1], detail: c[2].length > 24 ? c[2].slice(0, 23) + '…' : c[2], line: ln });
      }
    }
  }
  for (const it of items) delete it.fields;
  return items.sort((a, b) => a.line - b.line);
}

const outline = { items: [], collapsed: new Set(store.get('outlineCollapsed', [])) };
const narrowScreen = matchMedia('(max-width: 700px)');

function renderOutline() {
  const list = $('outline-list');
  const filter = $('outline-filter').value.trim().toUpperCase();
  const shown = outline.items.filter((it) => !filter || it.name.toUpperCase().includes(filter));
  list.textContent = '';
  $('outline-count').textContent = outline.items.length ? String(outline.items.length) : '';
  if (!shown.length) {
    const p = document.createElement('div');
    p.className = 'app-outline-empty';
    p.textContent = outline.items.length ? 'Nothing matches.' : 'No SUBs, FUNCTIONs, TYPEs, constants, labels or imports.';
    list.appendChild(p);
    return;
  }
  for (const [kind, title] of OUTLINE_GROUPS) {
    const group = shown.filter((it) => it.kind === kind);
    if (!group.length) continue;
    const open = !!filter || !outline.collapsed.has(kind);
    const head = document.createElement('button');
    head.type = 'button';
    head.className = 'ol-group';
    head.setAttribute('aria-expanded', String(open));
    head.append(title + ' ');
    const n = document.createElement('span');
    n.className = 'ol-group-n';
    n.textContent = group.length;
    head.appendChild(n);
    head.addEventListener('click', () => {
      if (outline.collapsed.has(kind)) outline.collapsed.delete(kind); else outline.collapsed.add(kind);
      store.set('outlineCollapsed', [...outline.collapsed]);
      renderOutline();
    });
    list.appendChild(head);
    if (!open) continue;
    for (const it of group) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ol-item';
      b.dataset.line = it.line;
      b.title = `${it.name}${it.detail ? ' ' + it.detail : ''} (line ${it.line})`;
      const name = document.createElement('span');
      name.className = 'ol-name';
      name.textContent = it.name;
      if (it.detail) {
        const d = document.createElement('span');
        d.className = 'ol-detail';
        d.textContent = ' ' + it.detail;
        name.appendChild(d);
      }
      const line = document.createElement('span');
      line.className = 'ol-line';
      line.textContent = it.line;
      b.append(name, line);
      b.addEventListener('click', () => {
        jumpTo(activeCode(), it.line);
        // on a phone the pane closes, a moment later so that a double-click can still reach it
        clearTimeout(outlineHideTimer);
        if (narrowScreen.matches) outlineHideTimer = setTimeout(() => setOutlineVisible(false), 350);
      });
      if (it.detail === '$INCLUDE') {
        b.title += ' - double-click to open the file';
        b.addEventListener('dblclick', () => {
          clearTimeout(outlineHideTimer);
          if (narrowScreen.matches) setOutlineVisible(false);
          openInclude(it.name);
        });
      }
      list.appendChild(b);
    }
  }
  markOutlineCursor();
}

// highlights the last item at or above the cursor (usually the SUB or FUNCTION it is in)
function markOutlineCursor() {
  const cur = activeCode().getCursor().line + 1;
  let best = null;
  for (const b of $('outline-list').querySelectorAll('.ol-item')) {
    b.classList.remove('active');
    const l = +b.dataset.line;
    if (l <= cur && (!best || l >= +best.dataset.line)) best = b;
  }
  if (best) best.classList.add('active');
}

let outlineHideTimer = null;

// Double-click on an $INCLUDE in the outline: open the file in an include tab. A relative name
// is looked up from the program's folder, as the compiler does (names ignore case).
async function openInclude(name) {
  const rel = name.replaceAll('\\', '/');
  const folder = vfs.fullPath(programFolder(progPath));
  const want = rel.startsWith('/') ? normPath(rel) : joinPath(folder, rel);
  const node = getNode(want);
  if (!node || node.type !== vfs.FILE) {
    await alertBox('File not found', `${name} was not found in the file system (looked for ${want}). Add it on the Files tab.`);
    return;
  }
  openIncludeTab(vfs.fullPath(node));
}

const refreshOutline = debounce(() => { outline.items = parseOutline(activeCode().getValue()); renderOutline(); }, 300);

function setOutlineVisible(show) {
  if (show && narrowScreen.matches && !$('watch').hidden) setWatchVisible(false);
  $('outline').hidden = !show;
  $('btn-outline').setAttribute('aria-pressed', String(show));
  if (!narrowScreen.matches) store.set('outline', show);
  editor.refresh();
  incEditor.refresh();
}

for (const cm of [editor, incEditor]) {
  cm.on('changes', () => { if (activeCode() === cm) refreshOutline(); });
  cm.on('cursorActivity', debounce(() => { if (activeCode() === cm) markOutlineCursor(); }, 100));
}
$('outline-filter').addEventListener('input', renderOutline);
$('outline-filter').addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.target.value = ''; renderOutline(); } });
$('outline-close').addEventListener('click', () => setOutlineVisible(false));
$('btn-outline').addEventListener('click', () => {
  const show = $('outline').hidden;
  setOutlineVisible(show);
  if (show && currentTab !== 'include') showTab('code');
});
setOutlineVisible(!narrowScreen.matches && store.get('outline', true));
refreshOutline.flush();

// ---------------------------------------------------------------- run / stop
// Compiling and running is done by qbjs/runner.js (QBRunner), shared with the embedded
// player; this part shows what happens in the IDE's tabs, status and debugger.
let lastRunFailed = false;
const fontsReady = Promise.all([
  document.fonts.load('16px dosvga'),
  document.fonts.load('8px dosvga8'),
]).catch(() => {});

// always true or false: classList.toggle(name, undefined) flips the class instead of removing it
function isRunning() { return QBRunner.running(); }

// mode: "run", "debug" (stop at breakpoints) or "step" (debug, stopping at the first line)
async function runProgram(source, path, mode = 'run') {
  if (isRunning()) return;
  if (source === undefined) { source = editor.getValue(); path = progPath; }
  if (mode !== 'run') startDebug();
  lastRunFailed = false;
  // A program started by RUN "name" is compiled and run by QBRunner too; label is its path,
  // shown with its messages, and is empty for the program in the editor.
  const running = QBRunner.run({
    source, path,
    debug: !!debug,
    ready: fontsReady,
    onCompile: () => setStatus('Compiling', 'amber blink'),
    onCompiled: (js) => { $('js-code').textContent = js; },
    onCompileMessage: (kind, line, text, file) => addMessage(kind, line, text, file),
    onMessage: programMessage,
    onStart: (js, cwd, label) => {
      if (debug) debugProgram(js, label || path, cwd, mode === 'step' && !label);
      setTimeout(() => ($('gx-canvas') || $('gx-container')).focus(), 0);
    },
  });
  // QBRunner.run marks itself compiling at once, so the run state shows it
  updateRunState();
  clearMessages();
  showTab('output');
  setStatus('Compiling', 'amber blink');
  try {
    const result = await running;
    if (result.reason === 'compile-error') {
      lastRunFailed = true;
      showTab('messages');
    } else if (result.reason === 'error') {
      lastRunFailed = true;
      addMessage('error', result.line, result.message, result.file);
      showTab('messages');
    }
  } finally {
    endDebug();
    updateRunState();
  }
}

function stopProgram() {
  QBRunner.stop();
  updateRunState();
}

$('btn-run').addEventListener('click', () => runProgram());
$('btn-stop').addEventListener('click', stopProgram);
// ---------------------------------------------------------------- debugger
// Debug (or F8) compiles the program with a hook before each line (see DebugHook in
// tools/qb2js.bas and QB.dbgHit in qb.js). The program stops at a breakpoint, after Step, or
// at the next line after Pause; the line about to run is highlighted, in the program's editor
// or in an include tab. Continue and Step go on from there. An include file is compiled from
// the file system, so its tab should be saved for its lines to match.
//
// debug = { files: Map hook file name -> VFS path, mark: { doc, handle }, where, stepTimer }
function startDebug() {
  debug = { files: new Map(), mark: null, where: '', stepTimer: 0, pause: null };
  watchState.prev = new Map();
  watchState.cur = new Map();
  watchState.userClosed = false;
  updateRunButtons();
  renderWatch();
}
function endDebug() {
  if (!debug) return;
  clearDebugMark();
  clearTimeout(debug.stepTimer);
  debug = null;
  QB.dbgStart(null);
  updateRunButtons();
  renderWatch();
}
// Called when the compiled program is about to start. The hooks name the program "" and each
// include file as its $INCLUDE line does; those names are found in the JavaScript and looked
// up from the folder the compiler read them from.
function debugProgram(js, path, cwd, stepFirst) {
  const folder = vfs.fullPath(cwd);
  debug.files = new Map([['', path ? normPath(path) : '']]);
  for (const m of js.matchAll(/QB\.dbgHit\(\d+, ("(?:[^"\\]|\\.)*")\)/g)) {
    const name = JSON.parse(m[1]);
    if (debug.files.has(name)) continue;
    const rel = name.replaceAll('\\', '/');
    const want = rel.startsWith('/') ? normPath(rel) : joinPath(folder, rel);
    const node = getNode(want);
    debug.files.set(name, node ? vfs.fullPath(node) : want);
  }
  QB.dbgStart(debugPaused);
  sendBreakpoints();
  if (stepFirst) QB.dbgStepNext();
}
// the breakpoints of a file: from its editor if it is open, otherwise as saved
function fileBreakpoints(path) {
  if (path === (progPath || '')) return docBreakpoints(editor.getDoc());
  const t = incTabs.find((x) => x.path === path);
  return t ? docBreakpoints(t.doc) : bpSaved.get(path) || [];
}
function sendBreakpoints() {
  if (!debug) return;
  const list = [];
  for (const [file, path] of debug.files) for (const line of fileBreakpoints(path)) list.push({ line, file });
  QB.dbgSetBreakpoints(list);
}
function debugPaused({ line, file, evalFn, scope }) {
  if (!debug) return;
  debug.pause = { evalFn, scope };
  debug.pauseId = (debug.pauseId || 0) + 1;
  clearTimeout(debug.stepTimer);
  const path = debug.files.get(file) ?? '';
  let cm = editor;
  if (path !== (progPath || '') && getNode(path)) { openIncludeTab(path); cm = incEditor; }
  else showTab('code');
  if (narrowScreen.matches && !$('outline').hidden) setOutlineVisible(false); // it would cover the line
  const doc = cm.getDoc();
  clearDebugMark();
  const handle = doc.addLineClass(line - 1, 'background', 'cm-debug-line');
  doc.addLineClass(handle, 'gutter', 'cm-debug-gutter');
  debug.mark = { doc, handle };
  jumpTo(cm, line);
  debug.where = (path ? baseName(path) : untitledName) + ':' + line;
  // the Watch pane opens on the first stop, unless it was closed while debugging
  if ($('watch').hidden && !watchState.userClosed && !narrowScreen.matches) setWatchVisible(true);
  renderWatch();
  clearTimeout(statusTimer); // "Pausing at the next line" is done
  statusTimer = 0;
  updateRunState(true);
}
function clearDebugMark() {
  if (!debug || !debug.mark) return;
  const { doc, handle } = debug.mark;
  doc.removeLineClass(handle, 'background', 'cm-debug-line');
  doc.removeLineClass(handle, 'gutter', 'cm-debug-gutter');
  debug.mark = null;
}
// Continue shows the program's output. Step stays with the code, unless the program has not
// stopped again soon after (it is waiting for INPUT, say).
function debugResume(action) {
  if (!debug || !QB.dbgPaused()) return;
  clearDebugMark();
  debug.pause = null;
  QB.dbgResume(action);
  // the values stay until the next stop; dimmed if the program is still running a moment later
  setTimeout(() => { if (debug && !QB.dbgPaused()) renderWatch(); }, 300);
  if (action === 'continue') showTab('output');
  else debug.stepTimer = setTimeout(() => { if (debug && !QB.dbgPaused() && isRunning()) showTab('output'); }, 400);
  updateRunState(true);
}
function debugPause() {
  if (!debug || QB.dbgPaused() || !isRunning()) return;
  QB.dbgStepNext();
  flashStatus('Pausing at the next line');
}
function startDebugging(step) {
  if (isRunning()) return;
  runProgram(undefined, undefined, step ? 'step' : 'debug');
}
$('btn-debug').addEventListener('click', () => startDebugging(false));
$('btn-continue').addEventListener('click', () => debugResume('continue'));
$('btn-step').addEventListener('click', () => debugResume('step'));
$('btn-pause').addEventListener('click', debugPause);
for (const cm of [editor, incEditor]) {
  cm.on('gutterClick', (cm, line, gutter) => { if (gutter === BP_GUTTER || gutter === 'CodeMirror-linenumbers') toggleBreakpoint(cm, line); });
}

// ---------------------------------------------------------------- watch
// The Watch pane, right of the code editor like the outline, lists the variables while the
// program is paused in the debugger: those of the SUB or FUNCTION it is in, then the main
// program's (shared variables included). The compiler lists each scope's variables
// (QB.dbgScopes) and the debugger hooks give a function that reads them in their scope.
// TYPE variables open into their fields and arrays into their elements; a value that changed
// since the last stop is highlighted. What is open stays open from stop to stop.
const watchState = {
  open: new Set(),       // paths of open TYPE variables and arrays
  closed: new Set(),     // sections (scopes) that are closed
  prev: new Map(),       // path -> value text at the previous stop
  cur: new Map(),        // ... and at this one
  pauseId: 0,
  userClosed: false,     // the pane was closed during this debugging session
};
const WATCH_LIMIT = 100; // array elements shown per level

function setWatchVisible(show, byUser = false) {
  if (show && narrowScreen.matches && !$('outline').hidden) setOutlineVisible(false);
  $('watch').hidden = !show;
  $('btn-watch').setAttribute('aria-pressed', String(show));
  if (byUser && !show && debug) watchState.userClosed = true;
  if (byUser && !narrowScreen.matches) store.set('watch', show);
  editor.refresh();
  incEditor.refresh();
  if (show) renderWatch();
}
$('watch-close').addEventListener('click', () => setWatchVisible(false, true));
// both panes fit beside the editor on a wide screen; on a phone they cover it, so one at a time
narrowScreen.addEventListener('change', () => { if (narrowScreen.matches && !$('watch').hidden && !$('outline').hidden) setOutlineVisible(false); });
$('btn-watch').addEventListener('click', () => {
  const show = $('watch').hidden;
  setWatchVisible(show, true);
  if (show && currentTab !== 'include') showTab('code');
});
setWatchVisible(!narrowScreen.matches && store.get('watch', false));

// a TYPE's name as declared and its fields, from the type map the compiler gives the runtime
function watchType(type) {
  const map = QB.dbgTypeMap() || {};
  const key = Object.keys(map).find((k) => k.toUpperCase() === String(type).toUpperCase());
  return key ? { name: typeSpelling(key), fields: map[key] } : null;
}
// The compiler gives TYPE names in capitals; show them as the program spells them (Monster),
// from the TYPE lines of the program and its includes (looked up once per stop).
function typeSpelling(type) {
  if (!debug) return type;
  if (!debug.typeNames) {
    debug.typeNames = new Map();
    try { for (const [k, t] of programTypes()) debug.typeNames.set(k.toUpperCase(), t.name); } catch { /* keep capitals */ }
  }
  return debug.typeNames.get(String(type).toUpperCase()) || type;
}
const NUMERIC = /^(_UNSIGNED )?(_BIT|_BYTE|INTEGER|LONG|_INTEGER64|INTEGER64|SINGLE|DOUBLE|_FLOAT|_OFFSET)$/;
function watchText(type, v) {
  type = String(type || '').toUpperCase();
  if (v === undefined || v === null) {   // not assigned yet: QBasic's starting value
    if (type === 'STRING') v = '';
    else if (NUMERIC.test(type)) v = 0;
    else return '(not set)';
  }
  if (typeof v === 'string') return '"' + v.replace(/[\x00-\x1f]/g, (c) => '\\x' + c.charCodeAt(0).toString(16).padStart(2, '0')) + '"';
  if (typeof v === 'number') {
    if (type === 'SINGLE') return String(Number(v.toPrecision(7)));
    return String(v);
  }
  if (typeof v === 'bigint' || typeof v === 'boolean') return String(v);
  if (typeof v === 'function') return '(function)';
  return null; // an object: a TYPE value or an array
}
function arrayDims(a) { return (a && a._dimensions) || []; }
function dimsText(dims) { return '(' + dims.map((d) => d.l + ' TO ' + d.u).join(', ') + ')'; }

// One variable, field or element: a row, and its children when it is open.
// node: { label, type, value, isArray, dims (array levels left), index (indexes so far) }
function watchRow(parent, path, node, depth, resultName) {
  const { label, type } = node;
  let text, kids = null;
  if (node.isArray) {
    const dims = node.dims;
    if (!node.value || typeof node.value !== 'object') text = '(not dimensioned)';
    else {
      text = (node.index.length ? '' : typeSpelling(type) + ' array ') + dimsText(dims);
      kids = () => {
        const d = dims[0], out = [];
        const n = d.u - d.l + 1;
        for (let i = d.l; i <= d.u && i < d.l + WATCH_LIMIT; i++) {
          const index = [...node.index, i];
          const at = node.value[i];
          if (dims.length > 1) out.push({ label: '(' + index.join(', ') + ', …)', type, value: at || {}, isArray: true, dims: dims.slice(1), index, root: node.root });
          else out.push({ label: '(' + index.join(', ') + ')', type, value: at ? at.value : (node.root._newObj && node.root._newObj.value) });
        }
        if (n > WATCH_LIMIT) out.push({ more: n - WATCH_LIMIT });
        return out;
      };
    }
  } else {
    text = watchText(type, node.value);
    if (text === null) {
      const t = watchType(type);
      const v = node.value;
      const names = t ? t.fields.map((f) => [f.name, f.type]) : Object.keys(v).map((k) => [k, '']);
      text = t ? t.name : 'object';
      kids = () => names.map(([n, t]) => ({ label: '.' + n, type: t, value: v[n] }));
    }
  }
  const open = kids && watchState.open.has(path);
  const row = document.createElement(kids ? 'button' : 'div');
  if (kids) { row.type = 'button'; row.setAttribute('aria-expanded', String(open)); row.dataset.path = path; }
  row.className = 'w-row';
  row.setAttribute('role', 'treeitem');
  row.style.setProperty('--d', depth);
  const name = document.createElement('span');
  name.className = 'w-name';
  name.textContent = label + (resultName ? ' (result)' : '');
  const val = document.createElement('span');
  val.className = 'w-val';
  val.textContent = text;
  row.title = label.replace(/^\./, '') + (type ? ' AS ' + typeSpelling(type) + (node.isArray && !node.index.length ? ' array' : '') : '') + (kids ? '' : ' = ' + text);
  if (!kids && watchState.prev.has(path) && watchState.prev.get(path) !== text) row.classList.add('changed');
  if (!kids) watchState.cur.set(path, text);
  row.append(name, val);
  if (kids) row.addEventListener('click', () => {
    if (watchState.open.has(path)) watchState.open.delete(path); else watchState.open.add(path);
    renderWatch(true);
  });
  parent.appendChild(row);
  if (open) {
    for (const k of kids()) {
      if (k.more) {
        const more = document.createElement('div');
        more.className = 'w-row w-more';
        more.style.setProperty('--d', depth + 1);
        more.textContent = '… ' + k.more + ' more';
        parent.appendChild(more);
      } else watchRow(parent, path + k.label, k, depth + 1);
    }
  }
}

function renderWatch(keepFocus) {
  if ($('watch').hidden) return;
  const list = $('watch-list');
  const focusPath = keepFocus && document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.path : null;
  const scroll = list.scrollTop;
  const p = debug && QB.dbgPaused() && debug.pause;
  $('watch-where').textContent = p ? debug.where : '';
  list.classList.toggle('stale', !!debug && !p);
  if (!p) {
    if (debug && list.querySelector('.w-row')) return; // running: the last values stay, dimmed
    list.innerHTML = '';
    const msg = document.createElement('div');
    msg.className = 'app-outline-empty';
    msg.textContent = debug ? 'The program is running. Its variables are shown when it stops (Pause, Step or a breakpoint).'
      : 'Variables are shown here while the program is paused in the debugger. Set a breakpoint (click a line number) and click Debug, or press F8 to start at the first line.';
    list.appendChild(msg);
    return;
  }
  list.innerHTML = '';
  const info = QB.dbgInfo() || { scopes: {} };
  const sections = [];
  if (p.scope) sections.push([p.scope, info.scopes[p.scope], p.evalFn]);
  sections.push(['', info.scopes[''], p.scope ? info.main : p.evalFn]);
  // values are compared with those at the previous stop (not with a redraw at this one)
  if (watchState.pauseId !== debug.pauseId) {
    watchState.pauseId = debug.pauseId;
    watchState.prev = watchState.cur;
    watchState.cur = new Map();
  }
  for (const [key, scope, evalFn] of sections) {
    if (!scope) continue;
    const seen = new Set();
    const vars = scope.vars.filter((v) => !seen.has(v.j) && seen.add(v.j));
    const closed = watchState.closed.has(key);
    const head = document.createElement('button');
    head.type = 'button';
    head.className = 'ol-group';
    head.setAttribute('aria-expanded', String(!closed));
    head.dataset.path = 'scope:' + key;
    head.innerHTML = '<span></span> <span class="ol-group-n"></span>';
    head.firstChild.textContent = scope.name;
    head.lastChild.textContent = vars.length;
    head.addEventListener('click', () => {
      if (watchState.closed.has(key)) watchState.closed.delete(key); else watchState.closed.add(key);
      renderWatch(true);
    });
    list.appendChild(head);
    if (closed) continue;
    if (!vars.length) {
      const none = document.createElement('div');
      none.className = 'w-row w-more';
      none.style.setProperty('--d', 0);
      none.textContent = 'No variables';
      list.appendChild(none);
    }
    const resultName = key.startsWith('func_') ? key.slice(5) : null;
    for (const v of vars) {
      let value;
      try { value = evalFn ? evalFn(v.j) : undefined; } catch { value = undefined; }
      const node = { label: v.n, type: v.t, value, isArray: !!v.a, dims: v.a ? arrayDims(value) : null, index: [], root: value };
      watchRow(list, key + '/' + v.n, node, 0, resultName && v.j === resultName);
    }
  }
  list.scrollTop = scroll;
  if (focusPath) { const el = list.querySelector('[data-path="' + CSS.escape(focusPath) + '"]'); if (el) el.focus(); }
}

$('btn-fullscreen').addEventListener('click', () => { if ($('gx-canvas')) GX.fullScreen(true); });

// ---------------------------------------------------------------- status
let statusTimer = 0;
function setStatus(text, led = '') {
  $('status-text').textContent = text;
  $('status-led').className = 'crt-led ' + led;
}
function flashStatus(text) {
  clearTimeout(statusTimer);
  setStatus(text);
  statusTimer = setTimeout(() => { statusTimer = 0; updateRunState(true); }, 2000);
}

let lastState = '';
function updateRunState(force) {
  const running = isRunning();
  const paused = running && QB.dbgPaused();
  const compiling = QBRunner.compiling();
  const state = compiling ? 'compiling' : paused ? 'paused ' + (debug && debug.where) : running ? 'running' : lastRunFailed ? 'error' : 'ready';
  if (state === lastState && !force) return;
  lastState = state;
  $('btn-run').disabled = running;
  $('btn-debug').disabled = running;
  $('btn-stop').disabled = !running;
  $('btn-continue').disabled = !paused;
  $('btn-step').disabled = !paused;
  $('btn-pause').disabled = !running || paused || compiling;
  for (const id of ['btn-new', 'btn-save', 'btn-saveas', 'btn-open']) $(id).disabled = running;
  editor.setOption('readOnly', running);
  editor.getWrapperElement().classList.toggle('CodeMirror-readonly', running);
  if (statusTimer && !running) return;
  if (compiling) setStatus('Compiling', 'amber blink');
  else if (paused) setStatus('Paused at ' + (debug && debug.where || ''), 'amber');
  else if (running) setStatus(debug ? 'Debugging' : 'Running', 'amber blink');
  else if (lastRunFailed) setStatus('Error', 'red');
  else setStatus('Ready');
}
setInterval(updateRunState, 150);

// ---------------------------------------------------------------- keyboard shortcuts
addEventListener('keydown', (e) => {
  if (dlg.open || $('rec-dlg').open) return;
  const mod = e.ctrlKey || e.metaKey;
  const key = e.key.toLowerCase();
  if (e.key === 'F5' || (mod && key === 'r' && !e.shiftKey)) {
    e.preventDefault();
    e.stopPropagation(); // not a key for the running program
    if (e.key === 'F5' && e.shiftKey) stopProgram();
    else if (e.key === 'F5' && QB.dbgPaused()) debugResume('continue');
    else if (!isRunning()) runProgram();
  } else if (e.key === 'F8' && !mod) { // QBasic's Step
    e.preventDefault();
    e.stopPropagation();
    if (QB.dbgPaused()) debugResume('step');
    else startDebugging(true);
  } else if (e.key === 'F9' && !mod && (currentTab === 'code' || currentTab === 'include')) { // QBasic's Toggle Breakpoint
    e.preventDefault();
    e.stopPropagation();
    const cm = activeCode();
    toggleBreakpoint(cm, cm.getCursor().line);
  } else if (mod && key === 's') {
    e.preventDefault();
    if (currentTab === 'fileeditor') saveFileEditor();
    else if (currentTab === 'records') saveRecordFile();
    else if (currentTab === 'include' && incActive) saveInclude(incActive, e.shiftKey);
    else saveProgram(e.shiftKey);
  }
}, true);

// ---------------------------------------------------------------- files
let fsCwd = store.get('fsCwd', '/');

function renderFiles() {
  let dir = getNode(fsCwd);
  if (!dir || (dir !== vfs.rootDirectory() && dir.type !== vfs.DIRECTORY)) { fsCwd = '/'; dir = vfs.rootDirectory(); }
  store.set('fsCwd', fsCwd);
  $('fs-path').textContent = fsCwd;
  $('fs-up').disabled = fsCwd === '/';

  const rows = $('fs-rows');
  rows.innerHTML = '';
  const dirs = vfs.getChildren(dir, vfs.DIRECTORY);
  const files = vfs.getChildren(dir, vfs.FILE);

  for (const d of dirs) {
    const p = vfs.fullPath(d);
    const count = vfs.getChildren(d).length;
    rows.appendChild(fileRow(d.name + '/', 'dir', count + (count === 1 ? ' item' : ' items'), [
      ['Open', () => { fsCwd = p; renderFiles(); }],
      ['Rename', () => renameNode(d)],
      ['Delete', () => deleteNode(d), true],
    ], () => { fsCwd = p; renderFiles(); }));
  }
  for (const f of files) {
    const p = vfs.fullPath(f);
    const ext = extOf(p);
    const actions = [];
    if (ext === 'bas') {
      actions.push(['Run', () => runFromFiles(p)]);
      actions.push(['Open', () => openFromFiles(p)]);
    } else if (!looksBinary(f.data)) {
      actions.push(['Edit', () => openFileEditor(p)]);
    }
    if (!['bas', 'bi', 'bm'].includes(ext)) actions.push(['Record Editor', () => openRecordEditor(p)]);
    actions.push(['Download', () => downloadBlob(new Blob([f.data]), f.name)]);
    actions.push(['Rename', () => renameNode(f)]);
    actions.push(['Delete', () => deleteNode(f), true]);
    rows.appendChild(fileRow(f.name, p === progPath ? 'file current' : 'file', fmtSize(f.data.byteLength), actions));
  }
  $('fs-empty').hidden = dirs.length + files.length > 0;
}

function fileRow(name, kind, size, actions, onNameClick) {
  const tr = document.createElement('tr');
  const tdName = document.createElement('td');
  const span = document.createElement('span');
  span.className = 'fs-name ' + kind;
  span.textContent = name;
  if (kind.includes('current')) span.title = 'Open in the editor';
  if (onNameClick) span.addEventListener('click', onNameClick);
  tdName.appendChild(span);
  const tdSize = document.createElement('td');
  tdSize.className = 'num';
  tdSize.textContent = size;
  const tdAct = document.createElement('td');
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'crt-btn fs-menu-btn';
  b.textContent = 'Actions ▾';
  b.setAttribute('aria-haspopup', 'menu');
  b.setAttribute('aria-expanded', 'false');
  b.setAttribute('aria-label', 'Actions for ' + name);
  attachMenu(b, () => actions);
  tdAct.appendChild(b);
  tr.append(tdName, tdSize, tdAct);
  return tr;
}

// Drop-down menus (the Files tab's Actions, the toolbar's File menu): one at a time, placed
// on <body> so the table's scrolling can't clip them. getActions() gives the items as
// [label, fn, danger, disabled, shortcut]; it is called each time the menu opens.
let fsMenu = null;
function attachMenu(button, getActions) {
  button.addEventListener('click', () => {
    const wasOpen = fsMenu && fsMenu.button === button;
    closeFileMenu();
    if (!wasOpen) openFileMenu(button, getActions());
  });
  button.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); closeFileMenu(); openFileMenu(button, getActions(), e.key === 'ArrowUp' ? -1 : 0); }
  });
}
function openFileMenu(button, actions, focusIndex = 0) {
  const menu = document.createElement('div');
  menu.className = 'crt-menu fs-menu';
  menu.setAttribute('role', 'menu');
  for (const [label, fn, danger, disabled, shortcut] of actions) {
    const item = document.createElement('button');
    item.type = 'button';
    item.setAttribute('role', 'menuitem');
    item.tabIndex = -1;
    item.textContent = label;
    if (shortcut) {
      const k = document.createElement('span');
      k.className = 'fs-menu-key';
      k.textContent = shortcut;
      item.appendChild(k);
    }
    if (danger) item.classList.add('danger');
    if (disabled) item.disabled = true;
    item.addEventListener('click', () => { closeFileMenu(true); fn(); });
    menu.appendChild(item);
  }
  menu.addEventListener('keydown', (e) => {
    const items = [...menu.children].filter((x) => !x.disabled);
    const i = items.indexOf(document.activeElement);
    const go = (n) => { e.preventDefault(); items[(n + items.length) % items.length].focus(); };
    if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(-1);
    else if (e.key === 'Escape') { e.preventDefault(); closeFileMenu(true); }
    else if (e.key === 'Tab') closeFileMenu();
  });
  document.body.appendChild(menu);
  button.setAttribute('aria-expanded', 'true');
  fsMenu = { menu, button };
  placeFileMenu();
  const items = [...menu.children].filter((x) => !x.disabled);
  if (items.length) items[(focusIndex + items.length) % items.length].focus({ preventScroll: true });
  else { menu.tabIndex = -1; menu.focus({ preventScroll: true }); } // every item disabled: Escape still works
}
// Below the button, right-aligned to it; flipped above or shifted left when it won't fit.
// Scrolling moves the menu with its button, and closes it once the button is out of sight.
function placeFileMenu() {
  const { menu, button } = fsMenu;
  const r = button.getBoundingClientRect(), mw = menu.offsetWidth, mh = menu.offsetHeight;
  if (r.bottom < 0 || r.top > innerHeight) { closeFileMenu(); return; }
  menu.style.left = Math.max(4, Math.min(r.right - mw, innerWidth - mw - 4)) + 'px';
  menu.style.top = (r.bottom + 2 + mh <= innerHeight - 4 ? r.bottom + 2 : Math.max(4, r.top - 2 - mh)) + 'px';
}
function closeFileMenu(refocus) {
  if (!fsMenu) return;
  const { menu, button } = fsMenu;
  fsMenu = null;
  menu.remove();
  button.setAttribute('aria-expanded', 'false');
  if (refocus && button.isConnected) button.focus();
}
document.addEventListener('pointerdown', (e) => {
  if (fsMenu && !fsMenu.menu.contains(e.target) && !fsMenu.button.contains(e.target)) closeFileMenu();
}, true);
window.addEventListener('resize', () => closeFileMenu());
document.addEventListener('scroll', (e) => { if (fsMenu && !fsMenu.menu.contains(e.target)) placeFileMenu(); }, true);

async function openFromFiles(p) {
  if (isRunning()) return;
  if (normPath(p) !== progPath && !(await confirmDiscard())) return;
  if (normPath(p) === progPath && isDirty() &&
      !(await confirmBox('Reload file?', `Discard your unsaved edits and reload ${p}?`, 'Reload', true))) { showTab('code'); return; }
  openProgram(p);
}
async function runFromFiles(p) {
  if (isRunning()) return;
  if (normPath(p) === progPath) { runProgram(); return; }
  runProgram(readTextFile(p) ?? '', normPath(p));
}

function remapPath(oldP, newP, p) {
  if (!p) return p;
  if (p === oldP) return newP;
  if (p.startsWith(oldP + '/')) return newP + p.slice(oldP.length);
  return p;
}

async function renameNode(node) {
  const oldPath = vfs.fullPath(node);
  const parent = node.parent;
  const name = await ask({
    title: 'Rename', message: `New name for ${oldPath}:`, value: node.name, okText: 'Rename',
    validate: (v) => { const other = vfs.findChild(parent, v); return nameError(v) || (other && other !== node ? 'Something with that name already exists here.' : ''); },
  });
  if (!name || name === node.name) return;
  vfs.renameNode(node, name);
  const newPath = vfs.fullPath(node);
  progPath = remapPath(oldPath, newPath, progPath);
  fePath = remapPath(oldPath, newPath, fePath);
  for (const t of incTabs) { t.path = remapPath(oldPath, newPath, t.path); incLabel(t); }
  if (rec) { rec.path = remapPath(oldPath, newPath, rec.path); $('rec-path').textContent = rec.path; setRecordDirty(rec.dirty); }
  fsCwd = remapPath(oldPath, newPath, fsCwd);
  updateTitle(); updateFileEditorLabel(); saveBuffer();
  renderFiles();
}

function removeTree(node) {
  if (node.type === vfs.DIRECTORY) {
    for (const c of vfs.getChildren(node)) removeTree(c);
    vfs.removeDirectory(node);
  } else vfs.removeFile(node);
}

function forgetPath(p) {
  if (progPath && (progPath === p || progPath.startsWith(p + '/'))) {
    untitledName = baseName(progPath);
    progPath = null;
    savedText = '';  // the text is no longer saved anywhere
    updateTitle(); saveBuffer();
  }
  if (fePath && (fePath === p || fePath.startsWith(p + '/'))) closeFileEditor(true);
  for (const t of [...incTabs]) if (t.path === p || t.path.startsWith(p + '/') || p === '/') closeIncludeTab(t, true);
  if (rec && (rec.path === p || rec.path.startsWith(p + '/') || p === '/')) closeRecordEditor(true);
}

async function deleteNode(node) {
  const p = vfs.fullPath(node);
  const isDir = node.type === vfs.DIRECTORY;
  const n = isDir ? vfs.getChildren(node).length : 0;
  const msg = isDir && n ? `Delete the folder ${p} and everything in it?` : `Delete ${p}?`;
  if (!(await confirmBox('Delete', msg, 'Delete', true))) return;
  removeTree(node);
  forgetPath(p);
  renderFiles();
}

$('fs-up').addEventListener('click', () => { fsCwd = parentPath(fsCwd); renderFiles(); });

$('fs-newfolder').addEventListener('click', async () => {
  const dir = getNode(fsCwd) || vfs.rootDirectory();
  const name = await ask({
    title: 'New Folder', message: `Create a folder in ${fsCwd}:`, value: 'new-folder', okText: 'Create',
    validate: (v) => nameError(v) || (vfs.findChild(dir, v) ? 'Something with that name already exists here.' : ''),
  });
  if (!name) return;
  vfs.createDirectory(name, dir);
  renderFiles();
});

$('fs-newfile').addEventListener('click', async () => {
  const dir = getNode(fsCwd) || vfs.rootDirectory();
  const name = await ask({
    title: 'New File', message: `Create a file in ${fsCwd}:`, value: 'data.txt', okText: 'Create',
    validate: (v) => nameError(v) || (vfs.findChild(dir, v) ? 'Something with that name already exists here.' : ''),
  });
  if (!name) return;
  vfs.createFile(name, dir);
  const p = joinPath(fsCwd, name);
  renderFiles();
  // a new program is only created, not opened: the program in the editor stays (use Open)
  if (extOf(p) === 'bas') flashStatus('Created ' + p);
  else openFileEditor(p);
});

async function addFiles(fileList, destPath) {
  const list = [...fileList];
  if (!list.length) return;
  const dir = ensureDir(destPath);
  const bad = list.filter((f) => nameError(f.name));
  if (bad.length) { await alertBox('Cannot upload', `These names are not allowed: ${bad.map((f) => f.name).join(', ')}`); return; }
  const clashes = list.filter((f) => vfs.findChild(dir, f.name));
  if (clashes.some((f) => vfs.findChild(dir, f.name).type === vfs.DIRECTORY)) { await alertBox('Cannot upload', 'A folder already has one of those names.'); return; }
  if (clashes.length && !(await confirmBox('Replace files?', `Replace ${clashes.length} existing file(s) in ${destPath}?\n${clashes.map((f) => f.name).join(', ')}`, 'Replace', true))) return;
  for (const f of list) {
    const node = vfs.findChild(dir, f.name) || vfs.createFile(f.name, dir);
    node.data = new ArrayBuffer(0);
    vfs.writeData(node, await f.arrayBuffer(), 0);
  }
  renderFiles();
  flashStatus(`Added ${list.length} file(s)`);
}

$('fs-upload').addEventListener('click', () => { $('upload-input').value = ''; $('upload-input').click(); });
$('upload-input').addEventListener('change', (e) => addFiles(e.target.files, fsCwd));

const drop = $('fs-drop');
drop.addEventListener('dragover', (e) => { if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); drop.classList.add('drag'); } });
drop.addEventListener('dragleave', (e) => { if (!drop.contains(e.relatedTarget)) drop.classList.remove('drag'); });
drop.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('drag'); addFiles(e.dataTransfer.files, fsCwd); });

$('fs-zip-down').addEventListener('click', async () => {
  const entries = serializeVFS();
  if (!entries.length) { await alertBox('Nothing to download', 'There are no files yet.'); return; }
  const zip = new JSZip();
  for (const e of entries) {
    const rel = e.path.slice(1);
    if (e.dir) zip.folder(rel); else zip.file(rel, e.data);
  }
  downloadBlob(await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' }), 'qb64-files.zip');
});

$('fs-zip-up').addEventListener('click', () => { $('zip-input').value = ''; $('zip-input').click(); });
$('zip-input').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  let zip;
  try { zip = await JSZip.loadAsync(file); }
  catch { await alertBox('Upload Package', 'That file is not a readable ZIP.'); return; }
  const items = Object.values(zip.files).filter((z) => !z.name.startsWith('__MACOSX/'));
  for (const z of items) {
    const err = pathError(z.name);
    if (err) { await alertBox('Upload Package', `Cannot add "${z.name}": ${err}`); return; }
  }
  const files = items.filter((z) => !z.dir);
  const clashes = files.filter((z) => getNode('/' + z.name));
  if (clashes.length && !(await confirmBox('Upload Package', `This will replace ${clashes.length} existing file(s). Continue?`, 'Replace', true))) return;
  try {
    for (const z of items) {
      if (z.dir) { ensureDir('/' + z.name); continue; }
      const p = normPath('/' + z.name);
      const dir = ensureDir(parentPath(p));
      let node = vfs.findChild(dir, baseName(p));
      if (node && node.type === vfs.DIRECTORY) throw new Error(`${p} is a folder.`);
      if (!node) node = vfs.createFile(baseName(p), dir);
      node.data = new ArrayBuffer(0);
      vfs.writeData(node, await z.async('arraybuffer'), 0);
    }
  } catch (err) { await alertBox('Upload Package', err.message); }
  renderFiles();
  flashStatus(`Added ${files.length} file(s) from ${file.name}`);
});

$('fs-clear').addEventListener('click', async () => {
  if (!(await confirmBox('Clear All', 'Delete every file and folder? This cannot be undone.', 'Delete All', true))) return;
  vfs.reset();
  forgetPath('/');
  if (progPath === null && fePath) closeFileEditor(true);
  fsCwd = '/';
  renderFiles();
});

// ---------------------------------------------------------------- keyword capitals
// As in the QB64 IDE, keywords are written in capitals: a word as soon as it is finished (by a
// space, bracket, operator, colon or new line), the rest of a line when the cursor leaves it,
// and pasted text. Strings, comments, DATA items and $IF JAVASCRIPT blocks are left alone, and
// so are names joined by a dot (r.name, EDX.Main.Menu, Dom.Create).
const kwWords = (s) => new Set(s.trim().split(/\s+/));
const QB64_WORDS = // QB64 keywords, with or without a $ suffix (_TRIM$, _LIMIT)
  '_ACOS _ACOSH _ALPHA _ALPHA32 _ANDALSO _ARCCOT _ARCCSC _ARCSEC _ASIN _ASINH _ATAN2 _ATANH _AUTODISPLAY ' +
  '_BACKGROUNDCOLOR _BIT _BLEND _BLUE _BLUE32 _BYTE _CAPSLOCK _CEIL _CLEARCOLOR _CLIPBOARD _CLIPBOARDIMAGE ' +
  '_COMMANDCOUNT _CONSOLE _CONTINUE _CONTROLCHR _COPYIMAGE _COSH _COT _COTH _CSC _CSCH _CWD _D2G _D2R _DEFAULTCOLOR ' +
  '_DEFINE _DEFLATE _DELAY _DESKTOPHEIGHT _DESKTOPWIDTH _DEST _DIR _DIREXISTS _DISPLAY _DONTBLEND _ECHO ' +
  '_ENVIRONCOUNT _ERRORLINE _ERRORMESSAGE _EXPLICIT _EXPLICITARRAY _FILEEXISTS _FILLBACKGROUND _FLOAT _FONT ' +
  '_FONTHEIGHT _FONTWIDTH _FREEFONT _FREEIMAGE _FULLSCREEN _G2D _G2R _GREEN _GREEN32 _HEIGHT _HYPOT _ICON ' +
  '_INFLATE _INSTRREV _INTEGER64 _KEEPBACKGROUND _KEYCLEAR _KEYDOWN _KEYHIT _LIMIT _LOADFONT _LOADIMAGE _LOGERROR _LOGINFO _LOGTRACE _LOGWARN ' +
  '_MAPUNICODE _MEM _MOUSEBUTTON _MOUSEHIDE _MOUSEINPUT _MOUSESHOW _MOUSEWHEEL _MOUSEX _MOUSEY _NEGATE ' +
  '_NEWIMAGE _NUMLOCK _OFF _OFFSET _ONLYBACKGROUND _ORELSE _OS _PALETTECOLOR _PI _PRESERVE _PRINTMODE ' +
  '_PRINTSTRING _PRINTWIDTH _PUTIMAGE _R2D _R2G _READBIT _RED _RED32 _RESETBIT _RESIZE _RESIZEHEIGHT ' +
  '_RESIZEWIDTH _RGB _RGB32 _RGBA _RGBA32 _ROUND _SCREENEXISTS _SCREENIMAGE _SCREENMOVE _SCREENX _SCREENY ' +
  '_SCROLLLOCK _SEC _SECH _SETALPHA _SETBIT _SHL _SHR _SINH _SMOOTH _SNDCLOSE _SNDLOOP _SNDOPEN _SNDPAUSE ' +
  '_SNDPLAY _SNDPLAYCOPY _SNDPLAYING _SNDSTOP _SNDVOL _SOURCE _SQUAREPIXELS _STARTDIR _STRCMP _STRETCH ' +
  '_STRICMP _TANH _TITLE _TOGGLEBIT _TRIM _UNSIGNED _WIDTH';
const KW_PLAIN = kwWords( // keywords written without a suffix
  'ABS ABSOLUTE ACCESS ALIAS AND ANDALSO ANY APPEND AS ASC ATN BASE BEEP BINARY BLOAD BSAVE BYVAL CALL CASE ' +
  'CDBL CDECL CHAIN CHDIR CINT CIRCLE CLEAR CLNG CLOSE CLS COLOR COM COMMON CONST COS CSNG CSRLIN CVD CVDMBF ' +
  'CVI CVL CVS CVSMBF DATA DECLARE DEF DEFDBL DEFINT DEFLNG DEFSNG DEFSTR DIM DO DOUBLE DRAW ELSE ELSEIF END ' +
  'ENDIF ENVIRON EOF EQV ERASE ERDEV ERL ERR ERROR EXIT EXP FIELD FILEATTR FILES FIX FOR FRE FREEFILE ' +
  'FUNCTION GET GOSUB GOTO IF IMP INP INPUT INSTR INT INTEGER INTERRUPT IOCTL IS KEY KILL LBOUND LEN LET ' +
  'LINE LOC LOCATE LOCK LOF LOG LONG LOOP LPOS LPRINT LSET MKDIR MOD NAME NEXT NOT OFF ON OPEN OPTION OR ' +
  'ORELSE OUT OUTPUT PAINT PALETTE PCOPY PEEK PEN PLAY PMAP POINT POKE POS PRESET PRINT PSET PUT RANDOM ' +
  'RANDOMIZE READ REDIM REM RESET RESTORE RESUME RETURN RMDIR RND RSET RUN SADD SCREEN SEEK SEG SELECT ' +
  'SETMEM SGN SHARED SHELL SIN SINGLE SLEEP SOUND SPC SQR STATIC STEP STICK STOP STRIG STRING SUB SWAP ' +
  'SYSTEM TAB TAN THEN TIMER TO TROFF TRON TYPE UBOUND UNLOCK UNTIL USING VAL VARPTR VARSEG VIEW WAIT WEND ' +
  'WHILE WIDTH WINDOW WRITE XOR ' +
  '$CHECKING $CONSOLE $DYNAMIC $ELSE $ELSEIF $END $ENDIF $IF $INCLUDE $LET $NOPREFIX $RESIZE $SCREENHIDE ' +
  '$SCREENSHOW $STATIC ' + QB64_WORDS);
const KW_DOLLAR = kwWords( // keywords written with a $ suffix (LEFT$), given without it
  'CHR COMMAND DATE ENVIRON ERDEV HEX INKEY INPUT IOCTL LCASE LEFT LTRIM MID MKD MKDMBF MKI MKL MKS MKSMBF ' +
  'OCT RIGHT RTRIM SPACE STR STRING TIME UCASE VARPTR ' + QB64_WORDS);

// Returns the line with its keywords in capitals. The word around column keepAt (being typed) is
// left as it is.
function capitalizeLine(text, keepAt = -1) {
  let out = '', i = 0;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (c === '"') {                                        // string
      const j = text.indexOf('"', i + 1) < 0 ? n : text.indexOf('"', i + 1) + 1;
      out += text.slice(i, j); i = j; continue;
    }
    if (c === "'") { out += text.slice(i); break; }         // comment
    if (/[A-Za-z_$]/.test(c) && !/[A-Za-z0-9_.&$%!#]/.test(text[i - 1] || '')) {
      let j = i + 1;
      while (j < n && /[A-Za-z0-9_]/.test(text[j])) j++;
      const word = text.slice(i, j), up = word.toUpperCase(), next = text[j] || '';
      const dotted = next === '.' && /[A-Za-z_]/.test(text[j + 1] || '');
      // a type suffix makes it a variable (name%), but PRINT#1 is a keyword
      const known = !dotted && (next === '$' ? KW_DOLLAR.has(up) : !/[%&!]/.test(next) && KW_PLAIN.has(up));
      out += known && !(keepAt > i && keepAt <= j) ? up : word;
      i = j;
      if (known && (up === 'REM' || up === 'DATA')) { out += text.slice(i); break; } // the rest is text
      continue;
    }
    out += c; i++;
  }
  return out;
}

// Is line n inside a $IF JAVASCRIPT ... $END IF block (native JavaScript)?
function inJavaScriptBlock(cm, n) {
  let inJs = false;
  for (let l = 0; l < n; l++) {
    const t = cm.getLine(l);
    if (/^\s*\$IF\s+JAVASCRIPT\b/i.test(t)) inJs = true;
    else if (/^\s*\$END\s*IF\b/i.test(t)) inJs = false;
  }
  return inJs;
}

let capKeywords = store.get('capKeywords', true);
let capBusy = false;
let capPending = null; // { doc, line handle } of the line being typed on, capitalized when the cursor leaves it

function capitalizeEditorLine(cm, n, keepAt = -1) {
  const text = cm.getLine(n);
  if (text == null || (inJavaScriptBlock(cm, n) && !/^\s*\$END\s*IF\b/i.test(text))) return;
  const out = capitalizeLine(text, keepAt);
  if (out === text) return;
  // replace only the words that change (same length), so the cursor and selection stay put
  capBusy = true;
  cm.operation(() => {
    for (let i = 0; i < text.length; i++) {
      if (text[i] === out[i]) continue;
      let j = i;
      while (j < text.length && text[j] !== out[j]) j++;
      cm.replaceRange(out.slice(i, j), { line: n, ch: i }, { line: n, ch: j }, '+input');
      i = j;
    }
  });
  capBusy = false;
}

// Used by the program editor and the include editor
function attachKeywordCaps(ed) {
ed.on('changes', (cm, changes) => {
  if (!capKeywords || capBusy) return;
  const cur = cm.getCursor();
  for (const ch of changes) {
    if (!ch.origin || ch.origin === 'setValue' || ch.origin === 'undo' || ch.origin === 'redo') continue;
    const first = ch.from.line, last = first + ch.text.length - 1, typed = ch.text.join('\n');
    if (ch.origin === '+input' && /^[A-Za-z0-9_]*$/.test(typed)) {
      capPending = { doc: cm.getDoc(), line: cm.getLineHandle(cur.line) }; // still typing a word
    }
    else if (ch.origin === '+input' || ch.origin === 'paste' || ch.origin === 'drop' || ch.origin === '+delete') {
      const typing = ch.origin === '+input';
      for (let l = first; l <= last && l < cm.lineCount(); l++) capitalizeEditorLine(cm, l, typing && l === cur.line ? cur.ch : -1);
      if (ch.origin === '+delete' || cur.line >= first && cur.line <= last) capPending = { doc: cm.getDoc(), line: cm.getLineHandle(cur.line) };
    }
  }
});
ed.on('cursorActivity', (cm) => {
  if (!capKeywords || !capPending) return;
  if (capPending.doc !== cm.getDoc()) { capPending = null; return; } // another file is now in the editor
  const n = cm.getLineNumber(capPending.line);
  if (n === null) { capPending = null; return; }            // the line was deleted
  if (n !== cm.getCursor().line) { capPending = null; capitalizeEditorLine(cm, n); }
});
}
attachKeywordCaps(editor);
attachKeywordCaps(incEditor);

// ---------------------------------------------------------------- display settings
function applyHue(h) { document.documentElement.style.setProperty('--crt-h', h); }
function applyScan(on) { document.body.classList.toggle('crt-scanlines', on); }
const hue = String(store.get('hue', '190'));
$('hue-select').value = hue; applyHue(hue);
$('hue-select').addEventListener('change', (e) => { applyHue(e.target.value); store.set('hue', e.target.value); });
const scan = store.get('scanlines', true);
$('scan-toggle').checked = scan; applyScan(scan);
$('scan-toggle').addEventListener('change', (e) => { applyScan(e.target.checked); store.set('scanlines', e.target.checked); });
$('caps-toggle').checked = capKeywords;
$('caps-toggle').addEventListener('change', (e) => { capKeywords = e.target.checked; capPending = null; store.set('capKeywords', capKeywords); });

// ---------------------------------------------------------------- startup
(async () => {
  await loadVFS();
  const buf = store.get('buffer', null);
  if (buf && typeof buf.text === 'string') {
    editor.setValue(buf.text);
    editor.clearHistory();
    progPath = buf.path && getNode(buf.path) ? normPath(buf.path) : null;
    untitledName = buf.untitledName || (buf.path ? baseName(buf.path) : 'untitled.bas');
    savedText = progPath ? (readTextFile(progPath) ?? '') : (buf.path ? '' : (buf.savedText ?? ''));
  } else {
    setProgram(STARTER, null, 'hello.bas');
  }
  updateTitle();
  updateRunState(true);
  editor.focus();
})();
})();
