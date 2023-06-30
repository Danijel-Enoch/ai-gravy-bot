//send token
//buy token from uniswap
//buy token  from pancakeswap
const { ethers } = require("ethers");
function GenerateWallet() {
    const mnemonic = ethers.Wallet.createRandom().privateKey;
    return mnemonic;
}



async function getWalletAddress(privateKey) {
    const PubKey = new ethers.Wallet(privateKey).address
    return PubKey
}

async function getGasPrice(rpcUrl) {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const gasPrice = (await provider.getFeeData()).gasPrice;
    //  console.log("Current gas price:", gasPrice.toString());
    return gasPrice.toString()

}
class Wallet {
    chainId
    provider
    privateKey
    walletAddress
    tokenABI = [
        // Standard ERC-20 functions
        "function balanceOf(address account) view returns (uint256)",
        "function transfer(address recipient, uint256 amount) returns (bool)",
        "function decimals() view returns (uint8)"
    ];
    walletInstance

    constructor(
        chainId,
        chainRPC,
        privateKey,
        walletAddress
    ) {
        this.chainId = chainId;
        this.provider = new ethers.JsonRpcProvider(chainRPC);
        this.privateKey = privateKey;
        this.walletAddress = walletAddress;
        this.walletInstance = new ethers.Wallet(this.privateKey, this.provider);
    }

    async checkEthBalance() {
        const balance = await this.provider.getBalance(this.walletAddress);

        // Convert the balance to Ether
        const etherBalance = ethers.formatEther(balance);

        return etherBalance;
    }
    async checkErc20Balance(contractAddress) {
        // Create a new instance of the ERC-20 token contract
        const tokenContract = new ethers.Contract(
            contractAddress,
            this.tokenABI,
            this.provider
        );

        // Call the balanceOf function on the token contract to get the balance
        const balance = await tokenContract.balanceOf(this.walletAddress);
        return balance;
    }
    async sendEth(to, amount) {
        const recipientAddress = to;
        const amountToSend = ethers.parseEther(amount);
        const transaction = {
            to: recipientAddress,
            value: amountToSend,
        };
        const response = await this.walletInstance.sendTransaction(transaction);
        return response;
    }


    async sendErc20Token(to, amount, tokenAdd) {
        const tokenContract = new ethers.Contract(
            tokenAdd,
            this.tokenABI,
            this.walletInstance
        );
        const decimal = await tokenContract.decimals()
        const tx = await tokenContract.transfer(to, ethers.parseEther(amount));
        return await tx.wait();

    }
}

module.exports = {
    Wallet,
    getGasPrice,
    GenerateWallet,
    getWalletAddress
}