// David Wang @david9511@gmail.com

import { ethers } from "ethers";

export function verifySignature(message: string, signature: string) {
  try {
    const signer = ethers.verifyMessage(message, signature);
    const isValid = Boolean(signer);
    return { isValid, signer };
  } catch (err) {
    throw new Error("signature_verification_failed");
  }
}
