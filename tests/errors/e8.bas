ON ERROR GOTO ErrHandler
PRINT "start"
OPEN "missing.dat" FOR INPUT AS #1
PRINT "after first error"
GOSUB Helper
ERROR 70
PRINT "after second error"; k
CALL Sub1
PRINT "end"; count
END

ErrHandler:
exx = ERR
PRINT "handler"; exx
GOSUB ErrHandler1
IF k = 1 THEN RESUME NEXT
IF k = 2 THEN GOSUB Helper: RESUME NEXT
END

ErrHandler1:
count = count + 1
k = 1: IF count = 2 THEN k = 2
PRINT "choice"; k
RETURN

Helper:
PRINT "shared routine"
RETURN

SUB Sub1
ERROR 71
PRINT "in sub after error"
END SUB
