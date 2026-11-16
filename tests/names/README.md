Variable name tests
===================

`n1.bas` checks that names which differ only by type suffix are separate variables, as in QBasic:
* `k`, `k$`, `k%`, `k#` and `k&` are five variables, and `k!` is the same as `k`;
* `DIM x AS INTEGER` makes `x` and `x%` the same variable;
* `a`, `a$`, `a()`, `a$()` and `a%()` are all separate, including arrays used without `DIM`;
* `FOR i%` and `FOR i` are separate loops;
* `DIM SHARED` and `SHARED` with suffixes, and `SUB` parameters with suffixes, including the string array parameter `n$()`;
* `FUNCTION Twice$`, `FUNCTION Half%`, `STATIC c%, c$`;
* `READ`, `SWAP`, and a `TYPE` variable `p` beside a string `p$`.

`expected.txt` holds what QB64 printed. Run the program on the Code tab and compare the Output screen with it.
