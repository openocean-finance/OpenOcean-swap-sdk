"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WETH = exports.currencyEquals = exports.Token = void 0;
var tiny_invariant_1 = __importDefault(require("tiny-invariant"));
var constants_1 = require("../constants");
var utils_1 = require("../utils");
var currency_1 = require("./currency");
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
var Token = /** @class */ (function (_super) {
    __extends(Token, _super);
    function Token(chainId, address, decimals, symbol, name) {
        var _this = _super.call(this, decimals, symbol, name) || this;
        _this.chainId = chainId;
        _this.address = (0, utils_1.validateAndParseAddress)(address);
        return _this;
    }
    /**
     * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
     * @param other other token to compare
     */
    Token.prototype.equals = function (other) {
        // short circuit on reference equality
        if (this === other) {
            return true;
        }
        return this.chainId === other.chainId && this.address === other.address;
    };
    /**
     * Returns true if the address of this token sorts before the address of the other token
     * @param other other token to compare
     * @throws if the tokens have the same address
     * @throws if the tokens are on different chains
     */
    Token.prototype.sortsBefore = function (other) {
        (0, tiny_invariant_1.default)(this.chainId === other.chainId, 'CHAIN_IDS');
        (0, tiny_invariant_1.default)(this.address !== other.address, 'ADDRESSES');
        return this.address.toLowerCase() < other.address.toLowerCase();
    };
    return Token;
}(currency_1.Currency));
exports.Token = Token;
/**
 * Compares two currencies for equality
 */
function currencyEquals(currencyA, currencyB) {
    if (currencyA instanceof Token && currencyB instanceof Token) {
        return currencyA.equals(currencyB);
    }
    else if (currencyA instanceof Token) {
        return false;
    }
    else if (currencyB instanceof Token) {
        return false;
    }
    else {
        return currencyA === currencyB;
    }
}
exports.currencyEquals = currencyEquals;
exports.WETH = (_a = {},
    _a[constants_1.ChainId.ETH] = new Token(constants_1.ChainId.ETH, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', 18, 'WETH', 'Wrapped ETH'),
    _a[constants_1.ChainId.MAINNET] = new Token(constants_1.ChainId.MAINNET, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB'),
    _a[constants_1.ChainId.BSCTESTNET] = new Token(constants_1.ChainId.BSCTESTNET, '0xaE8E19eFB41e7b96815649A6a60785e1fbA84C1e', 18, 'WBNB', 'Wrapped BNB'),
    _a[constants_1.ChainId.POLYGON] = new Token(constants_1.ChainId.POLYGON, '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 18, 'WMATIC', 'Wrapped MATIC'),
    _a[constants_1.ChainId.AVAX] = new Token(constants_1.ChainId.AVAX, '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', 18, 'WAVAX', 'Avalanche Token'),
    _a);
