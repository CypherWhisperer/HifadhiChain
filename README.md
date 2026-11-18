
## Run it locally

### Prerequisites

- Node.js 22.18 or later, with npm (`node --version`)
- Git
- A Chromium-based browser or Firefox with the [MetaMask](https://metamask.io) extension. Install it from the official site only.
- Linux or macOS shell syntax is used below. In other shells, set the `FUND_TO` variable in the way your shell does.

### 1. Install and verify the contract tooling

1. Enter the repository:
   ```bash
   git clone https://github.com/CypherWhisperer/HifadhiChain hifadhi_chain
   cd hifadhi_chain
   ```

2. Install the exact locked versions for the contract tooling, then for the frontend:
   ```bash
   npm ci
   cd frontend; npm ci; cd ..
   ```

3. Compile and run the tests:
   ```bash
   npm run compile
   npm test
   ```
- Expected: `Compiled 1 Solidity file with solc 0.8.28` and `4 passing`. The compiler comes from the npm package, so nothing is downloaded.

### 2. Prepare MetaMask (once)

1. Use a dedicated account that never holds real funds.
2. Add a custom network: name `Hardhat Local`, RPC URL `http://127.0.0.1:8545`, chain ID `31337`, currency symbol `ETH`.
3. Copy the development account's public address. You need it in step 3.5. A public address is not a secret, but never share a recovery phrase or private key.

### 3. Start the chain, deploy, and fund the account

1. **Terminal 1.** Start the local blockchain and leave it running:
```bash
npm run node
```
- It serves `http://127.0.0.1:8545` (chain ID 31337) with prefunded test accounts. 
- The test accounts' private keys are public: use them only here, never with real funds.

2. Optional check that the node answers (expect `0x7a69`):
```bash
curl -s -X POST -H 'content-type: application/json' \
--data '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}' http://127.0.0.1:8545
```

3. **Terminal 2.** Deploy the contract and send 100 test ETH to your development account:
```bash
FUND_TO=<your_wallet_address> npm run setup:local
```
- Note the contract address printed by the deploy, `SimpleStorageModule#SimpleStorage - 0x...`. On a fresh node it is `0x5FbDB2315678afecb367f032d93F642f64180aa3`.
- Check that MetaMask shows 100 ETH for the account on the `Hardhat Local` network.

### 4. Start the frontend

1. Tell the frontend which contract to use. Create `frontend/.env.local` (it is git-ignored) with the address from step 3.4:
```
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

2. **Terminal 3.** Start the dev server:
```bash
cd frontend
npm run dev
```

3. Open the URL it prints, normally `http://localhost:5173/`, in a normal (not private) browser window. After editing `.env.local`, restart the dev server.

### 5. Use the app

1. In MetaMask, select the dedicated account.
2. **Set the site's network.** MetaMask remembers a network per connected website. In the connected-site bar at the bottom of MetaMask's main screen, choose `Hardhat Local`, then reload the page. (Labels vary by MetaMask version.)
3. Click **Connect MetaMask** and approve. The page shows your address, the network `Hardhat Local`, and the stored number `0`.
4. Enter a whole number and click **Set New Number**. Confirm the transaction in MetaMask. When the page says `Transaction successful!`, the stored number has changed.
5. Click **Get Stored Number** to read it again. Reads are free and need no confirmation.

### Stopping and restarting

Stop each terminal with `Ctrl+C`. The local chain lives in memory, so **stopping the node erases it**: the contract and the balances disappear.

After a restart, repeat step 3 (start the node, then run `setup:local` with `FUND_TO`). The contract address is usually unchanged. The frontend keeps working without a restart unless the address changed.

### Commands used

| Command | Where | Purpose |
|---|---|---|
| `npm ci` | root and `frontend/` | Install exact locked dependencies |
| `npm run compile` | root | Compile the contract |
| `npm test` | root | Run the four contract tests |
| `npm run node` | root | Start the local chain |
| `FUND_TO=<address> npm run setup:local` | root | Deploy, then fund an account |
| `npm run dev` | `frontend/` | Start the frontend dev server |

### Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Page says "Wrong network (chain 1)" and buttons are disabled | The site is on a different network in MetaMask | Set the site's network to `Hardhat Local` (step 5.2) and reload |
| Page says "Please add your deployed contract address." | `frontend/.env.local` is missing or the dev server was not restarted | Create the file (step 4.1) and restart `npm run dev` |
| Balance shows 0 ETH | The node was restarted, or the funding step did not run | Run `FUND_TO=<address> npm run setup:local` again |
| `Error: listen EADDRINUSE ... 8545` | Another node is already running | Stop it, or reuse the running one |
| `Cannot connect to the network "localhost"` during setup | The node is not running | Start it in terminal 1 first |
| "MetaMask is not installed." | No wallet injected into the page, or a private window | Use a normal window and check the extension is enabled |
| A transaction hangs after restarting the node | MetaMask may remember the old chain's transaction count | Clear the account's activity data for the local network in MetaMask settings |
| `npm ci` fails with `ETARGET` while a VPN is on | The VPN path may serve the registry incorrectly | Disable the VPN for the install, or retry with `--prefer-online` |

---
### ==NOTE: FOR ASSOCIATED NOTES CHECK:== [NOTES](./NOTES.md)

---
Authored by: CypherWhisperer
Last Updated: 18/11/2026

