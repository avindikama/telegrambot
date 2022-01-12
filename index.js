const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const sequelize = require('./db');
const UserModel = require('./models');
const http = require("http");
const https = require("https");
const token = '5051736612:AAHRMUVkmB2NsBo6M2LwrPC8K3FlxrhXHRU'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`);
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

bot.on('message', msg => {
    console.log(msg)
})

let bitcoinprice = 42.692;

const start = async () => {





    bot.on('message',
        async msg => {
            const text = msg.text;
            const chatId = msg.chat.id;

            try {

                const user = await UserModel.findOne({chatId})
                return bot.sendMessage(chatId, `Иди нахуй ${msg.from.first_name}`);


                // return bot.sendMessage(chatId, 'Иди нахуй ${msg.from.first_name}  ');
            } catch (e) {
                function getRandomInt(max) {
                    return Math.floor(Math.random() * max);
                }

                https.get('https://api.coindesk.com/v1/bpi/currentprice.json',(response) => {
                    let data = '';
                    response.on('data', (chunk) => {
                        data += chunk
                    });

                    response.on('end',() => {
                        console.log(data)
                        var obj = JSON.parse(data)
                         bitcoinprice = obj.bpi.USD.rate
                        //console.log(obj.bpi.USD.rate)
                    })

                })
                console.log(getRandomInt(3));

                const cars = ["Иди нахуй", "Чина лох", "Скиньте бабки на Каспи 5169 4971 4978 0037, Я айфон хочу", "Ля ты конченный", "Я не агрессор"];
                cars.push('Даур блять Курс биткоина ' + String(bitcoinprice))
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b50/063/b5006369-8faa-44d7-9f02-1ca97d82cd49/9.webp')
                return bot.sendMessage(chatId, cars[getRandomInt(6)]);
            }

        })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        const user = await UserModel.findOne({chatId})
        if (data == chats[chatId]) {
            user.right += 1;
            await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            user.wrong += 1;
            await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
        }
        await user.save();
    })
}

start()

