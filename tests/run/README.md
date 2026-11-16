RUN and file name tests
=======================

These programs check `RUN` and DOS-style file names. They work together, so upload the whole `run/` folder (with `MAIN/`) on the Files tab, keeping the folder structure.

* `start.bas` writes `data.txt`, then `CHDIR "main"` (the folder is `MAIN`) and `RUN "frntdesk"` (the file is `MAIN/FRNTDESK.BAS`).
* `MAIN/FRNTDESK.BAS`:
  * reads `name.dat` (the file is `NAME.DAT`) and `..\DATA.TXT`;
  * appends to `Name.Dat`, which must not create a second file;
  * catches `RUN "nosuch"` with `ON ERROR` (error 53);
  * then runs `CHDIR ".."` and `RUN "END.BAS"`.
* `END.BAS` shows that variables start again after `RUN`, and reads `main\name.dat`.
* `count.bas` uses `RUN` with no name to restart itself until a counter file has three lines.
* `files.bas`:
  * runs `MKDIR "sub"` and writes `sub\x.txt` inside `MAIN`;
  * runs `OPEN "name.dat" FOR OUTPUT`, which must empty and reuse `NAME.DAT`;
  * opens a file in a missing folder (error 76).
* `errrun.bas` has an `ON ERROR` handler that ends with `RUN "END.BAS"`, as the Eamon handlers end with `RUN "EAMONDX"`.

`expected.txt` lists the expected output. The programs change the files (`NAME.DAT`, `count.txt`), so upload the folder again before running them a second time.
