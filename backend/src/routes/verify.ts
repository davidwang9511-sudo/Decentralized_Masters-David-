// David Wang @david9511@gmail.com

import express from "express";

import { verifySignature } from "../services/signatureService";

const router = express.Router();

router.post("/", (req, res) => {
  const { message, signature } = req.body;
  if (!message || !signature) {
    return res.status(400).json({ error: "message and signature required" });
  }
  try {
    const { isValid, signer } = verifySignature(message, signature);
    return res.json({ isValid, signer, originalMessage: message });
  } catch (err: any) {
    console.error("verify-signature error:", err.message || err);
    return res.status(500).json({ error: "verification_failed" });
  }
});

export default router;
