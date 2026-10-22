interface StoredNumberProps {
  storedNumber: string | null;
  isConnected: boolean;
  onRead: () => void;
}

export  default function StoredNumber({ storedNumber, isConnected, onRead }: StoredNumberProps) {
  return (
    <section aria-labelledby="stored-heading">
      <h2 id="stored-heading">Stored Number</h2>

      {/*
          - <output> marks the result of a user action.
          - Its "for" attribute lists the control that produced it (the read button below).
          - It is also an implicit live region, so screen readers announce a changed value.
      */}
      <output className="number" htmlFor="read-button">
        {storedNumber ?? "--"}
      </output>

      <button id="read-button" type="button" onClick={onRead} disabled={!isConnected}>
        Get Stored Number
      </button>
    </section>
  );
}
