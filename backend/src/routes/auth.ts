// David Wang @david9511@gmail.com

import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const DYNAMIC_API = "https://api.dynamic.xyz";
const API_KEY = process.env.DYNAMIC_API_KEY;
const ENV_ID = process.env.DYNAMIC_ENV_ID;
const DEMO_MODE = process.env.DEMO_MODE === "true";

if (!API_KEY || !ENV_ID) {
  console.warn("DYNAMIC_API_KEY or DYNAMIC_ENV_ID not set. Demo mode:", DEMO_MODE);
}

// In-memory demo store
const demoOtpStore: Record<string, string> = {};
const demoSessionStore: Record<string, { address: string; providerRpcUrl: string; sessionJwt: string }> = {};

router.post("/request-otp", async (req, res) => {
  const { email } = req.body;
  console.log(email);
  if (!email) return res.status(400).json({ error: "email required" });

  // Demo mode
  if (DEMO_MODE || !API_KEY || !ENV_ID) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    demoOtpStore[email] = otp;
    console.log(`[DEMO] OTP for ${email}:`, otp);
    return res.json({ ok: true, challengeId: "demo-challenge-id" });
  }

  // Production mode
  try {
    const response = await axios.post(
      `${DYNAMIC_API}/auth/headless/email/request-code`,
      { email, environmentId: ENV_ID },
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );

    const challengeId = response.data?.challengeId;
    return res.json({ ok: true, challengeId });
  } catch (err: any) {
    console.error("request-otp error:", err.response?.data || err.message);
    return res.status(500).json({ error: "request-otp-failed" });
  }
});


router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "email+otp required" });

  // Demo mode
  if (DEMO_MODE || !API_KEY || !ENV_ID) {
    const storedOtp = demoOtpStore[email];
    if (!storedOtp || storedOtp !== otp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    const address = demoSessionStore[email]?.address || `0x${Math.floor(Math.random() * 1e16).toString(16).padStart(16, "0")}`;
    const sessionJwt = demoSessionStore[email]?.sessionJwt || "demo-session-jwt";
    const providerRpcUrl = demoSessionStore[email]?.providerRpcUrl || "https://rpc.ankr.com/eth";

    demoSessionStore[email] = { address, providerRpcUrl, sessionJwt };
    delete demoOtpStore[email];

    console.log(`[DEMO] Verified ${email}, address: ${address}`);
    return res.json({ address, providerRpcUrl, sessionJwt });
  }

  // Production mode
  try {
    const verify = await axios.post(
      `${DYNAMIC_API}/auth/headless/email/verify-code`,
      { email, code: otp, environmentId: ENV_ID },
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );

    const data = verify.data;
    const sessionJwt = data?.session?.jwt;
    const address = data?.user?.wallets?.[0]?.address;

    if (!sessionJwt || !address) {
      console.error("Unexpected verify-otp response", data);
      return res.status(500).json({ error: "invalid-verify-response" });
    }

    // Request provider RPC endpoint bound to the session
    const providerRes = await axios.get(`${DYNAMIC_API}/wallet/provider`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "X-Dynamic-Session": sessionJwt,
      },
    });

    const providerRpcUrl = providerRes.data?.rpcEndpoint;
    if (!providerRpcUrl) {
      console.error("No rpcEndpoint in providerRes", providerRes.data);
      return res.status(500).json({ error: "no-rpc-endpoint" });
    }

    return res.json({ address, providerRpcUrl, sessionJwt });
  } catch (err: any) {
    console.error("verify-otp error:", err.response?.data || err.message);
    return res.status(500).json({ error: "verify-otp-failed" });
  }
});

export default router;