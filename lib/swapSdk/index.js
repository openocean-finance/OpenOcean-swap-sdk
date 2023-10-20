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
exports.swapSdk = exports.SwapSdk = void 0;
var RequestVo_1 = require("./RequestVo");
var ajx_1 = require("../utils/ajx");
var utils_1 = require("../utils");
var Approve_1 = require("./Approve");
var config_1 = require("../config");
var Swap_1 = require("./Swap");
var getBalance_1 = require("./getBalance");
var getAllowance_1 = require("./getAllowance");
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var wallet_1 = require("@openocean.finance/wallet");
var SwapSdk = /** @class */ (function () {
    function SwapSdk() {
        this.i = 0;
    }
    SwapSdk.prototype.setApi = function (api) {
        this.api = api;
    };
    SwapSdk.prototype.swapQuote = function (reqSwapVo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.wallet)
                            throw new Error('No linked wallet');
                        if (this.wallet && this.chain.key != reqSwapVo.chain) {
                            throw new Error('Need to switch chains');
                        }
                        return [4 /*yield*/, this.api.swapQuote(reqSwapVo)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SwapSdk.prototype.swap = function (swapData) {
        var swap = new Swap_1.Swap(swapData, this.wallet, this.chain);
        setTimeout(function () {
            swap.send();
        }, 200);
        return swap;
    };
    SwapSdk.prototype.fastSwap = function (swapData) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var chainId, _gasPrice, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.chain.compiler == 'EVM' && swapData.chainId && this.wallet.key !== "GnosisSafeWallet")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.wallet.sdk.eth.getChainId()];
                    case 1:
                        chainId = _a.sent();
                        console.log('chainId', chainId, swapData.chainId);
                        if (chainId != swapData.chainId || !chainId) {
                            reject({
                                message: "Please be aware: Your wallet's network is different from OpenOcean's. Switch networks before sending transaction."
                            });
                            return [2 /*return*/];
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.wallet.sdk.eth.getGasPrice()];
                    case 3:
                        _gasPrice = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.log('this.wallet.sdk.eth.getGasPrice', e_1);
                        return [3 /*break*/, 5];
                    case 5:
                        if (_gasPrice && swapData.gasPrice) {
                            swapData.gasPrice = (0, bignumber_js_1.default)(_gasPrice).comparedTo(swapData.gasPrice) > 0 ? swapData.gasPrice : _gasPrice;
                        }
                        else if (_gasPrice && !swapData.gasPrice) {
                            swapData.gasPrice = _gasPrice;
                        }
                        this.swap(swapData)
                            .on('transactionHash', resolve)
                            .on('error', reject);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    SwapSdk.prototype.getGas = function (swapData) {
        var swap = new Swap_1.Swap(swapData, this.wallet, this.chain);
        return swap.getGas();
    };
    SwapSdk.prototype.getGasLocal = function (swapData) {
        var swap = new Swap_1.Swap(swapData, this.wallet, this.chain, true);
        return swap.getGas();
    };
    SwapSdk.prototype.approve = function (reqApproveVo) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, contract, approve;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.wallet)
                            throw new Error('No linked wallet');
                        if (this.wallet && this.chain.key != reqApproveVo.chain)
                            throw new Error('Network error');
                        return [4 /*yield*/, (0, ajx_1.validateReq)(reqApproveVo, RequestVo_1.ReqApproveVo)];
                    case 1:
                        errors = _a.sent();
                        if (errors)
                            throw new Error(errors);
                        if (!reqApproveVo.tokenAbi)
                            reqApproveVo.tokenAbi = config_1.ERC20_abi;
                        contract = null;
                        if (!(this.wallet.key === "TronLink")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.wallet.sdk.contract().at(reqApproveVo.tokenAddress)];
                    case 2:
                        contract = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        if (this.wallet.sdk && this.wallet.sdk.eth && this.wallet.sdk.eth.Contract) {
                            contract = new this.wallet.sdk.eth.Contract(reqApproveVo.tokenAbi, reqApproveVo.tokenAddress);
                            if (!contract || !contract.methods || !contract.methods.approve)
                                throw new Error('Contract error');
                        }
                        _a.label = 4;
                    case 4:
                        approve = new Approve_1.Approve(contract, this.wallet);
                        setTimeout(function () {
                            approve.send(reqApproveVo, _this.wallet.address);
                        }, 200);
                        return [2 /*return*/, approve];
                }
            });
        });
    };
    SwapSdk.prototype.connectWallet = function (reqConnectWalletVo) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, wallet_1.tryWalletConnect)(reqConnectWalletVo)];
                    case 1:
                        data = _a.sent();
                        this.wallet = data.wallet;
                        this.chain = data.chain;
                        this.localRpcUrl = data.localRpcUrl;
                        this.localProvider = data.localProvider;
                        return [2 /*return*/, this
                            // let data: any = await ConnectWallet.link(reqConnectWalletVo)
                            // if (data) {
                            //   if (reqConnectWalletVo.localRpcUrl) {
                            //     this.localProvider = new Web3(new Web3.providers.HttpProvider(reqConnectWalletVo.localRpcUrl))
                            //     this.localRpcUrl = reqConnectWalletVo.localRpcUrl
                            //   } else {
                            //     this.localProvider = null
                            //     this.localRpcUrl = ''
                            //     if (data.chain.compiler == 'EVM') {
                            //       const params = chains.ethereumChainParams[reqConnectWalletVo.chain];
                            //       if (params) {
                            //         this.localRpcUrl = params[0].rpcUrls[0]
                            //       } else if (data.chain.chainId == '1') {
                            //         this.localRpcUrl = 'https://mainnet.infura.io/v3/'
                            //       } else if (data.chain.chainId == '4') {
                            //         this.localRpcUrl = 'https://rinkeby.infura.io/v3/'
                            //       }
                            //       if (this.localRpcUrl) {
                            //         this.localProvider = data.wallet.sdk
                            //       }
                            //     }
                            //   }
                            //   this.wallet = data.wallet
                            //   this.chain = data.chain
                            // }
                        ];
                }
            });
        });
    };
    SwapSdk.prototype.getWallet = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.wallet)
                            return [2 /*return*/, this.wallet];
                        return [4 /*yield*/, utils_1.utils.sleep(1000)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.getWallet()];
                }
            });
        });
    };
    SwapSdk.prototype.getChain = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.chain)
                            return [2 /*return*/, this.chain];
                        return [4 /*yield*/, utils_1.utils.sleep(1000)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.getChain()];
                }
            });
        });
    };
    SwapSdk.prototype.getBalance = function (reqBalanceVo) {
        return __awaiter(this, void 0, void 0, function () {
            var errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, ajx_1.validateReq)(reqBalanceVo, RequestVo_1.ReqBalanceVo)];
                    case 1:
                        errors = _a.sent();
                        if (errors)
                            throw new Error(errors);
                        if (!reqBalanceVo.account)
                            reqBalanceVo.account = this.wallet.address;
                        if (!this.localProvider) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, getBalance_1.getBalance)(reqBalanceVo.account, reqBalanceVo.tokenAddressOrSymbol, reqBalanceVo.decimals, reqBalanceVo.chain, {
                                sdk: this.localProvider,
                                key: this.wallet.key
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [4 /*yield*/, (0, getBalance_1.getBalance)(reqBalanceVo.account, reqBalanceVo.tokenAddressOrSymbol, reqBalanceVo.decimals, reqBalanceVo.chain, this.wallet, reqBalanceVo.customAddress)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SwapSdk.prototype.getAllowance = function (reqAllowanceVo) {
        return __awaiter(this, void 0, void 0, function () {
            var errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, ajx_1.validateReq)(reqAllowanceVo, RequestVo_1.ReqAllowanceVo)];
                    case 1:
                        errors = _a.sent();
                        if (errors)
                            throw new Error(errors);
                        if (!reqAllowanceVo.account)
                            reqAllowanceVo.account = this.wallet.sdk.address;
                        if (!this.localProvider) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, getAllowance_1.getAllowance)(reqAllowanceVo.account, reqAllowanceVo.tokenAddress, reqAllowanceVo.decimals, reqAllowanceVo.chain, reqAllowanceVo.approveContract, this.localProvider)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [4 /*yield*/, (0, getAllowance_1.getAllowance)(reqAllowanceVo.account, reqAllowanceVo.tokenAddress, reqAllowanceVo.decimals, reqAllowanceVo.chain, reqAllowanceVo.approveContract, this.wallet.sdk)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return SwapSdk;
}());
exports.SwapSdk = SwapSdk;
exports.swapSdk = new SwapSdk();
