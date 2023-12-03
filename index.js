const TelegramBot = require('node-telegram-bot-api');
const db = require('./db')
const token = '6377948810:AAFjRsbAuyaJyUe_zp9UMbZF3uQDB_DiwQA';
const bot = new TelegramBot(token, {polling: true});

const buttonOptions={
    reply_markup: JSON.stringify({
        inline_keyboard:[
            [{text: "Командование", callback_data: '1'},{text: "Штаб", callback_data: '2'},{text: "БП", callback_data: '3'}],
            [{text: "ВиСПР", callback_data: '4'},{text: "Тыл", callback_data: '5'},{text: "служба ВП", callback_data: '6'}],
            [{text: "Юр.Служба", callback_data: '7'},{text: "Отд.кадров", callback_data: '8'},{text: "Мед.служба", callback_data: '9'}],
            [{text: "Фин.служба", callback_data: '10'},{text: "Деж.по части", callback_data: '11'},{text: "Деж.по связи", callback_data: '12'}],
            [{text: "Резерв 1", callback_data: '13'},{text: "Резерв 2", callback_data: '14'}]
        ]
    })
}
const againOptions={
    reply_markup: JSON.stringify({
        inline_keyboard:[
            [{text: "Продолжить", callback_data: 'return'}]
        ]
    })
}
const startApp = async() =>{

}
const start = () =>{
    bot.setMyCommands([
        {command: "/personal", description: "Все"}
    ])
    bot.on('message', async  (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;
          if(text==='/start'){
            const persons = await db.query("select * from person")
            persons.rows.forEach(item=>{
                return bot.sendMessage(chatId, `Фамилия : ${item.name}-${item.status}`)
            })              
          }
          if(text==='/personal'){           
            return bot.sendMessage(chatId, "Personal", buttonOptions)
          }
          if(text==='/again'){           
            return bot.sendMessage(chatId, "again", againOptions)
          }
          return bot.sendMessage(chatId, "Я не понимаю тебя")      
    });
    bot.on('callback_query', async msg=>{
      const data = msg.data
      const chatId = msg.message.chat.id
      if(data === '1'){
        // const commandPersons = await db.query("select * from person")
        const commandPersons = await db.query(`SELECT * 
                                         FROM person p 
                                         LEFT JOIN category c 
                                         ON c.id=p.category_id 
                                         WHERE c.id=1`)
        commandPersons.rows.forEach(item=>{
          return bot.sendMessage(chatId, `Фамилия : ${item.name}-${item.status}`)
        })                               
       
      }
      if(data === '2'){
        return bot.sendMessage(chatId, `Вы нажали ${data}`)
      }
      return bot.sendMessage(chatId, `Не понимаю`);

      
    })
}
start()