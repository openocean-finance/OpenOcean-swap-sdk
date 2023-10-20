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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Percent = void 0;
var constants_1 = require("../../constants");
var fraction_1 = require("./fraction");
var _100_PERCENT = new fraction_1.Fraction(constants_1._100);
var Percent = /** @class */ (function (_super) {
    __extends(Percent, _super);
    function Percent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Percent.prototype.toSignificant = function (significantDigits, format, rounding) {
        if (significantDigits === void 0) { significantDigits = 5; }
        return this.multiply(_100_PERCENT).toSignificant(significantDigits, format, rounding);
    };
    Percent.prototype.toFixed = function (decimalPlaces, format, rounding) {
        if (decimalPlaces === void 0) { decimalPlaces = 2; }
        return this.multiply(_100_PERCENT).toFixed(decimalPlaces, format, rounding);
    };
    return Percent;
}(fraction_1.Fraction));
exports.Percent = Percent;
