ON ERROR GOTO h
DIM shape%(100)
OPEN "f2.dat" FOR RANDOM AS #2 LEN = 4
FIELD #2, 4 AS x$
GET #2, 1
GET (0, 0)-(15, 15), shape%()
PUT (10, 10), shape%()
PUT STEP(5, 5), shape%()
PRINT "still running"
END
h:
PRINT "err"; ERR
RESUME NEXT
