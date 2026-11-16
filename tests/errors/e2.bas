ON ERROR GOTO h
y = Twice(5) + 1
PRINT "y ="; y
READ a, b, c
PRINT "read"; a; b; c
DATA 1, 2
PRINT _ERRORMESSAGE$(53); "|"; _ERRORMESSAGE$(62)
OPEN "nope.txt" FOR INPUT AS #1
CLOSE #2
PRINT "err after resume"; ERR
mode = 1
ERROR 7
PRINT "unreachable"
END

h:
PRINT "h"; ERR; _ERRORMESSAGE$
IF mode = 1 THEN ON ERROR GOTO 0
RESUME NEXT

FUNCTION Twice (n)
    Twice = n * 2
    ERROR 99
    PRINT "in twice"
END FUNCTION
