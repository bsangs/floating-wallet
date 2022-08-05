const sleep = (ms) => new Promise(resolve=>setTimeout(resolve,ms));

function makeRandomString(length = 64) {
    let result = '';

    while (result.length < length) result += Math.random().toString(36).substring(2, 12);

    return result.substring(0, length);
}

exports.sleep = sleep;
exports.makeRandomString = makeRandomString;
