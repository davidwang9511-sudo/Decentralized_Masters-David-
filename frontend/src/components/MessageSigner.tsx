import React, { useState } from "react";
import { useWallet } from "../hooks/useWallet";

export default function MessageSigner() {
  const { signMessage } = useWallet();
  const [message, setMessage] = useState("");

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mb-6">
      <textarea
        placeholder="Enter message to sign"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border rounded-md p-2 w-full mb-3 focus:ring-indigo-500 focus:border-indigo-500"
        rows={3}
      />
      <button
        onClick={() => signMessage(message)}
        className="bg-indigo-600 text-white rounded-md px-4 py-2 w-full hover:bg-indigo-700 transition"
      >
        Sign Message
      </button>
    </div>
  );
}
