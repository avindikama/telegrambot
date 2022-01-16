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
let senderName = "лох"
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
                senderName = msg.from.first_name
                const cars = ["Иди нахуй "+String(senderName), "Чина лох", "Скиньте бабки на Каспи 5169 4971 4978 0037, Я айфон хочу", "Ля ты конченный", "Я не агрессор"];
                cars.push('Э, подлиза, че делаешь? ')
                cars.push('Ну ты и пидорррррас ' )
                cars.push('Пидорррррасул' )
                cars.push('Ляяя ты крыса ' )
                cars.push('Ну ты и конч ' )
                cars.push('Ну ладно пошла я нахуй                    Deenah покинула чат ')
                cars.push('Азамат такой охуенный')
                cars.push('Рукаблуд')


                let stickers = ['https://tlgrm.ru/_/stickers/b50/063/b5006369-8faa-44d7-9f02-1ca97d82cd49/9.webp',
                'https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp' ,
                    'https://tlgrm.eu/_/stickers/325/d8b/325d8b30-558a-49ed-b6e6-cf4f01e63c11/1.webp',
                    'https://tlgrm.eu/_/stickers/325/d8b/325d8b30-558a-49ed-b6e6-cf4f01e63c11/2.webp',
                    'https://tlgrm.eu/_/stickers/325/d8b/325d8b30-558a-49ed-b6e6-cf4f01e63c11/3.webp',
                    'https://tlgrm.eu/_/stickers/325/d8b/325d8b30-558a-49ed-b6e6-cf4f01e63c11/4.webp',
                    'https://tlgrm.eu/_/stickers/325/d8b/325d8b30-558a-49ed-b6e6-cf4f01e63c11/5.webp',
                    'https://tlgrm.eu/_/stickers/325/d8b/325d8b30-558a-49ed-b6e6-cf4f01e63c11/7.webp',
                    'https://tlgrm.eu/_/stickers/325/d8b/325d8b30-558a-49ed-b6e6-cf4f01e63c11/8.webp',
                    'https://tlgrm.eu/_/stickers/325/d8b/325d8b30-558a-49ed-b6e6-cf4f01e63c11/9.webp',
                    'https://tlgrm.eu/_/stickers/325/d8b/325d8b30-558a-49ed-b6e6-cf4f01e63c11/10.webp',
                    'https://tlgrm.eu/_/stickers/325/d8b/325d8b30-558a-49ed-b6e6-cf4f01e63c11/11.webp',
                    'https://tlgrm.eu/_/stickers/325/d8b/325d8b30-558a-49ed-b6e6-cf4f01e63c11/12.webp'
                ]

                await bot.sendSticker(chatId, stickers[getRandomInt(stickers.length)] )
                return bot.sendMessage(chatId, cars[getRandomInt(cars.length)]);
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

