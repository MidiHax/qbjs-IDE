Known limitations
-----------------
* QBJS supports most of QBasic and much of QB64, but not all of it. See the [supported keywords](https://github.com/boxgaming/qbjs/wiki/Supported-Keywords). Programs that call Windows or C libraries won't run.
* Files are stored as bytes, and text is read and written one byte per character (Latin-1), as QBJS does. Characters outside that range typed into the editor are not saved correctly.
* A few file names (`name`, `type`, `data`, `parent`, `toString`) are reserved by the QBJS file system.
* `CHAIN` and `COMMON` are not supported. `RUN` with a line number restarts from the top.
* Files live in one browser profile. Use Download Package to back them up or move them.
* Native JavaScript (`$If Javascript` blocks) must use the JavaScript names of suffixed variables, such as `name$s` for `name$` (see the compiler notes).
* Conversion to an integer rounds halves away from zero (JavaScript `Math.round`), but QBasic rounds them to the nearest even number. So `x% = 4.5` gives 5, where QB64 gives 4.
* `STRING * n` lengths are applied when a value is stored, but not by `SWAP` or to `SUB` parameters.
* A number with a signed exponent, such as `1E+20`, compiles to invalid JavaScript (upstream QBJS splits it at the sign). Write `1E20` instead.
* `GOTO` limits:
  * A `GOTO` or `GOSUB` can only reach a label in the same `SUB`, `FUNCTION` or main program (as in QB64).
  * Variables declared with `DIM` are only set up when the `DIM` line runs, so a `GOTO` that skips a `DIM` leaves the variable undefined. Implicit variables are set up at the start, except in code placed between two `SUB`s.
  * `ON TIMER`, `ON KEY` and the other event traps are not supported.
* `ON ERROR` limits:
  * Handlers must be in the main program, as in QB64.
  * An error in the first line of a block (the condition of an `IF`, `ELSEIF`, `DO`, `WHILE` or `SELECT CASE`, or the limits of a `FOR`) isn't caught, and stops the program. Errors in the statements inside the block are caught.
  * `ERL` is always 0, even in programs with line numbers. Use `_ERRORLINE`.
  * Some errors QB64 reports don't happen in QBJS, for example division by zero, overflow and array subscripts out of range.
  * Each statement of a program that uses `ON ERROR` runs inside a `try`/`catch`. This makes the compiled JavaScript longer. In a 3-million-iteration test loop the speed difference was too small to measure.
* Not supported: `FIELD`/`LSET`/`RSET`, the old `OPEN "R", #1, "file", 32` form, and `GET`/`PUT` of whole arrays on `RANDOM` files.
* `SHARED x` inside a `SUB` (not `DIM SHARED x` in the main program) doesn't share `x` with the main program if the main program also uses `x`: the main program gets its own variable. Use `DIM SHARED`.
* `PRINT` breaks an item that doesn't fit on the rest of the line at the screen edge, where QBasic moves the whole item to the next line. A comma moves the cursor to the next 14-column zone without writing spaces, where QBasic overwrites the characters it passes.