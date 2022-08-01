const prompt = require("prompt-sync")();

const {
    selectPrompt,
    selectOption,
    printOptions,
    printSubOptions,
    existKeyName
} = require("../utils/configUtils");

const { isValidRPCURL } = require("../utils/ethersUtils");

const { saveDatas } = require("../utils/loadData");

async function networkConfig(userData) {
    printOptions('select network options', [
        "set network",
        "add network",
        "remove network",
        "view networks"
    ])

    switch (selectPrompt()) {
        case 1:
            printSubOptions("network", userData['networks'], ``);
            selectOption('network', userData, Object.keys(userData['networks']).length);
            break;
        case 2:
            const networkName = prompt("input network name: ");

            if(existKeyName(networkName, userData['networks'])) {
                console.log("this network name is exists.");
                return;
            }

            const rpcURL = prompt("input RPC URL: ");
            if(!(await isValidRPCURL(rpcURL))) {
                console.log("Invalid RPC URL");
                return;
            }

            userData['networks'][networkName] = { rpcURL };

            console.log("successfully add network.");
            break;
        case 3:
            const keys = Object.keys(userData['networks']);

            printSubOptions("network", userData['networks'], ``);

            const number = Number(prompt("input network number: "));

            if(number - 1 > keys.length && number <= 0) {
                console.log("Input number is invalid.");
                return true;
            }

            delete userData['networks'][keys[number - 1]];

            console.log("successfully delete network");
            break;
        case 4:
            printSubOptions('network', userData['networks'], ``);
            prompt("press enter...",{echo: ''});
            break;
    }
}

function privateKeyConfig() {
    console.log("yeyeye")
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
                await networkConfig(userData);
                break;
            case 2:
                privateKeyConfig(userData);
                break;
            default:
                console.log("Exit config.");
                return;
        }

        saveDatas(userData);
    }
}
