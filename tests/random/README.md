RANDOM file tests
=================

`t1.bas` to `t4.bas` exercise RANDOM and BINARY file support: TYPE records, `STRING * n`, record numbers, gaps, truncation, `LOC`/`SEEK`/`EOF`, past-end reads, the default record length, `OPEN` without `FOR`, array elements and fields as `GET`/`PUT` targets, and record-length overflow.

`expected.txt` holds what the same programs printed and wrote when built with QB64. To check the IDE, run each program on the Code tab, then compare the Output screen with `expected.txt`. On the Files tab, download each `.dat` file and compare its bytes with the hex listed there.

`t4.bas` ends with a deliberate overflow, caught with `ON ERROR GOTO`, so it prints `error 59` and `after overflow`.
