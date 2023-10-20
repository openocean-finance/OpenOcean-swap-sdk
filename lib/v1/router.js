"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
var constants_1 = require("./constants");
var tiny_invariant_1 = __importDefault(require("tiny-invariant"));
var utils_1 = require("./utils");
var entities_1 = require("./entities");
function toHex(currencyAmount) {
    return "0x".concat(currencyAmount.raw.toString(16));
}
var ZERO_HEX = '0x0';
/**
 * Represents the Uniswap V2 Router, and has static methods for helping execute trades.
 */
var Router = /** @class */ (function () {
    /**
     * Cannot be constructed.
     */
    function Router() {
    }
    /**
     * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
     * @param trade to produce call parameters for
     * @param options options for the call parameters
     */
    Router.swapCallParameters = function (trade, options) {
        var etherIn = trade.inputAmount.currency === entities_1.ETHER;
        var etherOut = trade.outputAmount.currency === entities_1.ETHER;
        // the router does not support both ether in and out
        (0, tiny_invariant_1.default)(!(etherIn && etherOut), 'ETHER_IN_OUT');
        (0, tiny_invariant_1.default)(options.ttl > 0, 'TTL');
        var to = (0, utils_1.validateAndParseAddress)(options.recipient);
        var amountIn = toHex(trade.maximumAmountIn(options.allowedSlippage));
        var amountOut = toHex(trade.minimumAmountOut(options.allowedSlippage));
        var path = trade.route.path.map(function (token) { return token.address; });
        var deadline = "0x".concat((Math.floor(new Date().getTime() / 1000) + options.ttl).toString(16));
        var useFeeOnTransfer = Boolean(options.feeOnTransfer);
        var methodName;
        var args;
        var value;
        switch (trade.tradeType) {
            case constants_1.TradeType.EXACT_INPUT:
                if (etherIn) {
                    methodName = useFeeOnTransfer ? 'swapExactETHForTokensSupportingFeeOnTransferTokens' : 'swapExactETHForTokens';
                    // (uint amountOutMin, address[] calldata path, address to, uint deadline)
                    args = [amountOut, path, to, deadline];
                    value = amountIn;
                }
                else if (etherOut) {
                    methodName = useFeeOnTransfer ? 'swapExactTokensForETHSupportingFeeOnTransferTokens' : 'swapExactTokensForETH';
                    // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
                    args = [amountIn, amountOut, path, to, deadline];
                    value = ZERO_HEX;
                }
                else {
                    methodName = useFeeOnTransfer
                        ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens'
                        : 'swapExactTokensForTokens';
                    // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
                    args = [amountIn, amountOut, path, to, deadline];
                    value = ZERO_HEX;
                }
                break;
            case constants_1.TradeType.EXACT_OUTPUT:
                (0, tiny_invariant_1.default)(!useFeeOnTransfer, 'EXACT_OUT_FOT');
                if (etherIn) {
                    methodName = 'swapETHForExactTokens';
                    // (uint amountOut, address[] calldata path, address to, uint deadline)
                    args = [amountOut, path, to, deadline];
                    value = amountIn;
                }
                else if (etherOut) {
                    methodName = 'swapTokensForExactETH';
                    // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
                    args = [amountOut, amountIn, path, to, deadline];
                    value = ZERO_HEX;
                }
                else {
                    methodName = 'swapTokensForExactTokens';
                    // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
                    args = [amountOut, amountIn, path, to, deadline];
                    value = ZERO_HEX;
                }
                break;
        }
        return {
            methodName: methodName,
            args: args,
            value: value
        };
    };
    return Router;
}());
exports.Router = Router;
