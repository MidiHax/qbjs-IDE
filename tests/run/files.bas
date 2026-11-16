ON ERROR GOTO h
CHDIR "main"
MKDIR "sub"
OPEN "sub\x.txt" FOR OUTPUT AS #1: PRINT #1, "in sub": CLOSE
OPEN "name.dat" FOR OUTPUT AS #1: PRINT #1, 5: CLOSE
OPEN "nofolder\y.txt" FOR OUTPUT AS #1
PRINT "done"
END
h: PRINT "error"; ERR: RESUME NEXT
