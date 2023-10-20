"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortedInsert = exports.sqrt = exports.parseBigintIsh = exports.validateAndParseAddress = exports.validateSolidityTypeInstance = void 0;
var tiny_invariant_1 = __importDefault(require("tiny-invariant"));
var tiny_warning_1 = __importDefault(require("tiny-warning"));
var jsbi_1 = __importDefault(require("jsbi"));
var address_1 = require("@ethersproject/address");
var constants_1 = require("./constants");
function validateSolidityTypeInstance(value, solidityType) {
    (0, tiny_invariant_1.default)(jsbi_1.default.greaterThanOrEqual(value, constants_1.ZERO), "".concat(value, " is not a ").concat(solidityType, "."));
    (0, tiny_invariant_1.default)(jsbi_1.default.lessThanOrEqual(value, constants_1.SOLIDITY_TYPE_MAXIMA[solidityType]), "".concat(value, " is not a ").concat(solidityType, "."));
}
exports.validateSolidityTypeInstance = validateSolidityTypeInstance;
// warns if addresses are not checksummed
function validateAndParseAddress(address) {
    try {
        var checksummedAddress = (0, address_1.getAddress)(address);
        (0, tiny_warning_1.default)(address === checksummedAddress, "".concat(address, " is not checksummed."));
        return checksummedAddress;
    }
    catch (error) {
        (0, tiny_invariant_1.default)(false, "".concat(address, " is not a valid address."));
    }
}
exports.validateAndParseAddress = validateAndParseAddress;
function parseBigintIsh(bigintIsh) {
    return bigintIsh instanceof jsbi_1.default
        ? bigintIsh
        : typeof bigintIsh === 'bigint'
            ? jsbi_1.default.BigInt(bigintIsh.toString())
            : jsbi_1.default.BigInt(bigintIsh);
}
exports.parseBigintIsh = parseBigintIsh;
// mock the on-chain sqrt function
function sqrt(y) {
    validateSolidityTypeInstance(y, constants_1.SolidityType.uint256);
    var z = constants_1.ZERO;
    var x;
    if (jsbi_1.default.greaterThan(y, constants_1.THREE)) {
        z = y;
        x = jsbi_1.default.add(jsbi_1.default.divide(y, constants_1.TWO), constants_1.ONE);
        while (jsbi_1.default.lessThan(x, z)) {
            z = x;
            x = jsbi_1.default.divide(jsbi_1.default.add(jsbi_1.default.divide(y, x), x), constants_1.TWO);
        }
    }
    else if (jsbi_1.default.notEqual(y, constants_1.ZERO)) {
        z = constants_1.ONE;
    }
    return z;
}
exports.sqrt = sqrt;
// given an array of items sorted by `comparator`, insert an item into its sort index and constrain the size to
// `maxSize` by removing the last item
function sortedInsert(items, add, maxSize, comparator) {
    (0, tiny_invariant_1.default)(maxSize > 0, 'MAX_SIZE_ZERO');
    // this is an invariant because the interface cannot return multiple removed items if items.length exceeds maxSize
    (0, tiny_invariant_1.default)(items.length <= maxSize, 'ITEMS_SIZE');
    // short circuit first item add
    if (items.length === 0) {
        items.push(add);
        return null;
    }
    else {
        var isFull = items.length === maxSize;
        // short circuit if full and the additional item does not come before the last item
        if (isFull && comparator(items[items.length - 1], add) <= 0) {
            return add;
        }
        var lo = 0, hi = items.length;
        while (lo < hi) {
            var mid = (lo + hi) >>> 1;
            if (comparator(items[mid], add) <= 0) {
                lo = mid + 1;
            }
            else {
                hi = mid;
            }
        }
        items.splice(lo, 0, add);
        return isFull ? items.pop() : null;
    }
}
exports.sortedInsert = sortedInsert;
