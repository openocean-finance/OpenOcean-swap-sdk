"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
var tiny_invariant_1 = __importDefault(require("tiny-invariant"));
var currency_1 = require("./currency");
var token_1 = require("./token");
var price_1 = require("./fractions/price");
var Route = /** @class */ (function () {
    function Route(pairs, input, output) {
        (0, tiny_invariant_1.default)(pairs.length > 0, 'PAIRS');
        (0, tiny_invariant_1.default)(pairs.every(function (pair) { return pair.chainId === pairs[0].chainId; }), 'CHAIN_IDS');
        (0, tiny_invariant_1.default)((input instanceof token_1.Token && pairs[0].involvesToken(input)) ||
            (input === currency_1.ETHER && pairs[0].involvesToken(token_1.WETH[pairs[0].chainId])), 'INPUT');
        (0, tiny_invariant_1.default)(typeof output === 'undefined' ||
            (output instanceof token_1.Token && pairs[pairs.length - 1].involvesToken(output)) ||
            (output === currency_1.ETHER && pairs[pairs.length - 1].involvesToken(token_1.WETH[pairs[0].chainId])), 'OUTPUT');
        var path = [input instanceof token_1.Token ? input : token_1.WETH[pairs[0].chainId]];
        for (var _i = 0, _a = pairs.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], i = _b[0], pair = _b[1];
            var currentInput = path[i];
            (0, tiny_invariant_1.default)(currentInput.equals(pair.token0) || currentInput.equals(pair.token1), 'PATH');
            var output_1 = currentInput.equals(pair.token0) ? pair.token1 : pair.token0;
            path.push(output_1);
        }
        this.pairs = pairs;
        this.path = path;
        this.midPrice = price_1.Price.fromRoute(this);
        this.input = input;
        this.output = output !== null && output !== void 0 ? output : path[path.length - 1];
    }
    Object.defineProperty(Route.prototype, "chainId", {
        get: function () {
            return this.pairs[0].chainId;
        },
        enumerable: false,
        configurable: true
    });
    return Route;
}());
exports.Route = Route;
