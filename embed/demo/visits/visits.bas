' Visit counter: the demo page's package example (embed/demo.html).
' Reads banner.txt from the package, and keeps a count in count.txt,
' which the page keeps in its browser storage (persist).
_TITLE "Visit counter"
count = 0
IF _FILEEXISTS("count.txt") THEN
    OPEN "count.txt" FOR INPUT AS #1
    INPUT #1, count
    CLOSE #1
END IF
count = count + 1
OPEN "count.txt" FOR OUTPUT AS #1
PRINT #1, count
CLOSE #1

COLOR 14
OPEN "banner.txt" FOR INPUT AS #1
DO UNTIL EOF(1)
    LINE INPUT #1, a$
    PRINT a$
LOOP
CLOSE #1
COLOR 7
PRINT
PRINT "COMMAND$ (from qbjs.json): "; COMMAND$
PRINT
PRINT "You have run this program"; count; "time(s) on this page."
PRINT "Reload the page and run it again: the count is kept."
