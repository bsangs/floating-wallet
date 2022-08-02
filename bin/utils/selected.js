function setSelectOption(userData, optionName, selectNumber) {
    userData['selected'] = {
        ...userData['selected'],
        [optionName]: selectNumber
    }
}

function getSelectedNumber(userData, name) {
    return Number(userData['selected'][name] || 1);
}

function getSelectedValue(userData, name, dataKey, valueReturn = false) {
    const selected = getSelectedNumber(userData, name);

    const keys = Object.keys(userData[dataKey]);

    const selectKey = keys[selected - 1];

    if(!valueReturn) return selectKey;

    return {
        key: selectKey,
        value: userData[dataKey][selectKey]
    };
}

function getNetwork(userData, valueReturn = false) {
    return getSelectedValue(userData, 'network', 'networks', valueReturn);
}

function getPrivateKey(userData, valueReturn = false) {
    return getSelectedValue(userData, 'privateKey', 'privateKeys', valueReturn);
}

function getContractAddress(userData, valueReturn = false) {
    return getSelectedValue(userData, 'contractAddress', 'contracts', valueReturn);
}

function getReceiveAddress(userData, valueReturn = false) {
    return getSelectedValue(userData, 'receiveAddress', 'toAddresses', valueReturn);
}

exports.getSelectedNumber = getSelectedNumber;
exports.setSelectOption = setSelectOption;
exports.getSelectedValue = getSelectedValue;
exports.getNetwork = getNetwork;
exports.getPrivateKey = getPrivateKey;
exports.getContractAddress = getContractAddress;
exports.getReceiveAddress = getReceiveAddress;
