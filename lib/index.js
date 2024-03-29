"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MINIMUM_LIQUIDITY = exports.INIT_CODE_HASH = exports.FACTORY_ADDRESS = exports.Rounding = exports.TradeType = exports.ChainId = exports.JSBI = exports.OpenoceanSdk = void 0;
var api_1 = require("./api");
var utils_1 = require("./utils");
var web3_1 = require("./utils/web3");
var swapSdk_1 = require("./swapSdk");
var config_1 = require("./config");
var OpenoceanSdk = /** @class */ (function () {
    function OpenoceanSdk(sdkArg) {
        this.web3 = web3_1.web3;
        this.utils = utils_1.utils;
        this.config = config_1.config;
        this.swapSdk = swapSdk_1.swapSdk;
        this.api = new api_1.Api(sdkArg ? sdkArg.apiUrl : '');
        this.swapSdk.setApi(this.api);
    }
    return OpenoceanSdk;
}());
exports.OpenoceanSdk = OpenoceanSdk;
var jsbi_1 = __importDefault(require("jsbi"));
exports.JSBI = jsbi_1.default;
var constants_1 = require("./v1/constants");
Object.defineProperty(exports, "ChainId", { enumerable: true, get: function () { return constants_1.ChainId; } });
Object.defineProperty(exports, "TradeType", { enumerable: true, get: function () { return constants_1.TradeType; } });
Object.defineProperty(exports, "Rounding", { enumerable: true, get: function () { return constants_1.Rounding; } });
Object.defineProperty(exports, "FACTORY_ADDRESS", { enumerable: true, get: function () { return constants_1.FACTORY_ADDRESS; } });
Object.defineProperty(exports, "INIT_CODE_HASH", { enumerable: true, get: function () { return constants_1.INIT_CODE_HASH; } });
Object.defineProperty(exports, "MINIMUM_LIQUIDITY", { enumerable: true, get: function () { return constants_1.MINIMUM_LIQUIDITY; } });
__exportStar(require("./v1/errors"), exports);
__exportStar(require("./v1/entities"), exports);
__exportStar(require("./v1/router"), exports);
__exportStar(require("./v1/fetcher"), exports);
