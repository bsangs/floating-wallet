const prompt = require("prompt-sync")({sigint: false});

function selectPrompt() {
    return Number(prompt("select option: "));
}

function selectOption(optionName, userData, limit = 0) {
    const selected = selectPrompt();
    if (limit != 0 && selected > limit) {
        console.log("Input number is invalid.");
        return;
    }

    userData['selected'] = {
        ...userData['selected'],
        [optionName]: selected
    }

    console.log("successfully!");
}

function printOptions(title, options, description = undefined) {
    // console.clear();
    console.log('');

    if(typeof title === "string" && title.length > 0) console.log(`[${title}]`);

    if(typeof description === "string" && description.length > 0) console.log(description);

    options.forEach((option, i) => {
        console.log(`  ${i + 1}. ${option}`)
    })
    console.log('');
}

function printSubOptions(optionName, optionObj, description = undefined) {
    if(Object.keys(optionObj).length == 0) {
        console.log(`${optionName} not saved.`);
        return;
    }

    const data = Object.keys(optionObj).map((key) => `${key}:\n      ${JSON.stringify(optionObj[key])}`);

    printOptions(`select ${optionName}`, data, description);
}

function existKeyName(key, data) {
    return (key in Object.keys(data))
}

exports.selectPrompt = selectPrompt;
exports.selectOption = selectOption;
exports.printOptions = printOptions;
exports.printSubOptions = printSubOptions;
exports.existKeyName = existKeyName;