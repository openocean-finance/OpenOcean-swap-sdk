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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swap = exports.ReqSwapVo = void 0;
var aggregator_1 = require("../asset/abi/aggregator");
var RequestVo_1 = require("../api/vo/RequestVo");
Object.defineProperty(exports, "ReqSwapVo", { enumerable: true, get: function () { return RequestVo_1.ReqSwapVo; } });
var wallet_1 = require("@openocean.finance/wallet");
var web3_js_1 = require("@solana/web3.js");
var terra_js_1 = require("@terra-money/terra.js");
var ontology_ts_sdk_1 = require("ontology-ts-sdk");
var aptos_1 = require("aptos");
var ethers_1 = require("ethers");
var bn_js_1 = __importDefault(require("bn.js"));
var borsh_1 = require("borsh");
var ontology_dapi_1 = require("@ont-dev/ontology-dapi");
var NotoMobile_1 = require("./NotoMobile");
var web3_1 = __importDefault(require("web3"));
var config_1 = require("./../config");
var axios_1 = __importDefault(require("axios"));
// import bs58 from "bs58";
var bs58 = require("bs58");
ontology_dapi_1.client.registerClient({});
var providerEth = new ethers_1.ethers.providers.JsonRpcProvider({
    url: "https://rpc.ankr.com/eth"
});
var Swap = /** @class */ (function () {
    function Swap(res, wallet, chain, isNew) {
        this.getDataCallback = function () { };
        this.errorCallback = function () { };
        this.transactionHashCallback = function () { };
        this.receiptCallback = function () { };
        this.successCallback = function () { };
        this.res = res;
        this.wallet = wallet;
        this.chain = chain;
    }
    Swap.prototype.send = function () {
        var _this = this;
        setTimeout(function () {
            switch (_this.chain.compiler) {
                case "EVM":
                    console.log('this.res.data', _this.res.data);
                    if (_this.res.data === '0x') {
                        var e = new Error("Transaction failed");
                        _this.errorCallback(e.message);
                    }
                    else {
                        if (_this.isNew) {
                            _this.sendEthTransactionNew();
                        }
                        else {
                            _this.sendEthTransaction();
                        }
                    }
                    break;
                case "SOL":
                    _this.sendSolanaTransaction();
                    break;
                case "TRON":
                    _this.sendTronTransaction();
                    break;
                case "TERRA":
                    _this.sendTerraTransaction();
                    break;
                case "ONT":
                    _this.sendONTTransaction();
                    break;
                case "APTOS":
                    _this.sendAptosTransaction();
                    break;
                case "NEAR":
                    _this.sendNearTransaction();
                    break;
                case "COSMOS":
                    _this.sendCosmosTransaction();
                    break;
                case "STARKNET":
                    _this.sendStarknetTransaction();
                    break;
            }
        }, 200);
        return this;
    };
    Swap.prototype.getGas = function () {
        var _this = this;
        return new Promise(function (r, j) {
            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = this.chain.compiler;
                            switch (_a) {
                                case "EVM": return [3 /*break*/, 1];
                            }
                            return [3 /*break*/, 6];
                        case 1:
                            if (!this.isNew) return [3 /*break*/, 3];
                            _b = r;
                            return [4 /*yield*/, this.getGasNew()];
                        case 2:
                            _b.apply(void 0, [_d.sent()]);
                            return [3 /*break*/, 5];
                        case 3:
                            _c = r;
                            return [4 /*yield*/, this.getGasOld()];
                        case 4:
                            _c.apply(void 0, [_d.sent()]);
                            _d.label = 5;
                        case 5: return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            }); }, 200);
        });
    };
    Swap.prototype.sendONTTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, approve, swap, transaction, inAmount, inToken, instance_1, account;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.res, approve = _a.approve, swap = _a.swap, transaction = _a.transaction, inAmount = _a.inAmount, inToken = _a.inToken;
                        if (!(this.wallet.key === "OntoMobile")) return [3 /*break*/, 2];
                        instance_1 = new NotoMobile_1.NotoMobile(approve ? approve : swap);
                        return [4 /*yield*/, new Promise(function (r, q) {
                                instance_1.$on("close", function (result, action, account) {
                                    if (action === "login" && result === "success") {
                                        r(account);
                                    }
                                    else {
                                        q(action);
                                    }
                                });
                            })];
                    case 1:
                        account = _b.sent();
                        this.transactionHashCallback(account);
                        return [3 /*break*/, 3];
                    case 2:
                        if (approve) {
                            this.approveOnt(transaction, inAmount, inToken);
                        }
                        else {
                            this.sendOntTransactionSdk(transaction);
                        }
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Swap.prototype.sendSolanaTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a, setupTransaction, swapTransaction, cleanupTransaction, list, recentBlock_1, transactions, i, _i, transactions_1, transaction_1, txid, transaction, signed, signature, result, bytes, _b, msg, data, bytes, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        res = this.res;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 19, , 20]);
                        if (!(res.dex == "jupiter")) return [3 /*break*/, 11];
                        _a = JSON.parse(res.transaction), setupTransaction = _a.setupTransaction, swapTransaction = _a.swapTransaction, cleanupTransaction = _a.cleanupTransaction;
                        list = [
                            setupTransaction,
                            swapTransaction,
                            cleanupTransaction,
                        ].filter(Boolean);
                        return [4 /*yield*/, this.wallet.connection.getLatestBlockhash()];
                    case 2:
                        recentBlock_1 = _c.sent();
                        transactions = list.map(function (tx) {
                            var transaction = web3_js_1.Transaction.from(Buffer.from(tx, "base64"));
                            transaction.recentBlockhash = recentBlock_1.blockhash;
                            return transaction;
                        });
                        return [4 /*yield*/, this.wallet.sdk.signAllTransactions(transactions)];
                    case 3: return [4 /*yield*/, _c.sent()];
                    case 4:
                        _c.sent();
                        i = 0;
                        _i = 0, transactions_1 = transactions;
                        _c.label = 5;
                    case 5:
                        if (!(_i < transactions_1.length)) return [3 /*break*/, 10];
                        transaction_1 = transactions_1[_i];
                        i++;
                        return [4 /*yield*/, this.wallet.connection.sendRawTransaction(transaction_1.serialize({ requireAllSignatures: false }))];
                    case 6:
                        txid = _c.sent();
                        if (!(i < list.length)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.wallet.connection.confirmTransaction(txid)];
                    case 7:
                        _c.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        this.transactionHashCallback(txid);
                        _c.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 5];
                    case 10: return [2 /*return*/];
                    case 11:
                        transaction = web3_js_1.Transaction.from(Buffer.from(res.transaction, res.dex == "jupiter" ? "base64" : "hex"));
                        signed = null;
                        signature = null;
                        if (!this.wallet.sdk.isCoin98) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.wallet.sdk.request({
                                method: "sol_sign",
                                params: [transaction],
                            })];
                    case 12:
                        result = _c.sent();
                        console.log("Got signature, submitting transaction");
                        bytes = bs58.decode(result.signature);
                        transaction.signatures[0].signature = bytes;
                        transaction.feePayer = this.wallet.customPublicKey;
                        signed = transaction;
                        return [3 /*break*/, 17];
                    case 13:
                        if (!this.wallet.sdk.isSlopeWallet) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.wallet.sdk.signTransaction(bs58.encode(transaction.serializeMessage()))];
                    case 14:
                        _b = _c.sent(), msg = _b.msg, data = _b.data;
                        if (msg !== "ok")
                            return [2 /*return*/];
                        bytes = bs58.decode(data.signature);
                        transaction.signatures[0].signature = bytes;
                        transaction.feePayer = this.wallet.customPublicKey;
                        signed = transaction;
                        return [3 /*break*/, 17];
                    case 15: return [4 /*yield*/, this.wallet.sdk.signTransaction(transaction)];
                    case 16:
                        signed = _c.sent();
                        _c.label = 17;
                    case 17: return [4 /*yield*/, this.wallet.connection.sendRawTransaction(signed.serialize({
                            verifySignatures: false,
                            requireAllSignatures: false
                        }), {
                            skipPreflight: true,
                            preflightCommitment: "confirmed",
                        })];
                    case 18:
                        signature = _c.sent();
                        // this.receiptCallback(signature)
                        this.transactionHashCallback(signature);
                        return [3 /*break*/, 20];
                    case 19:
                        e_1 = _c.sent();
                        this.errorCallback(e_1.message);
                        return [3 /*break*/, 20];
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    Swap.prototype.sendStarknetTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var transaction, signature, transaction_hash, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        transaction = this.res.transaction;
                        console.log('sendStarknetTransaction 1', transaction, this.res);
                        return [4 /*yield*/, this.wallet.sdk.account.execute(transaction)];
                    case 1:
                        signature = _a.sent();
                        console.log('sendStarknetTransaction 2', signature);
                        transaction_hash = (signature || {}).transaction_hash;
                        this.transactionHashCallback(transaction_hash);
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        this.errorCallback(e_2.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Swap.prototype.sendAptosTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, transaction, hash, _a, result, hash, pendingTransaction, client_1, txn, hash, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, , 10]);
                        data = this.res.data;
                        console.log("sendAptosTransaction", data, this.wallet.key);
                        if (!(this.wallet.key === "MartianWallet")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.wallet.sdk.generateTransaction(this.wallet.address, data)];
                    case 1:
                        transaction = _b.sent();
                        return [4 /*yield*/, this.wallet.sdk.signAndSubmitTransaction(transaction)];
                    case 2:
                        hash = _b.sent();
                        this.transactionHashCallback(hash);
                        return [3 /*break*/, 8];
                    case 3:
                        if (!(this.wallet.key === "PontemWallet")) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.wallet.sdk.signAndSubmit(data)];
                    case 4:
                        _a = (_b.sent()).result, result = _a === void 0 ? {} : _a;
                        hash = result.hash;
                        console.log("sendAptosTransaction PontemWallet", hash);
                        this.transactionHashCallback(hash);
                        return [3 /*break*/, 8];
                    case 5: return [4 /*yield*/, this.wallet.sdk.signAndSubmitTransaction(data)];
                    case 6:
                        pendingTransaction = _b.sent();
                        client_1 = new aptos_1.AptosClient("https://fullnode.mainnet.aptoslabs.com/v1");
                        return [4 /*yield*/, client_1.waitForTransactionWithResult(pendingTransaction.hash)];
                    case 7:
                        txn = _b.sent();
                        console.log("sendAptosTransaction", txn);
                        hash = txn.hash;
                        this.transactionHashCallback(hash);
                        _b.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_1 = _b.sent();
                        // see "Errors"
                        this.errorCallback(error_1);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Swap.prototype._createTransaction = function (opt, wallet) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, localKey, accessKey, block, blockHash, publicKey, nonce;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accountId = wallet.sdk.getAccountId();
                        return [4 /*yield*/, wallet.sdk._connectedAccount.connection.signer.getPublicKey(accountId, wallet.sdk._connectedAccount.connection.networkId)];
                    case 1:
                        localKey = _a.sent();
                        return [4 /*yield*/, wallet.sdk._connectedAccount.accessKeyForTransaction(opt.receiverId, opt.actions, localKey)];
                    case 2:
                        accessKey = _a.sent();
                        if (!accessKey) {
                            throw new Error("Cannot find matching key for transaction sent to ".concat(opt.receiverId));
                        }
                        return [4 /*yield*/, wallet.sdk._connectedAccount.connection.provider.block({ finality: 'final' })];
                    case 3:
                        block = _a.sent();
                        blockHash = (0, borsh_1.baseDecode)(block.header.hash);
                        publicKey = wallet.PublicKey.from(accessKey.public_key);
                        nonce = accessKey.access_key.nonce + opt.nonceOffset;
                        return [2 /*return*/, wallet.createTransaction(accountId, publicKey, opt.receiverId, nonce, opt.actions, blockHash)];
                }
            });
        });
    };
    Swap.prototype.sendNearTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var transaction, wallet_2, transactions, currentTransactions, e_3, err, txResult, transaction_2, hash, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        transaction = this.res.transaction;
                        wallet_2 = this.wallet;
                        console.log("sendNearTransaction", transaction, wallet_2.key);
                        transactions = JSON.parse(Buffer.from(transaction, 'base64').toString());
                        if (!(wallet_2.key === "NearWallet" || wallet_2.key === "MyNearWallet")) return [3 /*break*/, 6];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, Promise.all(transactions.map(function (t, i) {
                                return _this._createTransaction({
                                    receiverId: t.receiverId,
                                    nonceOffset: i + 1,
                                    actions: t.functionCalls.map(function (fc) {
                                        var data = wallet_2.functionCall(fc.methodName, fc.args, fc.gas ? new bn_js_1.default(fc.gas) : new bn_js_1.default('100000000000000'), 
                                        // fc.deposit ? new BN8(fc.deposit) : new BN8('0')
                                        fc.deposit ? new bn_js_1.default(wallet_2.utils.format.parseNearAmount(fc.deposit) || '0') : new bn_js_1.default('0'));
                                        return data;
                                    })
                                }, wallet_2);
                            }))];
                    case 2:
                        currentTransactions = _a.sent();
                        return [4 /*yield*/, wallet_2.sdk.requestSignTransactions(currentTransactions)
                            // this.transactionHashCallback(hash);
                        ];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_3 = _a.sent();
                        err = e_3;
                        console.warn(e_3);
                        console.log("Error: " + e_3.message);
                        this.errorCallback(e_3.message);
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        if (!(wallet_2.key === "MeteorWallet" || wallet_2.key === "SenderWallet")) return [3 /*break*/, 8];
                        return [4 /*yield*/, wallet_2.sdk.signAndSendTransactions({ transactions: transactions.map(function (t, i) {
                                    return {
                                        receiverId: t.receiverId,
                                        nonceOffset: i + 1,
                                        actions: t.functionCalls.map(function (fc) {
                                            var actions = wallet_2.functionCall(fc.methodName, fc.args, fc.gas ? fc.gas : '100000000000000', 
                                            // fc.deposit ? new BN8(fc.deposit) : new BN8('0')
                                            fc.deposit ? wallet_2.utils.format.parseNearAmount(fc.deposit) : '0');
                                            console.log("FunctionCall", actions);
                                            return {
                                                type: "FunctionCall",
                                                enum: actions.enum,
                                                params: actions.functionCall
                                            };
                                        })
                                    };
                                })
                            })];
                    case 7:
                        txResult = _a.sent();
                        console.log('signAndSendTransactions', txResult);
                        transaction_2 = { hash: "" };
                        if (txResult && txResult.length === 1) {
                            transaction_2 = txResult[txResult.length - 1].transaction || {};
                        }
                        else if (txResult && txResult.length > 1) {
                            transaction_2 = txResult.filter(function (item) {
                                var _a = (item && item.transaction || {}).actions, actions = _a === void 0 ? [] : _a;
                                var _actions = actions.filter(function (fc) {
                                    var _a = fc.FunctionCall, FunctionCall = _a === void 0 ? {} : _a;
                                    var method_name = FunctionCall.method_name;
                                    return method_name === 'ft_transfer_call';
                                });
                                return _actions && _actions.length > 0;
                            });
                            if (transaction_2 && transaction_2.length) {
                                transaction_2 = transaction_2[0].transaction;
                            }
                        }
                        console.log('signAndSendTransactions', transaction_2);
                        hash = transaction_2.hash;
                        this.transactionHashCallback(hash);
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_2 = _a.sent();
                        // see "Errors"
                        this.errorCallback(error_2);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Swap.prototype.sendCosmosTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, transaction, cosmosReceiver, wallet, transactions, result, e_4, err, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _a = this.res, transaction = _a.transaction, cosmosReceiver = _a.cosmosReceiver;
                        wallet = this.wallet;
                        console.log("sendNearTransaction", transaction, wallet.key);
                        if (!(wallet.key === "KeplrWallet")) return [3 /*break*/, 4];
                        transactions = JSON.parse(Buffer.from(transaction, 'base64').toString());
                        if (cosmosReceiver && transactions.msgTransfer) {
                            transactions.msgTransfer.value.receiver = cosmosReceiver;
                            transactions.msg.push(transactions.msgTransfer);
                        }
                        console.log('transactions', transactions);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, wallet.sdk.signAndBroadcast(transactions.account, transactions.msg, transactions.fee, transactions.memo)];
                    case 2:
                        result = _b.sent();
                        // assertIsDeliverTxSuccess(result);
                        // console.log('result', result)
                        if (result.code !== undefined && result.code !== 0) {
                            this.errorCallback(result.log || result.rawLog);
                        }
                        else {
                            this.transactionHashCallback(result.transactionHash);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_4 = _b.sent();
                        err = e_4;
                        console.warn(e_4);
                        console.log("Error: " + e_4.message);
                        this.errorCallback(e_4.message);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_3 = _b.sent();
                        // see "Errors"
                        this.errorCallback(error_3);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Swap.prototype.getGasOld = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, inToken, inAmount, data, to, gas;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.res, inToken = _a.inToken, inAmount = _a.inAmount, data = _a.data, to = _a.to;
                        return [4 /*yield*/, this.wallet.sdk.eth.estimateGas({
                                from: this.wallet.address,
                                to: to,
                                data: data,
                                value: wallet_1.chainsObj.isNativeToken(this.chain.key, inToken.address)
                                    ? inAmount
                                    : 0,
                            })];
                    case 1:
                        gas = _b.sent();
                        return [2 /*return*/, Math.ceil(gas * 1.15)];
                }
            });
        });
    };
    Swap.prototype.getGasNew = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, inToken, inAmount, outAmount, outToken, data, to, myWallet, contract, invitee, path, amounts, swapAddr, swapExtraData, gas, e_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        console.log('getGasNew');
                        _a = this.res, inToken = _a.inToken, inAmount = _a.inAmount, outAmount = _a.outAmount, outToken = _a.outToken, data = _a.data, to = _a.to;
                        myWallet = this.wallet.sdk;
                        contract = new myWallet.eth.Contract(aggregator_1.aggregator, (0, config_1.getProxyContract)(this.chain.key));
                        invitee = this.wallet.address;
                        path = [inToken.address, outToken.address];
                        amounts = [inAmount, outAmount];
                        swapAddr = to;
                        swapExtraData = data;
                        return [4 /*yield*/, contract.methods
                                .swap(invitee, path, amounts, swapAddr, swapExtraData)
                                .estimateGas({
                                from: this.wallet.address,
                                value: wallet_1.chainsObj.isNativeToken(this.chain.key, inToken.address)
                                    ? inAmount
                                    : 0,
                            })];
                    case 1:
                        gas = _b.sent();
                        return [2 /*return*/, Math.ceil(gas * 1.5)];
                    case 2:
                        e_5 = _b.sent();
                        console.log('getGasNew error', e_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Swap.prototype.sendEthTransactionNew = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, inToken, inAmount, outAmount, outToken, data, to, ethGasPrice, gasPrice, myWallet, contract, invitee, path, amounts, swapAddr, swapExtraData, swapParams, maxFeePerGas, maxPriorityFeePerGas;
            var _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.res, inToken = _a.inToken, inAmount = _a.inAmount, outAmount = _a.outAmount, outToken = _a.outToken, data = _a.data, to = _a.to, ethGasPrice = _a.ethGasPrice, gasPrice = _a.gasPrice;
                        console.log('sendEthTransactionNew');
                        myWallet = this.wallet.sdk;
                        contract = new myWallet.eth.Contract(aggregator_1.aggregator, (0, config_1.getProxyContract)(this.chain.key));
                        invitee = this.wallet.address;
                        path = [inToken.address, outToken.address];
                        amounts = [inAmount, outAmount];
                        swapAddr = to;
                        swapExtraData = data;
                        _b = {
                            from: this.wallet.address
                        };
                        return [4 /*yield*/, this.getGasNew()];
                    case 1:
                        swapParams = (_b.gas = _c.sent(),
                            _b.to = to,
                            _b.data = data,
                            _b);
                        if (ethGasPrice) {
                            maxFeePerGas = ethGasPrice.maxFeePerGas, maxPriorityFeePerGas = ethGasPrice.maxPriorityFeePerGas;
                            if (maxFeePerGas && maxPriorityFeePerGas) {
                                swapParams.maxFeePerGas = +maxFeePerGas;
                                swapParams.maxPriorityFeePerGas = +maxPriorityFeePerGas;
                            }
                        }
                        else {
                            swapParams.gasPrice = +gasPrice;
                        }
                        if (wallet_1.chainsObj.isNativeToken(this.chain.key, inToken.address)) {
                            swapParams.value = inAmount;
                        }
                        contract.methods
                            .swap(invitee, path, amounts, swapAddr, swapExtraData)
                            .send(swapParams)
                            .on("error", function (error) {
                            _this.errorCallback(error);
                        })
                            .on("transactionHash", function (transactionHash) {
                            _this.transactionHashCallback(transactionHash);
                        })
                            .on("receipt", function (receipt) {
                            _this.receiptCallback(receipt);
                            // this.getSuccess()
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Swap.prototype.sendEthTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, inToken, inAmount, data, to, ethGasPrice, gasPrice, estimatedGas, swapParams, maxFeePerGas, maxPriorityFeePerGas, safeTxHash, e_6, gas, e_7;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.res, inToken = _a.inToken, inAmount = _a.inAmount, data = _a.data, to = _a.to, ethGasPrice = _a.ethGasPrice, gasPrice = _a.gasPrice, estimatedGas = _a.estimatedGas;
                        console.log('sendEthTransaction');
                        swapParams = {
                            from: this.wallet.address,
                            to: to,
                            data: data,
                        };
                        if (ethGasPrice) {
                            maxFeePerGas = ethGasPrice.maxFeePerGas, maxPriorityFeePerGas = ethGasPrice.maxPriorityFeePerGas;
                            if (maxFeePerGas && maxPriorityFeePerGas) {
                                swapParams.maxFeePerGas = +maxFeePerGas;
                                swapParams.maxPriorityFeePerGas = +maxPriorityFeePerGas;
                            }
                        }
                        else if (gasPrice) {
                            swapParams.gasPrice = +gasPrice;
                        }
                        if (wallet_1.chainsObj.isNativeToken(this.chain.key, inToken.address)) {
                            swapParams.value = inAmount;
                        }
                        if (!(this.wallet.key === "GnosisSafeWallet")) return [3 /*break*/, 5];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.wallet.sdk.txs.send({
                                txs: [
                                    {
                                        to: swapParams.to,
                                        value: swapParams.value || "0",
                                        data: swapParams.data,
                                    },
                                ],
                            })];
                    case 2:
                        safeTxHash = (_b.sent()).safeTxHash;
                        this.getGnosisSafeTransaction(safeTxHash);
                        return [3 /*break*/, 4];
                    case 3:
                        e_6 = _b.sent();
                        this.errorCallback((e_6 && e_6.message) || e_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                    case 5:
                        if (this.wallet.key === "LedgerWallet") {
                            swapParams.estimatedGas = estimatedGas;
                            this.signEthTransactionByLedger(swapParams);
                            return [2 /*return*/];
                        }
                        _b.label = 6;
                    case 6:
                        _b.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, this.getGasOld()];
                    case 7:
                        gas = _b.sent();
                        swapParams.gas = gas;
                        return [3 /*break*/, 9];
                    case 8:
                        e_7 = _b.sent();
                        if (e_7 && e_7.message.indexOf("JSON-RPC error.") != -1) {
                            e_7 = JSON.parse(e_7.message.split("JSON-RPC error.")[1]);
                        }
                        this.errorCallback((e_7 && e_7.message) || e_7);
                        return [3 /*break*/, 9];
                    case 9:
                        this.wallet.sdk.eth
                            .sendTransaction(swapParams)
                            .on("error", function (error) {
                            _this.errorCallback(error);
                        })
                            .on("transactionHash", function (transactionHash) {
                            _this.transactionHashCallback(transactionHash);
                        })
                            .on("receipt", function (receipt) {
                            _this.receiptCallback(receipt);
                            // this.getSuccess()
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Swap.prototype.signEthTransactionByLedger = function (swapParams) {
        return __awaiter(this, void 0, void 0, function () {
            var account, myWallet, gasPrice, txParams, serializedTx, signature, signedTx, hash, e_8;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        console.log('signEthTransactionByLedger params', swapParams);
                        account = this.wallet.address;
                        myWallet = this.wallet.sdk;
                        return [4 /*yield*/, providerEth.getGasPrice()];
                    case 1:
                        gasPrice = _b.sent();
                        _a = {
                            to: swapParams.to,
                            gasPrice: gasPrice._hex,
                            gasLimit: web3_1.default.utils.numberToHex(swapParams.estimatedGas * 2)
                        };
                        return [4 /*yield*/, providerEth.getTransactionCount(account, "latest")];
                    case 2:
                        txParams = (_a.nonce = _b.sent(),
                            _a.chainId = 1,
                            _a.data = swapParams.data,
                            _a.value = web3_1.default.utils.numberToHex(swapParams.value || 0),
                            _a);
                        serializedTx = ethers_1.ethers.utils.serializeTransaction(txParams).slice(2);
                        console.log('signEthTransactionByLedger serializeTransaction', txParams, serializedTx);
                        return [4 /*yield*/, myWallet.signTransaction("44'/60'/0'/0/0", serializedTx)];
                    case 3:
                        signature = _b.sent();
                        console.log('signEthTransactionByLedger signature1', signature);
                        signature.r = "0x" + signature.r;
                        signature.s = "0x" + signature.s;
                        signature.v = parseInt("0x" + signature.v);
                        signature.from = account;
                        console.log('signEthTransactionByLedger signature2', signature);
                        signedTx = ethers_1.ethers.utils.serializeTransaction(txParams, signature);
                        console.log('signEthTransactionByLedger signedTx', signedTx);
                        return [4 /*yield*/, providerEth.sendTransaction(signedTx)];
                    case 4:
                        hash = (_b.sent()).hash;
                        console.log('signEthTransactionByLedger hash', hash);
                        this.transactionHashCallback(hash);
                        return [3 /*break*/, 6];
                    case 5:
                        e_8 = _b.sent();
                        this.errorCallback(e_8);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Swap.prototype.getGnosisSafeTransaction = function (safeTxHash) {
        return __awaiter(this, void 0, void 0, function () {
            var txHash;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.wallet.sdk.txs.getBySafeTxHash(safeTxHash)];
                    case 1:
                        txHash = (_a.sent()).txHash;
                        console.log("safeTxHash", safeTxHash, txHash);
                        if (txHash) {
                            this.transactionHashCallback(txHash);
                        }
                        else {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.getGnosisSafeTransaction(safeTxHash)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, 2000);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Swap.prototype.sendTronTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, inToken, outToken, inAmount, outAmount, minOutAmount, addresses, calldata, offsets, gasLimitsAndValues, abi, contract, _contract, swapParams, e_9;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.res, inToken = _a.inToken, outToken = _a.outToken, inAmount = _a.inAmount, outAmount = _a.outAmount, minOutAmount = _a.minOutAmount, addresses = _a.addresses, calldata = _a.calldata, offsets = _a.offsets, gasLimitsAndValues = _a.gasLimitsAndValues;
                        abi = [
                            {
                                "outputs": [
                                    {
                                        "name": "outAmount",
                                        "type": "uint256"
                                    }
                                ],
                                "inputs": [
                                    {
                                        "name": "inToken",
                                        "type": "address"
                                    },
                                    {
                                        "name": "outToken",
                                        "type": "address"
                                    },
                                    {
                                        "name": "inAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "name": "minOutAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "name": "referrer",
                                        "type": "address"
                                    },
                                    {
                                        "name": "addressesToCall",
                                        "type": "address[]"
                                    },
                                    {
                                        "name": "dataToCall",
                                        "type": "bytes"
                                    },
                                    {
                                        "name": "offsets",
                                        "type": "uint256[]"
                                    },
                                    {
                                        "name": "gasLimitsAndValues",
                                        "type": "uint256[]"
                                    }
                                ],
                                "name": "swap",
                                "stateMutability": "Payable",
                                "type": "Function"
                            }
                        ];
                        contract = "TAPJbS45zHWv6ogXFfnw3seiCSfb3RPa6V";
                        console.log("sendTronTransaction", this.res);
                        return [4 /*yield*/, this.wallet.sdk.contract(abi, contract)];
                    case 1:
                        _contract = _b.sent();
                        swapParams = {
                            feeLimit: 100000000,
                        };
                        if (inToken.toLowerCase() === "t9yd14nj9j7xab4dbgeix9h8unkkhxuwwb") {
                            swapParams.callValue = inAmount;
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, _contract.methods
                                .swap(inToken, outToken, inAmount, minOutAmount, '0x0000000000000000000000000000000000000000', addresses, calldata, offsets, gasLimitsAndValues).send(swapParams, function (result, txHash) {
                                console.log("state.multicall.methods.swap", result);
                                if (result) {
                                    _this.errorCallback(result.message || result);
                                }
                                else {
                                    _this.transactionHashCallback(txHash);
                                }
                            })];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_9 = _b.sent();
                        this.errorCallback(e_9 || e_9.message);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Swap.prototype.sendTerraTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, address, gasPrices, msg, _a, fee, accountInfo, e_10;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, axios_1.default.get("https://ethapi.openocean.finance/v1/terra/exchange")];
                    case 1:
                        data = (_b.sent()).data;
                        address = this.wallet.address;
                        return [4 /*yield*/, axios_1.default.get("https://ethapi.openocean.finance/v1/terra/gas-price")];
                    case 2:
                        gasPrices = _b.sent();
                        return [4 /*yield*/, this.getTerraMsgExecuteContract(this.res, data, address, gasPrices.data)];
                    case 3:
                        msg = _b.sent();
                        return [4 /*yield*/, this.getTerraFee(address, msg, gasPrices.data)];
                    case 4:
                        _a = _b.sent(), fee = _a.fee, accountInfo = _a.accountInfo;
                        return [4 /*yield*/, this.wallet.sdk.post({
                                msgs: [msg],
                                gasAdjustment: 1.5,
                                waitForConfirmation: true,
                                fee: fee,
                                account_number: accountInfo.account_number,
                                sequence: accountInfo.sequence,
                                purgeQueue: true,
                            })];
                    case 5:
                        _b.sent();
                        this.wallet.sdk.on("onPost", function (data) {
                            var _a = data || {}, result = _a.result, success = _a.success;
                            if (success) {
                                var txhash = (result || {}).txhash;
                                _this.transactionHashCallback(txhash);
                            }
                            else {
                                _this.errorCallback("Transaction failed");
                            }
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        e_10 = _b.sent();
                        this.errorCallback(e_10.message || e_10);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Swap.prototype.approveOnt = function (transaction, _amount, inToken) {
        return __awaiter(this, void 0, void 0, function () {
            var scriptHash, operation, gasLimit, args, params, result, e_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        scriptHash = transaction.scriptHash, operation = transaction.operation, gasLimit = transaction.gasLimit, args = transaction.args;
                        params = {
                            contract: inToken,
                            operation: "approve",
                            args: [
                                {
                                    type: "Address",
                                    value: this.wallet.address,
                                },
                                {
                                    type: "ByteArray",
                                    value: ontology_ts_sdk_1.utils.reverseHex(scriptHash),
                                },
                                {
                                    type: "ByteArray",
                                    value: ontology_ts_sdk_1.utils.bigIntToBytes(_amount + ""),
                                },
                            ],
                            gasPrice: 2500,
                            gasLimit: 40000,
                        };
                        return [4 /*yield*/, ontology_dapi_1.client.api.smartContract.invoke(params)];
                    case 1:
                        result = _a.sent();
                        console.log("approveOnt params, result", params, result);
                        this.sendOntTransactionSdk(transaction);
                        return [3 /*break*/, 3];
                    case 2:
                        e_11 = _a.sent();
                        // tslint:disable-next-line:no-console
                        console.log("onScCall error:", e_11);
                        this.errorCallback((e_11 && e_11.message) || e_11);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Swap.prototype.sendOntTransactionSdk = function (transaction) {
        return __awaiter(this, void 0, void 0, function () {
            var scriptHash, operation, gasLimit, args, params, result, e_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        scriptHash = transaction.scriptHash, operation = transaction.operation, gasLimit = transaction.gasLimit, args = transaction.args;
                        params = {
                            scriptHash: scriptHash,
                            operation: operation,
                            args: args.map(function (item) {
                                var type = item.type;
                                if (["Long", "Integer"].indexOf(type) >= 0) {
                                    item.value = Number(item.value);
                                }
                                return item;
                            }),
                            gasPrice: 2500,
                            gasLimit: 60000,
                            requireIdentity: false,
                        };
                        return [4 /*yield*/, ontology_dapi_1.client.api.smartContract.invoke(params)];
                    case 1:
                        result = _a.sent();
                        if (result && result.transaction) {
                            this.transactionHashCallback(result.transaction);
                        }
                        else {
                            this.errorCallback("Progress transactions submitted.");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_12 = _a.sent();
                        this.errorCallback((e_12 && e_12.message) || e_12);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Swap.prototype.getTerraFee = function (address, msg, gasPrices) {
        return __awaiter(this, void 0, void 0, function () {
            var terra, accountInfo, fee, e_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        terra = new terra_js_1.LCDClient({
                            chainID: "columbus-5",
                            URL: "https://lcd.terra.dev",
                            gasPrices: gasPrices,
                            gasAdjustment: 1.75,
                        });
                        return [4 /*yield*/, terra.auth.accountInfo(address)];
                    case 1:
                        accountInfo = _a.sent();
                        return [4 /*yield*/, terra.tx.estimateFee([
                                {
                                    sequenceNumber: accountInfo.sequence,
                                    publicKey: accountInfo.public_key,
                                },
                            ], {
                                msgs: [msg],
                                feeDenoms: ["uusd"],
                            })];
                    case 2:
                        fee = _a.sent();
                        return [2 /*return*/, {
                                fee: fee,
                                accountInfo: accountInfo,
                            }];
                    case 3:
                        e_13 = _a.sent();
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Swap.prototype.getTerraMsgExecuteContract = function (res, res2, sender, gasPrices) {
        try {
            var inToken = res.inToken, inAmount = res.inAmount, data = res.data;
            var dataObj = data.msgs.map(function (item) {
                return JSON.parse(item);
            });
            var execute_swap_operations = dataObj[0].execute_msg.execute_swap_operations;
            var contract = res2.contract;
            var address = inToken.address;
            var msg = null;
            if (gasPrices[address]) {
                var coins = {};
                coins[address] = +inAmount;
                msg = new terra_js_1.MsgExecuteContract(sender, contract, {
                    execute_swap_operations: execute_swap_operations,
                }, coins);
            }
            else {
                msg = new terra_js_1.MsgExecuteContract(sender, address, {
                    send: {
                        contract: contract,
                        amount: inAmount,
                        msg: btoa(JSON.stringify({ execute_swap_operations: execute_swap_operations })),
                    },
                }, []);
            }
            return msg;
        }
        catch (e) {
            return null;
        }
    };
    Swap.prototype.on = function (events, callback) {
        if (events === "error") {
            this.errorCallback = callback;
        }
        else if (events === "transactionHash") {
            this.transactionHashCallback = callback;
        }
        else if (events === "receipt") {
            this.receiptCallback = callback;
        }
        else if (events === "success") {
            this.successCallback = callback;
        }
        else if (events === "getDataSuccess") {
            this.getDataCallback = callback;
        }
        return this;
    };
    return Swap;
}());
exports.Swap = Swap;
