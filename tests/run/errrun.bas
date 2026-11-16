ON ERROR GOTO ErrHandler
PRINT "before"
OPEN "missing.dat" FOR INPUT AS #1
PRINT "not reached"
END
ErrHandler:
PRINT "error"; ERR; "- running END.BAS"
RUN "END.BAS"
