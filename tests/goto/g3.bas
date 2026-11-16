ON ERROR GOTO h
tries = 0
start:
tries = tries + 1
PRINT "try"; tries
IF tries < 3 THEN ERROR 70
PRINT "ok after"; tries
CALL Deep
PRINT "not reached"
recover:
PRINT "recovered"
GOSUB s1
PRINT "end"
END
s1:
PRINT "in s1": RETURN

h:
PRINT "handler"; ERR
IF ERR = 70 THEN RESUME start
RESUME recover

SUB Deep
    PRINT "deep"
    ERROR 53
    PRINT "deep after"
END SUB
