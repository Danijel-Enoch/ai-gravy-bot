const { Telegraf, Markup } = require("telegraf");
const { authUser } = require("./src/util/api")
const { Wallet, getGasPrice, getWalletAddress } = require("./src/util/blockchain")
const { BSC_RPC_URL, ETH_RPC_URL } = require("./src/config")
const bot = new Telegraf('5661676335:AAF1z0yuo2mr7fPr_-J2G0SI7mSc8HvQTog');




const mainMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "Buy Tokens", callback_data: "buy" }, { text: "Sell Tokens", callback_data: "sell" }],
            [{ text: "Buy limit", callback_data: "buy_limit" }, { text: "Sell Limit", callback_data: "sell_limit" }],
            [{ text: "Token Balance", callback_data: "token_balance" }, { text: "Mirror Sniper", callback_data: "mirror_sniper" }, { text: "PnL Analysis", callback_data: "pnl" }],
            [{ text: "Transfer Eth", callback_data: "transfer_eth" }, { text: "Setting", callback_data: "setting" }],
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
bot.start(async (ctx) => {
    const userId = ctx.from.id.toString();
    const userData = await authUser(userId)
    const PublicKey = [await getWalletAddress(userData.pK1), await getWalletAddress(userData.pK2), await getWalletAddress(userData.pK3)]

    //get user

    // console.log({ userData })
    //get gas
    const bscGasPrice = await getGasPrice(BSC_RPC_URL);
    const ethGasPrice = await getGasPrice(ETH_RPC_URL)
    // console.log(bscGasPrice, ethGasPrice, PublicKey)
    //get wallet Addressess
    const bscWalletsBalances = [await new Wallet(56, BSC_RPC_URL, userData.pK1, PublicKey[0]).checkEthBalance(), await new Wallet(56, BSC_RPC_URL, userData.pK2, PublicKey[1]).checkEthBalance(), await new Wallet(56, BSC_RPC_URL, userData.pK3, PublicKey[2]).checkEthBalance()]
    console.log(bscWalletsBalances)
    //get bsc and eth Balance

    const msg = `Welcome to the Father Snipe bot!\n⬩ BSC Gas: ${bscGasPrice} GWEI \n ⬩ ETH Gas: ${ethGasPrice} GWEI \nSnipe & swap at elite speeds for free.\n \n═══ Your Wallets ═══ \n ===BSC Balance=== \n Wallet 1 \n ${PublicKey[0]} \n Balance:${bscWalletsBalances[0]} \n Wallet 2 \n ${PublicKey[1]} \n Balance:${bscWalletsBalances[1]} \n Wallet 3 \n ${PublicKey[2]} \n Balance:${bscWalletsBalances[2]} \n \n =====ETH Balance==== \n Wallet 1 \n ${PublicKey[0]} \n Balance:${bscWalletsBalances[0]} \n Wallet 2 \n ${PublicKey[1]} \n Balance:${bscWalletsBalances[1]} \n Wallet 3 \n ${PublicKey[2]} \n Balance:${bscWalletsBalances[2]} `

    bot.telegram.sendMessage(ctx.chat.id, msg, mainMenu)
})
bot.help((ctx) => {
    ctx.reply("This is Support Line")

})
bot.settings((ctx) => {
    ctx.reply("Change your Sniper Wallet Settings")

})

bot.launch();