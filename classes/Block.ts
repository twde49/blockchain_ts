import type { Transaction } from "./Transaction";
import { sha512 } from "js-sha512";
import randomBytes from "randombytes";

export class Block {
  nonce: string;
  transaction: Transaction;
  previousHash: string;
  hash: string;

  private calculateHash(): string {
      return sha512.create()
        .update(
          this.nonce +
          this.previousHash +
          JSON.stringify(this.transaction)
        ).hex();
    }
  
    constructor(prevHash: string, transaction: Transaction) {
      this.nonce = randomBytes(16).toString("base64");
      this.transaction = transaction;
      this.previousHash = prevHash;
      this.hash = this.calculateHash();
    }
  
    setNonce(nonce: string): void {
      this.nonce = nonce;
      this.hash = this.calculateHash();
    }
    
  getNonce(): string {
    return this.nonce;
  }

  getHash(): string {
    return this.hash;
  }

  setPreviousHash(previousHash: string): void {
    this.previousHash = previousHash;
    this.hash = sha512.create().update(this.nonce.toString()).hex();
  }

  getPreviousHash(): string {
    return this.previousHash;
  }

  setTransaction(transaction: Transaction): void {
    this.transaction = transaction;
    this.hash = sha512.create().update(this.nonce.toString()).hex();
  }

  getTransaction(): Transaction {
    return this.transaction;
  }
}
