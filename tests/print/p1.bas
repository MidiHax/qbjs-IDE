DECLARE SUB Show (a$)
PRINT "[";SPC(3);"]"
PRINT SPC(10); "1. Graphics mode: "; "x"
PRINT "abc"; TAB(10); "col10"; TAB(5); "col5 next line"
PRINT TAB(3); "t3"; SPC(2); 42; TAB(20); -7
PRINT "end with spc"; SPC(2)
PRINT "after"
PRINT "end with tab"; TAB(20)
PRINT "after2"
PRINT SPC(0); "spc0"; TAB(0); "tab0"
PRINT "wide"; SPC(85); "|"
PRINT "x"; TAB(90); "tab90"
PRINT SPC(4) "no semicolon"
FOR i = 1 TO 3: PRINT TAB(i * 5); i;: NEXT: PRINT
OPEN "p1.txt" FOR OUTPUT AS #1
PRINT #1, "ab"; TAB(6); "cd"; SPC(2); "ef"
PRINT #1, "z";
PRINT #1, TAB(4); "w"
PRINT #1, "a", "b"; 5, "c"
CLOSE #1
OPEN "p1.txt" FOR INPUT AS #1
WHILE NOT EOF(1): LINE INPUT #1, l$: PRINT "{"; l$; "}": WEND
CLOSE #1
CALL Show("done")

SUB Show (a$)
    PRINT a$
END SUB
q$ = "*": PRINT q$;"Zorag"q$
b$ = "B": x = 5: PRINT "a" b$ "c"; x "d"
