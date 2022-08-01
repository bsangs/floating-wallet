const prompt = require("prompt-sync")({sigint: false});

function selectPrompt() {
    return Number(prompt("select option: "));
}

function selectOption(optionName, userData, limit = -1) {
    const selected = selectPrompt();
    if (limit != -1 && selected > limit) {
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
        console.log(`${optionName} is empty.`);
        return;
    }

    const data = Object.keys(optionObj).map((key) => `${key}:\n      ${JSON.stringify(optionObj[key])}`);

    printOptions(`select ${optionName}`, data, description);
}

function existKeyName(key, data) {
    return (key in Object.keys(data))
}

async function subConfig(userData, name, userDataKeyword, addCallback) {
    const keys = Object.keys(userData[userDataKeyword])

    printOptions(`select ${name} options`, [
        `set ${name}`,
        `add ${name}`,
        `remove ${name}`,
        `view ${name}s`
    ])

    switch (selectPrompt()) {
        case 1:
            if(keys.length === 0) {
                console.log(`${name} is empty data.`);
                return;
            }

            printSubOptions(name, userData[userDataKeyword], ``);
            selectOption(name, userData, keys.length);
            break;
        case 2:
            const objName = prompt(`input ${name} name: `);

            if(existKeyName(objName, userData[userDataKeyword])) {
                console.log(`this ${name} name is exists.`);
                return;
            }

            const result = await addCallback(userData);

            if(result === -1) return;

            userData[userDataKeyword][objName] = result;
            console.log("successfully add network.");
            break;
        case 3:
            if(keys.length === 0) {
                console.log(`${name} is empty data.`);
                return;
            }

            printSubOptions(name, userData[userDataKeyword], ``);

            const number = Number(prompt(`input ${name} number: `));

            if(number - 1 > keys.length && number <= 0) {
                console.log("Input number is invalid.");
                return true;
            }

            delete userData[userDataKeyword][keys[number - 1]];

            console.log(`successfully delete ${name}`);
            break;
        case 4:
            if(keys.length === 0) {
                console.log(`${name} is empty data.`);
                return;
            }

            printSubOptions(name, userData[userDataKeyword], ``);
            prompt("press enter...",{echo: ''});
            break;
    }
}

exports.selectPrompt = selectPrompt;
exports.selectOption = selectOption;
exports.printOptions = printOptions;
exports.printSubOptions = printSubOptions;
exports.existKeyName = existKeyName;
exports.subConfig = subConfig;