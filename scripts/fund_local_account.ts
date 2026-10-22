// Sends test ETH on the local Hardhat chain from its first prefunded account
// to the address given in FUND_TO. The local chain resets whenever the node
// restarts, so run this again after each restart.
import { network } from "hardhat";
import { formatEther, isAddress, parseEther } from "viem";

const target = process.env.FUND_TO;
if (!target || !isAddress(target)) {
 throw new Error("Set FUND_TO to the address to fund: FUND_TO=0x... npm run fund:local");
}

const { viem } = await network.getOrCreate();
const [funder] = await viem.getWalletClients();
const publicClient = await viem.getPublicClient();

const hash = await funder.sendTransaction({ to: target, value: parseEther("100") });
await publicClient.waitForTransactionReceipt({ hash });

const balance = await publicClient.getBalance({ address: target });
console.log(`Funded ${target}. Balance: ${formatEther(balance)} ETH`);
