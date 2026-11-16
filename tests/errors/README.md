ON ERROR tests
==============

* `e1.bas`: `ON ERROR GOTO` with `RESUME NEXT` and `RESUME` (retry), `ERR` and `_ERRORLINE`, errors in a `SUB` (execution goes on inside the `SUB`, as in QB64), in an `IF` block and in a one-line `IF`, switching to a second handler, and `ON ERROR GOTO 0`.
* `e2.bas`: an error in a `FUNCTION` called from an expression, `READ` past the end of the `DATA`, `_ERRORMESSAGE$`, a missing file, `ERR` after `RESUME`, and `ON ERROR GOTO 0` inside a handler (in QB64 this only turns error handling off).
* `e3.bas`: a handler that ends without `RESUME`, which ends the program.
* `e4.bas`: an error inside a handler, which stops the program.
* `e5.bas`: `END` inside a handler.
* `e6.bas`: `NEXT: PRINT ...` lines in a program that uses `RESUME NEXT` (`NEXT` must stay a statement, not become a label).
* `e7.bas`: statements the compiler skips (`FIELD`, `GET #2, 1` without a variable, screen `GET`/`PUT`) in a program that uses `ON ERROR`. It used to crash the compiler; now each line gives a warning and the program runs. QB64 can't run it as a console program (screen `GET`/`PUT` need a graphics screen), so its expected output is from the IDE.

* `e8.bas`: the Eamon Deluxe error handler. The handler `GOSUB`s a routine placed after it, and a second routine that the main program uses too, then `RESUME NEXT`. There's also an error inside a `SUB`.
* `e9.bas`: the main program jumps to a label after the handler with `GOTO` (as `EDXDEMO.BAS` does). It raises an error there and `GOSUB`s on.
* `e10.bas`: a handler that runs on into the code after it, jumps on with `GOTO`, and then resumes.

`expected.txt` holds what QB64 printed for the same programs. Run each program on the Code tab and compare the Output screen with it.
