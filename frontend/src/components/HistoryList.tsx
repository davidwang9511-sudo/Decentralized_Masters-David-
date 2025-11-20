import React from "react";
import { useWallet } from "../hooks/useWallet";

export default function HistoryList() {
  const { history, disconnect } = useWallet();

  if (!history.length) return null;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Signed Messages History</h3>
        <button onClick={disconnect} className="text-red-500 hover:text-red-700 transition">
          Clear All
        </button>
      </div>
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {history.map((item, idx) => (
          <div key={idx} className="bg-gray-50 rounded-md p-3 flex justify-between items-center">
            <div>
              <p className="text-gray-800 font-medium">{item.message}</p>
              <p className="text-gray-500 text-sm">{new Date(item.timestamp).toLocaleString()}</p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(item.signature)}
              className="text-indigo-600 hover:text-indigo-800 transition"
            >
              Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
