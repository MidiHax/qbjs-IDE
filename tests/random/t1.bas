TYPE Rec
    id AS INTEGER
    nm AS STRING * 6
    sc AS SINGLE
    big AS LONG
END TYPE
DIM r AS Rec
PRINT "LEN"; LEN(r)
OPEN "t1.dat" FOR RANDOM AS #1 LEN = LEN(r)
FOR i = 1 TO 3
    r.id = i * 10: r.nm = "nm" + LTRIM$(STR$(i)): r.sc = i + 0.5: r.big = -i * 100000
    PUT #1, i, r
NEXT
r.id = 99: r.nm = "toolongname": PUT #1, 5, r
PRINT "LOF"; LOF(1); "LOC"; LOC(1)
GET #1, 2, r
PRINT r.id; "["; r.nm; "]"; r.sc; r.big; LOC(1)
GET #1, , r
PRINT r.id; "["; r.nm; "]"; r.sc; LOC(1); SEEK(1)
SEEK #1, 1
GET #1, , r
PRINT r.id; EOF(1)
GET #1, 5, r
PRINT r.id; "["; r.nm; "]"; EOF(1)
GET #1, 6, r
PRINT "past end EOF"; EOF(1); "LOC"; LOC(1)
CLOSE #1
