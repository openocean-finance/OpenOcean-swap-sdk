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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pair = void 0;
var price_1 = require("./fractions/price");
var tokenAmount_1 = require("./fractions/tokenAmount");
var tiny_invariant_1 = __importDefault(require("tiny-invariant"));
var jsbi_1 = __importDefault(require("jsbi"));
var solidity_1 = require("@ethersproject/solidity");
var address_1 = require("@ethersproject/address");
var constants_1 = require("../constants");
var utils_1 = require("../utils");
var errors_1 = require("../errors");
var token_1 = require("./token");
var PAIR_ADDRESS_CACHE = {};
var Pair = /** @class */ (function () {
    function Pair(tokenAmountA, tokenAmountB) {
        var tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
            ? [tokenAmountA, tokenAmountB]
            : [tokenAmountB, tokenAmountA];
        this.liquidityToken = new token_1.Token(tokenAmounts[0].token.chainId, Pair.getAddress(tokenAmounts[0].token, tokenAmounts[1].token), 18, 'UNI-V2', 'Uniswap V2');
        this.tokenAmounts = tokenAmounts;
    }
    Pair.getAddress = function (tokenA, tokenB) {
        var _a, _b;
        var _c;
        var tokens = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]; // does safety checks
        if (((_c = PAIR_ADDRESS_CACHE === null || PAIR_ADDRESS_CACHE === void 0 ? void 0 : PAIR_ADDRESS_CACHE[tokens[0].address]) === null || _c === void 0 ? void 0 : _c[tokens[1].address]) === undefined) {
            var chainId = tokenA.chainId;
            var factory_address = constants_1.FACTORY_ADDRESS[chainId];
            var init_code_hash = constants_1.INIT_CODE_HASH[chainId];
            PAIR_ADDRESS_CACHE = __assign(__assign({}, PAIR_ADDRESS_CACHE), (_a = {}, _a[tokens[0].address] = __assign(__assign({}, PAIR_ADDRESS_CACHE === null || PAIR_ADDRESS_CACHE === void 0 ? void 0 : PAIR_ADDRESS_CACHE[tokens[0].address]), (_b = {}, _b[tokens[1].address] = (0, address_1.getCreate2Address)(factory_address, (0, solidity_1.keccak256)(['bytes'], [(0, solidity_1.pack)(['address', 'address'], [tokens[0].address, tokens[1].address])]), init_code_hash), _b)), _a));
        }
        return PAIR_ADDRESS_CACHE[tokens[0].address][tokens[1].address];
    };
    /**
     * Returns true if the token is either token0 or token1
     * @param token to check
     */
    Pair.prototype.involvesToken = function (token) {
        return token.equals(this.token0) || token.equals(this.token1);
    };
    Object.defineProperty(Pair.prototype, "token0Price", {
        /**
         * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
         */
        get: function () {
            return new price_1.Price(this.token0, this.token1, this.tokenAmounts[0].raw, this.tokenAmounts[1].raw);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pair.prototype, "token1Price", {
        /**
         * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
         */
        get: function () {
            return new price_1.Price(this.token1, this.token0, this.tokenAmounts[1].raw, this.tokenAmounts[0].raw);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Return the price of the given token in terms of the other token in the pair.
     * @param token token to return price of
     */
    Pair.prototype.priceOf = function (token) {
        (0, tiny_invariant_1.default)(this.involvesToken(token), 'TOKEN');
        return token.equals(this.token0) ? this.token0Price : this.token1Price;
    };
    Object.defineProperty(Pair.prototype, "chainId", {
        /**
         * Returns the chain ID of the tokens in the pair.
         */
        get: function () {
            return this.token0.chainId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pair.prototype, "token0", {
        get: function () {
            return this.tokenAmounts[0].token;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pair.prototype, "token1", {
        get: function () {
            return this.tokenAmounts[1].token;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pair.prototype, "reserve0", {
        get: function () {
            return this.tokenAmounts[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pair.prototype, "reserve1", {
        get: function () {
            return this.tokenAmounts[1];
        },
        enumerable: false,
        configurable: true
    });
    Pair.prototype.reserveOf = function (token) {
        (0, tiny_invariant_1.default)(this.involvesToken(token), 'TOKEN');
        return token.equals(this.token0) ? this.reserve0 : this.reserve1;
    };
    Pair.prototype.getOutputAmount = function (inputAmount) {
        (0, tiny_invariant_1.default)(this.involvesToken(inputAmount.token), 'TOKEN');
        if (jsbi_1.default.equal(this.reserve0.raw, constants_1.ZERO) || jsbi_1.default.equal(this.reserve1.raw, constants_1.ZERO)) {
            throw new errors_1.InsufficientReservesError();
        }
        var inputReserve = this.reserveOf(inputAmount.token);
        var outputReserve = this.reserveOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0);
        var inputAmountWithFee = jsbi_1.default.multiply(inputAmount.raw, constants_1._998);
        var numerator = jsbi_1.default.multiply(inputAmountWithFee, outputReserve.raw);
        var denominator = jsbi_1.default.add(jsbi_1.default.multiply(inputReserve.raw, constants_1._1000), inputAmountWithFee);
        var outputAmount = new tokenAmount_1.TokenAmount(inputAmount.token.equals(this.token0) ? this.token1 : this.token0, jsbi_1.default.divide(numerator, denominator));
        if (jsbi_1.default.equal(outputAmount.raw, constants_1.ZERO)) {
            throw new errors_1.InsufficientInputAmountError();
        }
        return [outputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))];
    };
    Pair.prototype.getInputAmount = function (outputAmount) {
        (0, tiny_invariant_1.default)(this.involvesToken(outputAmount.token), 'TOKEN');
        if (jsbi_1.default.equal(this.reserve0.raw, constants_1.ZERO) ||
            jsbi_1.default.equal(this.reserve1.raw, constants_1.ZERO) ||
            jsbi_1.default.greaterThanOrEqual(outputAmount.raw, this.reserveOf(outputAmount.token).raw)) {
            throw new errors_1.InsufficientReservesError();
        }
        var outputReserve = this.reserveOf(outputAmount.token);
        var inputReserve = this.reserveOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0);
        var numerator = jsbi_1.default.multiply(jsbi_1.default.multiply(inputReserve.raw, outputAmount.raw), constants_1._1000);
        var denominator = jsbi_1.default.multiply(jsbi_1.default.subtract(outputReserve.raw, outputAmount.raw), constants_1._998);
        var inputAmount = new tokenAmount_1.TokenAmount(outputAmount.token.equals(this.token0) ? this.token1 : this.token0, jsbi_1.default.add(jsbi_1.default.divide(numerator, denominator), constants_1.ONE));
        return [inputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))];
    };
    Pair.prototype.getLiquidityMinted = function (totalSupply, tokenAmountA, tokenAmountB) {
        (0, tiny_invariant_1.default)(totalSupply.token.equals(this.liquidityToken), 'LIQUIDITY');
        var tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
            ? [tokenAmountA, tokenAmountB]
            : [tokenAmountB, tokenAmountA];
        (0, tiny_invariant_1.default)(tokenAmounts[0].token.equals(this.token0) && tokenAmounts[1].token.equals(this.token1), 'TOKEN');
        var liquidity;
        if (jsbi_1.default.equal(totalSupply.raw, constants_1.ZERO)) {
            liquidity = jsbi_1.default.subtract((0, utils_1.sqrt)(jsbi_1.default.multiply(tokenAmounts[0].raw, tokenAmounts[1].raw)), constants_1.MINIMUM_LIQUIDITY);
        }
        else {
            var amount0 = jsbi_1.default.divide(jsbi_1.default.multiply(tokenAmounts[0].raw, totalSupply.raw), this.reserve0.raw);
            var amount1 = jsbi_1.default.divide(jsbi_1.default.multiply(tokenAmounts[1].raw, totalSupply.raw), this.reserve1.raw);
            liquidity = jsbi_1.default.lessThanOrEqual(amount0, amount1) ? amount0 : amount1;
        }
        if (!jsbi_1.default.greaterThan(liquidity, constants_1.ZERO)) {
            throw new errors_1.InsufficientInputAmountError();
        }
        return new tokenAmount_1.TokenAmount(this.liquidityToken, liquidity);
    };
    Pair.prototype.getLiquidityValue = function (token, totalSupply, liquidity, feeOn, kLast) {
        if (feeOn === void 0) { feeOn = false; }
        (0, tiny_invariant_1.default)(this.involvesToken(token), 'TOKEN');
        (0, tiny_invariant_1.default)(totalSupply.token.equals(this.liquidityToken), 'TOTAL_SUPPLY');
        (0, tiny_invariant_1.default)(liquidity.token.equals(this.liquidityToken), 'LIQUIDITY');
        (0, tiny_invariant_1.default)(jsbi_1.default.lessThanOrEqual(liquidity.raw, totalSupply.raw), 'LIQUIDITY');
        var totalSupplyAdjusted;
        if (!feeOn) {
            totalSupplyAdjusted = totalSupply;
        }
        else {
            (0, tiny_invariant_1.default)(!!kLast, 'K_LAST');
            var kLastParsed = (0, utils_1.parseBigintIsh)(kLast);
            if (!jsbi_1.default.equal(kLastParsed, constants_1.ZERO)) {
                var rootK = (0, utils_1.sqrt)(jsbi_1.default.multiply(this.reserve0.raw, this.reserve1.raw));
                var rootKLast = (0, utils_1.sqrt)(kLastParsed);
                if (jsbi_1.default.greaterThan(rootK, rootKLast)) {
                    var numerator = jsbi_1.default.multiply(totalSupply.raw, jsbi_1.default.subtract(rootK, rootKLast));
                    var denominator = jsbi_1.default.add(jsbi_1.default.multiply(rootK, constants_1.FIVE), rootKLast);
                    var feeLiquidity = jsbi_1.default.divide(numerator, denominator);
                    totalSupplyAdjusted = totalSupply.add(new tokenAmount_1.TokenAmount(this.liquidityToken, feeLiquidity));
                }
                else {
                    totalSupplyAdjusted = totalSupply;
                }
            }
            else {
                totalSupplyAdjusted = totalSupply;
            }
        }
        return new tokenAmount_1.TokenAmount(token, jsbi_1.default.divide(jsbi_1.default.multiply(liquidity.raw, this.reserveOf(token).raw), totalSupplyAdjusted.raw));
    };
    return Pair;
}());
exports.Pair = Pair;
