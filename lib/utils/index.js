"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WETH_ADDRESS = exports.WETH_ABI = exports.EIP_712_ORDER_TYPE = exports.confirmLater = exports.isPc = exports.utils = exports.Utils = exports.ChainNames = void 0;
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var ChainNames;
(function (ChainNames) {
    ChainNames[ChainNames["eth"] = 0] = "eth";
    ChainNames[ChainNames["solana"] = 1] = "solana";
    ChainNames[ChainNames["ont"] = 2] = "ont";
    ChainNames[ChainNames["terra"] = 3] = "terra";
    ChainNames[ChainNames["tron"] = 4] = "tron";
    ChainNames[ChainNames["ropsten"] = 5] = "ropsten";
    ChainNames[ChainNames["bsc"] = 6] = "bsc";
    ChainNames[ChainNames["okex"] = 7] = "okex";
    ChainNames[ChainNames["polygon"] = 8] = "polygon";
    ChainNames[ChainNames["fantom"] = 9] = "fantom";
    ChainNames[ChainNames["heco"] = 10] = "heco";
    ChainNames[ChainNames["avax"] = 11] = "avax";
    ChainNames[ChainNames["arbitrum"] = 12] = "arbitrum";
    ChainNames[ChainNames["xdai"] = 13] = "xdai";
    ChainNames[ChainNames["optimism"] = 14] = "optimism";
    ChainNames[ChainNames["boba"] = 15] = "boba";
    ChainNames[ChainNames["moonriver"] = 16] = "moonriver";
    ChainNames[ChainNames["aurora"] = 17] = "aurora";
    ChainNames[ChainNames["cronos"] = 18] = "cronos";
    ChainNames[ChainNames["cosmos"] = 19] = "cosmos";
    ChainNames[ChainNames["osmosis"] = 20] = "osmosis";
    ChainNames[ChainNames["harmony"] = 21] = "harmony";
    ChainNames[ChainNames["bsctest"] = 22] = "bsctest";
})(ChainNames = exports.ChainNames || (exports.ChainNames = {}));
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.prototype.sleep = function (interval) {
        return new Promise(function (resolve) {
            setTimeout(resolve, interval);
        });
    };
    Utils.prototype.getShift = function (a, b) {
        return new bignumber_js_1.default(a).shiftedBy(Number(b)).toFixed();
    };
    Utils.prototype.decimals2Amount = function (amount, decimals) {
        return this.getShift(amount, -decimals);
    };
    Utils.prototype.amount2Decimals = function (amount, decimals) {
        return this.getFixed(this.getShift(amount, decimals), 0);
    };
    Utils.prototype.getFixed = function (val, fixed, trailingZeros) {
        var numStr = val || '0';
        if (trailingZeros) {
            return new bignumber_js_1.default(numStr).toFixed(fixed);
        }
        return new bignumber_js_1.default(numStr).decimalPlaces(fixed).toString();
    };
    Utils.prototype.toFixed = function (n, k, z) {
        if (isNaN(n)) {
            return 0;
        }
        if (!k)
            k = 4;
        return new bignumber_js_1.default(n).toFixed(k, 1);
        // let a = 10 ** k
        // if (Number(n) < 0) {
        //   a = Math.ceil(Number(n) * a) / a
        // } else {
        //   a = Math.floor(Number(n) * a) / a
        // }
        // if (!z) {
        //   return a
        // } else {
        //   return a.toFixed(k)
        // }
    };
    return Utils;
}());
exports.Utils = Utils;
exports.utils = new Utils();
function isPc() {
    var userAgent = navigator.userAgent, Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    console.log('userAgent:', userAgent);
    return Agents.some(function (i) {
        return userAgent.includes(i);
    });
}
exports.isPc = isPc;
function confirmLater(promise) {
    return new Promise(function (resolve, reject) {
        promise.on("transactionHash", resolve);
        promise.on("error", reject);
        function onConfirm(confNumber, receipt) {
            promise.off("confirmation", onConfirm);
        }
        promise.on("confirmation", onConfirm);
    });
}
exports.confirmLater = confirmLater;
exports.EIP_712_ORDER_TYPE = {
    EIP712Domain: [
        {
            name: "name",
            type: "string",
        },
        {
            name: "version",
            type: "string",
        },
        {
            name: "chainId",
            type: "uint256",
        },
        {
            name: "verifyingContract",
            type: "address",
        },
    ],
    OrderComponents: [
        {
            name: "offerer",
            type: "address",
        },
        {
            name: "zone",
            type: "address",
        },
        {
            name: "offer",
            type: "OfferItem[]",
        },
        {
            name: "consideration",
            type: "ConsiderationItem[]",
        },
        {
            name: "orderType",
            type: "uint8",
        },
        {
            name: "startTime",
            type: "uint256",
        },
        {
            name: "endTime",
            type: "uint256",
        },
        {
            name: "zoneHash",
            type: "bytes32",
        },
        {
            name: "salt",
            type: "uint256",
        },
        {
            name: "conduitKey",
            type: "bytes32",
        },
        {
            name: "counter",
            type: "uint256",
        },
    ],
    OfferItem: [
        {
            name: "itemType",
            type: "uint8",
        },
        {
            name: "token",
            type: "address",
        },
        {
            name: "identifierOrCriteria",
            type: "uint256",
        },
        {
            name: "startAmount",
            type: "uint256",
        },
        {
            name: "endAmount",
            type: "uint256",
        },
    ],
    ConsiderationItem: [
        {
            name: "itemType",
            type: "uint8",
        },
        {
            name: "token",
            type: "address",
        },
        {
            name: "identifierOrCriteria",
            type: "uint256",
        },
        {
            name: "startAmount",
            type: "uint256",
        },
        {
            name: "endAmount",
            type: "uint256",
        },
        {
            name: "recipient",
            type: "address",
        },
    ],
};
exports.WETH_ABI = [
    {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            { name: "guy", type: "address" },
            { name: "wad", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            { name: "src", type: "address" },
            { name: "dst", type: "address" },
            { name: "wad", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: false,
        inputs: [{ name: "wad", type: "uint256" }],
        name: "withdraw",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [{ name: "", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            { name: "dst", type: "address" },
            { name: "wad", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: false,
        inputs: [],
        name: "deposit",
        outputs: [],
        payable: true,
        stateMutability: "payable",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            { name: "", type: "address" },
            { name: "", type: "address" },
        ],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    { payable: true, stateMutability: "payable", type: "fallback" },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "src", type: "address" },
            { indexed: true, name: "guy", type: "address" },
            { indexed: false, name: "wad", type: "uint256" },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "src", type: "address" },
            { indexed: true, name: "dst", type: "address" },
            { indexed: false, name: "wad", type: "uint256" },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "dst", type: "address" },
            { indexed: false, name: "wad", type: "uint256" },
        ],
        name: "Deposit",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "src", type: "address" },
            { indexed: false, name: "wad", type: "uint256" },
        ],
        name: "Withdrawal",
        type: "event",
    },
];
exports.WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
