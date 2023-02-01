const express = require('express');
const app = express();
const fs = require('fs')

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const TeleBot = require('telebot');
const bot = new TeleBot('5780609524:AAHRBdUG9rvbO3kAjqO0VQ5RnAQ-nlglmHA');
const QRCode = require('qrcode')


bot.on('/start', (msg) => {
    let newtext = `Salom istalgan matinni kiriting va bot sizga qrcode tayyorlab beradi.`;
    fs.readFile(`./users.txt`, 'utf8', (err, data) => {
        if (!(data.indexOf(msg.from.id) + 1) || data.length == 0) {
            fs.writeFile('./users.txt', `${data}\n${msg.from.id}`, () => { });
        }
    });
    msg.reply.text(newtext)
});


bot.on('text', (msg) => {
    if (msg.text == '/start') return;

    QRCode.toBuffer(msg.text, function (err, code) {
        if (err) return console.log("error occurred");
        bot.sendPhoto(msg.from.id, code, { caption: 'created by: @TgQrCodeBot', fileName: 'progerboy.jpeg' })
    })
});

bot.start();

process.on('unhandledRejection', ex => {
    console.log(ex, 'uhr');
    process.exit(1)

})
process.on('uncaughtException', ex => {
    console.log(ex, 'unce');
    process.exit(1)
})
app.use(function (err, req, res, next) {
    console.log(err, 'un');
    res.status(500).send({
        message: 'SERVER ERROR', type: 'global'
    })
})
app.listen(3009, console.log('gooo'))