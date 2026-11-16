ON ERROR GOTO h
FOR i = 1 TO 3
    total = total + i
NEXT: PRINT "total"; total
FOR j = 1 TO 2: PRINT "j"; j: NEXT: PRINT "after"
FOR k = 1 TO 2
    IF k = 2 THEN ERROR 5
NEXT: PRINT "loop done"
PRINT "end"
END
h:
PRINT "err"; ERR
RESUME NEXT
