// Command-line QBJS compiler (adapted from QBJS's qbc.js).
// Run from the project root, so Import "lib/..." paths resolve:
//
//   node tools/qbc.js tools/qb2js.bas            rebuild the compiler -> qbjs/qb2js.js
//   node tools/qbc.js program.bas [out.js]       compile a program (prints the JS if no out file)
//
// The compiler is written in QBJS BASIC and compiles itself with the current qbjs/qb2js.js.
// The new compiler is only written if there are no errors.
const fs = require('fs');
const path = require('path');

(async () => {
  const src = process.argv[2];
  if (!src) { console.log('usage: node tools/qbc.js <file.bas> [out.js]'); process.exit(2); }
  const root = path.join(__dirname, '..');
  process.chdir(root);

  const qbc = await require(path.join(root, 'qbjs', 'qb2js.js')).QBCompiler();
  const data = fs.readFileSync(src, 'utf8');
  const selfBuild = src.endsWith('qb2js.bas');
  let result;
  if (selfBuild) {
    qbc.setSelfConvert();
    result = await qbc.compile(data);
  } else {
    result = 'async function __qbjs_run() {\n' + await qbc.compile(data) + '\n}';
  }

  let errors = 0;
  for (const w of qbc.getWarnings()) {
    if (w.mtype) errors++;
    console.error((w.mtype ? 'ERROR' : 'WARN') + ':' + w.line + ':' + w.text);
  }

  const out = process.argv[3] || (selfBuild ? path.join('qbjs', 'qb2js.js') : null);
  if (selfBuild && errors) { console.error(`${errors} error(s); qbjs/qb2js.js not changed.`); process.exit(1); }
  if (out) { fs.writeFileSync(out, result, 'utf8'); console.error('wrote ' + out); }
  else process.stdout.write(result + '\n');
  process.exit(errors ? 1 : 0);
})();
