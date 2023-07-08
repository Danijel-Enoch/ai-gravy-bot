const { ethers } = require("ethers");
const { ABI } = require("./config")
const RouterAbi = require("./abi/Router.json")
const provider = new ethers.WebSocketProvider("wss://mainnet.infura.io/ws/v3/9e9e77871cc04dc182dac2b47f6b0b44");
const JsonRpcProvider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/9e9e77871cc04dc182dac2b47f6b0b44')
const uniswapRouterContract = new ethers.Contract("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", RouterAbi, JsonRpcProvider);

const ABIERC20 = [
    "function _decimals() view returns (uint8)",
    "function _symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
]
async function getTokenData(address) {
    const token = new ethers.Contract(address, ABIERC20, JsonRpcProvider)
    try {
        return [await token._symbol(), await token._decimals()]
    } catch (error) {
        return [await token.symbol(), await token.decimals()]
    }

}
const scanForSwapTokenPendingTxs = async () => {
    const pendingTxs = await provider.on("pending", (tx) => {
        pendingTxs.getTransaction(tx).then(async function (transaction) {

            if (transaction && transaction.to === "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D") {
                const dataSlice = ethers.dataSlice(transaction.data, 4)
                if (transaction.data.length === 522) {
                    console.log("Finding ====>")
                    const decodedTx = uniswapRouterContract.interface.parseTransaction(transaction)
                    const decoded = new ethers.AbiCoder().decode(["address", "address", "uint24", "address", "uint256", "uint256", "uint256", "uint160"], dataSlice)
                    // console.log(transaction.hash, decoded);
                    if (decodedTx.name === "addLiquidity") {
                        console.log({ args: decodedTx.args, function: decodedTx.name, value: decodedTx.value })
                        const token1Data = await getTokenData(decodedTx.args[0])
                        const token2Data = await getTokenData(decodedTx.args[1])
                        const txData = {
                            tokenA: decodedTx.args[0],
                            tokenB: decodedTx.args[1],
                            SymboltokenA: token1Data[1],
                            SymboltokenB: token2Data[1],
                            amountADesired: ethers.formatUnits(decodedTx.args[2], token1Data[2]),
                            amountBDesired: ethers.formatUnits(decodedTx.args[3], token2Data[2]),
                            amountAMin: ethers.formatUnits(decodedTx.args[4], token1Data[2]),
                            amountBMin: ethers.formatUnits(decodedTx.args[5], token2Data[2]),
                            to: decodedTx.args[6],
                            deadLine: decodedTx.args[7]
                        }
                        console.log("======================== \n")
                        console.log(txData)
                        console.log("\n======================== \n")
                        //  console.log(transaction.hash, { args: decodedTx.args, function: decodedTx.name, value: decodedTx.value })
                    }
                    if (decodedTx.name === "addLiquidityETH") {
                        console.log({ args: decodedTx.args, function: decodedTx.name, value: decodedTx.value })
                        //  console.log(transaction.hash, { args: decodedTx.args, function: decodedTx.name, value: decodedTx.value })
                    }
                    if (decodedTx.name === "swapExactETHForTokens") {
                        console.log(transaction.hash, { args: decodedTx.args, function: decodedTx.name, value: decodedTx.value })
                    }
                    if (decodedTx.name === "swapExactTokensForTokens") {
                        //zero is amout In
                        //one is amoutOut in the Args
                        const tokens = decodedTx.args[2]
                        // // console.log({ tokens })
                        const token1Data = await getTokenData(tokens[0])
                        const token2Data = await getTokenData(tokens[1])
                        console.log("========Pending Transactions ============")
                        console.log("from: " + token1Data[0])
                        console.log("amoutIn : " + ethers.formatUnits(decodedTx.args[0], token2Data[1]))
                        console.log("Out : " + token2Data[0])
                        console.log("amount Out : " + ethers.formatUnits(decodedTx.args[1], token1Data[1]))
                        console.log(transaction.hash)
                        console.log("========================================")
                        console.log({ args: decodedTx.args, function: decodedTx.name, value: decodedTx.value })
                        //getTokenData
                    }

                }

            }
        });
    });

    // for (const tx of pendingTxs) {
    //     if (tx.contractAddress === "0xD99D1c33F9fC3444f8101754aBC46c52416550D1") {
    //         console.log("Found SwapToken pending transaction:", tx.hash);
    //     }
    // }
};

scanForSwapTokenPendingTxs().catch(console.log)

//scan pancakeswap for swap
// look for buys or sells
// calculate slippage and profit
// front run buy or sell
