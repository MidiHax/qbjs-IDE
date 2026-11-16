ON ERROR GOTO h
nl$ = CHR$(13) + CHR$(10)
OPEN "f1.txt" FOR OUTPUT AS #1
PRINT #1, " 637           561           377           196 " + nl$ + "Classic Eamon Adventures Vol. 6" + nl$ + " 6             3             10 " + nl$;
PRINT #1, "1 2" + nl$ + "3" + nl$ + nl$ + "  4  ,  5" + nl$;
PRINT #1, "   lead, trail   ,x" + nl$;
PRINT #1, CHR$(34) + "q, with comma" + CHR$(34) + "   , after" + nl$;
PRINT #1, ",,7" + nl$;
PRINT #1, "a" + nl$ + nl$ + "b" + nl$;
PRINT #1, "8" + CHR$(9) + "9" + nl$;
PRINT #1, "10, rest of line" + nl$ + "next line" + nl$;
PRINT #1, "-1.5E2 &H10 12abc" + nl$;
PRINT #1, "last"
CLOSE #1
OPEN "f1.txt" FOR INPUT AS #1
INPUT #1, nr, naf, ne, nm, aname$, nd, ver
PRINT nr; naf; ne; nm; "["; aname$; "]"; nd; ver
INPUT #1, x
PRINT "x"; x
INPUT #1, a: INPUT #1, b
PRINT "ab"; a; b
INPUT #1, c, d, e
PRINT "cde"; c; d; e
INPUT #1, s1$, s2$, s3$
PRINT "["; s1$; "]["; s2$; "]["; s3$; "]"
INPUT #1, q1$, q2$
PRINT "["; q1$; "]["; q2$; "]"
INPUT #1, e1$, e2, e3
PRINT "["; e1$; "]"; e2; e3
INPUT #1, b1$, b2$
PRINT "["; b1$; "]["; b2$; "]"
INPUT #1, t1, t2
PRINT "tab"; t1; t2
INPUT #1, r1
LINE INPUT #1, r$
PRINT r1; "["; r$; "]"
INPUT #1, f1, f2, f3
PRINT f1; f2; f3
INPUT #1, z$
PRINT "["; z$; "]"; EOF(1)
INPUT #1, past$
PRINT "past ["; past$; "]"
CLOSE #1
END
h:
PRINT "error"; ERR
RESUME NEXT
