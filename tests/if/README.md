One-line IF tests
=================

`i1.bas` checks one-line `IF` statements against QB64. In QBasic, everything after `THEN` on the line belongs to that `IF`, including more statements and further `IF`s:
* nested `IF a THEN x: IF b THEN y`, and `IF a THEN IF b THEN y` (patterns from Eamon Deluxe);
* `ELSE` belonging to the nearest `IF` (`IF a THEN IF b THEN x ELSE y`), and `ELSE IF` chains;
* `THEN f = 2:  ELSE ...` (a colon before `ELSE`);
* `THEN`, `ELSE`, `IF` and `:` inside strings, and names that contain them (`diff`, `elsewhere`, `thenx`);
* a whole `FOR` loop inside the `THEN` part;
* a block `IF` after a colon (`x = 1: IF x THEN`);
* `IF x THEN 200`, `IF x GOTO 300` and `... ELSE 400` with line numbers.

`expected.txt` holds what QB64 printed. Run the program on the Code tab and compare the Output screen with it.
