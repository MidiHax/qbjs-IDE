// Unit tests for records.js (TYPE parsing, record layout, field conversion). Run: node tests/records/records-test.js
const R = require('../../records.js');
let fails = 0;
const eq = (label, got, want) => { const g = JSON.stringify(got), w = JSON.stringify(want); if (g !== w) { fails++; console.log('FAIL', label, '\n  got ', g, '\n  want', w); } else console.log('ok  ', label); };

const src = `
CONST NAMELEN = 12
TYPE Point            ' a comment
    x AS INTEGER
    y AS INTEGER
END TYPE
Type Monster
    nm As String * NAMELEN: hp AS LONG
    pos AS Point
    AS SINGLE speed, weight
    flags AS _UNSIGNED _BYTE
    big as integer64
    REM a comment line
    area AS Box
END TYPE
TYPE Box: topLeft AS POINT: bottomRight AS point: END TYPE
TYPE Bad
    s AS STRING
END TYPE
TYPE Loop1
    me AS Loop1
END TYPE
$IF JAVASCRIPT
TYPE NotThis
$END IF
`;
const types = R.parseTypes(src);
eq('types found', [...types.keys()], ['POINT', 'MONSTER', 'BAD', 'LOOP1']);
const box = R.parseTypes('TYPE Box\n topLeft AS POINT\n bottomRight AS point\nEND TYPE', types);
const lay = R.layoutType('monster', types);
eq('monster layout error', lay.error, '');
eq('monster size', lay.size, 12 + 4 + 4 + 4 + 4 + 1 + 8 + 8);
eq('monster items', lay.items.map((i) => `${'  '.repeat(i.depth)}${i.path}:${i.type}@${i.offset}+${i.size}`), [
  'nm:STRING * 12@0+12', 'hp:LONG@12+4', 'pos:Point@16+4', '  pos.x:INTEGER@16+2', '  pos.y:INTEGER@18+2',
  'speed:SINGLE@20+4', 'weight:SINGLE@24+4', 'flags:_UNSIGNED _BYTE@28+1', 'big:_INTEGER64@29+8',
  'area:Box@37+8', '  area.topLeft:Point@37+4', '    area.topLeft.x:INTEGER@37+2', '    area.topLeft.y:INTEGER@39+2',
  '  area.bottomRight:Point@41+4', '    area.bottomRight.x:INTEGER@41+2', '    area.bottomRight.y:INTEGER@43+2']);
eq('variable STRING rejected', R.layoutType('Bad', types).error, 's: a variable-length STRING has no fixed size in a record; use STRING * n');
eq('self-nesting rejected', R.layoutType('Loop1', types).error, 'TYPE Loop1 contains itself');
eq('unknown type', R.layoutType('Nope', types).error, 'TYPE Nope is not defined');
eq('missing nested type', R.layoutType('X', R.parseTypes('TYPE X\n p AS Pt\nEND TYPE')).error, 'TYPE Pt is not defined');

// values round-trip through bytes
const buf = new DataView(new ArrayBuffer(lay.size));
const vals = { nm: 'Orc', hp: '-70000', 'pos.x': '-5', 'pos.y': '32767', speed: '1.1', weight: '-2.5E+10', flags: '255', big: '-9223372036854775808', 'area.bottomRight.y': '7' };
for (const it of lay.items) if (it.kind === 'field' && vals[it.path] !== undefined) { eq('check ' + it.path, R.checkField(it, vals[it.path]), ''); R.writeField(buf, it.offset, it, vals[it.path]); }
const back = {};
for (const it of lay.items) if (it.kind === 'field') back[it.path] = R.readField(buf, it.offset, it);
eq('read back', back, { nm: 'Orc', hp: '-70000', 'pos.x': '-5', 'pos.y': '32767', speed: '1.1', weight: '-25000000000', flags: '255', big: '-9223372036854775808',
  'area.topLeft.x': '0', 'area.topLeft.y': '0', 'area.bottomRight.x': '0', 'area.bottomRight.y': '7' });
eq('string padded with spaces', Array.from(new Uint8Array(buf.buffer, 0, 12)), [79, 114, 99, 32, 32, 32, 32, 32, 32, 32, 32, 32]);
const f = (base, extra = {}) => ({ base, size: 2, ...extra });
eq('integer range', R.checkField(f('INTEGER'), '32768'), 'Out of range (-32768 to 32767).');
eq('integer whole', R.checkField(f('INTEGER'), '1.5'), 'Enter a whole number.');
eq('string too long', R.checkField({ base: 'STRING', size: 3 }, 'abcd'), 'At most 3 characters.');
eq('double D exponent', R.checkField(f('DOUBLE'), '1.5D3'), '');
eq('bad number', R.checkField(f('SINGLE'), 'abc'), 'Enter a number.');
console.log(fails ? fails + ' FAILED' : 'all passed');
