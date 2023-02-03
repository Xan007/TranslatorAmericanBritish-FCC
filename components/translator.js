const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")

const britishOnly = require('./british-only.js')
const britishToAmericanSpelling = Object.fromEntries(
    Object.entries(americanToBritishSpelling).map((k) => k.reverse())
);
const britishToAmericanTitles = Object.fromEntries(
    Object.entries(americanToBritishTitles).map((k) => k.reverse())
);

const britishTime = /([\d]{1,2}).([\d]{1,2})/g
const americanTime = /([\d]{1,2}):([\d]{1,2})/g

function addHighlight(word) {
    return `<span class="highlight">${word}</span>`
}

function getTimes(text) {
    return [...text.matchAll(timeRegex)]
}

function capitalize(text) {
    return text[0].toUpperCase() + text.slice(1);
}

class Translator {
    constructor(locale) {
        this.locale = locale
    };

    translate(text) {
        if (this.locale === "american-to-british")
            return this.american_to_british(text)
        else if (this.locale === "british-to-american")
            return this.british_to_american(text)
    }

    american_to_british(text) {
        let new_text = text

        for (const [american, british] of Object.entries({
            ...americanOnly,
            ...americanToBritishSpelling,
        })) {
            new_text = new_text.replaceAll(new RegExp(`[^<-]\\b${american}\\b`, "ig"), " " + addHighlight(british));
        }

        for (const [american, british] of Object.entries(americanToBritishTitles)) {
            new_text = new_text.replaceAll(new RegExp(american, "ig"), addHighlight(capitalize(british)));
        }

        new_text = new_text.replaceAll(americanTime, addHighlight("$1.$2"))

        return new_text
    }

    british_to_american(text) {
        let new_text = text

        for (const [british, american] of Object.entries({
            ...britishOnly,
            ...britishToAmericanSpelling,
          })) {
            new_text = new_text.replaceAll(new RegExp(`[^<-]\\b${british}\\b`, "ig"), " " + addHighlight(american));
        }

        for (const [british, american] of Object.entries(britishToAmericanTitles)) {
            new_text = new_text.replaceAll(new RegExp(`\\b${british}\\b`, "ig"), addHighlight(capitalize(american)));
        }

        new_text = new_text.replaceAll(britishTime, addHighlight("$1:$2"))

        return new_text
    }
}

module.exports = Translator;