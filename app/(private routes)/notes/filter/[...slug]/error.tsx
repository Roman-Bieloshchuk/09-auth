"use client";

interface Props {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  return (
    <main style={{ padding: 40 }}>
      <h1>Something went wrong!</h1>

      <p>{error.message}</p>

      <button onClick={reset}>Try again</button>
    </main>
  );
}
