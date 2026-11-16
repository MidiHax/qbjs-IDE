TYPE R2
    a AS INTEGER
    b AS STRING * 4
END TYPE
DIM r AS R2
OPEN "t7.dat" FOR RANDOM AS #1 LEN = 14
a$ = "longstring": PUT #1, 1, a$
b$ = "ab": PUT #1, 1, b$
r.a = 5: r.b = "wxyz": PUT #1, 2, r
GET #1, 2, r
PRINT "partial EOF"; EOF(1); LOC(1); LOF(1)
r.a = 77: r.b = "keep"
GET #1, 9, r
PRINT "after past-end:"; r.a; "["; r.b; "]"; EOF(1); LOC(1); SEEK(1)
GET #1, , r
PRINT "next after past-end:"; LOC(1); EOF(1)
CLOSE #1
OPEN "t8.dat" FOR RANDOM AS #2 LEN = 4
PRINT "empty EOF"; EOF(2); LOC(2); SEEK(2)
PUT #2, , r.a
PUT #2, , r.a
PRINT "seq put"; LOC(2); LOF(2)
CLOSE #2
OPEN "t9.dat" FOR RANDOM AS #3 LEN = 3
r.b = "toolong"
x% = 1
PUT #3, 1, x%
PRINT "ok"
ON ERROR GOTO oops
PUT #3, 2, r
PRINT "after overflow"
CLOSE #3
END

oops: PRINT "error"; ERR: RESUME NEXT
