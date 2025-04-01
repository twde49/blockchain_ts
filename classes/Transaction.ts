import * as crypto from 'node:crypto';

export class Transaction {
  amount: number;
  recipientPublicKey: string;
  senderPublicKey: string;
  isSigned: boolean;

  constructor(
    amount: number,
    recipientPublicKey: string,
    senderPublicKey: string
  ) {
    this.recipientPublicKey = recipientPublicKey;
    this.senderPublicKey = senderPublicKey;
    this.amount = amount;
    this.isSigned = false;
  }

  async initialize() {
    try {
      
      return this;
    } catch (error) {
      console.error('Error initializing transaction:', error);
      throw error;
    }
  }
  
  sign() {
    this.isSigned = true;
  }
  
  verifyKeyPair(senderPublicKey: string, senderPrivateKey: string): boolean {
    try {
      const message = "test message";
      const sign = crypto.createSign("SHA256");
      sign.update(message);
      sign.end();
      const signature = sign.sign(senderPrivateKey, "base64");
  
      const verify = crypto.createVerify("SHA256");
      verify.update(message);
      verify.end();
      if (verify.verify(senderPublicKey, signature, "base64")) {
        this.isSigned = true;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying key pair:', error);
      return false;
    }
  }
}