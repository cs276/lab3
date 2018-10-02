# lab3

```
CREATE TABLE "files" ( `hash` INTEGER NOT NULL, `sentences` INTEGER NOT NULL, `letters` INTEGER NOT NULL, `words` INTEGER NOT NULL, `numbers` INTEGER NOT NULL, `cl_score` REAL NOT NULL, `ari_score` REAL NOT NULL )
```
Our program runs the function readability.js on a text file which the user types into the command line. This function parses the file into sentences, letters, numbers, and words to plug into 2 tools that measure reading level: the Coleman-Liau readability index and Automated Readability Index. The program then calculates those values, stores it into a databse, and presents the data to the user on the console. 

Once the user has typed in the correct number of arguments into the command line, readability.js creates a hash for the file and inserts it into the database. If there's already a hash of that file in the database, then prepare a report with the data associated with that hash using the prepareReport() function, which shows it to the user on the console. If the hash doesn't exist, then run the file through readability again to generate the necesary values, store those values into the database using db.run(INSERT INTO...), and present it to the user via prepareReport. 
