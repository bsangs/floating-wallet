const ethers = require('ethers');
const {
    ERC20_ABI
} = require('../abi/erc20')

async function isValidRPCURL(RPC_URL) {
    try {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        return (await provider.getNetwork()).name.length > 0;
    } catch (e) {
        return false;
    }
}

function privateKeyToAddress(privateKey) {
    const wallet = new ethers.Wallet(privateKey);
    return wallet.address;
}

function checksumAddress(address) {
    return ethers.utils.getAddress(address);
}

function checksumPrivateKey(privateKey) {
    const wallet = new ethers.Wallet(privateKey);

    return wallet.privateKey;
}

async function getERC20Symbol(rpcURL, contractAddress) {
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);

    const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);

    return (await contract.functions.symbol())[0];
}

async function getERC20Decimal(rpcURL, contractAddress) {
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);

    const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);

    return (await contract.functions.decimals())[0];
}

async function getAmount(rpcURL, address, isContract = false, contractAddress = null) {
    try {
        const provider = new ethers.providers.JsonRpcProvider(rpcURL);
        let balance;
        let decimals = 18;

        if (isContract && !contractAddress) {
            const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);

            // check array
            balance = (await contract.functions.balanceOf(address))[0];
            decimals = await getERC20Decimal(rpcURL, contractAddress);
        } else {
            balance = await provider.getBalance(address);
        }

        return balance / 10 ** decimals;
    } catch (e) {
        return -1;
    }
}

async function estimateGasLimit(rpcURL, from, to, isContract = false, contractAddress = null) {
    try {
        const provider = new ethers.providers.JsonRpcProvider(rpcURL);

        return await provider.estimateGas({
            from,
            to
        })
    } catch (e) {
        return -1;
    }
}

async function transferNativeToken() {

}

async function transferERC20Token() {
    // const provider = new ethers.providers.JsonRpcProvider(rpcURL);
    //
    // const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
}

exports.isValidRPCURL = isValidRPCURL;
exports.checksumAddress = checksumAddress;
exports.checksumPrivateKey = checksumPrivateKey;
exports.getERC20Symbol = getERC20Symbol;
exports.getERC20Decimal = getERC20Decimal;
exports.getAmount = getAmount;
exports.privateKeyToAddress = privateKeyToAddress;
exports.estimateGasLimit = estimateGasLimit;
