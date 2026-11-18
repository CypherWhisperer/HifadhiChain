// ──────────────────────────────────────────────────────────────────────────────
// All wallet and contract logic lives in this hook, so the components only
// render state and report what the user did.
//
// This is the React version of the source guide's script:
//   - connect, read, write, and react to wallet changes.
// ──────────────────────────────────────────────────────────────────────────────

import { BrowserProvider, Contract, isAddress } from "ethers";
import type { ContractTransactionResponse } from "ethers";
import { useEffect, useState } from "react";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  SEPOLIA_CHAIN_ID,
  SEPOLIA_TX_URL,
  SUPPORTED_CHAINS,
} from "./config.ts";

// ──────────────────────────────────────────────────────────────────────────────
// Turn whatever was thrown into a message a person can read.
// ──────────────────────────────────────────────────────────────────────────────
function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const e = error as {
      shortMessage?: unknown;
      reason?: unknown;
      message?: unknown
    };

    if (typeof e.shortMessage === "string") return e.shortMessage;
    if (typeof e.reason === "string") return e.reason;
    if (typeof e.message === "string") return e.message;
  }
  return "Unknown error";
}

export function useWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [networkLabel, setNetworkLabel] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [storedNumber, setStoredNumber] = useState<string | null>(null);
  const [status, setStatus] = useState("Connect MetaMask to begin.");
  const [txUrl, setTxUrl] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  // ────────────────────────────────────────────────────────────────────────────
  // Reload when the user switches account or network in MetaMask, so the page
  // never shows state that belongs to the previous account or chain.
  //
  // The cleanup removes the listeners if the component unmounts.
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const provider = window.ethereum;
    if (!provider?.on) return undefined;
    const reload = () => {
      window.location.reload();
    };
    provider.on("accountsChanged", reload);
    provider.on("chainChanged", reload);
    return () => {
      provider.removeListener?.("accountsChanged", reload);
      provider.removeListener?.("chainChanged", reload);
    };
  }, []);

  // ────────────────────────────────────────────────────────────────────────────
  // READ: a free "view" call. It needs no signature, so MetaMask shows
  // no pop-up.
  // ────────────────────────────────────────────────────────────────────────────
  async function fetchNumber(target: Contract) {
    try {
      setStatus("Reading blockchain...");
      const value = (await target.getStoredNumber()) as bigint;
      setStoredNumber(value.toString());
      setStatus("Number retrieved successfully.");
    } catch (error) {
      console.error(error);
      setStatus(`Read failed: ${getErrorMessage(error)}`);
    }
  }

  async function connect() {
    try {
      if (!window.ethereum) {
        setStatus("MetaMask is not installed.");
        return;
      }
      if (!isAddress(CONTRACT_ADDRESS)) {
        setStatus("Please add your deployed contract address.");
        return;
      }

      // ────────────────────────────────────────────────────────────────────────
      // Ask MetaMask to share an account with this page. This opens its pop-up.
      // ────────────────────────────────────────────────────────────────────────
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setWalletAddress(await signer.getAddress());

      const network = await provider.getNetwork();
      const id = network.chainId.toString();
      setChainId(id);
      const name: string | undefined = SUPPORTED_CHAINS[id];
      if (!name) {
        setNetworkLabel(`Wrong network (chain ${id})`);
        setStatus("Please switch MetaMask to Sepolia.");
        return;
      }
      setNetworkLabel(name);

      // ────────────────────────────────────────────────────────────────────────
      // The signer lets this contract object send transactions that MetaMask
      // signs.
      // ────────────────────────────────────────────────────────────────────────
      const instance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(instance);
      setStatus("Wallet connected successfully.");
      await fetchNumber(instance);
    } catch (error) {
      console.error(error);
      setStatus(`Connection failed: ${getErrorMessage(error)}`);
    }
  }

  async function readNumber() {
    if (!contract) {
      setStatus("Connect MetaMask first.");
      return;
    }
    await fetchNumber(contract);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // WRITE: a transaction. MetaMask asks for confirmation and a gas fee, then
  // the transaction waits to be included in a block.
  // ────────────────────────────────────────────────────────────────────────────
  async function writeNumber(value: string) {
    if (!contract) {
      setStatus("Connect MetaMask first.");
      return;
    }
    const input = value.trim();
    if (!/^\d+$/.test(input)) {
      setStatus("Enter a whole number (0, 1, 2, ...).");
      return;
    }
    setIsBusy(true);
    setTxUrl(null);
    try {
      setStatus("Waiting for MetaMask confirmation...");

      // ────────────────────────────────────────────────────────────────────────
      // Blockchain integers are BigInt, so convert the text before sending.
      // ────────────────────────────────────────────────────────────────────────
      const tx = (await contract.setStoredNumber(BigInt(input))) as ContractTransactionResponse;
      setStatus("Transaction submitted. Waiting for confirmation...");
      await tx.wait();
      await fetchNumber(contract); // read the new value back from the chain
      setStatus("Transaction successful!");
      if (chainId === SEPOLIA_CHAIN_ID) setTxUrl(`${SEPOLIA_TX_URL}${tx.hash}`);
    } catch (error) {
      console.error(error);
      setStatus(`Transaction failed: ${getErrorMessage(error)}`);
    } finally {
      setIsBusy(false);
    }
  }

  return {
    walletAddress,
    networkLabel,
    storedNumber,
    status,
    txUrl,
    isConnected: contract !== null,
    isBusy,
    connect,
    readNumber,
    writeNumber,
  };
}
