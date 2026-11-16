TYPE Pt
    x AS INTEGER
    y AS INTEGER
END TYPE
TYPE Rec
    id AS INTEGER
    nm AS STRING * 6
    p AS Pt
END TYPE
CONST N = 4
DIM s AS STRING * 5
DIM t AS STRING * N
DIM a(3) AS STRING * 4
DIM r AS Rec, c AS Rec
DIM team(2) AS Rec
PRINT "init"; LEN(s); ASC(s); ASC(r.nm); ASC(a(1)); ASC(team(1).nm)
s = "ab"
PRINT "[" + s + "]"; LEN(s)
s = "abcdefgh"
PRINT "[" + s + "]"; LEN(s)
s = "xy": s = s + "z"
PRINT "[" + s + "]"
t = "123456"
PRINT "[" + t + "]"
a(1) = "q"
PRINT "[" + a(1) + "]"
r.nm = "Alexander"
PRINT "[" + r.nm + "]"
r.nm = "Al"
PRINT "[" + r.nm + "]"; LEN(r.nm)
team(2).nm = "Bobby Long"
PRINT "[" + team(2).nm + "]"
r.id = 1: r.p.x = 10
c = r
c.id = 2: c.p.x = 20: c.nm = "Zed"
PRINT r.id; r.p.x; "[" + r.nm + "]"; c.id; c.p.x; "[" + c.nm + "]"
team(1) = r
r.id = 3
PRINT team(1).id; r.id
r = team(1)
team(1).id = 7
PRINT team(1).id; r.id
DIM q AS Pt
q = r.p
q.x = 99
PRINT q.x; r.p.x
r.p = q
q.y = 5
PRINT r.p.x; r.p.y
s = RTRIM$("hi   ")
PRINT "["; s; "]"; LEN(RTRIM$(s))
