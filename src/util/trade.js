const { ethers } = require('ethers');
async function buyToken(BNB, to_PURCHASE, AMOUNT_OF_BNB, routerAddress, recipient, gasPrice, Slippage, rpc, pK, ctx) {
    const tokenIn = BNB;
    const tokenOut = to_PURCHASE;
    let provider = new ethers.JsonRpcProvider(rpc);
    const account = new ethers.Wallet(pK).connect(provider)
    const router = new ethers.Contract(
        routerAddress,
        [
            'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
            'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
            'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
            'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external  payable returns (uint[] memory amounts)',
            'function swapExactETHForTokens( uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
        ],
        account
    );
    try {

        //We buy x amount of the new token for our bnb
        const amountIn = ethers.parseUnits(`${AMOUNT_OF_BNB}`, 'ether');
        let amountOutMin = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
        // if (parseInt(Slippage) !== 0) {
        //     
        //     //Our execution price will be a bit different, we need some flexibility
        //     amountOutMin = amounts[1] - (amounts[1] / (`${Slippage}`))
        // }
        const tx = await router.swapExactETHForTokens( //uncomment here if you want to buy token
            amountOutMin[1],
            [tokenIn, tokenOut],
            recipient,
            Date.now() + 1000 * 60 * 5, //5 minutes
            {
                //'gasLimit': 1671500610,
                //'gasPrice': 1671500610,
                'nonce': null, //set you want buy at where position in blocks
                'value': amountIn
            });

        const receipt = await tx.wait();
        ctx.reply(`Transaction receipt : https://www.bscscan.com/tx/${receipt.logs[1].transactionHash}`)
        //  console.log(`Transaction receipt : https://www.bscscan.com/tx/${receipt.logs[1].transactionHash}`);
    } catch (err) {

        // console.log(BNB, to_PURCHASE, AMOUNT_OF_BNB, routerAddress, recipient, gasPrice, Slippage, rpc, pK,)
        console.log(err)
        let error = JSON.parse(JSON.stringify(err));
        console.log(`Error caused by : 
        {
        reason : ${error.reason},
        transactionHash : ${error.transactionHash}
        message : ${error}
        }`);
        ctx.reply(`Error caused by : 
        {
        reason : ${error.reason},
        transactionHash : ${error.transactionHash}
        message : ${error}
        }`)
        console.log(error);
    }

}
async function approve(operator, approverPk, rpc, tokenAddress, ctx,) {
    try {
        const abi = [
            "function approve(address spender, uint256 amount) returns (bool)"
        ];
        let provider = new ethers.JsonRpcProvider(rpc);
        const account = new ethers.Wallet(approverPk).connect(provider)
        const contract = new ethers.Contract(tokenAddress, abi, account);
        const tx = await contract.approve(operator, "100000000000000000000000");
        const receipt = await tx.wait();
        ctx.reply("Router Contract Approved")
    } catch (error) {
        ctx.reply(" Error while Appoving Router Contract")
    }
}
async function sellToken(BNB, from_PURCHASE, AMOUNT_OF_BNB, routerAddress, recipient, gasPrice, Slippage, rpc, pK, ctx) {
    const tokenIn = from_PURCHASE;
    const tokenOut = BNB;
    let provider = new ethers.JsonRpcProvider(rpc);
    const account = new ethers.Wallet(pK).connect(provider)
    const router = new ethers.Contract(
        routerAddress,
        [
            'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
            'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
            'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
            'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external  payable returns (uint[] memory amounts)',
            'function swapExactETHForTokens( uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
            "function swapTokensForExactETH(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) returns (uint256[] amounts)"
        ],
        account
    );
    try {
        await approve(routerAddress, pK, rpc, from_PURCHASE, ctx)
        const amountInMax = ethers.parseUnits(AMOUNT_OF_BNB.toString(), 18);
        let amountOut = await router.getAmountsOut(amountInMax, [tokenIn, tokenOut]);

        //We buy x amount of the new token for our bnb


        const tx = await router.swapTokensForExactETH( //uncomment here if you want to buy token
            amountOut[1],
            amountInMax,
            [tokenIn, tokenOut],
            recipient,
            Date.now() + 1000 * 60 * 5, //5 minutes
            {
                //'gasLimit': 1671500610,
                //'gasPrice': 1671500610,
                // 'nonce': null, //set you want buy at where position in blocks
                // 'value': amountIn
            });

        const receipt = await tx.wait();
        ctx.reply(`Transaction receipt : https://www.bscscan.com/tx/${receipt.logs[1].transactionHash}`)
        //console.log(`Transaction receipt : https://www.bscscan.com/tx/${receipt.logs[1].transactionHash}`);
    } catch (err) {

        // console.log(BNB, to_PURCHASE, AMOUNT_OF_BNB, routerAddress, recipient, gasPrice, Slippage, rpc, pK,)
        console.log(err)
        let error = JSON.parse(JSON.stringify(err));
        console.log(`Error caused by : 
        {
        reason : ${error.reason},
        transactionHash : ${error.transactionHash}
        message : ${error}
        }`);
        ctx.reply(`Error caused by : 
        {
        reason : ${error.reason},
        transactionHash : ${error.transactionHash}
        message : ${error}
        }`)
        console.log(error);
    }

}


module.exports = { buyToken, sellToken }







