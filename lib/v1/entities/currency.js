"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MATIC = exports.ETHER = exports.Currency = void 0;
var jsbi_1 = __importDefault(require("jsbi"));
var constants_1 = require("../constants");
var utils_1 = require("../utils");
/**
 * A currency is any fungible financial instrument on Ethereum, including Ether and all ERC20 tokens.
 *
 * The only instance of the base class `Currency` is Ether.
 */
var Currency = /** @class */ (function () {
    /**
     * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.ETHER`.
     * @param decimals decimals of the currency
     * @param symbol symbol of the currency
     * @param name of the currency
     */
    function Currency(decimals, symbol, name) {
        (0, utils_1.validateSolidityTypeInstance)(jsbi_1.default.BigInt(decimals), constants_1.SolidityType.uint8);
        this.decimals = decimals;
        this.symbol = symbol;
        this.name = name;
    }
    /**
     * The only instance of the base class `Currency`.
     */
    Currency.ETHER = new Currency(18, 'BNB', 'Binance');
    Currency.MATIC = new Currency(18, 'MATIC', 'Polygon');
    return Currency;
}());
exports.Currency = Currency;
var ETHER = Currency.ETHER;
exports.ETHER = ETHER;
var MATIC = Currency.MATIC;
exports.MATIC = MATIC;
