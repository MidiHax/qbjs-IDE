' Bounce: the demo page's .bas example (embed/demo.html)
_TITLE "Bounce"
SCREEN 13
RANDOMIZE TIMER
CONST N = 12
DIM x(N), y(N), dx(N), dy(N), c(N)
FOR i = 1 TO N
    x(i) = RND * 300
    y(i) = 10 + RND * 170
    dx(i) = (1 + RND * 2) * SGN(RND - .5)
    dy(i) = (1 + RND * 2) * SGN(RND - .5)
    c(i) = 32 + INT(RND * 72)
NEXT
DO
    CLS
    FOR i = 1 TO N
        x(i) = x(i) + dx(i)
        y(i) = y(i) + dy(i)
        IF x(i) < 0 OR x(i) > 311 THEN dx(i) = -dx(i)
        IF y(i) < 8 OR y(i) > 191 THEN dy(i) = -dy(i)
        LINE (x(i), y(i))-STEP(8, 8), c(i), BF
    NEXT
    LOCATE 1, 1
    PRINT "Bounce - Esc stops"
    _DISPLAY
    _LIMIT 60
LOOP UNTIL INKEY$ = CHR$(27)
