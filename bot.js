const { Telegraf, Markup } = require("telegraf");
const { Bot, Context, session } = require("grammy");
const { Menu } = require("@grammyjs/menu");
const {
    conversations,
    createConversation,
} = require("@grammyjs/conversations");
const { buyToken, sellToken } = require("./src/util/trade")
const { authUser } = require("./src/util/api")
const { Wallet, getGasPrice, getWalletAddress } = require("./src/util/blockchain")
const { BSC_RPC_URL, ETH_RPC_URL, BSC_TESTNET, ETH_TESTNET } = require("./src/config")
const bot = new Bot('5661676335:AAF1z0yuo2mr7fPr_-J2G0SI7mSc8HvQTog');


bot.use(session({ initial: () => ({ slippage: 0, chain: "", txWallet: "" }) }));
bot.use(conversations());





async function greeting(conversation, ctx) {
    await ctx.reply("Hi there! What is your name?");
    const { message } = await conversation.wait();
    await ctx.reply(`Welcome to the chat, ${message.text}!`);
}


const slippageMenu = new Menu("slippage-menu").text("1%", ctx => ctx.session.slippage = 1).text("2%", ctx => ctx.session.slippage = 2).text("10%", ctx => ctx.session.slippage = 10).text("30%", ctx => ctx.session.slippage = 30).row()
    .text("Wallet 1", ctx => ctx.session.txWallet = "w1").text("Wallet 2", ctx => ctx.session.txWallet = "w2").text("Wallet 3", ctx => ctx.session.txWallet = "w3").row()
    .text("BSC", ctx => ctx.session.chain = "BSC").text("ETH", ctx => { ctx.session.chain = "ETH" }).row()
bot.use(slippageMenu)
async function sellConversation(conversation, ctx) {
    const userId = ctx.from.id.toString();
    const userData = await authUser(userId);
    await ctx.reply("Kindly input Sale Contract Address");
    const tokenAddressCtx = await conversation.waitFor(":text")
    await ctx.reply("Kindly input Sale Amount: (in ERC20/BEP20)");
    const amountCtx = await conversation.waitFor(":text")
    ctx.reply("Set Slippage :(1/2/10/20/30)")
    const slippageCtx = await conversation.waitFor(":text")
    ctx.reply("Set Wallet: (w1/w2/w3)")
    const walletCtx = await conversation.waitFor(":text")
    ctx.reply("Set Chain : (BSC/ETH)")
    const ChainCtx = await conversation.waitFor(":text")
    const bscGasPrice = await getGasPrice(BSC_TESTNET.rpc)
    const privateKey = () => {
        switch (walletCtx.msg.text) {
            case "w1":
                return userData.pK1
            case "w2":
                return userData.pK2
            case "w3":
                return userData.pK3
            default:
                break;
        }
    }
    const data = {
        weth: ChainCtx.msg.text === "BSC" ? BSC_TESTNET.weth : ETH_TESTNET.weth,
        tokenOut: tokenAddressCtx.msg.text,
        amount: amountCtx.msg.text,
        recipient: await getWalletAddress(privateKey()),
        router: ChainCtx.msg.text === "BSC" ? BSC_TESTNET.router : ETH_TESTNET.router,
        slippage: slippageCtx.msg.text,
        rpc: ChainCtx.msg.text === "BSC" ? BSC_TESTNET.rpc : ETH_TESTNET.rpc
    }
    ctx.reply(`This is the current gasPrice ${bscGasPrice}`)
    ctx.reply(`Selling Token`)
    await sellToken(data.weth, data.tokenOut, data.amount, data.router, data.recipient, bscGasPrice, data.slippage, data.rpc, privateKey(), ctx)

}
async function buyConversation(conversation, ctx) {
    const userId = ctx.from.id.toString();
    const userData = await authUser(userId)
    //token
    await ctx.reply("Kindly input Purchase Contract Address");
    const tokenAddressCtx = await conversation.waitFor(":text")
    //amount
    await ctx.reply("Kindly input Purchase Amount: (in BNB/ETH)");
    const amountCtx = await conversation.waitFor(":text")
    //slippage menu
    ctx.reply("Set Slippage :(1/2/10/20/30)")
    const slippageCtx = await conversation.waitFor(":text")
    ctx.reply("Set Wallet: (w1/w2/w3)")
    const walletCtx = await conversation.waitFor(":text")
    ctx.reply("Set Chain : (BSC/ETH)")
    const ChainCtx = await conversation.waitFor(":text")
    console.log(tokenAddressCtx.msg.text, amountCtx.msg.text, slippageCtx.msg.text, ChainCtx.msg.text, walletCtx.msg.text)
    //check for gasFee, gas balance
    const bscGasPrice = await getGasPrice(BSC_TESTNET.rpc)
    const privateKey = () => {
        switch (walletCtx.msg.text) {
            case "w1":
                return userData.pK1
            case "w2":
                return userData.pK2
            case "w3":
                return userData.pK3
            default:
                break;
        }
    }
    const data = {
        weth: ChainCtx.msg.text === "BSC" ? BSC_TESTNET.weth : ETH_TESTNET.weth,
        tokenOut: tokenAddressCtx.msg.text,
        amount: amountCtx.msg.text,
        recipient: await getWalletAddress(privateKey()),
        router: ChainCtx.msg.text === "BSC" ? BSC_TESTNET.router : ETH_TESTNET.router,
        slippage: slippageCtx.msg.text,
        rpc: ChainCtx.msg.text === "BSC" ? BSC_TESTNET.rpc : ETH_TESTNET.rpc
    }
    ctx.reply(`This is the current gasPrice ${bscGasPrice}`)
    ctx.reply(`Buying Token`)
    await buyToken(data.weth, data.tokenOut, data.amount, data.router, data.recipient, bscGasPrice, data.slippage, data.rpc, privateKey(), ctx)
    //execute tx nd return reciept
}
const menu = new Menu("my-menu-identifier")
    .text("Buy", async (ctx) => await ctx.conversation.enter("buyConversation"))
    .text("Sell", async (ctx) => await ctx.conversation.enter("sellConversation")).row()
    .text("withdraw ETH/BNB", (ctx) => ctx.reply("Right!")).row()
    .text("Withdraw ERC20 tokens", async (ctx) => await ctx.conversation.enter("greeting"));

