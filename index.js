const TelegramBotApi = require('node-telegram-bot-api')
const token = '5333445333:AAGb4L0Bwdbfk0Rgcpst877e9mheCx-o2aU'
const bot = new TelegramBotApi(token, { polling: true })
const users = require('./data/base/users.json')
const { setInterval } = require('timers')

const adminChat = 5015947677

function prettify(number) {
    return String(number).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, "$1 ").replace(/\s/g, '.')
}

setInterval(() => {
    require('fs').writeFileSync('./data/base/users.json', JSON.stringify(users, null, '\t'))
}, 9000)


bot.on('message', msg => {
    var user = users.filter(x => x.id === msg.from.id)[0]
    if (!user) {
        users.push({
            id: msg.from.id,
            nick: msg.from.username,
            chat: msg.chat.id,
            adminText: null,
            adminImg: null,


        })
        user = users.filter(x => x.id === msg.from.id)[0]
    }
})


const adminComand = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '📩 Отправить всем пользователям оффер', callback_data: `adminComand1` }],
        ]
    })
}

const nextComand = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Продолжить ⬇️ ', callback_data: `nextComand1` }],
        ]
    })
}

const reducerComand = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Отправить', callback_data: `reducerComand1` }],
            [{ text: 'Добавить картинку', callback_data: `reducerComand2` },
             { text: 'Изиминить', callback_data: `reducerComand3` }],

        ]
    })
}


bot.setMyCommands([
    { command: 'start', description: 'Начать' }
])



bot.onText(/admin/, msg => {
    const chatId = msg.chat.id
    var user = users.filter(x => x.id === msg.from.id)[0]

    if (user.id === adminChat) {
        bot.sendMessage(adminChat,
            `📢 Здравствуйте ${user.nick}, вас приветствует \n панель администратора, выберете функцию`, adminComand)
    } else {
        bot.sendMessage(chatId, "Вы не являетесь администратором")
    }




})

bot.on('callback_query', msg => {

    const data = msg.data
    const chatId = msg.message.chat.id
    var user = users.filter(x => x.id === msg.from.id)[0]

    if (data === "adminComand1") {
        
        if (user.id === adminChat) {
            bot.sendMessage(adminChat, "Соблюдайте инструкцию что бы сделать рассылку 💨", nextComand)

        } else {
            bot.sendMessage(chatId, "Вы не являетесь администратором")
        }
    }
    

    if (data === "nextComand1") {
        if (user.id === adminChat) {
            bot.sendMessage(adminChat, "Для отправки текста напишите текст: ВАШ ТЕКСТ")

        } else {
            bot.sendMessage(chatId, "Вы не являетесь администратором")
        }
    }

})
bot.onText(/текст:/, msg=>{

    const chatId = msg.chat.id
    const text = msg.text.replace('текст:',"")
    var user = users.filter(x => x.id === msg.from.id)[0]

    if (user.id === adminChat) {
        bot.sendMessage(adminChat, "Текст был сохранен,", reducerComand)
        user.adminText = text

    } else {
        bot.sendMessage(chatId, "Вы не являетесь администратором")
    }
    
})
bot.onText(/картинка:/, msg=>{

    const chatId = msg.chat.id
    const text = msg.text.replace('картинка:',"")
    var user = users.filter(x => x.id === msg.from.id)[0]

    if (user.id === adminChat) {
        bot.sendMessage(adminChat, "Картинка был сохранена,", reducerComand)
        user.adminImg = text

    } else {
        bot.sendMessage(chatId, "Вы не являетесь администратором")
    }
    
})
bot.on('callback_query', msg => {

    const data = msg.data
    const chatId = msg.message.chat.id
    var user = users.filter(x => x.id === msg.from.id)[0]

    if (data === "reducerComand1") {
        
        if (user.id === adminChat) {
            bot.sendMessage(adminChat, "Успех! Всем пользователям были отправлена ваша информация.")
                users.forEach(function(item, i, arr) {
                    bot.sendPhoto(item.id, user.adminImg, { caption: user.adminText }); 

                });


        } else {
            bot.sendMessage(chatId, "Вы не являетесь администратором")
        }
    }

    if (data === "reducerComand2") {
        
        if (user.id === adminChat) {
            bot.sendMessage(adminChat, "Для отправки картинки вместе с текстом напишите картинка: СЫЛКА НА ВАШУ КАРТИНКУ")


        } else {
            bot.sendMessage(chatId, "Вы не являетесь администратором")
        }
    }

    if (data === "reducerComand3") {
        
        if (user.id === adminChat) {
            bot.sendMessage(adminChat, "Для изминения текста или картинки, вы должны просто заново переотправить команду которую вам продиктовал бот - для изминнения текст эта текст: ваш текст.")


        } else {
            bot.sendMessage(chatId, "Вы не являетесь администратором")
        }
    }
    

})

