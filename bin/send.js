const process = require('process');

const {
    privateKeyToAddress,
    getAmount
} = require('./utils/ethersUtils');

const {
    getNetwork,
    getPrivateKey,
    getReceiveAddress,
    getContractAddress,
} = require('./utils/selected');


async function validationData(userData, amount, isContract = false) {

    const network = getNetwork(userData, true);
    let privateKey = getPrivateKey(userData, true).value;
    let receiveAddress = getReceiveAddress(userData, true).value;
    let contractAddress = getContractAddress(userData, true).value;
    const address = privateKeyToAddress(privateKey);

    if (!network.value || !privateKey || !receiveAddress || !contractAddress) {
        if (!network.value) console.log("Check select network please.");
        if (!privateKey) console.log("Check select private key please.");
        if (!receiveAddress) console.log("Check select receive address please.");
        if (!contractAddress) console.log("Check select contract address please.");
        process.exit(0);
    }

    privateKey = privateKey.privateKey;
    receiveAddress = receiveAddress.address;
    contractAddress = contractAddress.contract

    const currentBalance = await getAmount(network.value.rpcURL, address, isContract, contractAddress);

    if (currentBalance === -1) {
        if (!network.value) console.log("Check select network RPC URL please.");
        process.exit(0);
    }



    if (currentBalance < amount) {
        console.log(`Check select wallet balance, wallet balance: ${currentBalance}`);
        process.exit(0)
    }

    console.log("ttttt", address, contractAddress, currentBalance);
}

async function send(userData, argv) {
    await validationData(userData, argv[0], !(!argv[1]))
}

exports.send = send;