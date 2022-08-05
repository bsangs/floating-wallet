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

function toBN(num) {
    return ethers.BigNumber.from(`${num}`);
}

function getWallet(rpcURL, privateKey) {
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);

    return new ethers.Wallet(privateKey, provider);
}

function privateKeyToAddress(privateKey) {
    const wallet = new ethers.Wallet(privateKey);
    return wallet.address;
}

function checksumAddress(address) {
    try {
        return ethers.utils.getAddress(address);
    } catch (e) {
        return null;
    }
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

        if (isContract && contractAddress) {
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

async function estimateGasLimit(rpcURL, from, to, amount, privateKey, isContract = false, contractAddress = null) {
    amount = `${amount}`;
    try {
        const provider = new ethers.providers.JsonRpcProvider(rpcURL);
        const wallet = new ethers.Wallet(privateKey, provider);

        if(isContract && contractAddress) {
            const contract = new ethers.Contract(contractAddress, ERC20_ABI, wallet);
            return (await contract.estimateGas.transfer(to, amount)).toNumber();
        }
        return (await wallet.estimateGas({
            from,
            to
        })).toNumber()
    } catch (e) {
        console.error(e);
        return -1;
    }
}

async function getGasPrice(rpcURL) {
    try {
        const provider = new ethers.providers.JsonRpcProvider(rpcURL);

        return (await provider.getGasPrice()).toNumber();
    } catch (e) {
        return -1;
    }
}

function weiToUnit(wei, unit) {
    return Number(ethers.utils.formatUnits(wei, unit));
}

function weiToEther(wei) {
    return Number(ethers.utils.formatEther(wei));
}

async function transferNativeToken(wallet, to, weiAmount, gasPrice, gasLimit) {
    try {
        return await wallet.sendTransaction({
            to,
            value: weiAmount,
            gasPrice,
            gasLimit
        });
    } catch (e) {
        return e;
    }
}

async function transferERC20Token(wallet, contractAddress, to, weiAmount, gasPrice, gasLimit) {
    try {
        const contract = new ethers.Contract(contractAddress, ERC20_ABI, wallet);

        return await contract.functions.transfer(to, weiAmount);
    } catch (e) {
        return e;
    }
}

exports.isValidRPCURL = isValidRPCURL;
exports.checksumAddress = checksumAddress;
exports.checksumPrivateKey = checksumPrivateKey;
exports.getERC20Symbol = getERC20Symbol;
exports.getERC20Decimal = getERC20Decimal;
exports.getAmount = getAmount;
exports.getWallet = getWallet;
exports.privateKeyToAddress = privateKeyToAddress;
exports.estimateGasLimit = estimateGasLimit;
exports.getGasPrice = getGasPrice;
exports.weiToUnit = weiToUnit;
exports.weiToEther = weiToEther;
exports.transferNativeToken = transferNativeToken;
exports.transferERC20Token = transferERC20Token;
exports.toBN = toBN;
