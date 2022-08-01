const prompt = require("prompt-sync")();

const {
    selectPrompt,
    printOptions,
    subConfig
} = require("../utils/configUtils");

const {
    isValidRPCURL,
    checksumAddress,
    checksumPrivateKey
} = require("../utils/ethersUtils");

const { saveDatas } = require("../utils/loadData");

async function networkAddCallback(userData) {
    const rpcURL = prompt("input RPC URL: ");
    if(!(await isValidRPCURL(rpcURL))) {
        console.log("Invalid RPC URL");
        return -1;
    }

    return { rpcURL };
}

async function privateKeyAddCallback(userData) {
    const privateKey = prompt("input private key: ");

    if(!(privateKey.length === 66 && privateKey.startsWith("0x")) && privateKey.length !== 64) {
        console.log("Invalid private key");
        return -1;
    }

    return { privateKey: checksumPrivateKey(privateKey) };
}

async function toAddressAddCallback(userData) {
    const address = prompt("input address: ");

    if(!(address.length === 42 && address.startsWith("0x")) && address.length !== 40) {
        console.log("Invalid address");
        return -1;
    }

    return { address: checksumAddress(address) };
}

exports.config = async(userData) => {
    while (true) {
        printOptions("select options", [
            "network settings",
            "private key settings",
            "receive address settings",
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
                await subConfig(userData, 'receive address', 'toAddresses', toAddressAddCallback);
                break;
            default:
                console.log("Exit config.");
                return;
        }

        saveDatas(userData);
    }
}
