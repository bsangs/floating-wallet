const process = require('process');
const prompt = require("prompt-sync")();

const { pressEnter } = require('../utils/configUtils');
const { getNetwork } = require('../utils/selected');

function nextPagePrompt(currentPage) {
    return Number(prompt(`input page (exit: 0 or ^C, default ${currentPage + 1}): `, {value: currentPage + 1}));
}

function printHistories(userData, defaultPage=1) {
    const histories = userData['histories'];
    const historyKeys = Object.keys(histories);
    const network = getNetwork(userData);
    const rows = process.stdout.rows;
    let page = defaultPage;

    if (typeof network === "undefined") {
        console.log("network is not selected!");
        pressEnter();
        return;
    }

    const networkFilteredIndex = [];

    for (let i = 0; i < historyKeys.length; i++) {
        const value = histories[historyKeys[i]];

        if (value['network'] === network) networkFilteredIndex.push(i);
    }

    do {
        const rowSize = (rows - 2);
        const objSize = (rowSize / 2).toFixed(0) - (rowSize % 2);
        let blankSize = (rowSize % 2);

        console.log(`[view ${network} network histories page ${page}]`);

        for (let i = (page - 1) * objSize; i < page * objSize; i++) {
            if (i >= networkFilteredIndex.length) {
                if (i === (page - 1) * objSize) {
                    console.log("More histories not found.");
                    blankSize -= 1;
                }
                blankSize += ((page * objSize) - i) * 2;
                break;
            }
            const idx = networkFilteredIndex[i];
            const value = histories[historyKeys[idx]];

            console.log(`  send ${value['amount']} ${value['symbol']}  to ${value['to'].slice(0, 10)}...`);
            console.log(`    - ${historyKeys[idx]}`);
        }

        for (let j = 0; j < blankSize; j++) console.log('');
    } while (page = nextPagePrompt(page));
}

exports.printHistories = printHistories;