"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.Wallet = void 0;
var Transaction_1 = require("./Transaction");
var Block_1 = require("./Block");
var crypto = __importStar(require("node:crypto"));
var dbUtils_js_1 = require("../utils/dbUtils.js");
var Wallet = /** @class */ (function () {
    function Wallet(publicKey, privateKey) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.id = crypto.randomUUID();
    }
    Wallet.createWallet = function (publicKey) {
        return __awaiter(this, void 0, void 0, function () {
            var base64regex;
            return __generator(this, function (_a) {
                if (!publicKey) {
                    return [2 /*return*/, Wallet.createNewWallet()];
                }
                base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
                if (!base64regex.test(publicKey)) {
                    console.log("Invalid public key");
                    return [2 /*return*/];
                }
                return [2 /*return*/, Wallet.findThisWallet(atob(publicKey))];
            });
        });
    };
    Wallet.createNewWallet = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, publicKey, privateKey, db, wallets;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = Wallet.generateKeys(), publicKey = _a.publicKey, privateKey = _a.privateKey;
                        return [4 /*yield*/, (0, dbUtils_js_1.readDB)()];
                    case 1:
                        db = _b.sent();
                        wallets = db.wallets;
                        wallets.push({ publicKey: publicKey, privateKey: privateKey });
                        console.log("wallet added ! Here's your public key: ".concat(btoa(publicKey), " DON'T SHARE IT, DON'T FORGET IT"));
                        db.wallets = wallets;
                        return [4 /*yield*/, (0, dbUtils_js_1.writeDB)(db)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, new Wallet(publicKey, privateKey)];
                }
            });
        });
    };
    Wallet.generateKeys = function () {
        var _a = crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: "spki",
                format: "pem",
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem",
            },
        }), publicKey = _a.publicKey, privateKey = _a.privateKey;
        return { publicKey: publicKey, privateKey: privateKey };
    };
    Wallet.prototype.sendMoney = function (amount, recipient, blockchain) {
        var newTransaction = new Transaction_1.Transaction(amount, this.publicKey, recipient);
        var newBlock = new Block_1.Block(blockchain.getLastBlockHash(), newTransaction);
        if (blockchain.checkAmountFromWallet(amount, this.publicKey)) {
            blockchain.addBlock(newBlock);
        }
    };
    Wallet.findThisWallet = function (publicKey) {
        return __awaiter(this, void 0, void 0, function () {
            var db, warningMessage, foundWallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, dbUtils_js_1.readDB)()];
                    case 1:
                        db = _a.sent();
                        warningMessage = "Vous devez fournir une clé publique correcte";
                        if (!db.wallets) {
                            console.warn(warningMessage);
                            throw new Error("No wallets found in the database."); // Or return null
                        }
                        if (Array.isArray(db.wallets)) {
                            foundWallet = db.wallets.find(function (wallet) {
                                return wallet.publicKey === publicKey;
                            });
                            if (foundWallet) {
                                return [2 /*return*/, new Wallet(foundWallet.publicKey, foundWallet.privateKey)];
                            }
                            console.warn(warningMessage);
                            throw new Error("Wallet not found."); // Or return null
                        }
                        throw new Error("Unexpected database structure."); // Or return null
                }
            });
        });
    };
    return Wallet;
}());
exports.Wallet = Wallet;
