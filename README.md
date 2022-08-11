# Floating-wallet

- Heavy wallet (cold wallet)
- Light wallet (hot wallet)
- <p style="color: indianred; font-size: 18px; font-weight: bold">Floating wallet (very hot wallet)</p>

## Running from command line
You can run fw directly from the CLI (if it's globally available in your `PATH`, e.g. by `yarn global add floating-wallet` or `npm install floating-wallet --global`)
```shell
fw // print help messages


[config Commands]
- fw config // set the configuration.
  [send Commands]
- fw send <amount> <null or receive address> // send native token. if null input, get select receive address in configuration.
  [send ERC20 Token]
    - fw send <amount> -c <null or contract address> // if null input, get select ERC20 contract in configuration.
      [send Token Fastly]
    - fw send <amount> -f // send token fastly, increase gas price.
      [send Token Skip Confirmation]
    - fw send <amount> -y // send token with skip confirmation.
      [send Token with Debug Log]
    - fw send <amount> -d // send token with debug log.
```

