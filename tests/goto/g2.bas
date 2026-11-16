DIM total AS INTEGER
FOR i = 1 TO 5
    FOR j = 1 TO 5
        IF i * j = 6 THEN GOTO found
    NEXT j
NEXT i
found:
PRINT "found"; i; j
k = 0
again:
k = k + 1
SELECT CASE k
    CASE 1: PRINT "one"
    CASE 2 TO 3: PRINT "two-three"
    CASE IS > 5: PRINT "big": GOTO done
    CASE ELSE: PRINT "else"; k
END SELECT
GOSUB tally
IF k < 10 THEN GOTO again
done:
PRINT "total"; total
DO
    w = w + 1
    IF w = 2 THEN _CONTINUE
    IF w > 4 THEN EXIT DO
    PRINT "w"; w
LOOP
x = 0
DO UNTIL x >= 3: x = x + 1: LOOP
PRINT "x"; x
DO: x = x - 1: LOOP WHILE x > 0
PRINT "x"; x
WHILE x < 2: x = x + 1: WEND
PRINT "x"; x
IF x = 2 THEN
    PRINT "if"
ELSEIF x = 3 THEN
    PRINT "elseif"
ELSE
    PRINT "else"
END IF
CALL Counter(3)
PRINT "fact"; Fact(5)
GOSUB outer
PRINT "end"
END

tally:
total = total + k
RETURN

outer:
PRINT "outer"
GOSUB inner
PRINT "back in outer"
RETURN
inner:
PRINT "inner"
RETURN

SUB Counter (n)
    c = 0
top:
    c = c + 1
    PRINT "c"; c
    IF c < n THEN GOTO top
END SUB

FUNCTION Fact (n)
    r = 1
    m = n
loop1:
    IF m <= 1 THEN GOTO fin
    r = r * m: m = m - 1
    GOTO loop1
fin:
    Fact = r
END FUNCTION
