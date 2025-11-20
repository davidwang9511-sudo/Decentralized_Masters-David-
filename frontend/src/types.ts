export interface SignedMessage {
    message: string;
    signature: string;
    signer: string;
    timestamp: number;
    verification?: { isValid: boolean; signer: string };
}
  
export interface VerifyResponse {
    isValid: boolean;
    signer: string;
    originalMessage: string;
    Signature?: string;
    sessionJwt?: string;
}