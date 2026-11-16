' VIEW PRINT: text windows. Writes what the screen shows (through SCREEN()) to VP.TXT
' after each step, with CSRLIN, POS and ERR, so the results can be compared with QB64.
DECLARE SUB Dump (title$)
DIM SHARED er
OPEN "VP.TXT" FOR OUTPUT AS #1
ON ERROR GOTO Oops
CLS
FOR r = 1 TO 25
    LOCATE r, 1: PRINT "row"; r; STRING$(5, 64 + r);
NEXT
VIEW PRINT 3 TO 23
Dump "1: VIEW PRINT 3 TO 23 on a full screen"

FOR i = 1 TO 30: PRINT "L"; i: NEXT
Dump "2: 30 lines scroll inside rows 3-23"

LOCATE 1, 1
Dump "3: LOCATE 1, 1 outside the window"
LOCATE 10, 5: PRINT "ten";
Dump "4: LOCATE 10, 5 inside the window"
LOCATE 23, 1: PRINT STRING$(100, "w")
Dump "5: a 100-character line wraps and scrolls at the bottom of the window"

CLS 2
Dump "6: CLS 2 clears only the window"
PRINT "after CLS 2"
VIEW PRINT
Dump "7: VIEW PRINT with no rows"
LOCATE 25, 1: PRINT "bottom";
Dump "8: LOCATE 25 after VIEW PRINT"

VIEW PRINT 20 TO 25
LOCATE 25, 1: PRINT "x"
PRINT "y";
Dump "9: VIEW PRINT 20 TO 25, PRINT on row 25"

VIEW PRINT 2 TO 10
CLS
Dump "10: CLS with a window"
VIEW PRINT 2 TO 10
CLS 0
Dump "11: CLS 0 with a window"

VIEW PRINT 0 TO 5
Dump "12: VIEW PRINT 0 TO 5"
VIEW PRINT 10 TO 5
Dump "13: VIEW PRINT 10 TO 5"
top = 4: bot = 6
VIEW PRINT top + 1 TO bot * 2: PRINT "in 5-12"
Dump "14: VIEW PRINT with expressions"
VIEW PRINT 1 TO 25: LOCATE 1, 1
PRINT "one": VIEW PRINT 12 TO 14
Dump "15: cursor above the new window"
PRINT "p"
Dump "16: PRINT after that"
CLOSE
END

Oops:
er = ERR
RESUME NEXT

SUB Dump (title$)
    rr = CSRLIN: cc = POS(0)
    PRINT #1, "== "; title$; " | CSRLIN"; rr; "POS"; cc; "ERR"; er
    er = 0
    FOR r = 1 TO 25
        l$ = ""
        FOR c = 1 TO 80: l$ = l$ + CHR$(SCREEN(r, c)): NEXT
        l$ = RTRIM$(l$)
        IF l$ <> "" THEN PRINT #1, RIGHT$(STR$(r), 2); "|"; l$
    NEXT
END SUB
