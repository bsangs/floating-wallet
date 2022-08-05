const process = require('process');
const prompt = require("prompt-sync")();

const {
    sleep,
    makeRandomString
} = require('../utils/utils');

class Logger {
    static ins;
    isDone = true;
    runningId = null;
    dotCount = 0;

    constructor(isDebug) {
        Logger.ins = this;
        this.debug = isDebug || false;
    }

    async processingDot(runningId) {
        if (this.runningId) return;

        this.runningId = runningId;

        while (this.runningId === runningId) {
            this.dotCount += 1;
            await sleep(1000);
            if (this.isDone || this.dotCount >= 10) break;
            process.stdout.write(`.`);
        }

        this.runningId = null;
    }

    log(...data) {
        if (this.debug) console.log("[DEBUG]", ...data);
    }

    process(message) {
        if (this.debug) {
            process.stdout.write("[DEBUG] " + message);
            this.isDone = false;
            this.processingDot(makeRandomString());
        }
    }

    done() {
        if (this.debug) {
            console.log(" done!");
            this.isDone = true;
            this.dotCount = 0;
        }
    }
}

function exitMessage(message, code = 0) {
    console.log(message);
    return process.exit(code);
}

function pressEnter() {
    prompt("press enter...");
}

function selectPrompt() {
    return Number(prompt("select option: "));
}

function yesOrNo(isExit = false) {
    const input = prompt('Go to the next step (y,n)? (default: y): ', {value: 'y'});

    if (input.startsWith("y")) {
        return true;
    } else if (isExit) {
        exitMessage("Cancelled.");
    } else {
        return false;
    }
}

exports.selectPrompt = selectPrompt;
exports.pressEnter = pressEnter;
exports.exitMessage = exitMessage;
exports.yesOrNo = yesOrNo;
exports.Logger = Logger;
