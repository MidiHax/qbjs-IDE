QB64 IDE
========

A browser IDE for writing and running QB64 / QBasic programs, with a virtual file system that persists in the browser.

Programs are compiled to JavaScript and run by [QBJS](https://github.com/boxgaming/qbjs) (MIT License).

> [!TIP]
> [Try it out!](https://midihax.github.io/qbjs-IDE/)


Features
--------
* Tabbed interface: Code / Output / Messages / Files / Info, plus a File Editor tab for data files.
* Code editor (CodeMirror 5) with QBasic syntax highlighting, search (Ctrl+F) and 4-space indenting.
* Outline pane on the Code tab: the program's imports, `TYPE`s, constants, `SUB`s, `FUNCTION`s and labels (line numbers only when something jumps to them), found by scanning the text as you type, without compiling. Click an item to jump to it, or double-click an `$INCLUDE` to open that file in a tab of its own (looked up from the program's folder, as the compiler does); filter by name; hide it with the Outline button.
* Include tabs: an `$INCLUDE` opened from the outline gets an amber tab after the standard ones, with a code editor like the program's (highlighting, keyword capitals, its own outline). Run and Stop are hidden there; Save (Ctrl+S), Save As and Download apply to the include file. Close a tab with its × or a middle click; unsaved changes are asked about first. The tabs are not kept when the page is reloaded.
* Record Editor (Files tab) for `RANDOM` files. A dialog asks for the records' `TYPE`: one from the program in the editor or the files it `$INCLUDE`s (TYPEs that can't be stored, such as one with a variable-length `STRING`, are listed but greyed out with the reason), or a pasted definition ("Custom"; the last `TYPE` in it is the record, and the TYPEs nested in it may come from the paste or the program). It also asks for the record length (`LEN =` in `OPEN`, at least the TYPE's size). The first time, it picks the largest TYPE whose size divides the file size. The editor shows one record at a time, with a field for each part of the TYPE; nested TYPEs are indented groups (`pos` with `x` and `y`). Choose the record from the list (it shows the first string field of each record) or with the arrows, and Add Record adds an empty record at the end. Values are checked as you type (range, whole numbers, string length). Changes stay in memory until Save File (Ctrl+S); Close asks about unsaved changes, and Change TYPE reads the same bytes another way. The layout is the one `GET`/`PUT` use: fields in order with no padding, numbers little-endian, `STRING * n` as *n* bytes padded with spaces; an edited file was checked byte for byte against QB64. Supported field types: `INTEGER`, `LONG`, `SINGLE`, `DOUBLE`, `_INTEGER64`, `_BYTE`, their `_UNSIGNED` forms, `STRING * n` (*n* may be a `CONST`) and nested TYPEs.
* Keywords in capitals, as in the QB64 IDE: `print left$(a$, 2)` becomes `PRINT LEFT$(a$, 2)` when the word is finished, when the cursor leaves the line, or when text is pasted. Strings, comments, `REM` and `DATA` text, names joined by a dot (`r.name`) and `$IF JAVASCRIPT` blocks are left alone, and so are variables with a type suffix (`name$`). Opening a file doesn't change it. Turn it off on the Info tab.
* Toolbar: icon buttons for Run (play, Ctrl+R or F5), Debug (bug) and Stop (square, Shift+F5); while debugging, Continue, Step and Pause appear beside them as text buttons. The disk button opens the File menu (New, Save, Save As, Download, Open from Computer); the tree-list button shows or hides the Outline pane and the eye button the Watch pane. Hover over a button for its name and keys. The program screen is the Output tab, with a Full Screen button.
* Step-debugger, with QBasic's keys. Click a line number (or press F9) to set or clear a breakpoint; breakpoints are red dots and can be set in include tabs too, also while the program runs. Debug runs the program until it reaches a breakpoint; F8 (Step) starts it stopped at the first line. While it is stopped, the line about to run is highlighted, in the program's editor or in an include tab (opened if needed), and the status shows where (`Paused at main.bas:12`). Continue (F5) runs to the next breakpoint and shows the Output tab; Step (F8) runs one line, going into `SUB`s and `FUNCTION`s, and stays with the code unless the program then waits (for `INPUT`, say); Pause stops at the next line; Stop (Shift+F5) ends the program. A line is one step, even with several statements (`a = 1: b = 2`, one-line `IF`). Lines that only end or continue a block (`ELSE`, `CASE`, `NEXT`, `LOOP`, `END IF`) are not stops. Debugging compiles the program with a check before each line, so it runs slower than Run; Run is unchanged. Include files are compiled as saved, so save an include tab before debugging for its lines to match.
* Watch pane (eye button, or it opens at the first stop in the debugger): a right-hand pane beside the outline that lists the variables while the program is paused. In a `SUB` or `FUNCTION` it shows that procedure's parameters and variables (a FUNCTION's value as "(result)", `STATIC` variables too), then the main program's, shared variables included; each section can be closed. TYPE variables open into their fields (nested TYPEs too) and arrays into their elements, a level per dimension, the first 100 at a time. A value that changed since the last stop is highlighted, and what is open stays open from stop to stop. While the program runs on, the last values stay, dimmed. Closing the pane while debugging keeps it closed until the next debugging session; on a phone the Watch and Outline panes take turns.
* Messages tab: compiler errors and warnings and runtime errors, with line numbers. Click a row to jump to the line (a line in an include file opens its tab).
* Program messages: `_ECHO text$` (QB64) and QB64-PE's `_LOGTRACE`, `_LOGINFO`, `_LOGWARN` and `_LOGERROR` write a row to the Messages tab (ECHO, TRACE, INFO, WARN, ERROR) with the line it came from, and not to the program's screen, so they suit debugging output: `_ECHO "x =" + STR$(x)`. They also go to the browser's JavaScript console, at the matching level (log, debug, info, warn, error). The tab is cleared when a run starts and does not come to the front by itself; its count goes up (red if there is a `_LOGERROR`). After 2000 messages in one run, the rest are only counted. In QB64 the same statements write to the console window, so programs stay compatible. The compiled JavaScript can be expanded underneath.
* File menu: Save / Save As (Ctrl+S / Ctrl+Shift+S) into the virtual file system, including into folders (`games/snake.bas`). New, Download (as `.bas`) and Open (from your computer).
* Files tab: browse folders; each row's Actions menu has Run / Open for `.bas` files, Edit for text files, Record Editor, Download, Rename and Delete (the arrow keys, Enter and Escape work in it). The toolbar has New Folder, New File, Upload Files (or drag and drop), and Download Package / Upload Package to move every file as one ZIP.
* The virtual file system is saved to IndexedDB, so files survive reloads. Changes made by running programs (`OPEN`, `PRINT #`, `KILL`, `MKDIR`, ...) are saved too.
* A program starts in its own folder, so relative paths in `OPEN`, `_LOADIMAGE` and so on resolve next to the `.bas` file.
* `RUN "program"` starts another program from the virtual file system, as programs split across several files expect. A program started by `RUN` starts in the folder that was current.
* File and folder names ignore case, as in DOS: `OPEN "name.dat"` opens `NAME.DAT`.
* The editor buffer is kept in `localStorage`, so unsaved work survives a reload.
* Phosphor colour (teal, green, amber, violet, pink) and scanlines can be changed on the Info tab.

Local Hosting
-------------
To run the IDE locally, serve the folder over HTTP (opening `index.html` as a `file://` URL won't work, because `Import` statements fetch `lib/*.bas`):

```
python -m http.server 8000
```

Additional Documentation
------------------------
- [Embed a QB Program in your Web Page](doc/embedding.md)
- [Project layout](doc/layout.md)
- [Deviance from QBJS](doc/qbjs-delta.md)
- [Known Limitations](doc/limitations.md)