const fs = require("fs");
const md5File = require('md5-file');
const sqlite3 = require('sqlite3');
const Tokenizer = require('tokenize-text');
const tokenize = new Tokenizer();
const tokenizeEnglish = require("tokenize-english")(tokenize);

// Parses a text file into words, sentences, characters, numbers
function readability(filename, callback) {
    fs.readFile(filename, "utf8", (err, contents) => {
        if (err) throw err;

        contents = contents.replace(/\n/g, ' ') // remove newline characters

        let sentences = tokenizeEnglish.sentences()(contents).length;
        let letters = tokenize.re(/[a-zA-Z]/)(contents).length;
        let numbers = tokenize.re(/[0-9]/)(contents).length;
        let words = tokenize.words()(contents).length;

        let cl_score = colemanLiau(letters, words, sentences).toFixed(3);
        let ari_score = automatedReadabilityIndex(letters, numbers, words, sentences).toFixed(3);

        callback({
            sentences,
            letters,
            numbers,
            words,
            cl_score,
            ari_score
        });
    })
};

// Computes Coleman-Liau readability index
function colemanLiau(letters, words, sentences) {
    return (0.0588 * (letters * 100 / words)) -
        (0.296 * (sentences * 100 / words)) -
        15.8;
}

// Computes Automated Readability Index
function automatedReadabilityIndex(letters, numbers, words, sentences) {
    return (4.71 * ((letters + numbers) / words)) +
        (0.5 * (words / sentences)) -
        21.43;
}

// Prepares report with previously calculated values 
function prepareReport(filename, letters, words, numbers, sentences, cl_score, ari_score) {
    console.log(`REPORT for ${filename}\n${letters + numbers} characters\n${words} words\n${sentences} sentences\n------------------\nColeman-Liau Score: ${cl_score}\nAutomated Readability Index: ${ari_score}`);
}

// Calls the readability function on the provided file and defines callback behavior
if (process.argv.length >= 3) {
    let db = new sqlite3.Database('./readability.db', (err) => {
        if (err) throw err
    });
    
    // Creating unique signature for the file, 
    let hash = md5File.sync(process.argv[2]);

    
    check_present = `SELECT * FROM "files" WHERE hash = "${hash}"`
    
    // Checks if hash value present in database, if so, then print report to console
    // else, calculate, prepare report, insert into database, and print to console 
    db.get(check_present, [], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (row) {
            prepareReport(process.argv[2], row.letters, row.words, row.numbers, row.sentences, row.cl_score, row.ari_score)
        } else {
            readability(process.argv[2], data => {
                prepareReport(process.argv[2], data.letters, data.words, data.numbers, data.sentences, data.cl_score, data.ari_score);
                db.run(`INSERT INTO "files" (hash, letters, words, numbers, sentences, cl_score, ari_score) VALUES ('${hash}', ${data.letters}, ${data.words}, ${data.numbers}, ${data.sentences}, ${data.cl_score}, ${data.ari_score})`);
            });
        };
    });

} else {
    console.log("Usage: node readability.js <file>");
}
