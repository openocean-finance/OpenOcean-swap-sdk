"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProxyContract = exports.config = exports.ERC20_abi = void 0;
// import { wallets, Wallets } from "./Wallets";
// import { chains, Chains } from "./Chains";
var wallet_1 = require("@openocean.finance/wallet");
exports.ERC20_abi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }];
exports.config = {
    chains: wallet_1.chainsObj,
    wallets: wallet_1.walletsObj,
    ERC20_abi: exports.ERC20_abi
};
function getProxyContract(chainName) {
    return {
        eth: '0x38B7C17E62dcBD1C39f96eFe74848C4A037b3ed3',
        bsc: "0x7aeef1035ba6794c0478718a2330671ec8802af1",
        fantom: "0x38B7C17E62dcBD1C39f96eFe74848C4A037b3ed3",
        avax: "0x38B7C17E62dcBD1C39f96eFe74848C4A037b3ed3",
        polygon: "0x38B7C17E62dcBD1C39f96eFe74848C4A037b3ed3",
        okex: "0x6D5630eC1Ee74C907617a6fb7BCAdC4Bf0EF3fcA",
        optimism: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
        harmony: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
        cronos: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
        moonriver: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
        arbitrum: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
        heco: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
        boba: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
        xdai: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
        tron: "TTpcMZbsojNCMhea2a9LFHq9DLCxsgGZVv",
    }[chainName];
}
exports.getProxyContract = getProxyContract;
;
