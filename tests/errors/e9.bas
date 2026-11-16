ON ERROR GOTO Trap
mode = 3
IF mode <> 1 THEN GOTO WrongScreen
PRINT "not reached"
END
Trap:
PRINT "trap"; ERR
RESUME NEXT
WrongScreen:
PRINT "wrong screen mode"
ERROR 99
PRINT "after 99"
GOSUB Tail
END
Tail:
PRINT "tail"
RETURN