bot.use(createConversation(greeting));
bot.use(createConversation(buyConversation));
bot.use(createConversation(sellConversation));
bot.use(menu);


bot.api.setMyCommands([
    { command: "menu", description: "Shows all wallet and dapps Options" },
    { command: "help", description: "Contact our Help Channel" },
    { command: "settings", description: "Change Wallet Settings and password" },
    { command: "balance", description: "Shows all wallet balance" },
])
bot.command("start", async (ctx) => {
    const userId = ctx.from.id.toString();
    const userData = await authUser(userId)
    const PublicKey = [await getWalletAddress(userData.pK1), await getWalletAddress(userData.pK2), await getWalletAddress(userData.pK3)]

    //get user

    // console.log({ userData })
    //get gas
    const bscGasPrice = await getGasPrice(BSC_TESTNET.rpc);
    const ethGasPrice = await getGasPrice(ETH_RPC_URL)
    // console.log(bscGasPrice, ethGasPrice, PublicKey)
    //get wallet Addressess
    const bscWalletsBalances = [await new Wallet(97, BSC_TESTNET.rpc, userData.pK1, PublicKey[0]).checkEthBalance(), await new Wallet(97, BSC_TESTNET.rpc, userData.pK2, PublicKey[1]).checkEthBalance(), await new Wallet(97, BSC_TESTNET.rpc, userData.pK3, PublicKey[2]).checkEthBalance()]
    console.log(bscWalletsBalances)
    //get bsc and eth Balance

    const msg = `🤑🤑Welcome to the Omini🤖 Snipe bot!🤑🤑\n⬩ BSC Gas🛅: ${bscGasPrice} GWEI \n ⬩ ETH Gas🛅: ${ethGasPrice} GWEI \nSnipe & swap at elite speeds for free.\n \n═══ Your Wallets ═══ \n ===BSC Balance=== \n Wallet 1 \n ${PublicKey[0]} \n Balance:${bscWalletsBalances[0]} \n Wallet 2 \n ${PublicKey[1]} \n Balance:${bscWalletsBalances[1]} \n Wallet 3 \n ${PublicKey[2]} \n Balance:${bscWalletsBalances[2]} \n \n =====ETH Balance==== \n Wallet 1 \n ${PublicKey[0]} \n Balance:${bscWalletsBalances[0]} \n Wallet 2 \n ${PublicKey[1]} \n Balance:${bscWalletsBalances[1]} \n Wallet 3 \n ${PublicKey[2]} \n Balance:${bscWalletsBalances[2]} `

    ctx.reply(msg, { reply_markup: menu })
})

bot.catch(errorHandler);

function boundaryHandler(err, next) {
    console.error("Error in B!", err);
}

function errorHandler(err) {
    console.error("Error in C!", err);
}








bot.start();


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));