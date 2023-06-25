const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf('5661676335:AAF1z0yuo2mr7fPr_-J2G0SI7mSc8HvQTog');


const mainMenuKeyboard = {
    reply_markup: {
        keyboard: [
            ['/start', '/help'],
            ['/command1', '/command2'],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
    },
};

const mainMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "Buy Tokens", callback_data: "hello" }, { text: "Sell Tokens", callback_data: "hello" }],
            [{ text: "Buy limit", callback_data: "hello" }, { text: "Sell Limit", callback_data: "hello" }],
            [{ text: "Token Balance", callback_data: "hello" }, { text: "Mirror Sniper", callback_data: "hello" }, { text: "PnL Analysis", callback_data: "hello" }],
            [{ text: "Transfer Eth", callback_data: "hello" }, { text: "Setting", callback_data: "hello" }],
            [{ text: "Change Network to Eth", callback_data: "hello" }, { text: "Change Network to BSC", callback_data: "hello" }],

        ]
    }
}

bot.telegram.setMyCommands([
    { command: "menu", description: "Shows all wallet and dapps Options" },
    { command: "help", description: "Contact our Help Channel" },
    { command: "settings", description: "Change Wallet Settings and password" },
    { command: "balance", description: "Shows all wallet balance" },
])
bot.start((ctx) => {
    const msg = "Welcome to the Father Snipe bot!\n⬩Gas: 13 GWEI ⬩Block: 17558867 ⬩ETH: $1890\nSnipe & swap at elite speeds for free. Uniswap v2 and v3 are supported.\n \n═══ Your Wallets ═══ \n No Wallets "
    bot.telegram.sendMessage(ctx.chat.id, msg, mainMenu)
})
bot.help((ctx) => {
    ctx.reply("This is Support Line")

})
bot.settings((ctx) => {
    ctx.reply("Change your Sniper Wallet Settings")

})

bot.launch();