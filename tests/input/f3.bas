x = 3: a$ = "str": d# = 1.25: k% = -7
OPEN "f3.txt" FOR OUTPUT AS #1
WRITE #1, 0.5, -0.25, x + 1, a$ + "!", d#, k%, 100000, 1E20
CLOSE #1
OPEN "f3.txt" FOR INPUT AS #1
LINE INPUT #1, l$
PRINT "{"; l$; "}"
CLOSE #1
