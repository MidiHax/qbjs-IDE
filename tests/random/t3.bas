TYPE P
    x AS INTEGER
    y AS INTEGER
END TYPE
DIM pts(1 TO 3) AS P
FOR i = 1 TO 3: pts(i).x = i: pts(i).y = i * i: NEXT
OPEN "t4.dat" FOR RANDOM AS #1 LEN = LEN(pts(1))
FOR i = 1 TO 3: PUT #1, i, pts(i): NEXT
DIM q AS P
GET #1, 3, q
PRINT q.x; q.y; LEN(pts(2)); LOF(1)
GET #1, 1, pts(3)
PRINT pts(3).x; pts(3).y
CLOSE #1
OPEN "t5.dat" FOR BINARY AS #1
v% = 258: PUT #1, , v%
SEEK #1, 1
GET #1, , w%
PRINT w%; SEEK(1); LOF(1)
CLOSE #1
