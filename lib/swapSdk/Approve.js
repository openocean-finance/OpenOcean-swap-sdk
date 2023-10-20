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
exports.Approve = void 0;
var web3_1 = __importDefault(require("web3"));
var ethers_1 = require("ethers");
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var providerEth = new ethers_1.ethers.providers.JsonRpcProvider({
    url: "https://rpc.ankr.com/eth"
});
var Approve = /** @class */ (function () {
    function Approve(contract, wallet) {
        this.errorCallback = function () { };
        this.transactionHashCallback = function () { };
        this.receiptCallback = function () { };
        this.successCallback = function () { };
        this.contract = contract;
        this.wallet = wallet;
    }
    Approve.prototype.send = function (reqApproveVo, address) {
        return __awaiter(this, void 0, void 0, function () {
            var _gasPrice, e_1, web3, data, safeTxHash, e_2, hash, e_3, _a, _b, gasAmount, error_1, json;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.account = address;
                        this.key = 0;
                        this.approveContract = reqApproveVo.approveContract;
                        this.tokenAddress = reqApproveVo.tokenAddress;
                        if (reqApproveVo.gasPrice && (String(reqApproveVo.gasPrice).indexOf('.') > -1 || Number(reqApproveVo.gasPrice) < Math.pow(10, 6))) {
                            reqApproveVo.gasPrice = new bignumber_js_1.default(reqApproveVo.gasPrice + '').times(Math.pow(10, 9)).toFixed(0);
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.wallet.sdk.eth.getGasPrice()];
                    case 2:
                        _gasPrice = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _c.sent();
                        console.log('this.wallet.sdk.eth.getGasPrice', e_1);
                        return [3 /*break*/, 4];
                    case 4:
                        if (_gasPrice && reqApproveVo.gasPrice) {
                            reqApproveVo.gasPrice = (0, bignumber_js_1.default)(_gasPrice).comparedTo(reqApproveVo.gasPrice) > 0 ? reqApproveVo.gasPrice : _gasPrice;
                        }
                        else if (_gasPrice && !reqApproveVo.gasPrice) {
                            reqApproveVo.gasPrice = _gasPrice;
                        }
                        if (reqApproveVo.decimals) {
                            reqApproveVo.amount = (0, bignumber_js_1.default)(reqApproveVo.amount).times(Math.pow(10, reqApproveVo.decimals)).toFixed(0);
                        }
                        if (!(this.wallet.key === "GnosisSafeWallet")) return [3 /*break*/, 9];
                        web3 = new web3_1.default();
                        data = web3.eth.abi.encodeFunctionCall({
                            inputs: [
                                {
                                    name: "spender",
                                    type: "address",
                                },
                                {
                                    name: "value",
                                    type: "uint256",
                                },
                            ],
                            name: "approve",
                            type: "function",
                        }, [this.approveContract, reqApproveVo.amount]);
                        console.log("data", this.approveContract, reqApproveVo.amount, data);
                        _c.label = 5;
                    case 5:
                        _c.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.wallet.sdk.txs.send({
                                txs: [
                                    {
                                        to: this.tokenAddress,
                                        value: 0,
                                        data: data,
                                    },
                                ],
                            })];
                    case 6:
                        safeTxHash = (_c.sent()).safeTxHash;
                        console.log("safeTxHash", safeTxHash);
                        setTimeout(function () {
                            console.log("successCallback");
                            _this.successCallback(1);
                        }, 3000);
                        return [3 /*break*/, 8];
                    case 7:
                        e_2 = _c.sent();
                        setTimeout(function () {
                            _this.errorCallback(e_2);
                        }, 500);
                        return [3 /*break*/, 8];
                    case 8: return [3 /*break*/, 27];
                    case 9:
                        if (!(this.wallet.key === "LedgerWallet")) return [3 /*break*/, 10];
                        this.signEthTransactionByLedger(reqApproveVo, address);
                        return [3 /*break*/, 27];
                    case 10:
                        if (!(this.wallet.key === "TronLink")) return [3 /*break*/, 18];
                        this.approveContract = "TRtQA3D9BFRLFw3rajKBziAof2eAWkAL7B";
                        _c.label = 11;
                    case 11:
                        _c.trys.push([11, 16, , 17]);
                        hash = "";
                        this.amount = reqApproveVo.amount + "";
                        if (!([
                            "TMwFHYXLJaRUPeW6421aqXL4ZEzPRFGkGT",
                            "TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9",
                            "TKfjV9RNKJJCqPvBtK8L7Knykh7DNWvnYt",
                            "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR"
                        ].indexOf(this.tokenAddress) >= 0)) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.contract.methods
                                .approve(this.approveContract)
                                .send({ feeLimit: 100000000 })];
                    case 12:
                        hash = _c.sent();
                        return [3 /*break*/, 15];
                    case 13:
                        console.log('send approve', this.amount);
                        return [4 /*yield*/, this.contract.methods
                                .approve(this.approveContract, this.amount)
                                .send({ feeLimit: 100000000 })];
                    case 14:
                        hash = _c.sent();
                        _c.label = 15;
                    case 15:
                        console.log('hash', hash);
                        this.successCallback(1);
                        return [3 /*break*/, 17];
                    case 16:
                        e_3 = _c.sent();
                        this.errorCallback(e_3);
                        return [3 /*break*/, 17];
                    case 17: return [3 /*break*/, 27];
                    case 18:
                        if (!!reqApproveVo.amount) return [3 /*break*/, 20];
                        _a = reqApproveVo;
                        return [4 /*yield*/, this.contract.methods.totalSupply().call()];
                    case 19:
                        _a.amount = _c.sent();
                        _c.label = 20;
                    case 20:
                        if (!(this.tokenAddress === "0xfa17b330bcc4e7f3e2456996d89a5a54ab044831")) return [3 /*break*/, 22];
                        _b = reqApproveVo;
                        return [4 /*yield*/, this.contract.methods
                                .balanceOf(this.account)
                                .call()];
                    case 21:
                        _b.amount = _c.sent();
                        if (Number(reqApproveVo.amount) == 0) {
                            this.errorCallback("Insufficient Balance.");
                            return [2 /*return*/];
                        }
                        _c.label = 22;
                    case 22:
                        this.amount = reqApproveVo.amount + "";
                        gasAmount = "80000";
                        _c.label = 23;
                    case 23:
                        _c.trys.push([23, 25, , 26]);
                        return [4 /*yield*/, this.contract.methods
                                .approve(this.approveContract, this.amount)
                                .estimateGas({
                                from: this.account,
                            })];
                    case 24:
                        gasAmount = _c.sent();
                        return [3 /*break*/, 26];
                    case 25:
                        error_1 = _c.sent();
                        setTimeout(function () {
                            _this.errorCallback(error_1);
                        }, 500);
                        return [2 /*return*/];
                    case 26:
                        json = {
                            from: address,
                        };
                        if (reqApproveVo.gasPrice) {
                            json.gasPrice = reqApproveVo.gasPrice;
                        }
                        this.contract.methods
                            .approve(this.approveContract, this.amount)
                            .send(json)
                            .on("error", function (error) {
                            console.log('eee error1111', error);
                            _this.errorCallback(error);
                        })
                            .on("transactionHash", function (transactionHash) {
                            console.log('eee transactionHash');
                            _this.transactionHashCallback(transactionHash);
                        })
                            .on("receipt", function (receipt) {
                            console.log('eee receipt');
                            _this.receiptCallback(receipt);
                            _this.getSuccess(receipt);
                        });
                        _c.label = 27;
                    case 27: return [2 /*return*/];
                }
            });
        });
    };
    Approve.prototype.on = function (events, callback) {
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
        return this;
    };
    Approve.prototype.signEthTransactionByLedger = function (reqApproveVo, address) {
        return __awaiter(this, void 0, void 0, function () {
            var web3, data, account, myWallet, gasPrice, txParams, serializedTx, signature, signedTx, hash, e_4;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        web3 = new web3_1.default();
                        data = web3.eth.abi.encodeFunctionCall({
                            inputs: [
                                {
                                    name: "spender",
                                    type: "address",
                                },
                                {
                                    name: "value",
                                    type: "uint256",
                                },
                            ],
                            name: "approve",
                            type: "function",
                        }, [reqApproveVo.approveContract, reqApproveVo.amount]);
                        console.log("data", reqApproveVo.approveContract, reqApproveVo.amount, data);
                        console.log('signEthTransactionByLedger params', reqApproveVo);
                        account = address;
                        myWallet = this.wallet.sdk;
                        return [4 /*yield*/, providerEth.getGasPrice()];
                    case 1:
                        gasPrice = _b.sent();
                        _a = {
                            to: this.tokenAddress,
                            gasPrice: gasPrice._hex,
                            gasLimit: web3_1.default.utils.numberToHex(50000 * 2)
                        };
                        return [4 /*yield*/, providerEth.getTransactionCount(account, "latest")];
                    case 2:
                        txParams = (_a.nonce = _b.sent(),
                            _a.chainId = 1,
                            _a.data = data,
                            _a.value = web3_1.default.utils.numberToHex(0),
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
                        setTimeout(function () {
                            console.log("successCallback");
                            _this.successCallback(1);
                        }, 3000);
                        return [3 /*break*/, 6];
                    case 5:
                        e_4 = _b.sent();
                        setTimeout(function () {
                            _this.errorCallback(e_4);
                        }, 500);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Approve.prototype.getSuccess = function (receipt) {
        return __awaiter(this, void 0, void 0, function () {
            var balance;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.methods
                            .allowance(this.account, this.approveContract)
                            .call()];
                    case 1:
                        balance = _a.sent();
                        this.key++;
                        if (this.key > 20) {
                            this.successCallback(balance);
                            return [2 /*return*/];
                        }
                        ;
                        if (balance >= Number(this.amount)) {
                            this.successCallback(balance);
                        }
                        else {
                            setTimeout(function () {
                                _this.getSuccess(receipt);
                            }, 2000);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Approve;
}());
exports.Approve = Approve;
