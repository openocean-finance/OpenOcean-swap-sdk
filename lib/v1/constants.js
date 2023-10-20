"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOLIDITY_TYPE_MAXIMA = exports.SolidityType = exports._1000 = exports._998 = exports._100 = exports.TEN = exports.FIVE = exports.THREE = exports.TWO = exports.ONE = exports.ZERO = exports.MINIMUM_LIQUIDITY = exports.INIT_CODE_HASH = exports.FACTORY_ADDRESS = exports.Rounding = exports.TradeType = exports.ChainId = void 0;
var jsbi_1 = __importDefault(require("jsbi"));
var ChainId;
(function (ChainId) {
    ChainId[ChainId["ETH"] = 1] = "ETH";
    ChainId[ChainId["MAINNET"] = 56] = "MAINNET";
    ChainId[ChainId["ONTEVM"] = 56] = "ONTEVM";
    ChainId[ChainId["BSCTESTNET"] = 97] = "BSCTESTNET";
    ChainId[ChainId["POLYGON"] = 137] = "POLYGON";
    ChainId[ChainId["KAVA"] = 2222] = "KAVA";
    ChainId[ChainId["AVAX"] = 43114] = "AVAX";
})(ChainId = exports.ChainId || (exports.ChainId = {}));
var TradeType;
(function (TradeType) {
    TradeType[TradeType["EXACT_INPUT"] = 0] = "EXACT_INPUT";
    TradeType[TradeType["EXACT_OUTPUT"] = 1] = "EXACT_OUTPUT";
})(TradeType = exports.TradeType || (exports.TradeType = {}));
var Rounding;
(function (Rounding) {
    Rounding[Rounding["ROUND_DOWN"] = 0] = "ROUND_DOWN";
    Rounding[Rounding["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
    Rounding[Rounding["ROUND_UP"] = 2] = "ROUND_UP";
})(Rounding = exports.Rounding || (exports.Rounding = {}));
// export const FACTORY_ADDRESS = '0xF22b5afBe6152ca43fAE20DDA4F75575BABD0c5A'
// export const INIT_CODE_HASH = '0xe7da666f616ba3bdb18c6908b22d556a41659bdd652762c246b8d1fa4f7506b4'
exports.FACTORY_ADDRESS = {
    1: '0x1F8c25f8DA3990Ecd3632eE4F02C2eA37755C3c6',
    56: '0xd76d8C2A7CA0a1609Aea0b9b5017B3F7782891bf',
    58: '0x1AA8c24ac757758e27E66E619429cA87d3Fc28BB',
    97: '0xd76d8C2A7CA0a1609Aea0b9b5017B3F7782891bf',
    137: '0xd76d8C2A7CA0a1609Aea0b9b5017B3F7782891bf',
    2222: '0x6dd434082EAB5Cd134B33719ec1FF05fE985B97b',
    42161: '0x01Ec93c289cB003e741f621cDD4FE837243f8905',
    43114: '0x042AF448582d0a3cE3CFa5b65c2675e88610B18d'
};
exports.INIT_CODE_HASH = {
    1: '0x338b9651a8c140547a88432caaff04a13e79d54b23e3cfec1e37fb3051125fab',
    56: '0xe7da666f616ba3bdb18c6908b22d556a41659bdd652762c246b8d1fa4f7506b4',
    58: '0xe7da666f616ba3bdb18c6908b22d556a41659bdd652762c246b8d1fa4f7506b4',
    97: '0xe7da666f616ba3bdb18c6908b22d556a41659bdd652762c246b8d1fa4f7506b4',
    137: '0x0415568b317738f62f1608a814ac51b81c10e7300e23f4b1395231fc8251e7e4',
    2222: '0xc26b7c10cfd3e76ca96f0c5d9191b4c2e08295897ffd6e452ae36b1f11f6fec3',
    42161: '0xc26b7c10cfd3e76ca96f0c5d9191b4c2e08295897ffd6e452ae36b1f11f6fec3',
    43114: '0x0761dc23a5b0e399fc92b9c3ea676b0314153899f2e30483c7217dcc02046630'
};
exports.MINIMUM_LIQUIDITY = jsbi_1.default.BigInt(1000);
// exports for internal consumption
exports.ZERO = jsbi_1.default.BigInt(0);
exports.ONE = jsbi_1.default.BigInt(1);
exports.TWO = jsbi_1.default.BigInt(2);
exports.THREE = jsbi_1.default.BigInt(3);
exports.FIVE = jsbi_1.default.BigInt(5);
exports.TEN = jsbi_1.default.BigInt(10);
exports._100 = jsbi_1.default.BigInt(100);
exports._998 = jsbi_1.default.BigInt(998);
exports._1000 = jsbi_1.default.BigInt(1000);
var SolidityType;
(function (SolidityType) {
    SolidityType["uint8"] = "uint8";
    SolidityType["uint256"] = "uint256";
})(SolidityType = exports.SolidityType || (exports.SolidityType = {}));
exports.SOLIDITY_TYPE_MAXIMA = (_a = {},
    _a[SolidityType.uint8] = jsbi_1.default.BigInt('0xff'),
    _a[SolidityType.uint256] = jsbi_1.default.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
    _a);
