import React from "react";
import { useWallet } from "../hooks/useWallet";

export default function SignatureResult() {
  const { lastResult } = useWallet();

  console.log(lastResult);

  if (!lastResult) return null;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mb-6">
      <p>Status: {lastResult.isValid ? "✅ Valid" : "❌ Invalid"}</p>
      <p>Signer: {lastResult.signer}</p>
      <p>Message: {lastResult.originalMessage}</p>
      <p>Signature: {lastResult.signature ? `${lastResult.signature.slice(0, 10)}...` : "N/A"}</p>
      <button
        onClick={() => navigator.clipboard.writeText(lastResult!.signature!)}
        className="mt-2 bg-indigo-600 text-white px-4 py-1 rounded-md hover:bg-indigo-700 transition"
      >
        Copy Signature
      </button>
    </div>
  );
}
