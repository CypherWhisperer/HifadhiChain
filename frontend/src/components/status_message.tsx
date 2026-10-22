interface StatusMessageProps {
  status: string;
  txUrl: string | null;
}

// role="status" turns this paragraph into a polite live region: changes are
// announced without moving keyboard focus. The element must exist from the
// first render for the announcements to work.
export default function StatusMessage({ status, txUrl }: StatusMessageProps) {
  return (
    <p role="status" className="status">
      {status}
      {txUrl ? (
        <>
          {" "}
          <a href={txUrl} target="_blank" rel="noopener noreferrer">
            View the transaction on Etherscan
          </a>
        </>
      ) : null}
    </p>
  );
}
