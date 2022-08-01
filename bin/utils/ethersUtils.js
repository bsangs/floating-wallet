const ethers = require('ethers');

async function isValidRPCURL(RPC_URL) {
    try {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        return (await provider.getNetwork()).name.length > 0;
    } catch (e) {
        return false;
    }
}

exports.isValidRPCURL = isValidRPCURL;