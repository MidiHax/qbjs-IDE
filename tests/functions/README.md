FUNCTION return type tests
==========================

`fn1.bas` checks FUNCTIONs that return a `TYPE` (`FUNCTION f (...) AS Point`), and FUNCTIONs declared `AS type` without parentheses (`FUNCTION Five AS INTEGER`):
* a result built in a local record and assigned (`Shift = t`), and that the caller gets its own copy;
* fields of the result set directly (`Make.x = x`, rounded for an `INTEGER` field), including nested `TYPE` fields and a `STRING * n` field (`Diagonal.b.x`, `Diagonal.label`);
* a result never set (a zeroed record), one partly set, and `EXIT FUNCTION` part way;
* each call returning its own record, a result passed straight to a `SUB`, and a field read straight from a call (`Make(4, 5).y`);
* `FUNCTION name AS type` without `()`, called with and without `()`, for `INTEGER`, a `TYPE`, `_UNSIGNED LONG` and `UNSIGNED INTEGER`.

QB64 can't run this program: its FUNCTIONs can't return a `TYPE`, and it has no `AS` clause for FUNCTIONs (the type comes from the suffix). So `expected.txt` was worked out by hand from QBasic's rules. Run the program on the Code tab and compare the Output screen with it.
