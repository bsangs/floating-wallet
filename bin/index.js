#! /usr/bin/env node
const process = require("process");
const { loadDatas } = require("./utils/loadData");

const { config } = require("./config");
const { send } = require("./send");

const userData = loadDatas();
const argv = process.argv.slice(2);

switch (argv[0]) {
    case 'config':
        config(userData);
        break;
    case 'send':
        send(userData, argv.slice(1));
        break;
    case 'view':
        break;
}

// console.log(argv, userData);
