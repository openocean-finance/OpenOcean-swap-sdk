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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyAmount = void 0;
var token_1 = require("../token");
var currency_1 = require("../currency");
var tiny_invariant_1 = __importDefault(require("tiny-invariant"));
var jsbi_1 = __importDefault(require("jsbi"));
var big_js_1 = __importDefault(require("big.js"));
var toformat_1 = __importDefault(require("toformat"));
var constants_1 = require("../../constants");
var utils_1 = require("../../utils");
var fraction_1 = require("./fraction");
var Big = (0, toformat_1.default)(big_js_1.default);
var CurrencyAmount = /** @class */ (function (_super) {
    __extends(CurrencyAmount, _super);
    // amount _must_ be raw, i.e. in the native representation
    function CurrencyAmount(currency, amount) {
        var _this = this;
        var parsedAmount = (0, utils_1.parseBigintIsh)(amount);
        (0, utils_1.validateSolidityTypeInstance)(parsedAmount, constants_1.SolidityType.uint256);
        _this = _super.call(this, parsedAmount, jsbi_1.default.exponentiate(constants_1.TEN, jsbi_1.default.BigInt(currency.decimals))) || this;
        _this.currency = currency;
        return _this;
    }
    /**
     * Helper that calls the constructor with the ETHER currency
     * @param amount ether amount in wei
     */
    CurrencyAmount.ether = function (amount) {
        return new CurrencyAmount(currency_1.ETHER, amount);
    };
    Object.defineProperty(CurrencyAmount.prototype, "raw", {
        get: function () {
            return this.numerator;
        },
        enumerable: false,
        configurable: true
    });
    CurrencyAmount.prototype.add = function (other) {
        (0, tiny_invariant_1.default)((0, token_1.currencyEquals)(this.currency, other.currency), 'TOKEN');
        return new CurrencyAmount(this.currency, jsbi_1.default.add(this.raw, other.raw));
    };
    CurrencyAmount.prototype.subtract = function (other) {
        (0, tiny_invariant_1.default)((0, token_1.currencyEquals)(this.currency, other.currency), 'TOKEN');
        return new CurrencyAmount(this.currency, jsbi_1.default.subtract(this.raw, other.raw));
    };
    CurrencyAmount.prototype.toSignificant = function (significantDigits, format, rounding) {
        if (significantDigits === void 0) { significantDigits = 6; }
        if (rounding === void 0) { rounding = constants_1.Rounding.ROUND_DOWN; }
        return _super.prototype.toSignificant.call(this, significantDigits, format, rounding);
    };
    CurrencyAmount.prototype.toFixed = function (decimalPlaces, format, rounding) {
        if (decimalPlaces === void 0) { decimalPlaces = this.currency.decimals; }
        if (rounding === void 0) { rounding = constants_1.Rounding.ROUND_DOWN; }
        (0, tiny_invariant_1.default)(decimalPlaces <= this.currency.decimals, 'DECIMALS');
        return _super.prototype.toFixed.call(this, decimalPlaces, format, rounding);
    };
    CurrencyAmount.prototype.toExact = function (format) {
        if (format === void 0) { format = { groupSeparator: '' }; }
        Big.DP = this.currency.decimals;
        return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(format);
    };
    return CurrencyAmount;
}(fraction_1.Fraction));
exports.CurrencyAmount = CurrencyAmount;
