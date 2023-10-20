"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trade = exports.tradeComparator = exports.inputOutputComparator = void 0;
var tiny_invariant_1 = __importDefault(require("tiny-invariant"));
var constants_1 = require("../constants");
var utils_1 = require("../utils");
var currency_1 = require("./currency");
var currencyAmount_1 = require("./fractions/currencyAmount");
var fraction_1 = require("./fractions/fraction");
var percent_1 = require("./fractions/percent");
var price_1 = require("./fractions/price");
var tokenAmount_1 = require("./fractions/tokenAmount");
var route_1 = require("./route");
var token_1 = require("./token");
/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */
function computePriceImpact(midPrice, inputAmount, outputAmount) {
    var exactQuote = midPrice.raw.multiply(inputAmount.raw);
    // calculate slippage := (exactQuote - outputAmount) / exactQuote
    var slippage = exactQuote.subtract(outputAmount.raw).divide(exactQuote);
    return new percent_1.Percent(slippage.numerator, slippage.denominator);
}
// comparator function that allows sorting trades by their output amounts, in decreasing order, and then input amounts
// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first
function inputOutputComparator(a, b) {
    // must have same input and output token for comparison
    (0, tiny_invariant_1.default)((0, token_1.currencyEquals)(a.inputAmount.currency, b.inputAmount.currency), 'INPUT_CURRENCY');
    (0, tiny_invariant_1.default)((0, token_1.currencyEquals)(a.outputAmount.currency, b.outputAmount.currency), 'OUTPUT_CURRENCY');
    if (a.outputAmount.equalTo(b.outputAmount)) {
        if (a.inputAmount.equalTo(b.inputAmount)) {
            return 0;
        }
        // trade A requires less input than trade B, so A should come first
        if (a.inputAmount.lessThan(b.inputAmount)) {
            return -1;
        }
        else {
            return 1;
        }
    }
    else {
        // tradeA has less output than trade B, so should come second
        if (a.outputAmount.lessThan(b.outputAmount)) {
            return 1;
        }
        else {
            return -1;
        }
    }
}
exports.inputOutputComparator = inputOutputComparator;
// extension of the input output comparator that also considers other dimensions of the trade in ranking them
function tradeComparator(a, b) {
    var ioComp = inputOutputComparator(a, b);
    if (ioComp !== 0) {
        return ioComp;
    }
    // consider lowest slippage next, since these are less likely to fail
    if (a.priceImpact.lessThan(b.priceImpact)) {
        return -1;
    }
    else if (a.priceImpact.greaterThan(b.priceImpact)) {
        return 1;
    }
    // finally consider the number of hops since each hop costs gas
    return a.route.path.length - b.route.path.length;
}
exports.tradeComparator = tradeComparator;
/**
 * Given a currency amount and a chain ID, returns the equivalent representation as the token amount.
 * In other words, if the currency is ETHER, returns the WETH token amount for the given chain. Otherwise, returns
 * the input currency amount.
 */
