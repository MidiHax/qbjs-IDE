PRINT "front desk"
OPEN "name.dat" FOR INPUT AS #1: INPUT #1, n: CLOSE #1
PRINT "n"; n
OPEN "..\DATA.TXT" FOR INPUT AS #1: LINE INPUT #1, a$: CLOSE: PRINT a$
OPEN "Name.Dat" FOR APPEND AS #1: PRINT #1, 7: CLOSE
ON ERROR GOTO h
RUN "nosuch"
PRINT "after missing file"
CHDIR ".."
RUN "END.BAS"
END
h: PRINT "error"; ERR: RESUME NEXT
