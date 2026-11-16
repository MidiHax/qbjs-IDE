PRINT tests
===========

`p1.bas` checks `SPC(n)` and `TAB(n)` in `PRINT` and `PRINT #`, `DECLARE SUB`, and `PRINT` items written next to each other:
* `SPC` and `TAB` on the screen: columns, `TAB` to a column the cursor has passed (next line), `SPC(0)` and `TAB(0)`, values over 80, `SPC(4) "text"` with no `;`, and `TAB` in a loop;
* `PRINT #` to a file: `TAB` and `SPC`, `TAB` after a `PRINT #` that ended with `;` (the column carries over), and comma zones, which are 14 characters wide;
* `DECLARE SUB Show (a$)`, which is accepted without a warning;
* `"Zorag"q$` and `"a" b$ "c"; x "d"`, which QBasic reads as if `;` were between the items.

`expected.txt` describes the expected screen and file output. The file lines come from QB64; the screen lines follow QBasic's rules (see the note there). Run the program on the Code tab and compare the Output screen with it.
