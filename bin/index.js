#! /usr/bin/env node
const process = require("process");
const { loadDatas } = require("./utils/loadData");

const { config } = require("./config");

const userData = loadDatas();
const argv = process.argv.slice(2);

if(argv[0] == 'config') {
    config(userData);
}

// console.log(argv, userData);
