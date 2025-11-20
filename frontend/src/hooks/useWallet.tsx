import { useState, useEffect, useContext, createContext } from "react";
import { ethers, Wallet, JsonRpcProvider } from "ethers";
import { api } from "../services/api";
import { SignedMessage, VerifyResponse } from "../types";

export type WalletContextType = ReturnType<typeof useWallet>;

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wallet = useWallet();
  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>;
};

// Hook to use the context
export const useWalletContext = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWalletContext must be used within a WalletProvider");
  return context;
};

export function useWallet() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [history, setHistory] = useState<SignedMessage[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("signHistory") || "[]");
    } catch {
      return [];
    }
  });
  const [lastResult, setLastResult] = useState<VerifyResponse | null>(null);
  const [mfaMethods, setMfaMethods] = useState<string[]>([]);
  const [isMfaVerified, setIsMfaVerified] = useState(false);

  useEffect(() => {
    localStorage.setItem("signHistory", JSON.stringify(history));
  }, [history]);

  async function requestOtp() {
    if (!email) return alert("Enter your email");
    try {
      const res = await api.post("/auth/request-otp", { email });
      alert("OTP sent! Use it to verify your email.");
      return res.data.challengeId;
    } catch (err) {
      console.error(err);
      alert("Failed to request OTP");
    }
  }

  async function verifyOtp() {
    if (!email || !otp) return alert("Email and OTP required");

    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      const { address, providerRpcUrl, sessionJwt } = res.data;
      setAddress(address);
      setProvider(new JsonRpcProvider(providerRpcUrl) as any);
      setLastResult({ ...res.data, sessionJwt });

      // Immediately request MFA methods after OTP
      const mfaRes = await api.post("/auth/request-mfa", { email, sessionJwt });
      setMfaMethods(mfaRes.data.methods || []);
      setIsMfaVerified(false);

      alert("OTP verified. Now complete MFA to enable wallet actions.");
    } catch (err) {
      console.error(err);
      alert("OTP verification failed ( MFA )");
    }
  }

  // 3️⃣ Verify MFA
  async function verifyMfa(code: string, method: string) {
    if (!lastResult?.sessionJwt) return alert("Session missing. Verify OTP first");

    try {
      const res = await api.post("/auth/verify-mfa", {
        email,
        sessionJwt: lastResult.sessionJwt,
        code,
        method,
      });
      if (res.data.verified) {
        setIsMfaVerified(true);
        alert("MFA verified! Wallet is fully authenticated.");
        return true;
      }
      alert("MFA verification failed");
      return false;
    } catch (err) {
      console.error(err);
      alert("MFA verification failed");
      return false;
    }
  }

  // 4️⃣ Sign message
  async function signMessage(message: string) {
    if (!message) return alert("Enter a message");
    if (!address || !provider) return alert("Authenticate first (OTP + MFA)");
    if (!isMfaVerified) return alert("Complete MFA before signing");

    let signature: string;
    let signerAddress: string;

    try {
      const signer = await provider.getSigner();
      signature = await signer.signMessage(message);
      signerAddress = await signer.getAddress();
    } catch (err) {
      console.error(err);
      return alert("Error signing message");
    }

    // Send to backend for verification
    try {
      const res = await api.post("/verify-signature", { message, signature });
      setLastResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to verify signature with backend");
    }

    // Update local history
    const newEntry: SignedMessage = {
      message,
      signature,
      signer: signerAddress,
      timestamp: Date.now(),
    };
    setHistory([newEntry, ...history]);
  }

  // 5️⃣ Disconnect wallet
  function disconnect() {
    setEmail("");
    setOtp("");
    setAddress(null);
    setProvider(null);
    setHistory([]);
    setLastResult(null);
    setMfaMethods([]);
    setIsMfaVerified(false);
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
    mfaMethods,
    isMfaVerified,
    requestOtp,
    verifyOtp,
    verifyMfa,
    signMessage,
    disconnect,
  };
}
