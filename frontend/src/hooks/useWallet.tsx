import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ethers, Wallet, BrowserProvider } from "ethers";
import { api } from "../services/api";
import { sign } from "crypto";

export interface SignedMessage {
  message: string;
  signature: string;
  signer: string;
  timestamp: number;
}

export interface VerifyResponse {
  isValid: boolean;
  signer: string;
  originalMessage: string;
  signature?: string;
}

interface WalletContextType {
  email: string;
  setEmail: (e: string) => void;
  otp: string;
  setOtp: (o: string) => void;
  address: string | null;
  provider: BrowserProvider | null;
  history: SignedMessage[];
  lastResult: VerifyResponse | null;
  requestOtp: () => Promise<void>;
  verifyOtp: () => Promise<void>;
  signMessage: (message: string) => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const wallet = useProvideWallet();
  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>;
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
};

function useProvideWallet(): WalletContextType {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [history, setHistory] = useState<SignedMessage[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("signHistory") || "[]");
    } catch {
      return [];
    }
  });
  const [lastResult, setLastResult] = useState<VerifyResponse | null>(null);

  useEffect(() => {
    localStorage.setItem("signHistory", JSON.stringify(history));
  }, [history]);


  async function requestOtp() {
    try {
      await api.post("/auth/request-otp", { email });
      alert("OTP sent to your email!");
    } catch (err) {
      console.error(err);
      alert("Failed to request OTP");
    }
  }


  async function verifyOtp() {
    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      setAddress(res.data.address);
      setProvider(new ethers.BrowserProvider(window.ethereum));
      alert("Wallet connected!");
    } catch (err) {
      console.error(err);
      alert("OTP verification failed");
    }
  }

  async function signMessage(message: string) {
    if (!message) return alert("Enter a message");

    if (!provider) return alert("Authenticate first");

    try {
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);
      const signerAddress = await signer.getAddress();

      console.log(signature)

      const res = await api.post("/verify-signature", { message, signature });
      setLastResult({...res.data, signature: signature});


      const newEntry: SignedMessage = {
        message,
        signature,
        signer: signerAddress,
        timestamp: Date.now(),
      };
      setHistory([newEntry, ...history]);
    } catch (err) {
      console.error(err);
      alert("Error signing message");
    }
  }

  function disconnect() {
    setAddress(null);
    setProvider(null);
    setHistory([]);
    localStorage.removeItem("signHistory");
  }

  return {
    email,
    setEmail,
    otp,
    setOtp,
    address,
    provider,
    history,
    lastResult,
    requestOtp,
    verifyOtp,
    signMessage,
    disconnect,
  };
}
