PRINT "the end, n ="; n; "(variables start again)"
OPEN "main\name.dat" FOR INPUT AS #1
WHILE NOT EOF(1): LINE INPUT #1, l$: PRINT "{"; l$; "}": WEND
CLOSE
