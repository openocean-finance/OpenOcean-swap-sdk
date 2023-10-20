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
exports.InsufficientInputAmountError = exports.InsufficientReservesError = void 0;
// see https://stackoverflow.com/a/41102306
var CAN_SET_PROTOTYPE = 'setPrototypeOf' in Object;
/**
 * Indicates that the pair has insufficient reserves for a desired output amount. I.e. the amount of output cannot be
 * obtained by sending any amount of input.
 */
var InsufficientReservesError = /** @class */ (function (_super) {
    __extends(InsufficientReservesError, _super);
    function InsufficientReservesError() {
        var _newTarget = this.constructor;
        var _this = _super.call(this) || this;
        _this.isInsufficientReservesError = true;
        _this.name = _this.constructor.name;
        if (CAN_SET_PROTOTYPE)
            Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return InsufficientReservesError;
}(Error));
exports.InsufficientReservesError = InsufficientReservesError;
/**
 * Indicates that the input amount is too small to produce any amount of output. I.e. the amount of input sent is less
 * than the price of a single unit of output after fees.
 */
var InsufficientInputAmountError = /** @class */ (function (_super) {
    __extends(InsufficientInputAmountError, _super);
    function InsufficientInputAmountError() {
        var _newTarget = this.constructor;
        var _this = _super.call(this) || this;
        _this.isInsufficientInputAmountError = true;
        _this.name = _this.constructor.name;
        if (CAN_SET_PROTOTYPE)
            Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return InsufficientInputAmountError;
}(Error));
exports.InsufficientInputAmountError = InsufficientInputAmountError;
