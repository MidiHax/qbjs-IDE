' FUNCTIONs that return a TYPE, and FUNCTIONs declared AS type without parentheses.
' QB64 can't run this program (its FUNCTIONs can't return a TYPE, and it has no AS clause
' for FUNCTIONs), so expected.txt was checked by hand against QBasic's rules.
TYPE Point
    x AS INTEGER
    y AS INTEGER
END TYPE
TYPE Segment
    a AS Point
    b AS Point
    label AS STRING * 5
END TYPE

DIM p AS Point, q AS Point, r AS Point
DIM s AS Segment

' 1. built in a local record, then assigned to the result
p.x = 1: p.y = 2
q = Shift(p, 10)
PRINT "1:"; q.x; q.y; p.x; p.y
q.x = 99
PRINT "1 copy:"; q.x; Shift(p, 10).x; p.x

' 2. fields of the result set directly (rounded, as INTEGER fields)
q = Make(3.6, -2)
PRINT "2:"; q.x; q.y

' 3. a result never set is a zeroed record; one partly set keeps zeros elsewhere
q.x = 5: q.y = 6
q = Nothing
PRINT "3:"; q.x; q.y
q = OnlyX(7)
PRINT "3 partly:"; q.x; q.y

' 4. each call returns its own record
p = Make(1, 1)
r = Make(2, 2)
PRINT "4:"; p.x; r.x

' 5. nested TYPE fields and a STRING * n field in the result
s = Diagonal(4)
PRINT "5:"; s.a.x; s.a.y; s.b.x; s.b.y; "["; s.label; "]"; LEN(s.label)

' 6. EXIT FUNCTION returns what was set so far
q = Early(1)
PRINT "6:"; q.x; q.y
q = Early(0)
PRINT "6 late:"; q.x; q.y

' 7. the result passed straight to a SUB, and a field read straight from a call
Show Make(8, 9)
PRINT "7:"; Make(4, 5).y + 1

' 8. no parentheses: FUNCTION name AS type, called with or without ()
PRINT "8:"; Five; Five + 1; Six()
q = Origin
PRINT "8 type:"; q.x; q.y
PRINT "8 unsigned:"; Big; Small

FUNCTION Shift (pt AS Point, d AS INTEGER) AS Point
    DIM t AS Point
    t.x = pt.x + d
    t.y = pt.y + d
    Shift = t
END FUNCTION

FUNCTION Make (x AS SINGLE, y AS SINGLE) AS Point
    Make.x = x
    Make.y = y
END FUNCTION

FUNCTION Nothing AS Point
END FUNCTION

FUNCTION OnlyX (x AS INTEGER) AS Point
    OnlyX.x = x
END FUNCTION

FUNCTION Diagonal (n AS INTEGER) AS Segment
    Diagonal.b.x = n
    Diagonal.b.y = n
    Diagonal.label = "diagonal"
END FUNCTION

FUNCTION Early (stopNow AS INTEGER) AS Point
    Early.x = 1
    IF stopNow THEN EXIT FUNCTION
    Early.y = 2
END FUNCTION

SUB Show (pt AS Point)
    PRINT "7 sub:"; pt.x; pt.y
END SUB

FUNCTION Five AS INTEGER
    Five = 5
END FUNCTION

FUNCTION Six () AS INTEGER
    Six = 6
END FUNCTION

FUNCTION Origin AS Point
    Origin.x = 0
END FUNCTION

FUNCTION Big AS _UNSIGNED LONG
    Big = 4000000000
END FUNCTION

FUNCTION Small AS UNSIGNED INTEGER
    Small = 65535
END FUNCTION
