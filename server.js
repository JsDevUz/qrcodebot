
const fs = require('fs')
const { Telegraf } = require('telegraf');
const bot = new Telegraf('5780609524:AAHRBdUG9rvbO3kAjqO0VQ5RnAQ-nlglmHA');
const QRCode = require('qrcode');
const { unlink } = require('fs/promises');
const { default: axios } = require('axios');
const checkUserAvialable = (user) => {
    fs.readFile(`./users.txt`, 'utf8', (err, data) => {
        if (!(data.indexOf(user) + 1) || data.length == 0) {
            fs.writeFile('./users.txt', `${data}\n${user}`, () => { });
        }
    });
}


bot.start(async (ctx) => {
    checkUserAvialable(ctx.chat.id)

    let newtext = `Hi send me text or qrcode!`;
    fs.readFile(`./users.txt`, 'utf8', (err, data) => {
        if (!(data.indexOf(ctx.chat.id) + 1) || data.length == 0) {
            fs.writeFile('./users.txt', `${data}\n${ctx.chat.id}`, () => { });
        }
    });
    ctx.reply(newtext)
});


bot.on('text', async (ctx) => {
    if (ctx.message.text == '/start') return;
    // console.log(ctx.message.text);
    let name = `${ctx.message.text}.jpeg`;
    QRCode.toDataURL(ctx.message.text, async function (err, code) {
        if (err) return console.log("error occurred");
        // bot.telegram.sendMessage(ctx.chat.id, code, { parse_mode: 'markdown' })
        var base64Data = code.replace(/^data:image\/png;base64,/, "");
        await fs.writeFile(name, base64Data, 'base64', function (err) {
            console.log(err, 'iii');
        });

        bot.telegram.sendPhoto(ctx.chat.id, { source: `${name}`, caption: 'created by: @TgQrCodeBot', fileName: 'progerboy.jpeg' }).then(() => {
            unlink(`./${name}`).catch(e => {
                console.log('e');
            })

        }

        )
    })
});

bot.on('photo', async (ctx) => {

    const imageData = await bot.telegram.getFile(ctx.message.photo[ctx.message.photo.length - 1].file_id)
    bot.telegram.sendMessage(ctx.from.id, 'Scanning...', { reply_to_message_id: ctx.message.message_id })
    axios({
        url: `https://api.qrserver.com/v1/read-qr-code/?fileurl=https://api.telegram.org/file/bot5780609524:AAHRBdUG9rvbO3kAjqO0VQ5RnAQ-nlglmHA/${imageData.file_path}`,
        method: 'GET'
    })
        .then(async (response) => {
            if (response.data[0].symbol[0].error === null) {
                await ctx.reply(`Result: ${response.data[0].symbol[0].data}`)
            } else {
                await ctx.reply('No data found on this picture.')
            }

            ctx.reply('You can send me other pictures')
        })
        .catch((err) => {
            ctx.reply('No data found on this picture.')
        })
})
bot.launch();



