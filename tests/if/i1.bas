c$ = "7": IF LEN(c$) < 3 THEN c$ = "0" + c$: IF LEN(c$) < 3 THEN c$ = "0" + c$
PRINT "["; c$; "]"
c$ = "77": IF LEN(c$) < 3 THEN c$ = "0" + c$: IF LEN(c$) < 3 THEN c$ = "0" + c$
PRINT "["; c$; "]"
a$ = "": k = 2: k$ = "x": c = 0
IF a$ = "" OR k = 2 THEN IF k$ <> "" THEN c = -1
PRINT "c"; c
FOR t = 1 TO 4
    IF t > 2 THEN IF t = 3 THEN PRINT "three"; ELSE PRINT "four";
    IF t < 2 THEN PRINT "one"; ELSE IF t = 2 THEN PRINT "two"; ELSE PRINT "big";
    PRINT
NEXT
f = 0: pe = 53
IF pe > 0 AND pe <> 53 THEN f = 2:  ELSE pe = 0
PRINT "f"; f; "pe"; pe
dly = 150: IF dly > 100 THEN dly = dly - 100: IF dly < 100 THEN dly = 100
PRINT "dly"; dly
IF 1 THEN PRINT "a: IF b THEN c ELSE d": PRINT "second"
diff = 5: elsewhere = 6: thenx = 7
IF diff = 5 THEN PRINT "diff"; elsewhere; thenx ELSE PRINT "no"
IF 0 THEN PRINT "x" ELSE PRINT "else part": PRINT "still else"
n = 0: IF n = 0 THEN FOR j = 1 TO 3: n = n + j: NEXT j ELSE n = -1
PRINT "n"; n
x = 1: IF x THEN
    PRINT "block if after colon"
END IF
IF x = 1 THEN 200
PRINT "skipped"
200 IF x = 1 GOTO 300
PRINT "skipped too"
300 IF x = 2 THEN PRINT "no" ELSE 400
PRINT "skipped three"
400 PRINT "end"
