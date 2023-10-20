"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.Api = void 0;
var ajx_1 = require("../utils/ajx");
var config_1 = require("../config");
var RequestVo_1 = require("./vo/RequestVo");
var axios_1 = __importDefault(require("axios"));
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var Api = /** @class */ (function () {
    function Api(baseUrl) {
        this.baseUrl = 'https://open-api.openocean.finance/v3';
        this.baseUrlNft = 'http://10.17.130.161:7104/v1';
        if (baseUrl)
            this.baseUrl = baseUrl;
    }
    Api.prototype.collections = function (option) {
        return (0, ajx_1.get)("".concat(this.baseUrlNft, "/").concat(option.chain, "/").concat(option.market, "/collections"), option, RequestVo_1.CollectionsVo);
    };
    Api.prototype.assets = function (option) {
        return (0, ajx_1.get)("".concat(this.baseUrlNft, "/").concat(option.chain, "/").concat(option.market, "/assets"), option, RequestVo_1.AssetsVo);
    };
    Api.prototype.buy = function (option) {
        return (0, ajx_1.post)("".concat(this.baseUrlNft, "/").concat(option.chain, "/").concat(option.market, "/buy"), option, RequestVo_1.NftBuyVo);
    };
    Api.prototype.sell = function (option) {
        return (0, ajx_1.post)("".concat(this.baseUrlNft, "/").concat(option.chain, "/").concat(option.market, "/sell"), option, RequestVo_1.NftSellVo);
    };
    Api.prototype.sign = function (option) {
        return (0, ajx_1.post)("".concat(this.baseUrlNft, "/").concat(option.chain, "/").concat(option.market, "/sign"), option, RequestVo_1.NftSignVo);
    };
    Api.prototype.quote = function (option) {
        return (0, ajx_1.get)("".concat(this.baseUrl, "/").concat(option.chain, "/quote"), option, RequestVo_1.ReqQuoteVo);
    };
    Api.prototype.swapQuote = function (option) {
        return (0, ajx_1.get)("".concat(this.baseUrl, "/").concat(option.chain, "/swap_quote"), option, RequestVo_1.ReqSwapVo);
    };
    Api.prototype.getGasPrice = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var data, base, fast, instant, standard, gasPrice, maxFeePerGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, ajx_1.get)("".concat(this.baseUrl, "/").concat(option.chain, "/gasPrice"), option, RequestVo_1.ChainName)];
                    case 1:
                        data = (_a.sent()).data;
                        if (!data)
                            return [2 /*return*/, 0];
                        base = data.base, fast = data.fast, instant = data.instant, standard = data.standard;
                        gasPrice = 0;
                        if (!base) {
                            gasPrice = standard;
                        }
                        else {
                            maxFeePerGas = standard.maxFeePerGas;
                            gasPrice = +maxFeePerGas;
                        }
                        return [2 /*return*/, new bignumber_js_1.default(gasPrice).div(Math.pow(10, 9)).toFixed()];
                }
            });
        });
    };
    Api.prototype.getTransaction = function (option) {
        return (0, ajx_1.get)("".concat(this.baseUrl, "/").concat(option.chain, "/getTransaction"), option, RequestVo_1.TransactionVo);
    };
    Api.prototype.getTokenList = function (option) {
        return (0, ajx_1.get)("".concat(this.baseUrl, "/").concat(option.chain, "/tokenList"), option, RequestVo_1.ChainName);
    };
    Api.prototype.dexList = function (option) {
        return (0, ajx_1.get)("".concat(this.baseUrl, "/").concat(option.chain, "/dexList"), option, RequestVo_1.ChainName);
    };
    Api.prototype.getTxs = function (option) {
        return (0, ajx_1.get)("".concat(this.baseUrl, "/").concat(option.chain, "/getTxs"), option, RequestVo_1.TxsVo);
    };
    Api.prototype.getTokenPrice = function (id) {
        return axios_1.default.get("https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=".concat(id));
    };
    Api.prototype.getBalance = function (option) {
        return (0, ajx_1.get)("".concat(this.baseUrl, "/").concat(option.chain, "/getBalance"), option, RequestVo_1.ReqBanlanceVo);
    };
    Api.prototype.getAllowance = function (option) {
        return (0, ajx_1.get)("https://open-api.openocean.finance/v1/cross/getAllowance", option, RequestVo_1.ReqAllowanceVo);
    };
    Api.prototype.createWallet = function (option) {
        return (0, ajx_1.get)("".concat(this.baseUrl, "/").concat(option.chain, "/createWallet"), option, RequestVo_1.ChainName);
    };
    Api.prototype.solanaScan = function (option) {
        return (0, ajx_1.post)("https://market-api.openocean.finance/v1/solana/scan", option, RequestVo_1.SolanaScanVo);
    };
    Api.prototype.exchange = function (option) {
        return (0, ajx_1.get)("".concat(this.baseUrl, "/").concat(option.chain, "/exChange"), option, RequestVo_1.ChainName);
    };
    __decorate([
        setChainId
    ], Api.prototype, "collections", null);
    __decorate([
        setChainId
    ], Api.prototype, "assets", null);
    __decorate([
        setChainId
    ], Api.prototype, "buy", null);
    __decorate([
        setChainId
    ], Api.prototype, "sell", null);
    __decorate([
        setChainId
    ], Api.prototype, "sign", null);
    __decorate([
        setChainId
    ], Api.prototype, "quote", null);
    __decorate([
        setChainId
    ], Api.prototype, "swapQuote", null);
    __decorate([
        setChainId
    ], Api.prototype, "getGasPrice", null);
    __decorate([
        setChainId
    ], Api.prototype, "getTransaction", null);
    __decorate([
        setChainId
    ], Api.prototype, "getTokenList", null);
    __decorate([
        setChainId
    ], Api.prototype, "dexList", null);
    __decorate([
        setChainId
    ], Api.prototype, "getTxs", null);
    __decorate([
        setChainId
    ], Api.prototype, "getBalance", null);
    __decorate([
        setChainId
    ], Api.prototype, "getAllowance", null);
    __decorate([
        setChainId
    ], Api.prototype, "createWallet", null);
    __decorate([
        setChainId
    ], Api.prototype, "exchange", null);
    return Api;
}());
exports.Api = Api;
function setChainId(target, method, descriptor) {
    var oldMethod = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        args = args.map(function (item, i) {
            if (item && item.chain) {
                item.chain = item.chain.toLowerCase();
                if (config_1.config.chains.chainObj[item.chain] && config_1.config.chains.chainObj[item.chain].chainId) {
                    item.chainId = config_1.config.chains.chainObj[item.chain].chainId + '';
                }
            }
            return item;
        });
        return oldMethod.apply(this, args);
    };
}
