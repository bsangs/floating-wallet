#! /usr/bin/env node
const process = require("process");
const { loadDatas, saveDatas } = require("./utils/loadData");

let userData = loadDatas();
const argv = process.argv.slice(2);

console.log(argv, userData);
