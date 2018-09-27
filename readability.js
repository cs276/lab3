const fs = require("fs");
const md5File = require('md5-file');
const sqlite3 = require('sqlite3');
const Tokenizer = require('tokenize-text');
const tokenize = new Tokenizer();
const tokenizeEnglish = require("tokenize-english")(tokenize);

// Parses a text file into words, sentences, characters
function readability(filename, callback) {
    fs.readFile(filename, "utf8", (err, contents) => {
        if (err) throw err;

        contents = contents.replace(/\n/g, ' ') // remove newline characters

        let sentences = tokenizeEnglish.sentences()(contents).length;
        let letters = tokenize.re(/[a-zA-Z]/)(contents).length
        let numbers = tokenize.re(/[0-9]/)(contents).length
        let words = tokenize.words()(contents).length

        output = `REPORT for ${filename}\n${letters} characters\n${words} words\n${sentences} sentences\n------------------\nColeman-Liau Score: ${colemanLiau(letters, words, sentences).toFixed(3)}\nAutomated Readability Index: ${automatedReadabilityIndex(letters, numbers, words, sentences).toFixed(3)}`

        callback(output);
    });
}

// Computes Coleman-Liau readability index
function colemanLiau(letters, words, sentences) {
    return (0.0588 * (letters * 100 / words))
        - (0.296 * (sentences * 100 / words))
        - 15.8;
}

// Computes Automated Readability Index
function automatedReadabilityIndex(letters, numbers, words, sentences) {
    return (4.71 * ((letters + numbers) / words))
        + (0.5 * (words / sentences))
        - 21.43;
}

// Calls the readability function on the provided file and defines callback behavior
if (process.argv.length >= 3) {
    readability(process.argv[2], data => {
        console.log(data);
    });
}
else {
    console.log("Usage: node readability.js <file>");
}
