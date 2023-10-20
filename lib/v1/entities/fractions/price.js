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
exports.Price = void 0;
var token_1 = require("../token");
var tokenAmount_1 = require("./tokenAmount");
var token_2 = require("../token");
var tiny_invariant_1 = __importDefault(require("tiny-invariant"));
var jsbi_1 = __importDefault(require("jsbi"));
var constants_1 = require("../../constants");
var fraction_1 = require("./fraction");
var currencyAmount_1 = require("./currencyAmount");
var Price = /** @class */ (function (_super) {
    __extends(Price, _super);
    // denominator and numerator _must_ be raw, i.e. in the native representation
    function Price(baseCurrency, quoteCurrency, denominator, numerator) {
        var _this = _super.call(this, numerator, denominator) || this;
        _this.baseCurrency = baseCurrency;
        _this.quoteCurrency = quoteCurrency;
        _this.scalar = new fraction_1.Fraction(jsbi_1.default.exponentiate(constants_1.TEN, jsbi_1.default.BigInt(baseCurrency.decimals)), jsbi_1.default.exponentiate(constants_1.TEN, jsbi_1.default.BigInt(quoteCurrency.decimals)));
        return _this;
    }
    Price.fromRoute = function (route) {
        var prices = [];
        for (var _i = 0, _a = route.pairs.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], i = _b[0], pair = _b[1];
            prices.push(route.path[i].equals(pair.token0)
                ? new Price(pair.reserve0.currency, pair.reserve1.currency, pair.reserve0.raw, pair.reserve1.raw)
                : new Price(pair.reserve1.currency, pair.reserve0.currency, pair.reserve1.raw, pair.reserve0.raw));
        }
        return prices.slice(1).reduce(function (accumulator, currentValue) { return accumulator.multiply(currentValue); }, prices[0]);
    };
    Object.defineProperty(Price.prototype, "raw", {
        get: function () {
            return new fraction_1.Fraction(this.numerator, this.denominator);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Price.prototype, "adjusted", {
        get: function () {
            return _super.prototype.multiply.call(this, this.scalar);
        },
        enumerable: false,
        configurable: true
    });
    Price.prototype.invert = function () {
        return new Price(this.quoteCurrency, this.baseCurrency, this.numerator, this.denominator);
    };
    Price.prototype.multiply = function (other) {
        (0, tiny_invariant_1.default)((0, token_2.currencyEquals)(this.quoteCurrency, other.baseCurrency), 'TOKEN');
        var fraction = _super.prototype.multiply.call(this, other);
        return new Price(this.baseCurrency, other.quoteCurrency, fraction.denominator, fraction.numerator);
    };
    // performs floor division on overflow
    Price.prototype.quote = function (currencyAmount) {
        (0, tiny_invariant_1.default)((0, token_2.currencyEquals)(currencyAmount.currency, this.baseCurrency), 'TOKEN');
        if (this.quoteCurrency instanceof token_1.Token) {
            return new tokenAmount_1.TokenAmount(this.quoteCurrency, _super.prototype.multiply.call(this, currencyAmount.raw).quotient);
        }
        return currencyAmount_1.CurrencyAmount.ether(_super.prototype.multiply.call(this, currencyAmount.raw).quotient);
    };
    Price.prototype.toSignificant = function (significantDigits, format, rounding) {
        if (significantDigits === void 0) { significantDigits = 6; }
        return this.adjusted.toSignificant(significantDigits, format, rounding);
    };
    Price.prototype.toFixed = function (decimalPlaces, format, rounding) {
        if (decimalPlaces === void 0) { decimalPlaces = 4; }
        return this.adjusted.toFixed(decimalPlaces, format, rounding);
    };
    return Price;
}(fraction_1.Fraction));
exports.Price = Price;
