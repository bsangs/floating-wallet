const process = require('process');
const {Logger} = require('../utils/consoleUtils');
const {getContractAddress, getNetwork, getPrivateKey, getReceiveAddress} = require("../utils/selected");
const {
    estimateGasLimit,
    getAmount,
    getERC20Decimal,
    getGasPrice,
    privateKeyToAddress,
    weiToEther,
    toBN
} = require("../utils/ethersUtils");

async function validationData(userData, amount, isContract = false, contractAddr = null, toAddress = null, isFaster = false) {
    if (typeof amount !== 'number' || amount === -1) {
        console.log("Please input sending amount.");
        process.exit(0);
    }

    const log = Logger.ins;

    log.process("Get selected options");

    const gasRate = (isFaster) ? 1.2 : 1;
    const network = getNetwork(userData, true);
    let privateKey = getPrivateKey(userData, true).value;
    let receiveAddress = toAddress || getReceiveAddress(userData, true).value;
    let contractAddress = contractAddr || getContractAddress(userData, true).value;
    const address = privateKeyToAddress(privateKey);
    let decimals = 18;

    if (!network.value || !privateKey || !receiveAddress || !contractAddress) {
        if (!network.value) console.log("Check select network please.");
        if (!privateKey) console.log("Check select private key please.");
        if (!receiveAddress) console.log("Check select receive address please.");
        if (!contractAddress) console.log("Check select contract address please.");
        process.exit(0);
    }

    privateKey = privateKey.privateKey;
    receiveAddress = toAddress || receiveAddress.address;
    contractAddress = contractAddr || contractAddress.contract

    const rpcURL = network.value.rpcURL;

    log.done();

    log.process("Get address in balance");

    const currentBalance = await getAmount(rpcURL, address, isContract, contractAddress);

    log.done();

    log.process("Check RPC node URL");

    if (isContract && contractAddress) {
        decimals = await getERC20Decimal(rpcURL, contractAddress);
    }

    const weiAmount = `${amount * (10 ** decimals)}`;

    if (currentBalance === -1) {
        if (!network.value) console.log("Check select network RPC URL please.");
        process.exit(0);
    }

    log.done();

    log.process("Check enough balance");

    if (currentBalance < amount) {
        console.log(`selected wallet has insufficient${isContract ? ' token' : ''} balance.\nwallet balance: ${currentBalance}`);
        process.exit(0)
    }

    log.done();

    log.process("Get gas price and limit");

    const gasPrice = (await getGasPrice(rpcURL) * gasRate).toFixed(0);
    const gasLimit = await estimateGasLimit(
        rpcURL,
        address,
        receiveAddress,
        weiAmount,
        privateKey,
        isContract,
        (isContract) ? contractAddress : null
    );

    const gas = weiToEther(gasPrice * gasLimit);

    log.done();

    log.process("Check enough gas fee");

    if (isContract) {
        const nativeBalance = await getAmount(rpcURL, address);

        if (nativeBalance < gas) {
            console.log(`selected wallet has insufficient balance of gas, wallet balance: ${nativeBalance}`);
            process.exit(0);
        }
    } else if (currentBalance < (amount + gas)) {
        console.log(`selected wallet has insufficient balance.\nwallet balance: ${currentBalance}\ncalculate required amount: ${amount + gas}`);
        process.exit(0);
    }

    log.done();

    return {
        from: address,
        to: receiveAddress,
        amount: toBN(weiAmount),
        privateKey: privateKey,
        rpcURL: rpcURL,
        gasPrice: toBN(gasPrice),
        gasLimit: toBN(gasLimit),
        contractAddress: (isContract) ? contractAddress : null,
        network: network
    }
}

exports.validationData = validationData;
