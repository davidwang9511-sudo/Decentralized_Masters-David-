export interface VerifyRequest {
    message: string;
    signature: string;
}

export interface VerifyResponse {
    isValid: boolean;
    signer: string | null;
    originalMessage: string;
}

export interface VerificationResult {
    isValid: boolean;
    signer: string | null;
    originalMessage: string;
}