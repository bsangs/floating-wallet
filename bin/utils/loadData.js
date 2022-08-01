const { file_dir } = require("../settings");
const fs = require("fs");

const privateKeyFile = `${file_dir}/private-keys.json`;
const networksFile = `${file_dir}/networks.json`;
const addressesFile = `${file_dir}/to-addresses.json`;
const historiesFile = `${file_dir}/histories.json`;
const selectedFile = `${file_dir}/selected-options.json`;

function prepareFileIO(filename) {
  // if file not exists, make file
  if (!fs.existsSync(filename)) {
    try {
      fs.mkdirSync(file_dir);
    } catch (e) {}
    fs.closeSync(fs.openSync(filename, "w"));
  }
}

function loadJsonFile(filename) {
  prepareFileIO(filename);

  const rawData = fs.readFileSync(filename, "utf8");

  if (rawData.length == 0) return {};

  const jsonData = JSON.parse(rawData);

  return jsonData;
}

function saveJsonFile(filename, jsonData) {
  prepareFileIO(filename);

  fs.writeFileSync(filename, JSON.stringify(jsonData));
}

exports.loadDatas = () => {
  return {
    privateKeys: loadJsonFile(privateKeyFile),
    networks: loadJsonFile(networksFile),
    toAddresses: loadJsonFile(addressesFile),
    histories: loadJsonFile(historiesFile),
    selected: loadJsonFile(selectedFile),
  };
};

exports.saveDatas = (datas) => {
  saveJsonFile(privateKeyFile, datas.privateKeys);
  saveJsonFile(networksFile, datas.networks);
  saveJsonFile(addressesFile, datas.toAddresses);
  saveJsonFile(historiesFile, datas.histories);
  saveJsonFile(selectedFile, datas.selected)
};
