const prompt = require("prompt-sync")();

const {
    printOptions,
    subConfig
} = require("../utils/configUtils");

const {
    selectPrompt,
    pressEnter
} = require("../utils/consoleUtils")

const {
    isValidRPCURL,
    checksumAddress,
    checksumPrivateKey,
    getERC20Symbol,
    getERC20Decimal,
    privateKeyToAddress
} = require("../utils/ethersUtils");

const {
    getNetwork
} = require("../utils/selected");

const {
    printHistories
} = require("./histories");

const { saveDatas } = require("../utils/loadData");

async function networkAddCallback(userData) {
    const rpcURL = prompt("input RPC URL: ");
    if(!(await isValidRPCURL(rpcURL))) {
        console.log("Invalid RPC URL");
        pressEnter();
        return -1;
    }

    return { rpcURL };
}

async function privateKeyAddCallback(userData) {
    const privateKey = prompt("input private key: ");

    if(!(privateKey.length === 66 && privateKey.startsWith("0x")) && privateKey.length !== 64) {
        console.log("Invalid private key");
        pressEnter();
        return -1;
    }

    const checksumResult = checksumPrivateKey(privateKey);

    return {
        address: privateKeyToAddress(checksumResult),
        privateKey: checksumResult
    };
}

async function toAddressAddCallback(userData) {
    const address = prompt("input address: ");

    if(!(address.length === 42 && address.startsWith("0x")) && address.length !== 40) {
        console.log("Invalid address");
        pressEnter();
        return -1;
    }

    return { address: checksumAddress(address) };
}

async function contractAddCallback(userData) {
    const network = getNetwork(userData);

    if (typeof network === "undefined") {
        console.log("network is not selected!");
        pressEnter();
        return -1;
    }

    const addressObj = await toAddressAddCallback(userData);
    if (addressObj === -1) return -1;

    const RPC_URL = userData['networks'][network]['rpcURL'];

    const contractAddress = addressObj.address;
    const symbol = await getERC20Symbol(RPC_URL, contractAddress);
    const decimals = await getERC20Decimal(RPC_URL, contractAddress);

    if (
        typeof symbol === "undefined" ||
        typeof decimals === "undefined"
    ) {
        console.log("Check your network in RPC URL.");
        pressEnter();
        return -1;
    }

    return {
        symbol,
        contract: contractAddress,
        decimals,
        network
    };
}

exports.config = async(userData) => {
    while (true) {
        printOptions("select options", [
            "network settings",
            "private key settings",
            "receive address settings",
            "ERC20 contracts settings",
            "view transaction histories",
            "exit config (or ^C)"
        ])

        switch (selectPrompt()) {
            case 1:
                await subConfig(userData, 'network', 'networks', networkAddCallback);
                break;
            case 2:
                await subConfig(userData, 'privateKey', 'privateKeys', privateKeyAddCallback);
                break;
            case 3:
                await subConfig(userData, 'receiveAddress', 'toAddresses', toAddressAddCallback);
                break;
            case 4:
                await subConfig(userData, 'contractAddress', 'contracts', contractAddCallback);
                break;
            case 5:
                printHistories(userData)
                break;
            default:
                console.log("Exit config.");
                return;
        }

        saveDatas(userData);
    }
}
