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
exports.TokenAmount = void 0;
var currencyAmount_1 = require("./currencyAmount");
var tiny_invariant_1 = __importDefault(require("tiny-invariant"));
var jsbi_1 = __importDefault(require("jsbi"));
var TokenAmount = /** @class */ (function (_super) {
    __extends(TokenAmount, _super);
    // amount _must_ be raw, i.e. in the native representation
    function TokenAmount(token, amount) {
        var _this = _super.call(this, token, amount) || this;
        _this.token = token;
        return _this;
    }
    TokenAmount.prototype.add = function (other) {
        (0, tiny_invariant_1.default)(this.token.equals(other.token), 'TOKEN');
        return new TokenAmount(this.token, jsbi_1.default.add(this.raw, other.raw));
    };
    TokenAmount.prototype.subtract = function (other) {
        (0, tiny_invariant_1.default)(this.token.equals(other.token), 'TOKEN');
        return new TokenAmount(this.token, jsbi_1.default.subtract(this.raw, other.raw));
    };
    return TokenAmount;
}(currencyAmount_1.CurrencyAmount));
exports.TokenAmount = TokenAmount;
