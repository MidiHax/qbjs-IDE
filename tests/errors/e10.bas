ON ERROR GOTO h
ERROR 5
PRINT "resumed here"
END
h:
PRINT "h"; ERR
nextpart:
PRINT "fell into nextpart"
GOTO finish
PRINT "skipped"
finish:
PRINT "finish"
RESUME NEXT
