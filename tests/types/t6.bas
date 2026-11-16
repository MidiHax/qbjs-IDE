TYPE Item
    code AS STRING * 3
    qty AS INTEGER
END TYPE
DIM SHARED g AS STRING * 4
DIM it AS Item, keep AS Item
DIM w AS STRING * 5
READ w, it.code, it.qty
PRINT "[" + w + "][" + it.code + "]"; it.qty
DATA "abcdefg", "X", 7
OPEN "t6.txt" FOR OUTPUT AS #1
PRINT #1, "longer line"
PRINT #1, "q,r"
CLOSE #1
OPEN "t6.txt" FOR INPUT AS #1
LINE INPUT #1, w
INPUT #1, it.code, g
CLOSE #1
PRINT "[" + w + "][" + it.code + "][" + g + "]"
SetG "123456"
PRINT "[" + g + "]"
keep = it
Bump it
PRINT it.qty; keep.qty; "[" + it.code + "]"
REDIM lst(2) AS STRING * 2
lst(2) = "xyz"
PRINT "[" + lst(2) + "]"; ASC(lst(1))
PRINT Counter$; Counter$
MID$(w, 2, 9) = "ZZZZZZZZ"
PRINT "[" + w + "]"

SUB SetG (v AS STRING)
    g = v
END SUB

SUB Bump (x AS Item)
    DIM tmp AS Item
    tmp = x
    tmp.qty = tmp.qty + 100
    x.qty = x.qty + 1
    x.code = "LONGCODE"
END SUB

FUNCTION Counter$
    STATIC c AS STRING * 3
    c = "x" + c
    Counter$ = STR$(ASC(c, 1)) + STR$(ASC(c, 2)) + STR$(ASC(c, 3))
END FUNCTION
