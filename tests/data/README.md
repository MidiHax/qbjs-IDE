DATA tests
==========

`d1.bas` checks `DATA` and `READ` against QB64:
* unquoted text items (`Clothes, Chain  Mail`), trimmed but with inner spaces kept, and quoted items with spaces and commas;
* numbers read into numeric and string variables (a string gets the text as written, such as `-3.5E2`);
* empty items (`DATA , ,`), which read as `""` or 0;
* `'` and `REM` inside unquoted items (`Loucas' sword`), which are part of the data, not comments;
* `&H1F` and `2.5D1`, read as 31 and 25;
* integers, backslash paths (`..\E001\NEW-MEAT`, `"C:\EAMONDX\"`), and `RESTORE label`.

`expected.txt` holds what QB64 printed. Run the program on the Code tab and compare the Output screen with it.
