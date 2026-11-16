OPEN "t7.txt" FOR OUTPUT AS #1
PRINT #1, "one"
PRINT #1, "two"
PRINT #1, 3, 4
CLOSE #1
OPEN "t7.txt" FOR INPUT AS #1
n = 0
WHILE NOT EOF(1)
    LINE INPUT #1, l$
    n = n + 1
    PRINT n; "[" + l$ + "]"
WEND
CLOSE #1
OPEN "t7b.txt" FOR OUTPUT AS #1
PRINT #1, "a" + CHR$(10) + "b,c" + CHR$(10) + "d";
CLOSE #1
OPEN "t7b.txt" FOR INPUT AS #1
n = 0
WHILE NOT EOF(1)
    LINE INPUT #1, l$
    n = n + 1
    PRINT n; "[" + l$ + "]"
WEND
CLOSE #1
OPEN "t7.txt" FOR INPUT AS #1
INPUT #1, a$
INPUT #1, b$
INPUT #1, x, y
PRINT a$; b$; x + y; EOF(1)
CLOSE #1
