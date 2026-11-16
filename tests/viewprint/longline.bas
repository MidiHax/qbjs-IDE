' A 100-character line printed with no VIEW PRINT: it wraps, and the screen scrolls rows 1-24.
' Writes the screen to LONG.TXT.
OPEN "LONG.TXT" FOR OUTPUT AS #1
CLS
FOR i = 1 TO 30: PRINT "n"; i: NEXT
PRINT STRING$(100, "w")
PRINT "end";
PRINT #1, CSRLIN; POS(0)
FOR r = 1 TO 25: l$ = "": FOR c = 1 TO 80: l$ = l$ + CHR$(SCREEN(r, c)): NEXT: PRINT #1, RIGHT$(STR$(r), 2); "|"; RTRIM$(l$): NEXT
CLOSE
END
