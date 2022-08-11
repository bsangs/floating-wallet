const indentSpacing = 2;

function printMessage(message, indent = 0) {
    console.log(`${" ".repeat(indent)}${message}`);
}

function printOptions(options, indent = 0) {
    const { param, description } = options;
    const message = `- fw ${param} ${typeof description === 'string' ? `// ${description}` : ''}`;

    printMessage(message, indent + indentSpacing);
}

function printCategory(categoryData, indent = 0) {
    const keys = Object.keys(categoryData);

    keys.forEach(key => {
        const category = categoryData[key];
        printMessage(`[${key}]`, indent);
        printOptions(category.options, indent);

        if (Object.keys(category).indexOf('subCategory') > 0) {
            printCategory(category.subCategory, indent + indentSpacing);
        }
    });
}

function printHelpMessage() {
    const help = {
        "config Commands": {
            options: {
                param: 'config',
                description: 'set the configuration.'
            },
        },
        "send Commands": {
            options: {
                param: 'send <amount> <null or receive address>',
                description: 'send native token. if null input, get select receive address in configuration.',
            },
            "subCategory": {
                "send ERC20 Token": {
                    options: {
                        param: 'send <amount> -c <null or contract address>',
                        description: 'if null input, get select ERC20 contract in configuration.'
                    }
                },
                "send Token Fastly": {
                    options: {
                        param: 'send <amount> -f',
                        description: 'send token fastly, increase gas price.'
                    }
                },
                "send Token Skip Confirmation": {
                    options: {
                        param: 'send <amount> -y',
                        description: 'send token with skip confirmation.'
                    }
                },
                "send Token with Debug Log": {
                    options: {
                        param: 'send <amount> -d',
                        description: 'send token with debug log.'
                    }
                }
            }
        }
    }

    printCategory(help);
}

exports.printHelpMessage = printHelpMessage;
