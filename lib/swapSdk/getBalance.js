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
exports.getBalance = void 0;
var axios_1 = __importDefault(require("axios"));
var utils_1 = require("./../utils");
var terra_js_1 = require("@terra-money/terra.js");
var web3_1 = __importDefault(require("web3"));
var config_1 = require("./../config");
var web3_js_1 = require("@solana/web3.js");
var wallet_1 = require("@openocean.finance/wallet");
var near_api_js_1 = require("near-api-js");
var ethers_1 = require("ethers");
var providerNear = new near_api_js_1.providers.JsonRpcProvider({
    url: "https://rpc.mainnet.near.org"
});
var providerEth = new ethers_1.ethers.providers.JsonRpcProvider({
    url: "https://rpc.ankr.com/eth"
});
function getBalance(account, tokenAddressOrSymbol, decimals, chainName, myWallet, customAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var balanceObj, balance, contract, address, _a, data, _b, coin, _c, value, sum_1, _d, value, terra, result, _symbol, token, amount, res, e_1, balanceDecimals, e_2, _e, result, balance_1, response, response, e_3;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    balanceObj = {
                        short: 0,
                        long: 0,
                        decimals: decimals,
                        tokenAddress: tokenAddressOrSymbol
                    };
                    balance = 0;
                    contract = null;
                    if (!(chainName === 'ont')) return [3 /*break*/, 2];
                    return [4 /*yield*/, axios_1.default.get("https://ethapi.openocean.finance/v1/ont/token-balance?account=".concat(account, "&token=").concat(tokenAddressOrSymbol))];
                case 1:
                    balance = _f.sent();
                    if (balance.data && balance.data[tokenAddressOrSymbol]) {
                        balanceObj.short = balance.data[tokenAddressOrSymbol].balance;
                        balanceObj.long = balance.data[tokenAddressOrSymbol].balance * (Math.pow(10, decimals));
                    }
                    return [3 /*break*/, 40];
                case 2:
                    if (!(chainName === 'aptos')) return [3 /*break*/, 4];
                    address = customAddress ? customAddress : tokenAddressOrSymbol === "0x1" ? "".concat(tokenAddressOrSymbol, "::aptos_coin::AptosCoin") : "".concat(tokenAddressOrSymbol, "::coin::T}");
                    return [4 /*yield*/, axios_1.default.get("https://fullnode.mainnet.aptoslabs.com/v1/accounts/".concat(account, "/resource/0x1::coin::CoinStore<").concat(address, ">"))];
                case 3:
                    _a = (_f.sent()).data, data = _a === void 0 ? {} : _a;
                    _b = (data.data || {}).coin, coin = _b === void 0 ? {} : _b;
                    _c = coin.value, value = _c === void 0 ? 0 : _c;
                    balanceObj.long = value;
                    balanceObj.short = +utils_1.utils.toFixed(utils_1.utils.decimals2Amount(value, decimals), 6);
                    return [3 /*break*/, 40];
                case 4:
                    if (!(chainName === 'solana')) return [3 /*break*/, 9];
                    if (!(tokenAddressOrSymbol === "So11111111111111111111111111111111111111112")) return [3 /*break*/, 6];
                    return [4 /*yield*/, myWallet.connection.getBalance(new web3_js_1.PublicKey(account))];
                case 5:
                    balance = _f.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, myWallet.connection.getParsedTokenAccountsByOwner(new web3_js_1.PublicKey(account), {
                        mint: new web3_js_1.PublicKey(tokenAddressOrSymbol),
                    })];
                case 7:
                    balance = _f.sent();
                    sum_1 = 0;
                    _d = (balance || {}).value, value = _d === void 0 ? [] : _d;
                    value.forEach(function (item) {
                        var account = (item || {}).account;
                        var data = (account || {}).data;
                        var parsed = (data || {}).parsed;
                        var info = (parsed || {}).info;
                        var tokenAmount = (info || {}).tokenAmount;
                        var _a = (tokenAmount || {}).amount, amount = _a === void 0 ? 0 : _a;
                        sum_1 += +amount;
                    });
                    balance = sum_1;
                    _f.label = 8;
                case 8:
                    balanceObj.long = balance;
                    balanceObj.short = +utils_1.utils.toFixed(utils_1.utils.decimals2Amount(balance || 0, decimals), 6);
                    return [3 /*break*/, 40];
                case 9:
                    if (!(chainName === 'terra')) return [3 /*break*/, 15];
                    terra = new terra_js_1.LCDClient({
                        URL: "https://lcd.terra.dev",
                        chainID: "columbus-5",
                    });
                    return [4 /*yield*/, terra.bank.balance(account)];
                case 10:
                    result = _f.sent();
                    _symbol = {
                        'luna': 'uluna',
                        'ust': 'uusd',
                    }[tokenAddressOrSymbol.toLowerCase()] || tokenAddressOrSymbol.toLowerCase();
                    token = result[0]._coins[_symbol];
                    amount = 0;
                    if (!token) return [3 /*break*/, 11];
                    amount = token.amount.toNumber();
                    return [3 /*break*/, 14];
                case 11:
                    _f.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, axios_1.default.get("https://fcd.terra.dev/wasm/contracts/".concat(tokenAddressOrSymbol, "/store"), {
                            params: {
                                query_msg: {
                                    balance: {
                                        address: account,
                                    },
                                },
                            },
                            // cache: false,
                        })];
                case 12:
                    res = _f.sent();
                    amount = +(res.result.balance || 0);
                    return [3 /*break*/, 14];
                case 13:
                    e_1 = _f.sent();
                    console.log('terra balanceOf', e_1);
                    return [3 /*break*/, 14];
                case 14:
                    balanceObj.long = amount;
                    balanceObj.short = +utils_1.utils.toFixed(utils_1.utils.decimals2Amount(amount || 0, decimals), 6);
                    return [3 /*break*/, 40];
                case 15:
                    if (!(chainName === 'tron')) return [3 /*break*/, 22];
                    if (!(tokenAddressOrSymbol.toLowerCase() === "t9yd14nj9j7xab4dbgeix9h8unkkhxuwwb")) return [3 /*break*/, 17];
                    return [4 /*yield*/, myWallet.sdk.trx.getBalance(account)];
                case 16:
                    balance = _f.sent();
                    balanceObj.long = myWallet.sdk.fromSun(balance) * (Math.pow(10, decimals));
                    balanceObj.short = myWallet.sdk.fromSun(balance);
                    _f.label = 17;
                case 17:
                    _f.trys.push([17, 20, , 21]);
                    return [4 /*yield*/, myWallet.sdk.contract().at(tokenAddressOrSymbol)];
                case 18:
                    contract = _f.sent();
                    return [4 /*yield*/, contract.balanceOf(account).call()];
                case 19:
                    balance = _f.sent();
                    balanceDecimals = web3_1.default.utils.hexToNumberString(balance || 0);
                    if (balanceDecimals) {
                        balanceObj.long = Number(balanceDecimals);
                        balanceObj.short = +utils_1.utils.toFixed(utils_1.utils.decimals2Amount(balanceDecimals, decimals), 6);
                    }
                    return [3 /*break*/, 21];
                case 20:
                    e_2 = _f.sent();
                    console.log("triggerConfirmedConstantContract", e_2);
                    return [3 /*break*/, 21];
                case 21: return [3 /*break*/, 40];
                case 22:
                    if (!(chainName === 'osmosis')) return [3 /*break*/, 24];
                    return [4 /*yield*/, myWallet.sdk.lcdClient.bank.balances(account)];
                case 23:
                    _e = (_f.sent()).result, result = _e === void 0 ? [] : _e;
                    result.forEach(function (item) {
                        var amount = item.amount, denom = item.denom;
                        if (denom === tokenAddressOrSymbol) {
                            balance = amount;
                        }
                    });
                    balanceObj.long = balance;
                    balanceObj.short = +utils_1.utils.toFixed(utils_1.utils.decimals2Amount(balance, decimals), 6);
                    return [3 /*break*/, 40];
                case 24:
                    if (!(chainName === 'near')) return [3 /*break*/, 29];
                    balance_1 = 0;
                    if (!(tokenAddressOrSymbol == 'near.near')) return [3 /*break*/, 26];
                    return [4 /*yield*/, providerNear.query({
                            request_type: "view_account",
                            finality: "final",
                            account_id: account,
                        })];
                case 25:
                    response = _f.sent();
                    balance_1 = response ? response.amount : '0';
                    return [3 /*break*/, 28];
                case 26: return [4 /*yield*/, providerNear.query({
                        request_type: "call_function",
                        finality: "final",
                        account_id: tokenAddressOrSymbol,
                        method_name: "ft_balance_of",
                        args_base64: Buffer.from(JSON.stringify({
                            "account_id": account
                        })).toString("base64"),
                    })];
                case 27:
                    response = _f.sent();
                    balance_1 = JSON.parse(Buffer.from(response.result).toString());
                    _f.label = 28;
                case 28:
                    balanceObj.long = balance_1;
                    balanceObj.short = +utils_1.utils.toFixed(utils_1.utils.decimals2Amount(balance_1, decimals), 6);
                    return [3 /*break*/, 40];
                case 29:
                    if (!wallet_1.chainsObj.isNativeToken(chainName, tokenAddressOrSymbol)) return [3 /*break*/, 36];
                    console.log('myWallet', myWallet);
                    if (!(myWallet.key === "GnosisSafeWallet")) return [3 /*break*/, 31];
                    return [4 /*yield*/, myWallet.sdk.eth.getBalance([account, "latest"])];
                case 30:
                    balance = _f.sent();
                    return [3 /*break*/, 35];
                case 31:
                    if (!(myWallet.key === "LedgerWallet")) return [3 /*break*/, 33];
                    return [4 /*yield*/, providerEth.getBalance(account)];
                case 32:
                    balance = _f.sent();
                    return [3 /*break*/, 35];
                case 33: return [4 /*yield*/, myWallet.sdk.eth.getBalance(account)];
                case 34:
                    balance = _f.sent();
                    _f.label = 35;
                case 35: return [3 /*break*/, 39];
                case 36:
                    _f.trys.push([36, 38, , 39]);
                    if (myWallet.key === "LedgerWallet") {
                        contract = new ethers_1.ethers.Contract(tokenAddressOrSymbol, config_1.ERC20_abi, providerEth);
                    }
                    else {
                        contract = new myWallet.sdk.eth.Contract(config_1.ERC20_abi, tokenAddressOrSymbol);
                    }
                    return [4 /*yield*/, contract.methods.balanceOf(account).call()];
                case 37:
                    balance = _f.sent();
                    return [3 /*break*/, 39];
                case 38:
                    e_3 = _f.sent();
                    return [3 /*break*/, 39];
                case 39:
                    if (balance) {
                        balanceObj.long = balance;
                        balanceObj.short = +utils_1.utils.toFixed(utils_1.utils.decimals2Amount(balance, decimals), 6);
                    }
                    _f.label = 40;
                case 40: return [2 /*return*/, balanceObj];
            }
        });
    });
}
exports.getBalance = getBalance;
