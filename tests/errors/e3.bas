ON ERROR GOTO h
PRINT "a"
ERROR 70
PRINT "b"
END
h:
PRINT "handler, no resume"; ERR
