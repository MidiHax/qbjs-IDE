GOTO tests
==========

* `g1.bas`: a line-numbered program: `GOTO` backwards, `IF x THEN 30`, `IF x GOTO 90`, `IF ... THEN 80 ELSE 150`, `GOSUB`/`RETURN`, `ON I GOSUB` inside a `FOR` loop, `ON 5 GOTO` out of range (no jump), and `RESTORE 9000`.
* `g2.bas`: `GOTO` out of nested `FOR` loops, a `GOTO` loop around a `SELECT CASE` (with `CASE` ranges, `CASE IS`, `CASE ELSE` and a `GOTO` out of a `CASE`), `GOSUB` from inside a loop, nested `GOSUB`s, `DO`/`LOOP` with `_CONTINUE` and `EXIT DO`, `DO UNTIL`, `LOOP WHILE`, `WHILE`/`WEND`, `IF`/`ELSEIF`/`ELSE` blocks, and `GOTO` loops inside a `SUB` and a `FUNCTION`.
* `g3.bas`: `RESUME label` back to an earlier label (retrying), and `RESUME label` after an error inside a `SUB`, which leaves the `SUB` and continues in the main program.

`expected.txt` holds what QB64 printed for the same programs. Run each program on the Code tab and compare the Output screen with it.
