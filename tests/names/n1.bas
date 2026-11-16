TYPE Pt
    x AS INTEGER
END TYPE
DIM SHARED total#, names$(3)
k = 1.5: k$ = "str": k% = 7.6: k# = 2.25: k& = 100000
PRINT k; k$; k%; k#; k&; k!
k! = 9.5
PRINT k
DIM x AS INTEGER
x% = 3.4
PRINT x; x%
DIM a(3), a$(3)
a = 1: a$ = "s": a(1) = 10: a$(1) = "t": a%(2) = 20
PRINT a; a$; a(1); a$(1); a%(2)
b$(2) = "auto": b = 4
PRINT b$(2); b
FOR i% = 1 TO 2
    FOR i = 5 TO 6: NEXT i
    PRINT i%; i;
NEXT i%
PRINT
names$(1) = "Ann": total# = 1.25
CALL Fill(names$(), "Bob", 3)
PRINT names$(1); names$(2); total#
PRINT Twice$("ab"); Half%(10)
PRINT Counter%; Counter%
READ d$, d, d%
PRINT d$; d; d%
DATA "dee", 2.5, 7
s1$ = "one": s2$ = "two"
SWAP s1$, s2$
PRINT s1$; s2$
DIM p AS Pt
p.x = 5: p$ = "pee"
PRINT p.x; p$
DATA 1, 2

SUB Fill (n$(), s$, n%)
    SHARED total#
    n$(2) = s$
    n = 99
    total# = total# + n%
END SUB

FUNCTION Twice$ (s$)
    Twice$ = s$ + s$
END FUNCTION

FUNCTION Half% (v)
    Half% = v / 2
END FUNCTION

FUNCTION Counter%
    STATIC c%, c$
    c% = c% + 1: c$ = c$ + "x"
    Counter% = c% * 10 + LEN(c$)
END FUNCTION
