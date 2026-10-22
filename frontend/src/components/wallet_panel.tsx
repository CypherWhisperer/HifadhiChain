interface WalletPanelProps {
  walletAddress: string | null;
  networkLabel: string | null;
  isConnected: boolean;
  onConnect: () => void;
}

export default function WalletPanel({
  walletAddress,
  networkLabel,
  isConnected,
  onConnect,
}: WalletPanelProps) {
  return (
    <section aria-labelledby="wallet-heading">
      <h2 id="wallet-heading">Wallet</h2>
      <button type="button" onClick={onConnect}>
        {isConnected ? "MetaMask Connected" : "Connect MetaMask"}
      </button>
      
      {/*
         - <dl> is a list of name/value pairs:
         - <dt> names the item, <dd> holds its value.
         - An address is literal text, so it goes in <code>.
      */}
      <dl className="info">
        <dt>Wallet</dt>
        <dd>
          <code>{walletAddress ?? "Not connected"}</code>
        </dd>
        <dt>Network</dt>
        <dd>{networkLabel ?? "Not connected"}</dd>
      </dl>
    </section>
  );
}
