import { Api } from './api';
import { Utils } from './utils';
import { Web3 } from './utils/web3';
import { SwapSdk } from './swapSdk';
import { Config } from './config';
interface OpenoceanSdkArg {
    apiUrl?: string;
}
export declare class OpenoceanSdk {
    web3: Web3;
    utils: Utils;
    config: Config;
    api: Api;
    swapSdk: SwapSdk;
    constructor(sdkArg?: OpenoceanSdkArg);
}
import JSBI from 'jsbi';
export { JSBI };
export { BigintIsh, ChainId, TradeType, Rounding, FACTORY_ADDRESS, INIT_CODE_HASH, MINIMUM_LIQUIDITY } from './v1/constants';
export * from './v1/errors';
export * from './v1/entities';
export * from './v1/router';
export * from './v1/fetcher';
