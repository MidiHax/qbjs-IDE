DIM s AS STRING * 5
OPEN "t2.dat" FOR RANDOM AS #1 LEN = 20
a$ = "hello world"
PUT #1, 1, a$
s = "abc"
PUT #1, 2, s
b$ = ""
GET #1, 1, b$
GET #1, 2, s
PRINT "["; b$; "]["; s; "]"; LEN(s); LOF(1)
CLOSE #1
OPEN "t3.dat" FOR RANDOM AS #2
x% = 7: PUT #2, 1, x%: PUT #2, 3, x%
PRINT "default reclen LOF"; LOF(2)
CLOSE #2
OPEN "t6.dat" AS #3 LEN = 4
y& = 123456: PUT #3, 2, y&
GET #3, 2, z&
PRINT "no FOR:"; z&; LOF(3)
CLOSE #3
