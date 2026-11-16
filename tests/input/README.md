INPUT # and WRITE # tests
=========================

* `f1.bas` writes a file with exact bytes and reads it back with `INPUT #`:
  * the layout of Eamon's `NAME.DAT` (numbers separated by spaces, then a text line);
  * values that continue on the next line, and two `INPUT #` statements reading one line;
  * blank lines (an empty value), empty fields (`,,7`);
  * unquoted strings with spaces around them, and quoted strings with commas;
  * text read into a number (0), `-1.5E2`, a tab inside a value;
  * `LINE INPUT #` after `INPUT #`.
* `f2.bas` reads back what `WRITE #` and `PRINT #` wrote.
* `f3.bas` checks how `WRITE #` writes numbers and expressions (`.5`, `-.25`, `x + 1`, `1E+20`).

`expected.txt` holds what QB64 printed. Run each program on the Code tab and compare the Output screen with it.
