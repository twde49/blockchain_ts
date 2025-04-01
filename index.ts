import { Block } from "./classes/Block.js";
import { Blockchain } from "./classes/Blockchain.js";
import { Transaction } from "./classes/Transaction.js";
import { Wallet } from "./classes/Wallet.js";
import { readDB, writeDB } from "./utils/dbUtils.js";
import { select, Separator, input } from "@inquirer/prompts";

async function initializeBlockchain(db: any): Promise<Blockchain> {
  let blockchain: Blockchain;

  if (!db.blockchain) {
    blockchain = new Blockchain(crypto.randomUUID());
    db.blockchain = {
      id: blockchain.id,
      blocks: []
    };
    await writeDB(db);
  } else {
    blockchain = new Blockchain(db.blockchain.id);
    blockchain.blocks = db.blockchain.blocks || [];
  }

  // Créer le bloc genesis si nécessaire
  if (blockchain.blocks.length === 0) {
    const genesisWallet = await Wallet.createWallet(null);
    if (!genesisWallet) throw new Error("Failed to create genesis wallet");
    
    // Save the genesis wallet to the database
    if (!db.wallets) {
      db.wallets = [];
    }
    db.wallets.push({
      publicKey: genesisWallet.publicKey,
      privateKey: genesisWallet.privateKey
    });
    
    const transaction = new Transaction(100, genesisWallet.publicKey, 'GENESIS');
    transaction.sign();
    
    const genesisBlock = new Block('0', transaction);
    blockchain.addBlock(genesisBlock);
    
    db.blockchain.blocks = blockchain.blocks;
    await writeDB(db);
  }

  return blockchain;
}

async function main() {
  try {
    let db = await readDB();
    if (!db) {
      db = { wallets: [], blockchain: null };
    }

    const blockchain = await initializeBlockchain(db);
    
    while (true) {
      const action = await select({
        message: "Quelle action souhaitez-vous effectuer ?",
        choices: [
          {
            name: "Envoyer des CoinCoin",
            value: "sendCoinCoin",
            description: "Envoyer des coinCoin à un wallet",
          },
          {
            name: "Miner du CoinCoin",
            value: "mineCoinCoin",
            description: "Miner un peu de CoinCoin au coin du feu",
          },
          {
            name: "Créer un wallet",
            value: "createWallet",
            description: "Créer un nouveau wallet pour vos CoinCoin",
          },
          {
            name: "Voir mon solde",
            value: "checkBalance",
            description: "Vérifier le solde de votre wallet",
          },
          {
            name: "Quitter",
            value: "quit",
            description: "Quitter l'application",
          },
          new Separator(),
        ],
      });

      switch (action) {
        case "sendCoinCoin": {
          const sender = await signIn();
          if (!sender) break;

          const amountStr = await input({
            message: "Montant à envoyer",
            validate: (value) => !Number.isNaN(Number(value)) && Number(value) > 0,
          });
          const amount = Number(amountStr);

          const recipientPublicKey = await input({
            message: "Clé publique du destinataire",
            validate: (key) => key.length > 0,
          });

          try {
            const transaction = new Transaction(amount, recipientPublicKey, sender.publicKey);
            transaction.verifyKeyPair(sender.publicKey, sender.privateKey);
            
            const newBlock = new Block(blockchain.getLastBlockHash(), transaction);
            blockchain.addBlock(newBlock);
            
            db.blockchain.blocks = blockchain.blocks;
            await writeDB(db);
            console.warn("Transaction effectuée avec succès!");
          } catch (error) {
            console.error("Erreur lors de la transaction:", error);
          }
          break;
        }

        case "mineCoinCoin": {
          const miner = await signIn();
          if (!miner) break;
          
          blockchain.mine();
          db.blockchain.blocks = blockchain.blocks;
          await writeDB(db);
          console.warn("Minage effectué!");
          break;
        }

        case "createWallet": {
          await Wallet.createWallet(null);
          break;
        }

        case "checkBalance": {
          const wallet = await signIn();
          if (wallet) {
            const balance = blockchain.getBalance(wallet.publicKey);
            console.warn("Votre solde:", balance, "CoinCoins");
          }
          break;
        }

        case "quit":
          console.warn("Au revoir!");
          return;
      }
    }
  } catch (error) {
    console.error("Une erreur est survenue:", error);
  }
}

async function signIn(): Promise<Wallet | undefined> {
  try {
    const publicKey = await input({
      message: "Entrez votre clé publique",
      validate: (key) => key.length > 0,
    });
    return await Wallet.createWallet(publicKey);
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return undefined;
  }
}

main();
