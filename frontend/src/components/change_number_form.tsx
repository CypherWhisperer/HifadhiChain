import { useState } from "react";

interface ChangeNumberFormProps {
  disabled: boolean;
  onSubmit: (value: string) => void;
}

export default function ChangeNumberForm({ disabled, onSubmit }: ChangeNumberFormProps) {
  const [value, setValue] = useState("");

  return (
    <section aria-labelledby="change-heading">
      <h2 id="change-heading">Change Number</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault(); // stay on the page instead of reloading it
          onSubmit(value);
        }}
      >
        <label htmlFor="new-number">New number</label>
        <input
          id="new-number"
          name="newNumber"
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          required
          placeholder="Enter a whole number, e.g. 42"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
        <button type="submit" disabled={disabled}>
          Set New Number
        </button>
      </form>
    </section>
  );
}
