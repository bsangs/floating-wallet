const ethers = require('ethers');

async function isValidRPCURL(RPC_URL) {
    try {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        return (await provider.getNetwork()).name.length > 0;
    } catch (e) {
        return false;
    }

    ethers.ethers.Wallet.createRandom()
}

function checksumAddress(address) {
    return ethers.utils.getAddress(address);
}

function checksumPrivateKey(privateKey) {
    const wallet = new ethers.Wallet(privateKey);

    return wallet.privateKey;
}

exports.isValidRPCURL = isValidRPCURL;
exports.checksumAddress = checksumAddress;
exports.checksumPrivateKey = checksumPrivateKey;