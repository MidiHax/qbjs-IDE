OPEN "count.txt" FOR APPEND AS #1: PRINT #1, "x": CLOSE
OPEN "count.txt" FOR INPUT AS #1: c = 0
WHILE NOT EOF(1): LINE INPUT #1, l$: c = c + 1: WEND: CLOSE
PRINT "run"; c
IF c < 3 THEN RUN
PRINT "done"
