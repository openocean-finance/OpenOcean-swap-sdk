import JSBI from 'jsbi';
export type BigintIsh = JSBI | bigint | string;
export declare enum ChainId {
    ETH = 1,
    MAINNET = 56,
    ONTEVM = 56,
    BSCTESTNET = 97,
    POLYGON = 137,
    KAVA = 2222,
    AVAX = 43114
}
export declare enum TradeType {
    EXACT_INPUT = 0,
    EXACT_OUTPUT = 1
}
export declare enum Rounding {
    ROUND_DOWN = 0,
    ROUND_HALF_UP = 1,
    ROUND_UP = 2
}
export declare const FACTORY_ADDRESS: {
    1: string;
    56: string;
    58: string;
    97: string;
    137: string;
    2222: string;
    42161: string;
    43114: string;
};
export declare const INIT_CODE_HASH: {
    1: string;
    56: string;
    58: string;
    97: string;
    137: string;
    2222: string;
    42161: string;
    43114: string;
};
export declare const MINIMUM_LIQUIDITY: JSBI;
export declare const ZERO: JSBI;
export declare const ONE: JSBI;
export declare const TWO: JSBI;
export declare const THREE: JSBI;
export declare const FIVE: JSBI;
export declare const TEN: JSBI;
export declare const _100: JSBI;
export declare const _998: JSBI;
export declare const _1000: JSBI;
export declare enum SolidityType {
    uint8 = "uint8",
    uint256 = "uint256"
}
export declare const SOLIDITY_TYPE_MAXIMA: {
    uint8: JSBI;
    uint256: JSBI;
};
