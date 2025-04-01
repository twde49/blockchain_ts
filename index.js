"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Block_js_1 = require("./classes/Block.js");
var Blockchain_js_1 = require("./classes/Blockchain.js");
var Transaction_js_1 = require("./classes/Transaction.js");
var Wallet_js_1 = require("./classes/Wallet.js");
var dbUtils_js_1 = require("./utils/dbUtils.js");
var prompts_1 = require("@inquirer/prompts");
function initializeBlockchain(db) {
    return __awaiter(this, void 0, void 0, function () {
        var blockchain, genesisWallet, transaction, genesisBlock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!db.blockchain) return [3 /*break*/, 2];
                    blockchain = new Blockchain_js_1.Blockchain(crypto.randomUUID());
                    db.blockchain = {
                        id: blockchain.id,
                        blocks: []
                    };
                    return [4 /*yield*/, (0, dbUtils_js_1.writeDB)(db)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    blockchain = new Blockchain_js_1.Blockchain(db.blockchain.id);
                    blockchain.blocks = db.blockchain.blocks || [];
                    _a.label = 3;
                case 3:
                    if (!(blockchain.blocks.length === 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, Wallet_js_1.Wallet.createWallet(null)];
                case 4:
                    genesisWallet = _a.sent();
                    if (!genesisWallet)
                        throw new Error("Failed to create genesis wallet");
                    // Save the genesis wallet to the database
                    if (!db.wallets) {
                        db.wallets = [];
                    }
                    db.wallets.push({
                        publicKey: genesisWallet.publicKey,
                        privateKey: genesisWallet.privateKey
                    });
                    transaction = new Transaction_js_1.Transaction(100, genesisWallet.publicKey, 'GENESIS');
                    transaction.sign();
                    genesisBlock = new Block_js_1.Block('0', transaction);
                    blockchain.addBlock(genesisBlock);
                    db.blockchain.blocks = blockchain.blocks;
                    return [4 /*yield*/, (0, dbUtils_js_1.writeDB)(db)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/, blockchain];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var db, blockchain, action, _a, sender, amountStr, amount, recipientPublicKey, transaction, newBlock, error_1, miner, wallet, balance, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 23, , 24]);
                    return [4 /*yield*/, (0, dbUtils_js_1.readDB)()];
                case 1:
                    db = _b.sent();
                    if (!db) {
                        db = { wallets: [], blockchain: null };
                    }
                    return [4 /*yield*/, initializeBlockchain(db)];
                case 2:
                    blockchain = _b.sent();
                    _b.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 22];
                    return [4 /*yield*/, (0, prompts_1.select)({
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
                                new prompts_1.Separator(),
                            ],
                        })];
                case 4:
                    action = _b.sent();
                    _a = action;
                    switch (_a) {
                        case "sendCoinCoin": return [3 /*break*/, 5];
                        case "mineCoinCoin": return [3 /*break*/, 13];
                        case "createWallet": return [3 /*break*/, 16];
                        case "checkBalance": return [3 /*break*/, 18];
                        case "quit": return [3 /*break*/, 20];
                    }
                    return [3 /*break*/, 21];
                case 5: return [4 /*yield*/, signIn()];
                case 6:
                    sender = _b.sent();
                    if (!sender)
                        return [3 /*break*/, 21];
                    return [4 /*yield*/, (0, prompts_1.input)({
                            message: "Montant à envoyer",
                            validate: function (value) { return !Number.isNaN(Number(value)) && Number(value) > 0; },
                        })];
                case 7:
                    amountStr = _b.sent();
                    amount = Number(amountStr);
                    return [4 /*yield*/, (0, prompts_1.input)({
                            message: "Clé publique du destinataire",
                            validate: function (key) { return key.length > 0; },
                        })];
                case 8:
                    recipientPublicKey = _b.sent();
                    _b.label = 9;
                case 9:
                    _b.trys.push([9, 11, , 12]);
                    transaction = new Transaction_js_1.Transaction(amount, recipientPublicKey, sender.publicKey);
                    transaction.verifyKeyPair(sender.publicKey, sender.privateKey);
                    newBlock = new Block_js_1.Block(blockchain.getLastBlockHash(), transaction);
                    blockchain.addBlock(newBlock);
                    db.blockchain.blocks = blockchain.blocks;
                    return [4 /*yield*/, (0, dbUtils_js_1.writeDB)(db)];
                case 10:
                    _b.sent();
                    console.log("Transaction effectuée avec succès!");
                    return [3 /*break*/, 12];
                case 11:
                    error_1 = _b.sent();
                    console.error("Erreur lors de la transaction:", error_1);
                    return [3 /*break*/, 12];
                case 12: return [3 /*break*/, 21];
                case 13: return [4 /*yield*/, signIn()];
                case 14:
                    miner = _b.sent();
                    if (!miner)
                        return [3 /*break*/, 21];
                    blockchain.mine();
                    db.blockchain.blocks = blockchain.blocks;
                    return [4 /*yield*/, (0, dbUtils_js_1.writeDB)(db)];
                case 15:
                    _b.sent();
                    console.log("Minage effectué!");
                    return [3 /*break*/, 21];
                case 16: return [4 /*yield*/, Wallet_js_1.Wallet.createWallet(null)];
                case 17:
                    _b.sent();
                    return [3 /*break*/, 21];
                case 18: return [4 /*yield*/, signIn()];
                case 19:
                    wallet = _b.sent();
                    if (wallet) {
                        balance = blockchain.getBalance(wallet.publicKey);
                        console.log("Votre solde:", balance, "CoinCoins");
                    }
                    return [3 /*break*/, 21];
                case 20:
                    console.log("Au revoir!");
                    return [2 /*return*/];
                case 21: return [3 /*break*/, 3];
                case 22: return [3 /*break*/, 24];
                case 23:
                    error_2 = _b.sent();
                    console.error("Une erreur est survenue:", error_2);
                    return [3 /*break*/, 24];
                case 24: return [2 /*return*/];
            }
        });
    });
}
function signIn() {
    return __awaiter(this, void 0, void 0, function () {
        var publicKey, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, prompts_1.input)({
                            message: "Entrez votre clé publique",
                            validate: function (key) { return key.length > 0; },
                        })];
                case 1:
                    publicKey = _a.sent();
                    return [4 /*yield*/, Wallet_js_1.Wallet.createWallet(publicKey)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_3 = _a.sent();
                    console.error("Erreur lors de la connexion:", error_3);
                    return [2 /*return*/, undefined];
                case 4: return [2 /*return*/];
            }
        });
    });
}
main();
