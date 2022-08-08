const {
    yesOrNo,
    Logger
} = require('../utils/consoleUtils');

const {
    checksumAddress,
    getERC20Symbol
} = require('../utils/ethersUtils');

const {
    validationData
} = require('./validation');

const {
    sendERC20Token,
    sendNativeToken
} = require('./send');

const {
    saveDatas
} = require('../utils/loadData')

async function send(userData, argv) {
    const contractOptionIndex = argv.indexOf('-c');
    const isContract = contractOptionIndex >= 0;
    const isSkipConfirm = argv.indexOf('-y') >= 0;
    const isFaster = argv.indexOf('-f') >= 0;
    const isDebug = argv.indexOf('-d') >= 0;
    let amount = -1;
    let toAddress;
    let contractAddress;
    let transactionResult;

    const log = new Logger(isDebug);

    if (isContract && argv.length > contractOptionIndex + 1) {
        const cAddress = checksumAddress(argv[contractOptionIndex + 1]);

        if (cAddress) contractAddress = cAddress;
    }

    for (let i = 0; i < argv.length; i++) {
        const cAddress = checksumAddress(argv[i]);
        if (!isNaN(argv[i]) && amount === -1) {
            amount = Number(argv[i]);
        }

        if (cAddress && cAddress !== contractAddress && !toAddress) {
            toAddress = cAddress;
        }
    }

    if (contractAddress && !toAddress) {
        toAddress = contractAddress;
        contractAddress = null;
    }

    log.log("Validating transaction...");

    const validData = await validationData(
        userData,
        amount,
        isContract,
        contractAddress,
        toAddress,
        isFaster
    );

    if (!isSkipConfirm) {
        const printData = { ...validData };
        delete printData['privateKey'];

        console.log(printData);
        yesOrNo(true);
    }

    log.log("Sending transaction...");

    if (isContract) {
        transactionResult = await sendERC20Token(validData);
    } else {
        transactionResult = await sendNativeToken(validData);
    }



    if (transactionResult !== -1) {
        const transactionHash = transactionResult.hash;

        console.log(`transactionHash(TXID): ${transactionHash}`);

        let symbol;
        try {
            symbol = await getERC20Symbol(validData.rpcURL, validData.contractAddress);
        } catch (e) {
            symbol = validData.network.key;
        }

        const history = {
            hash: transactionResult.hash,
            from: transactionResult.from,
            to: transactionResult.to,
            network: validData.network.key,
            amount: amount,
            contractAddress: validData.contractAddress,
            symbol: symbol
        }
        userData.histories[history.hash] = history;

        saveDatas(userData);
    } else {
        console.log("Error")
    }
}

exports.send = send;
