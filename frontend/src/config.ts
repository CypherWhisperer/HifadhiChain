// Central configuration. Everything that differs between networks lives here,
// so moving to another network later is a change to this file plus one
// environment variable.

// The deployed contract's address, injected at build time from
// VITE_CONTRACT_ADDRESS. Every VITE_* variable is embedded in the public
// bundle, so it must never hold a secret. An address is public by nature.
const rawAddress = import.meta.env.VITE_CONTRACT_ADDRESS as string | undefined;
export const CONTRACT_ADDRESS: string = rawAddress ?? "";

// Networks this page accepts: chain ID (as a string) -> display name.
export const SUPPORTED_CHAINS: Record<string, string> = {
  "11155111": "Sepolia",
  "31337": "Hardhat Local",
};

// Transaction links to a block explorer exist only for Sepolia. The local
// chain has no explorer.
export const SEPOLIA_CHAIN_ID = "11155111";
export const SEPOLIA_TX_URL = "https://sepolia.etherscan.io/tx/";

// ABI: describes the two functions this page calls, so ethers.js knows their
// names and types. Hand-copied from the compiler output
// (artifacts/contracts/SimpleStorage.sol/SimpleStorage.json, key "abi") and
// trimmed to what the page uses.
export const CONTRACT_ABI = [
  {
    inputs: [],
    name: "getStoredNumber",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_newNumber", type: "uint256" }],
    name: "setStoredNumber",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
