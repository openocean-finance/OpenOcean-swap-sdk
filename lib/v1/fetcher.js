"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fetcher = void 0;
var contracts_1 = require("@ethersproject/contracts");
var networks_1 = require("@ethersproject/networks");
var providers_1 = require("@ethersproject/providers");
var tokenAmount_1 = require("./entities/fractions/tokenAmount");
var pair_1 = require("./entities/pair");
// import IPancakePair from '@uniswap/v2-core/build/IPancakePair.json'
var IUniswapV2Pair_1 = __importDefault(require("./abis/IUniswapV2Pair"));
var tiny_invariant_1 = __importDefault(require("tiny-invariant"));
var ERC20_1 = __importDefault(require("./abis/ERC20"));
var constants_1 = require("./constants");
var token_1 = require("./entities/token");
var TOKEN_DECIMALS_CACHE = (_a = {},
    _a[constants_1.ChainId.MAINNET] = {
        '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A': 9 // DGD
    },
    _a);
/**
 * Contains methods for constructing instances of pairs and tokens from on-chain data.
 */
var Fetcher = /** @class */ (function () {
    /**
     * Cannot be constructed.
     */
    function Fetcher() {
    }
    /**
     * Fetch information for a given token on the given chain, using the given ethers provider.
     * @param chainId chain of the token
     * @param address address of the token on the chain
     * @param provider provider used to fetch the token
     * @param symbol optional symbol of the token
     * @param name optional name of the token
     */
    Fetcher.fetchTokenData = function (chainId, address, provider, symbol, name) {
        var _a;
        if (provider === void 0) { provider = (0, providers_1.getDefaultProvider)((0, networks_1.getNetwork)(chainId)); }
        return __awaiter(this, void 0, void 0, function () {
            var parsedDecimals, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(typeof ((_a = TOKEN_DECIMALS_CACHE === null || TOKEN_DECIMALS_CACHE === void 0 ? void 0 : TOKEN_DECIMALS_CACHE[chainId]) === null || _a === void 0 ? void 0 : _a[address]) === 'number')) return [3 /*break*/, 1];
                        _b = TOKEN_DECIMALS_CACHE[chainId][address];
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, new contracts_1.Contract(address, ERC20_1.default, provider).decimals().then(function (decimals) {
                            var _a, _b;
                            TOKEN_DECIMALS_CACHE = __assign(__assign({}, TOKEN_DECIMALS_CACHE), (_a = {}, _a[chainId] = __assign(__assign({}, TOKEN_DECIMALS_CACHE === null || TOKEN_DECIMALS_CACHE === void 0 ? void 0 : TOKEN_DECIMALS_CACHE[chainId]), (_b = {}, _b[address] = decimals, _b)), _a));
                            return decimals;
                        })];
                    case 2:
                        _b = _c.sent();
                        _c.label = 3;
                    case 3:
                        parsedDecimals = _b;
                        return [2 /*return*/, new token_1.Token(chainId, address, parsedDecimals, symbol, name)];
                }
            });
        });
    };
    /**
     * Fetches information about a pair and constructs a pair from the given two tokens.
     * @param tokenA first token
     * @param tokenB second token
     * @param provider the provider to use to fetch the data
     */
    Fetcher.fetchPairData = function (tokenA, tokenB, provider) {
        if (provider === void 0) { provider = (0, providers_1.getDefaultProvider)((0, networks_1.getNetwork)(tokenA.chainId)); }
        return __awaiter(this, void 0, void 0, function () {
            var address, _a, reserves0, reserves1, balances;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, tiny_invariant_1.default)(tokenA.chainId === tokenB.chainId, 'CHAIN_ID');
                        address = pair_1.Pair.getAddress(tokenA, tokenB);
                        return [4 /*yield*/, new contracts_1.Contract(address, IUniswapV2Pair_1.default.abi, provider).getReserves()];
                    case 1:
                        _a = _b.sent(), reserves0 = _a[0], reserves1 = _a[1];
                        balances = tokenA.sortsBefore(tokenB) ? [reserves0, reserves1] : [reserves1, reserves0];
                        return [2 /*return*/, new pair_1.Pair(new tokenAmount_1.TokenAmount(tokenA, balances[0]), new tokenAmount_1.TokenAmount(tokenB, balances[1]))];
                }
            });
        });
    };
    return Fetcher;
}());
exports.Fetcher = Fetcher;
