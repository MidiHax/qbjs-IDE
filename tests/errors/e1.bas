DIM SHARED tries AS INTEGER
ON ERROR GOTO handler
PRINT "start"
OPEN "missing.txt" FOR INPUT AS #1
PRINT "after open"; ERR
ERROR 200
PRINT "after error 200"
tries = 0
ERROR 201
PRINT "retried"; tries
x = 1: ERROR 202: x = 2
PRINT "x ="; x
CALL Inner
PRINT "after inner"
IF 1 THEN
    ERROR 203
    PRINT "in if"
END IF
FOR i = 1 TO 3
    IF i = 2 THEN ERROR 204
    PRINT "loop"; i
NEXT
ON ERROR GOTO other
ERROR 205
ON ERROR GOTO 0
PRINT "line"; _ERRORLINE
PRINT "done"
END

handler:
PRINT "handler"; ERR; _ERRORLINE
IF ERR = 201 THEN
    tries = tries + 1
    IF tries < 3 THEN RESUME
END IF
RESUME NEXT

other:
PRINT "other"; ERR
RESUME NEXT

SUB Inner
    PRINT "inner a"
    ERROR 206
    PRINT "inner b"
END SUB
