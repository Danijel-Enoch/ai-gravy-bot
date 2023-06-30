const { ethers } = require("ethers")
const { BSC_RPC_URL, ETH_RPC_URL } = require("./../config")
const signer = ethers.Wallet.fromMnemonic("<Mnemonic_Phrase>").connect(provider);


async function swapETHForExactTokens(url, userAddress, Router, amountIn) {
    const path = []
    const to = (Date.now() + 1000 * 60 * 10)
    const amountsAmount = ''
    const deadline = ""
    const provider = new ethers.JsonRpcProvider(url);
    const address = Router;
    const abi = [
        "function swapETHForExactTokens(uint256 amountOut, address[] path, address to, uint256 deadline) payable returns (uint256[] amounts)"
    ];
    const contract = new ethers.Contract(address, abi, signer);
    const tx = await contract.swapETHForExactTokens(null, null, null, null, {
        'value': amountIn,
        // 'gasLimit': config.cfg.transaction.gas_limit,
        // 'gasPrice': config.cfg.transaction.gas_price
    });
    const receipt = await tx.wait();
    console.log("receipt", receipt);
}


async function swapExactTokensForETH() {
    const provider = new ethers.providers.JsonRpcProvider("<Provider_URL>");
    const signer = ethers.Wallet.fromMnemonic("<Mnemonic_Phrase>").connect(provider);
    const address = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
    const abi = [
        "function swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) returns (uint256[] amounts)"
    ];
    const contract = new ethers.Contract(address, abi, signer);
    const tx = await contract.functions.swapExactTokensForETH(amountIn, amountOutMin, [path], to, deadline);

    const receipt = await tx.wait();
    console.log("receipt", receipt);
}

// swapETHForExactTokens();
const checkGasEstiamate = async () => {

}