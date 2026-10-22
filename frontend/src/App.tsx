import {
  ChangeNumberForm,
  ContractInfo,
  StatusMessage,
  StoredNumber,
  WalletPanel
} from "./components/index.ts";
import { useWallet } from "./use_wallet.ts";

export default function App() {
  const wallet = useWallet();

  return (
    <div className="container">
      <main className="card">
        <header>
          <h1>HifadhiChain</h1>
          <p className="tagline">Store and read a number on the Ethereum blockchain</p>
        </header>

        <WalletPanel
          walletAddress={wallet.walletAddress}
          networkLabel={wallet.networkLabel}
          isConnected={wallet.isConnected}
          onConnect={() => {
            void wallet.connect();
          }}
        />

        <StoredNumber
          storedNumber={wallet.storedNumber}
          isConnected={wallet.isConnected}
          onRead={() => {
            void wallet.readNumber();
          }}
        />

        <ChangeNumberForm
          disabled={!wallet.isConnected || wallet.isBusy}
          onSubmit={(value) => {
            void wallet.writeNumber(value);
          }}
        />

        <ContractInfo />
        <StatusMessage status={wallet.status} txUrl={wallet.txUrl} />
      </main>
    </div>
  );
}
