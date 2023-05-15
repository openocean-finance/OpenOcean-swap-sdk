export declare enum ChainNames {
    'eth' = 0,
    'solana' = 1,
    'ont' = 2,
    'terra' = 3,
    'tron' = 4,
    'ropsten' = 5,
    'bsc' = 6,
    'okex' = 7,
    'polygon' = 8,
    'fantom' = 9,
    'heco' = 10,
    'avax' = 11,
    'arbitrum' = 12,
    'xdai' = 13,
    'optimism' = 14,
    'boba' = 15,
    'moonriver' = 16,
    'aurora' = 17,
    'cronos' = 18,
    'cosmos' = 19,
    'osmosis' = 20,
    'harmony' = 21,
    'bsctest' = 22
}
export declare class Utils {
    sleep(interval: number): Promise<unknown>;
    getShift(a: any, b: any): string;
    decimals2Amount(amount: any, decimals: any): string;
    amount2Decimals(amount: any, decimals: any): string;
    getFixed(val: any, fixed: any, trailingZeros?: any): string;
    toFixed(n: any, k: any, z?: any): string | 0;
}
export declare const utils: Utils;
export declare function isPc(): boolean;
export declare function confirmLater(promise: any): Promise<unknown>;
export declare const EIP_712_ORDER_TYPE: {
    EIP712Domain: {
        name: string;
        type: string;
    }[];
    OrderComponents: {
        name: string;
        type: string;
    }[];
    OfferItem: {
        name: string;
        type: string;
    }[];
    ConsiderationItem: {
        name: string;
        type: string;
    }[];
};
export declare const WETH_ABI: ({
    constant: boolean;
    inputs: {
        name: string;
        type: string;
    }[];
    name: string;
    outputs: {
        name: string;
        type: string;
    }[];
    payable: boolean;
    stateMutability: string;
    type: string;
    anonymous?: undefined;
} | {
    payable: boolean;
    stateMutability: string;
    type: string;
    constant?: undefined;
    inputs?: undefined;
    name?: undefined;
    outputs?: undefined;
    anonymous?: undefined;
} | {
    anonymous: boolean;
    inputs: {
        indexed: boolean;
        name: string;
        type: string;
    }[];
    name: string;
    type: string;
    constant?: undefined;
    outputs?: undefined;
    payable?: undefined;
    stateMutability?: undefined;
})[];
export declare const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
