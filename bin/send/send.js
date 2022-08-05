const {
    getWallet,
    transferNativeToken,
    transferERC20Token
} = require('../utils/ethersUtils');

async function sendNativeToken(validationData) {
    const wallet = getWallet(validationData.rpcURL, validationData.privateKey);

    return await transferNativeToken(
        wallet,
        validationData.to,
        validationData.amount,
        validationData.gasPrice,
        validationData.gasLimit
    );
}

async function sendERC20Token(validationData) {
    const wallet = getWallet(validationData.rpcURL, validationData.privateKey);

    return await transferERC20Token(wallet, validationData.contractAddress, validationData.to, validationData.amount);
}

exports.sendNativeToken = sendNativeToken;
exports.sendERC20Token = sendERC20Token;
