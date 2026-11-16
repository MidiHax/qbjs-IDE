/* QB64 IDE: TYPE definitions and RANDOM file records, for the Record Editor.
 *
 * parseTypes(text) finds the TYPE ... END TYPE blocks in QBasic source.
 * layoutType(name, types) works out the byte layout of a record of that TYPE, with nested
 * TYPEs flattened into dotted fields (pos.x, pos.y), the way GET and PUT store them: fields
 * one after the other, no padding, numbers little-endian, STRING * n as n bytes.
 * readField / writeField convert one field between those bytes and the text in the editor.
 *
 * Plain script: defines window.QBRecords (or module.exports under node, for tests).
 */
(function (root) {
'use strict';

// sizes of the field types a RANDOM record can hold, by normalized type name
const SIZES = {
  'INTEGER': 2, 'LONG': 4, 'SINGLE': 4, 'DOUBLE': 8, '_INTEGER64': 8, '_BYTE': 1,
  '_UNSIGNED INTEGER': 2, '_UNSIGNED LONG': 4, '_UNSIGNED _INTEGER64': 8, '_UNSIGNED _BYTE': 1,
};
const UNSUPPORTED = {
  'STRING': 'a variable-length STRING has no fixed size in a record; use STRING * n',
  '_FLOAT': '_FLOAT fields are not supported', '_OFFSET': '_OFFSET fields are not supported',
  '_UNSIGNED _OFFSET': '_OFFSET fields are not supported', '_BIT': '_BIT fields are not supported',
  '_UNSIGNED _BIT': '_BIT fields are not supported', '_MEM': '_MEM fields are not supported',
};
const RANGES = {
  'INTEGER': [-32768, 32767], 'LONG': [-2147483648, 2147483647], '_BYTE': [-128, 127],
  '_UNSIGNED INTEGER': [0, 65535], '_UNSIGNED LONG': [0, 4294967295], '_UNSIGNED _BYTE': [0, 255],
};

// "_unsigned  long" -> "_UNSIGNED LONG"; the underscore is optional ($NOPREFIX)
function normalizeType(t) {
  let u = t.trim().toUpperCase().replace(/\s+/g, ' ');
  const pre = (w) => (w.startsWith('_') ? w : '_' + w);
  const words = u.split(' ');
  const fix = (w) => (['INTEGER64', 'BYTE', 'UNSIGNED', 'FLOAT', 'OFFSET', 'BIT', 'MEM'].includes(w.replace(/^_/, '')) ? pre(w) : w);
  return words.map(fix).join(' ');
}

// code and comment of a line: ' or REM outside strings starts the comment
function codePart(line) {
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') q = !q;
    else if (!q) {
      if (c === "'") return line.slice(0, i);
      if ((c === 'R' || c === 'r') && (i === 0 || /[\s:]/.test(line[i - 1])) && /^REM(\s|$)/i.test(line.slice(i))) return line.slice(0, i);
    }
  }
  return line;
}

const TYPE_SPEC = /^(STRING\s*\*\s*([A-Za-z_][\w.]*|\d+)|_?UNSIGNED\s+[A-Za-z_]\w*|[A-Za-z_]\w*)/i;

// One field line inside a TYPE block: "name AS type" or QB64's "AS type name1, name2".
// Returns [{ name, type, strLen }] or { error }.
function parseField(stmt, consts) {
  let names, spec;
  let m = /^AS\s+(.*)$/i.exec(stmt);
  if (m) {
    const t = TYPE_SPEC.exec(m[1]);
    if (!t) return { error: 'cannot read the type in "' + stmt + '"' };
    spec = t[0];
    names = m[1].slice(spec.length).split(',').map((s) => s.trim());
  } else {
    m = /^([A-Za-z_][\w.]*)\s+AS\s+(.+)$/i.exec(stmt);
    if (!m) return { error: 'cannot read the field "' + stmt + '"' };
    names = [m[1]];
    spec = m[2].trim();
  }
  if (!names.length || names.some((n) => !/^[A-Za-z_][\w.]*$/.test(n))) return { error: 'cannot read the field names in "' + stmt + '"' };
  const s = /^STRING\s*\*\s*(.+)$/i.exec(spec);
  let type, strLen = 0;
  if (s) {
    const lenText = s[1].trim();
    strLen = /^\d+$/.test(lenText) ? +lenText : consts.get(lenText.toUpperCase());
    if (!(strLen > 0)) return { error: 'unknown length "' + lenText + '" in "' + stmt + '"' };
    type = 'STRING';
  } else {
    const n = normalizeType(spec);
    type = SIZES[n] || UNSUPPORTED[n] ? n : spec.trim(); // a TYPE name keeps its spelling, for messages
  }
  return names.map((name) => ({ name, type, strLen }));
}

// Finds the TYPEs in QBasic source: Map of upper-case name -> { name, line, fields, error }.
// CONSTs with a number are collected too, for STRING * MAXLEN. $IF JAVASCRIPT blocks are skipped.
function parseTypes(text, into = new Map(), consts = new Map(), source = '') {
  const lines = String(text).split(/\r?\n/);
  let cur = null, inJs = false;
  for (let i = 0; i < lines.length; i++) {
    const code = codePart(lines[i]).trim();
    const u = code.toUpperCase();
    if (inJs) { if (/^\$END\s*IF\b/.test(u)) inJs = false; continue; }
    if (/^\$IF\s+JAVASCRIPT\b/.test(u)) { inJs = true; continue; }
    if (!code) continue;
    if (cur) {
      if (/^END\s+TYPE\b/.test(u)) { into.set(cur.name.toUpperCase(), cur); cur = null; continue; }
      for (const stmt of code.split(':').map((x) => x.trim()).filter(Boolean)) {
        const f = parseField(stmt, consts);
        if (f.error) { cur.error = cur.error || f.error; continue; }
        cur.fields.push(...f);
      }
      continue;
    }
    let m = /^TYPE\s+([A-Za-z_][\w.]*)\s*$/i.exec(code);
    if (m) { cur = { name: m[1], line: i + 1, source, fields: [], error: '' }; continue; }
    m = /^CONST\s+(.+)$/i.exec(code);
    if (m) {
      for (const part of m[1].split(',')) {
        const c = /^\s*([A-Za-z_][\w.]*)[%&!#]?\s*=\s*(-?\d+(?:\.\d+)?)\s*$/.exec(part);
        if (c) consts.set(c[1].toUpperCase(), +c[2]);
      }
    }
  }
  return into;
}

// The byte layout of a record: { size, items, error }. items lists the fields in order, with
// group headers for nested TYPEs: { kind: 'group'|'field', path, depth, type, typeName,
// offset, size, strLen }.
function layoutType(name, types) {
  const items = [];
  let error = '';
  function walk(tname, prefix, depth, offset, stack) {
    const t = types.get(tname.toUpperCase());
    if (!t) { error = error || 'TYPE ' + tname + ' is not defined'; return offset; }
    if (stack.includes(t.name.toUpperCase())) { error = error || 'TYPE ' + t.name + ' contains itself'; return offset; }
    if (t.error) { error = error || t.name + ': ' + t.error; return offset; }
    if (!t.fields.length) { error = error || 'TYPE ' + t.name + ' has no fields'; return offset; }
    for (const f of t.fields) {
      const path = prefix + f.name;
      if (f.type === 'STRING' && f.strLen) {
        items.push({ kind: 'field', path, name: f.name, depth, type: 'STRING * ' + f.strLen, base: 'STRING', offset, size: f.strLen, strLen: f.strLen });
        offset += f.strLen;
      } else if (SIZES[f.type]) {
        items.push({ kind: 'field', path, name: f.name, depth, type: f.type, base: f.type, offset, size: SIZES[f.type] });
        offset += SIZES[f.type];
      } else if (UNSUPPORTED[f.type]) {
        error = error || path + ': ' + UNSUPPORTED[f.type];
      } else {
        const sub = types.get(f.type.toUpperCase());
        const header = { kind: 'group', path, name: f.name, depth, type: sub ? sub.name : f.type, offset, size: 0 };
        items.push(header);
        const end = walk(f.type, path + '.', depth + 1, offset, stack.concat(t.name.toUpperCase()));
        header.size = end - offset;
        offset = end;
      }
    }
    return offset;
  }
  const size = walk(name, '', 0, 0, []);
  return { size, items, error };
}

// ---- field values <-> bytes (little-endian; strings one byte per character, Latin-1)

function float32Text(v) {
  if (!isFinite(v)) return String(v);
  for (let p = 1; p <= 9; p++) {
    const s = String(Number(v.toPrecision(p)));
    if (Math.fround(Number(s)) === v) return s;
  }
  return String(v);
}

// Text shown for a field. Trailing spaces and CHR$(0) of a STRING * n are not shown.
function readField(view, offset, f) {
  switch (f.base) {
    case 'STRING': {
      let s = '';
      for (let i = 0; i < f.size; i++) s += String.fromCharCode(view.getUint8(offset + i));
      return s.replace(/[ \0]+$/, '');
    }
    case 'INTEGER': return String(view.getInt16(offset, true));
    case 'LONG': return String(view.getInt32(offset, true));
    case 'SINGLE': return float32Text(view.getFloat32(offset, true));
    case 'DOUBLE': return String(view.getFloat64(offset, true));
    case '_INTEGER64': return view.getBigInt64(offset, true).toString();
    case '_BYTE': return String(view.getInt8(offset));
    case '_UNSIGNED INTEGER': return String(view.getUint16(offset, true));
    case '_UNSIGNED LONG': return String(view.getUint32(offset, true));
    case '_UNSIGNED _INTEGER64': return view.getBigUint64(offset, true).toString();
    case '_UNSIGNED _BYTE': return String(view.getUint8(offset));
  }
  return '';
}

// Checks text for a field: '' if it can be stored, else the reason it can't.
function checkField(f, text) {
  if (f.base === 'STRING') {
    if (text.length > f.size) return 'At most ' + f.size + ' characters.';
    if (/[^\x00-\xff]/.test(text)) return 'Only characters 0-255 can be stored.';
    return '';
  }
  const t = text.trim();
  if (f.base === 'SINGLE' || f.base === 'DOUBLE') {
    if (!/^[-+]?(\d+\.?\d*|\.\d+)([ED][-+]?\d+)?$/i.test(t)) return 'Enter a number.';
    const v = Number(t.replace(/d/i, 'e'));
    if (f.base === 'SINGLE' && Math.abs(v) > 3.4028234663852886e38) return 'Too large for a SINGLE.';
    return '';
  }
  if (!/^[-+]?\d+$/.test(t)) return 'Enter a whole number.';
  if (f.base === '_INTEGER64' || f.base === '_UNSIGNED _INTEGER64') {
    const v = BigInt(t);
    const [lo, hi] = f.base === '_INTEGER64' ? [-(2n ** 63n), 2n ** 63n - 1n] : [0n, 2n ** 64n - 1n];
    return v < lo || v > hi ? 'Out of range (' + lo + ' to ' + hi + ').' : '';
  }
  const [lo, hi] = RANGES[f.base];
  const v = Number(t);
  return v < lo || v > hi ? 'Out of range (' + lo + ' to ' + hi + ').' : '';
}

// Stores text in a field (check it first with checkField). A STRING * n is padded with spaces.
function writeField(view, offset, f, text) {
  const t = text.trim();
  switch (f.base) {
    case 'STRING':
      for (let i = 0; i < f.size; i++) view.setUint8(offset + i, i < text.length ? text.charCodeAt(i) : 32);
      return;
    case 'INTEGER': view.setInt16(offset, Number(t), true); return;
    case 'LONG': view.setInt32(offset, Number(t), true); return;
    case 'SINGLE': view.setFloat32(offset, Number(t.replace(/d/i, 'e')), true); return;
    case 'DOUBLE': view.setFloat64(offset, Number(t.replace(/d/i, 'e')), true); return;
    case '_INTEGER64': view.setBigInt64(offset, BigInt(t), true); return;
    case '_BYTE': view.setInt8(offset, Number(t)); return;
    case '_UNSIGNED INTEGER': view.setUint16(offset, Number(t), true); return;
    case '_UNSIGNED LONG': view.setUint32(offset, Number(t), true); return;
    case '_UNSIGNED _INTEGER64': view.setBigUint64(offset, BigInt(t), true); return;
    case '_UNSIGNED _BYTE': view.setUint8(offset, Number(t)); return;
  }
}

const api = { parseTypes, layoutType, readField, writeField, checkField, normalizeType };
if (typeof module === 'object' && module.exports) module.exports = api;
else root.QBRecords = api;
})(typeof window !== 'undefined' ? window : globalThis);
