import { Block } from "./Block";
import { Transaction } from "./Transaction";

export class Blockchain {
  
  id: string;
  blocks: Block[] = [];
  
  constructor(id:string){
    this.id = id;
  }
  
  findBlockchainById(id: string): Blockchain | undefined {
    return new Blockchain(id)
  }
  
  mine(){
    console.warn('mining');
  }
  
  
  public checkAmountFromWallet(amount: number, publicKey: string): boolean {
    const balance = this.getBalance(publicKey);
    return balance >= amount;
  }
  
  public addBlock(block: Block){
    const amountIsValid = this.checkAmountFromWallet(block.transaction.amount, block.transaction.senderPublicKey)
    if(!block.transaction.isSigned){
      throw new Error('Transaction is not signed');
    }
    
    if(!amountIsValid && block.transaction.senderPublicKey !== 'GENESIS'){
      throw new Error('Pas assez de coincoin deconne pas');
    }
    
    this.blocks.push(block);
  }
  
  public getBalance(publicKey: string): number {
    let balance = 0;
    for (const block of this.blocks) {
        if (block.transaction.senderPublicKey === publicKey) {
          balance -= block.transaction.amount;
        }
        if (block.transaction.recipientPublicKey === publicKey) {
          balance += block.transaction.amount;
        }
    }
    return balance;
  }
  
  public getLastBlockHash(): string {
      if (this.blocks.length === 0) {
        return '0'; // Hash pour le bloc genesis
      }
      return this.blocks[this.blocks.length - 1].hash;
    }
  
    async createGenesisBlock(publicKey: string, amount: number) {
      const transaction = new Transaction(amount, publicKey, 'Creator');
      await transaction.initialize();
      transaction.sign();
      const genesisBlock = new Block('0', transaction);
      this.addBlock(genesisBlock);
    }
}
