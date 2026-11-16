' The bottom line: by default PRINT scrolls rows 1-24 and leaves row 25 alone; VIEW PRINT
' (no rows) and VIEW PRINT 1 TO 25 make all 25 rows scroll. Writes the screen to BOTTOM.TXT.
OPEN "BOTTOM.TXT" FOR OUTPUT AS #1
GOSUB Fill: LOCATE 25, 1: PRINT "x": GOSUB Dump
GOSUB Fill: LOCATE 25, 1: PRINT "x";: PRINT "y": GOSUB Dump
GOSUB Fill: LOCATE 24, 1: PRINT "a": GOSUB Dump
VIEW PRINT: GOSUB Fill: VIEW PRINT: FOR i = 1 TO 30: PRINT "v"; i: NEXT: GOSUB Dump
VIEW PRINT 1 TO 25: GOSUB Fill: VIEW PRINT 1 TO 25: FOR i = 1 TO 30: PRINT "f"; i: NEXT: GOSUB Dump
VIEW PRINT 1 TO 25: CLS: VIEW PRINT: FOR i = 1 TO 30: PRINT "after reset"; i: NEXT: GOSUB Dump
CLOSE: END
Fill: CLS: FOR r = 1 TO 25: LOCATE r, 1: PRINT "row"; r;: NEXT: RETURN
Dump: PRINT #1, "== CSRLIN"; CSRLIN; "POS"; POS(0)
FOR r = 1 TO 25: l$ = "": FOR c = 1 TO 80: l$ = l$ + CHR$(SCREEN(r, c)): NEXT: l$ = RTRIM$(l$)
IF l$ <> "" THEN PRINT #1, RIGHT$(STR$(r), 2); "|"; l$
NEXT: RETURN
