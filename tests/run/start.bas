PRINT "start"
OPEN "data.txt" FOR OUTPUT AS #1: PRINT #1, "hello from data.txt": CLOSE
n = 99
CHDIR "main"
RUN "frntdesk"
PRINT "not reached"
