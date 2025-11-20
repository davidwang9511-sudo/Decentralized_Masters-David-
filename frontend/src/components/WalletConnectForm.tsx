import React, { useState } from "react";
import { useWallet } from "../hooks/useWallet";

export default function WalletConnectForm() {
  const { email, setEmail, otp, setOtp, address, requestOtp, verifyOtp } = useWallet();
  console.log({address});

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mb-6">
      {!address ? (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md p-2 w-full mb-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={requestOtp}
            className="bg-indigo-600 text-white rounded-md px-4 py-2 w-full hover:bg-indigo-700 transition"
          >
            Request OTP
          </button>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border rounded-md p-2 w-full my-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={verifyOtp}
            className="bg-green-600 text-white rounded-md px-4 py-2 w-full hover:bg-green-700 transition"
          >
            Verify OTP & Connect Wallet
          </button>
        </>
      ) : (
        <div className="text-green-600 font-medium">Connected: {address}</div>
      )}
    </div>
  );
}
