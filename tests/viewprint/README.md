VIEW PRINT tests
================

Each program writes what the screen shows (read back with `SCREEN(row, col)`) to a file after each step, with `CSRLIN`, `POS(0)` and `ERR`. `expected.txt` holds QB64 2.1's files, and the IDE's files match them exactly.

* `viewprint.bas` → `VP.TXT`:
  * `VIEW PRINT 3 TO 23` moves the cursor to row 3, column 1.
  * 30 lines scroll only rows 3–23, and rows 1, 2, 24 and 25 stay as they are.
  * `LOCATE` above the window is error 5.
  * A 100-character line wraps and scrolls at the bottom of the window.
  * `CLS 2` clears only the window. `CLS` also clears row 25. `CLS 0` clears the whole screen.
  * `VIEW PRINT` with no rows, and `VIEW PRINT 20 TO 25` with printing on row 25.
  * `VIEW PRINT 0 TO 5` and `VIEW PRINT 10 TO 5` are error 5.
  * The rows can be expressions.
* `bottomline.bas` → `BOTTOM.TXT`:
  * By default, `PRINT` scrolls rows 1–24 and leaves row 25 alone.
  * A new line on row 25 scrolls rows 1–24 and moves the cursor to row 24.
  * `VIEW PRINT` and `VIEW PRINT 1 TO 25` make all 25 rows scroll.
* `longline.bas` → `LONG.TXT`: a line longer than 80 characters, with no window.

Things QB64 does that the IDE doesn't copy:
* QB64 lets `LOCATE` go to the row just below a window. The IDE allows that too. Printing from there in QB64, though, seems to stop it from keeping to the window, so the tests don't do it.
* QBasic moves a `PRINT` item that doesn't fit on the rest of the line to the next line. The IDE breaks the item at the edge of the screen instead. This rule is separate from `VIEW PRINT`.
