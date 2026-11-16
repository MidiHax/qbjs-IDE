TYPE and string tests
=====================

* `t5.bas`: `STRING * n` variables, array elements and fields (starting as CHR$(0), padded or cut on assignment), and record copies (`c = r`, `team(1) = r`, `r = team(1)`, nested fields).
* `t6.bas`: fixed-length strings filled by `READ`, `LINE INPUT #` and `INPUT #`, a `SHARED` one set in a `SUB`, a record passed to a `SUB` (by reference) and copied inside it, `REDIM ... AS STRING * n`, a `STATIC` fixed string, and `MID$` on a fixed string.
* `t7.bas`: reading lines back with `LINE INPUT #` until `EOF`, for files with CR+LF and with LF line endings.

`expected.txt` holds what QB64 printed for the same programs. Run each program on the Code tab and compare the Output screen with it.
