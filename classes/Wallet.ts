import { Transaction } from "./Transaction";
import { Block } from "./Block";
import type { Blockchain } from "./Blockchain";
import * as crypto from "node:crypto";
import { readDB, writeDB } from "../utils/dbUtils.js";

export class Wallet {
  
  publicKey: string;
  privateKey: string;
  id: string;

  private constructor(publicKey: string, privateKey: string) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.id = crypto.randomUUID();
  }

  static async createWallet(publicKey: string | null): Promise<Wallet> {
    if (!publicKey) {
      return Wallet.createNewWallet();
    }
    const base64regex =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    if (!base64regex.test(publicKey)) {
      console.warn("Invalid public key");
      return;
    }

    return Wallet.findThisWallet(atob(publicKey));
  }

  private static async createNewWallet(): Promise<Wallet> {
    const { publicKey, privateKey } = Wallet.generateKeys();
    const db = await readDB();
    const wallets = db.wallets;
    wallets.push({ publicKey, privateKey });
    console.warn(
      `wallet added ! Here's your public key: ${btoa(
        publicKey,
      )} DON'T SHARE IT, DON'T FORGET IT`,
    );
    db.wallets = wallets
    await writeDB(db);
    return new Wallet(publicKey, privateKey);
  }

  private static generateKeys(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });
    return { publicKey, privateKey };
  }

  sendMoney(amount: number, recipient: string, blockchain: Blockchain) {
    const newTransaction = new Transaction(amount, this.publicKey, recipient);
    const newBlock = new Block(blockchain.getLastBlockHash(), newTransaction);
    if (blockchain.checkAmountFromWallet(amount, this.publicKey)) {
      blockchain.addBlock(newBlock);
    }
  }

  private static async findThisWallet(publicKey: string): Promise<Wallet> {
    const db = await readDB();
    const warningMessage = "Vous devez fournir une clé publique correcte";

    if (!db.wallets) {
      console.warn(warningMessage);
      throw new Error("No wallets found in the database."); // Or return null
    }

    if (Array.isArray(db.wallets)) {
      const foundWallet = db.wallets.find(
        (wallet: { publicKey: string; privateKey: string }) =>
          wallet.publicKey === publicKey,
      );
      if (foundWallet) {
        return new Wallet(foundWallet.publicKey, foundWallet.privateKey);
      }
      console.warn(warningMessage);
      throw new Error("Wallet not found."); // Or return null
    }

    throw new Error("Unexpected database structure."); // Or return null
  }
}
