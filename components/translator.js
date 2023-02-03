const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

const timeRegex = /([\d]{1,2})([.:])([\d]{1,2})/g

function addHighlight(word) {
    return `<span class="highlight">${word}</span>`
}

function getTimes(text) {
    return [...text.matchAll(timeRegex)]
}

class Translator {
    constructor(locale) {
        this.locale = locale
    };

    translate(text) {
        const words = text.toLowerCase().split(/[\s"']/)

        if (this.locale === "american-to-british")
            return this.american_to_british(text, words)
        else if (this.locale === "british-to-american")
            return this.british_to_american(text, words)
    }

    american_to_british(text, words) {
        let new_text = text

        words.forEach(word => {
            let new_word = americanOnly[word]
                || americanToBritishSpelling[word]
            
            if (americanToBritishTitles[word])
                new_word = americanToBritishTitles[word].replace(/^(.)/, (p1) => p1.toUpperCase())

            if (new_word)
                new_text = new_text.replaceAll(new RegExp(word, "ig"), addHighlight(new_word))
        })

        getTimes(new_text).forEach((time_match) => {
            if (time_match[2] == ":")
                new_text = new_text.replaceAll(
                    new RegExp(`${time_match[0]}`, "g"),
                    addHighlight(`${time_match[1]}.${time_match[3]}`)
                )
        })

        return new_text
    }

    british_to_american(text, words) {
        let new_text = text

        function getKeyForValue(value_search, obj) {
            for (const [key, value] of Object.entries(obj)) {
                if (value === value_search)
                    return key
            }
        }

        words.forEach(word => {
            let new_word = getKeyForValue(word, britishOnly)
                || getKeyForValue(word, americanToBritishSpelling)

            if (getKeyForValue(word, americanToBritishTitles))
                new_word = getKeyForValue(word, americanToBritishTitles).replace(/^(.)/, (p1) => p1.toUpperCase())

            if (new_word)
                new_text = new_text.replaceAll(new RegExp(word, "ig"), addHighlight(new_word))
        })

        getTimes(new_text).forEach((time_match) => {
            if (time_match[2] == ".")
                new_text = new_text.replaceAll(
                    new RegExp(`${time_match[0]}`, "g"),
                    addHighlight(`${time_match[1]}:${time_match[3]}`)
                )
        })

        return new_text
    }
}

module.exports = Translator;