'use strict';

const TranslatorClass = require('../components/translator.js');

module.exports = function (app) {

  app.route('/api/translate')
    .post((req, res) => {
      const { text, locale } = req.body

      if (!(locale !== undefined && text !== undefined))
        return res.send({ error: 'Required field(s) missing' })

      if (!text)
        return res.send({ error: 'No text to translate' })


      if (!["american-to-british", "british-to-american"].includes(locale))
        return res.send({ error: 'Invalid value for locale field' })

      const translator = new TranslatorClass(locale)
      
      let translation = translator.translate(text)

      if (translation === text)
        translation = "Everything looks good to me!"

      res.send({ text: text, translation: translation })
    });
};
