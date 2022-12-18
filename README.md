# SCPscan
Block Explorer for SCC Layer 2 &amp; Smart Contracts

# Requirements
- [Node.js >16.0](https://nodejs.org/en/download/)
- An [SCC Core](https://github.com/stakecube/StakeCubeCoin) fully synchronised.
- An [SCP Wallet](https://github.com/stakecube/StakeCubeProtocol#scp-wallet) in Full-node mode, with REST API module `tokens` enabled.

# Setup
- Clone the repository
```
git clone https://github.com/stakecube/scpscan.git && cd scpscan
```
- Install all dependencies.
```
npm i
```
- Edit the configuration file `./config.json`
- Startup with `node main` / `npm start` or use a process manager like PM2, Screen, Systemd, etc for extra stability.

**Config Note:** SCPscan is best compatible with LetEncrypt (default certbot) certificates, the path to a certbot directory is all you need.
