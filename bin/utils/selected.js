function setSelectOption(userData, optionName, selectNumber) {
    userData['selected'] = {
        ...userData['selected'],
        [optionName]: selectNumber
    }
}

function getSelectedNumber(userData, name) {
    return Number(userData['selected'][name] || 1);
}

function getNetwork(userData) {
    const selected = getSelectedNumber(userData, 'network');

    const keys = Object.keys(userData['networks']);

    return keys[selected - 1];
}

exports.getNetwork = getNetwork;
exports.getSelectedNumber = getSelectedNumber;
exports.setSelectOption = setSelectOption;