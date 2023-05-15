import { ChainName } from "../api/vo/RequestVo";
export declare class ReqConnectWalletVo extends ChainName {
    walletName: string;
    localRpcUrl: string;
    noSwitch: boolean;
}
export declare class ReqBalanceVo extends ChainName {
    tokenAddressOrSymbol: string;
    decimals: number;
    account: string;
    customAddress: string;
}
export declare class ReqAllowanceVo extends ChainName {
    approveContract: string;
    tokenAddress: string;
    decimals: number;
    account: string;
}
export declare class ReqApproveVo extends ChainName {
    tokenAddress: string;
    approveContract: string;
    amount: string;
    gasPrice: string;
    tokenAbi: any;
    decimals: any;
}
