const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
    test("Translation with text and locale fields: POST request to /api/translate", (done) => {
        chai
            .request(server)
            .post("/api/translate")
            .send({ text: "We watched the footie match for a while.", locale: "british-to-american" })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.isObject(res)
                assert.property(res.body, "translation")

                done()
            })
    })

    test("Translation with text and invalid locale field: POST request to /api/translate", (done) => {
        chai
            .request(server)
            .post("/api/translate")
            .send({ text: "We watched the footie match for a while.", locale: "invalid-locale" })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, "error")
                assert.isString(res.body.error)

                done()
            })
    })

    test("Translation with missing text field: POST request to /api/translate", (done) => {
        chai
            .request(server)
            .post("/api/translate")
            .send({ locale: "british-to-american" })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, "error")
                assert.isString(res.body.error)

                done()
            })
    })

    test("Translation with missing locale field: POST request to /api/translate", (done) => {
        chai
            .request(server)
            .post("/api/translate")
            .send({ text: "We watched the footie match for a while." })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, "error")
                assert.isString(res.body.error)

                done()
            })
    })

    test("Translation with empty text: POST request to /api/translate", (done) => {
        chai
            .request(server)
            .post("/api/translate")
            .send({ text: "", locale: "british-to-american" })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, "error")
                assert.isString(res.body.error)

                done()
            })
    })

    test("Translation with text that needs no translation: POST request to /api/translate", (done) => {
        chai
            .request(server)
            .post("/api/translate")
            .send({ text: "Paracetamol takes up to an hour to work.", locale: "british-to-american" })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.isObject(res)
                assert.property(res.body, "translation")
                assert.equal(res.body.translation, "Everything looks good to me!")

                done()
            })
    })

});