function wrappedAmount(currencyAmount, chainId) {
    if (currencyAmount instanceof tokenAmount_1.TokenAmount)
        return currencyAmount;
    if (currencyAmount.currency === currency_1.ETHER)
        return new tokenAmount_1.TokenAmount(token_1.WETH[chainId], currencyAmount.raw);
    (0, tiny_invariant_1.default)(false, 'CURRENCY');
}
function wrappedCurrency(currency, chainId) {
    if (currency instanceof token_1.Token)
        return currency;
    if (currency === currency_1.ETHER)
        return token_1.WETH[chainId];
    (0, tiny_invariant_1.default)(false, 'CURRENCY');
}
/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */
var Trade = /** @class */ (function () {
    function Trade(route, amount, tradeType) {
        var amounts = new Array(route.path.length);
        var nextPairs = new Array(route.pairs.length);
        if (tradeType === constants_1.TradeType.EXACT_INPUT) {
            (0, tiny_invariant_1.default)((0, token_1.currencyEquals)(amount.currency, route.input), 'INPUT');
            amounts[0] = wrappedAmount(amount, route.chainId);
            for (var i = 0; i < route.path.length - 1; i++) {
                var pair = route.pairs[i];
                var _a = pair.getOutputAmount(amounts[i]), outputAmount = _a[0], nextPair = _a[1];
                amounts[i + 1] = outputAmount;
                nextPairs[i] = nextPair;
            }
        }
        else {
            (0, tiny_invariant_1.default)((0, token_1.currencyEquals)(amount.currency, route.output), 'OUTPUT');
            amounts[amounts.length - 1] = wrappedAmount(amount, route.chainId);
            for (var i = route.path.length - 1; i > 0; i--) {
                var pair = route.pairs[i - 1];
                var _b = pair.getInputAmount(amounts[i]), inputAmount = _b[0], nextPair = _b[1];
                amounts[i - 1] = inputAmount;
                nextPairs[i - 1] = nextPair;
            }
        }
        this.route = route;
        this.tradeType = tradeType;
        this.inputAmount =
            tradeType === constants_1.TradeType.EXACT_INPUT
                ? amount
                : route.input === currency_1.ETHER
                    ? currencyAmount_1.CurrencyAmount.ether(amounts[0].raw)
                    : amounts[0];
        this.outputAmount =
            tradeType === constants_1.TradeType.EXACT_OUTPUT
                ? amount
                : route.output === currency_1.ETHER
                    ? currencyAmount_1.CurrencyAmount.ether(amounts[amounts.length - 1].raw)
                    : amounts[amounts.length - 1];
        this.executionPrice = new price_1.Price(this.inputAmount.currency, this.outputAmount.currency, this.inputAmount.raw, this.outputAmount.raw);
        this.nextMidPrice = price_1.Price.fromRoute(new route_1.Route(nextPairs, route.input));
        this.priceImpact = computePriceImpact(route.midPrice, this.inputAmount, this.outputAmount);
    }
    /**
     * Constructs an exact in trade with the given amount in and route
     * @param route route of the exact in trade
     * @param amountIn the amount being passed in
     */
    Trade.exactIn = function (route, amountIn) {
        return new Trade(route, amountIn, constants_1.TradeType.EXACT_INPUT);
    };
    /**
     * Constructs an exact out trade with the given amount out and route
     * @param route route of the exact out trade
     * @param amountOut the amount returned by the trade
     */
    Trade.exactOut = function (route, amountOut) {
        return new Trade(route, amountOut, constants_1.TradeType.EXACT_OUTPUT);
    };
    /**
     * Get the minimum amount that must be received from this trade for the given slippage tolerance
     * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
     */
    Trade.prototype.minimumAmountOut = function (slippageTolerance) {
        (0, tiny_invariant_1.default)(!slippageTolerance.lessThan(constants_1.ZERO), 'SLIPPAGE_TOLERANCE');
        if (this.tradeType === constants_1.TradeType.EXACT_OUTPUT) {
            return this.outputAmount;
        }
        else {
            var slippageAdjustedAmountOut = new fraction_1.Fraction(constants_1.ONE)
                .add(slippageTolerance)
                .invert()
                .multiply(this.outputAmount.raw).quotient;
            return this.outputAmount instanceof tokenAmount_1.TokenAmount
                ? new tokenAmount_1.TokenAmount(this.outputAmount.token, slippageAdjustedAmountOut)
                : currencyAmount_1.CurrencyAmount.ether(slippageAdjustedAmountOut);
        }
    };
    /**
     * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
     * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
     */
    Trade.prototype.maximumAmountIn = function (slippageTolerance) {
        (0, tiny_invariant_1.default)(!slippageTolerance.lessThan(constants_1.ZERO), 'SLIPPAGE_TOLERANCE');
        if (this.tradeType === constants_1.TradeType.EXACT_INPUT) {
            return this.inputAmount;
        }
        else {
            var slippageAdjustedAmountIn = new fraction_1.Fraction(constants_1.ONE).add(slippageTolerance).multiply(this.inputAmount.raw).quotient;
            return this.inputAmount instanceof tokenAmount_1.TokenAmount
                ? new tokenAmount_1.TokenAmount(this.inputAmount.token, slippageAdjustedAmountIn)
                : currencyAmount_1.CurrencyAmount.ether(slippageAdjustedAmountIn);
        }
    };
    /**
     * Given a list of pairs, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
     * amount to an output token, making at most `maxHops` hops.
     * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
     * the amount in among multiple routes.
     * @param pairs the pairs to consider in finding the best trade
     * @param currencyAmountIn exact amount of input currency to spend
     * @param currencyOut the desired currency out
     * @param maxNumResults maximum number of results to return
     * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
     * @param currentPairs used in recursion; the current list of pairs
     * @param originalAmountIn used in recursion; the original value of the currencyAmountIn parameter
     * @param bestTrades used in recursion; the current list of best trades
     */
    Trade.bestTradeExactIn = function (pairs, currencyAmountIn, currencyOut, _a, 
    // used in recursion.
    currentPairs, originalAmountIn, bestTrades) {
        var _b = _a === void 0 ? {} : _a, _c = _b.maxNumResults, maxNumResults = _c === void 0 ? 3 : _c, _d = _b.maxHops, maxHops = _d === void 0 ? 3 : _d;
        if (currentPairs === void 0) { currentPairs = []; }
        if (originalAmountIn === void 0) { originalAmountIn = currencyAmountIn; }
        if (bestTrades === void 0) { bestTrades = []; }
        (0, tiny_invariant_1.default)(pairs.length > 0, 'PAIRS');
        (0, tiny_invariant_1.default)(maxHops > 0, 'MAX_HOPS');
        (0, tiny_invariant_1.default)(originalAmountIn === currencyAmountIn || currentPairs.length > 0, 'INVALID_RECURSION');
        var chainId = currencyAmountIn instanceof tokenAmount_1.TokenAmount
            ? currencyAmountIn.token.chainId
            : currencyOut instanceof token_1.Token
                ? currencyOut.chainId
                : undefined;
        (0, tiny_invariant_1.default)(chainId !== undefined, 'CHAIN_ID');
        var amountIn = wrappedAmount(currencyAmountIn, chainId);
        var tokenOut = wrappedCurrency(currencyOut, chainId);
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            // pair irrelevant
            if (!pair.token0.equals(amountIn.token) && !pair.token1.equals(amountIn.token))
                continue;
            if (pair.reserve0.equalTo(constants_1.ZERO) || pair.reserve1.equalTo(constants_1.ZERO))
                continue;
            var amountOut = void 0;
            try {
                ;
                amountOut = pair.getOutputAmount(amountIn)[0];
            }
            catch (error) {
                // input too low
                if (error.isInsufficientInputAmountError) {
                    continue;
                }
                throw error;
            }
            // we have arrived at the output token, so this is the final trade of one of the paths
            if (amountOut.token.equals(tokenOut)) {
                (0, utils_1.sortedInsert)(bestTrades, new Trade(new route_1.Route(__spreadArray(__spreadArray([], currentPairs, true), [pair], false), originalAmountIn.currency, currencyOut), originalAmountIn, constants_1.TradeType.EXACT_INPUT), maxNumResults, tradeComparator);
            }
            else if (maxHops > 1 && pairs.length > 1) {
                var pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length));
                // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops
                Trade.bestTradeExactIn(pairsExcludingThisPair, amountOut, currencyOut, {
                    maxNumResults: maxNumResults,
                    maxHops: maxHops - 1
                }, __spreadArray(__spreadArray([], currentPairs, true), [pair], false), originalAmountIn, bestTrades);
            }
        }
        return bestTrades;
    };
    /**
     * similar to the above method but instead targets a fixed output amount
     * given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
     * to an output token amount, making at most `maxHops` hops
     * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
     * the amount in among multiple routes.
     * @param pairs the pairs to consider in finding the best trade
     * @param currencyIn the currency to spend
     * @param currencyAmountOut the exact amount of currency out
     * @param maxNumResults maximum number of results to return
     * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
     * @param currentPairs used in recursion; the current list of pairs
     * @param originalAmountOut used in recursion; the original value of the currencyAmountOut parameter
     * @param bestTrades used in recursion; the current list of best trades
     */
    Trade.bestTradeExactOut = function (pairs, currencyIn, currencyAmountOut, _a, 
    // used in recursion.
    currentPairs, originalAmountOut, bestTrades) {
        var _b = _a === void 0 ? {} : _a, _c = _b.maxNumResults, maxNumResults = _c === void 0 ? 3 : _c, _d = _b.maxHops, maxHops = _d === void 0 ? 3 : _d;
        if (currentPairs === void 0) { currentPairs = []; }
        if (originalAmountOut === void 0) { originalAmountOut = currencyAmountOut; }
        if (bestTrades === void 0) { bestTrades = []; }
        (0, tiny_invariant_1.default)(pairs.length > 0, 'PAIRS');
        (0, tiny_invariant_1.default)(maxHops > 0, 'MAX_HOPS');
        (0, tiny_invariant_1.default)(originalAmountOut === currencyAmountOut || currentPairs.length > 0, 'INVALID_RECURSION');
        var chainId = currencyAmountOut instanceof tokenAmount_1.TokenAmount
            ? currencyAmountOut.token.chainId
            : currencyIn instanceof token_1.Token
                ? currencyIn.chainId
                : undefined;
        (0, tiny_invariant_1.default)(chainId !== undefined, 'CHAIN_ID');
        var amountOut = wrappedAmount(currencyAmountOut, chainId);
        var tokenIn = wrappedCurrency(currencyIn, chainId);
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            // pair irrelevant
            if (!pair.token0.equals(amountOut.token) && !pair.token1.equals(amountOut.token))
                continue;
            if (pair.reserve0.equalTo(constants_1.ZERO) || pair.reserve1.equalTo(constants_1.ZERO))
                continue;
            var amountIn = void 0;
            try {
                ;
                amountIn = pair.getInputAmount(amountOut)[0];
            }
            catch (error) {
                // not enough liquidity in this pair
                if (error.isInsufficientReservesError) {
                    continue;
                }
                throw error;
            }
            // we have arrived at the input token, so this is the first trade of one of the paths
            if (amountIn.token.equals(tokenIn)) {
                (0, utils_1.sortedInsert)(bestTrades, new Trade(new route_1.Route(__spreadArray([pair], currentPairs, true), currencyIn, originalAmountOut.currency), originalAmountOut, constants_1.TradeType.EXACT_OUTPUT), maxNumResults, tradeComparator);
            }
            else if (maxHops > 1 && pairs.length > 1) {
                var pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length));
                // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops
                Trade.bestTradeExactOut(pairsExcludingThisPair, currencyIn, amountIn, {
                    maxNumResults: maxNumResults,
                    maxHops: maxHops - 1
                }, __spreadArray([pair], currentPairs, true), originalAmountOut, bestTrades);
            }
        }
        return bestTrades;
    };
    return Trade;
}());
exports.Trade = Trade;
