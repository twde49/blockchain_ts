"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
var js_sha512_1 = require("js-sha512");
var randombytes_1 = __importDefault(require("randombytes"));
var Block = /** @class */ (function () {
    function Block(prevHash, transaction) {
        this.nonce = (0, randombytes_1.default)(16).toString("base64");
        this.transaction = transaction;
        this.previousHash = prevHash;
        this.hash = this.calculateHash();
    }
    Block.prototype.calculateHash = function () {
        return js_sha512_1.sha512.create()
            .update(this.nonce +
            this.previousHash +
            JSON.stringify(this.transaction)).hex();
    };
    Block.prototype.setNonce = function (nonce) {
        this.nonce = nonce;
        this.hash = this.calculateHash();
    };
    Block.prototype.getNonce = function () {
        return this.nonce;
    };
    Block.prototype.getHash = function () {
        return this.hash;
    };
    Block.prototype.setPreviousHash = function (previousHash) {
        this.previousHash = previousHash;
        this.hash = js_sha512_1.sha512.create().update(this.nonce.toString()).hex();
    };
    Block.prototype.getPreviousHash = function () {
        return this.previousHash;
    };
    Block.prototype.setTransaction = function (transaction) {
        this.transaction = transaction;
        this.hash = js_sha512_1.sha512.create().update(this.nonce.toString()).hex();
    };
    Block.prototype.getTransaction = function () {
        return this.transaction;
    };
    return Block;
}());
exports.Block = Block;
