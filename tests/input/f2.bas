OPEN "f2.txt" FOR OUTPUT AS #1
WRITE #1, "a, b", 5, -2.5, "", "quote"
WRITE #1, 1, 2
PRINT #1, 3; 4; -5
CLOSE #1
OPEN "f2.txt" FOR INPUT AS #1
INPUT #1, s$, n, m!, e$, q$
INPUT #1, i%, j&
INPUT #1, x, y, z
PRINT "["; s$; "]"; n; m!; "["; e$; "]["; q$; "]"; i%; j&; x; y; z; EOF(1)
CLOSE #1
