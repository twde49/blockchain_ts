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
exports.Blockchain = void 0;
var Block_1 = require("./Block");
var Transaction_1 = require("./Transaction");
var Blockchain = /** @class */ (function () {
    function Blockchain(id) {
        this.blocks = [];
        this.id = id;
    }
    Blockchain.prototype.findBlockchainById = function (id) {
        return new Blockchain(id);
    };
    Blockchain.prototype.mine = function () {
        console.log('mining');
    };
    Blockchain.prototype.checkAmountFromWallet = function (amount, publicKey) {
        var balance = this.getBalance(publicKey);
        console.log('balance', balance, 'amount', amount, 'balance >= amount', balance >= amount);
        return balance >= amount;
    };
    Blockchain.prototype.addBlock = function (block) {
        var amountIsValid = this.checkAmountFromWallet(block.transaction.amount, block.transaction.senderPublicKey);
        if (!block.transaction.isSigned) {
            throw new Error('Transaction is not signed');
        }
        if (!amountIsValid && block.transaction.senderPublicKey !== 'GENESIS') {
            return console.warn('nope');
        }
        this.blocks.push(block);
    };
    Blockchain.prototype.getBalance = function (publicKey) {
        var balance = 0;
        for (var _i = 0, _a = this.blocks; _i < _a.length; _i++) {
            var block = _a[_i];
            if (block.transaction.senderPublicKey === publicKey) {
                balance -= block.transaction.amount;
            }
            if (block.transaction.recipientPublicKey === publicKey) {
                balance += block.transaction.amount;
            }
        }
        return balance;
    };
    Blockchain.prototype.getLastBlockHash = function () {
        if (this.blocks.length === 0) {
            return '0'; // Hash pour le bloc genesis
        }
        return this.blocks[this.blocks.length - 1].hash;
    };
    Blockchain.prototype.createGenesisBlock = function (publicKey, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var transaction, genesisBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transaction = new Transaction_1.Transaction(amount, publicKey, 'Creator');
                        return [4 /*yield*/, transaction.initialize()];
                    case 1:
                        _a.sent();
                        transaction.sign();
                        genesisBlock = new Block_1.Block('0', transaction);
                        this.addBlock(genesisBlock);
                        return [2 /*return*/];
                }
            });
        });
    };
    return Blockchain;
}());
exports.Blockchain = Blockchain;
