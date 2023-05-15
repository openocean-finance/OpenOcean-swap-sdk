import BigNumber from 'bignumber.js';


export enum ChainNames {
  'eth', 'solana', 'ont', 'terra', 'tron', 'ropsten',
  'bsc', 'okex', 'polygon', 'fantom', 'heco', 'avax',
  'arbitrum', 'xdai', 'optimism', 'boba', 'moonriver',
  'aurora', 'cronos', 'cosmos', 'osmosis', 'harmony', 'bsctest'
}



export class Utils {
  sleep(interval: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, interval);
    });
  }
  getShift(a: any, b: any): string {
    return new BigNumber(a).shiftedBy(Number(b)).toFixed()
  }
  decimals2Amount(amount: any, decimals: any): string {
    return this.getShift(amount, -decimals)
  }
  amount2Decimals(amount: any, decimals: any): string {
    return this.getFixed(this.getShift(amount, decimals), 0);
  }
  getFixed(val: any, fixed: any, trailingZeros?: any): string {
    const numStr = val || '0';
    if (trailingZeros) {
      return new BigNumber(numStr).toFixed(fixed);
    }
    return new BigNumber(numStr).decimalPlaces(fixed).toString();
  }
  toFixed(n: any, k: any, z?: any) {
    if (isNaN(n)) {
      return 0
    }
    if (!k) k = 4
    return new BigNumber(n).toFixed(k, 1);
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
  }
}

export const utils: Utils = new Utils()

export function isPc() {
  let userAgent = navigator.userAgent, Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
  console.log('userAgent:', userAgent)
  return Agents.some((i) => {
    return userAgent.includes(i)
  })
}

export function confirmLater(promise: any) {
  return new Promise((resolve, reject) => {
    promise.on("transactionHash", resolve);
    promise.on("error", reject);
    function onConfirm(confNumber: any, receipt: any) {
      promise.off("confirmation", onConfirm);
    }
    promise.on("confirmation", onConfirm);
  });
}

export const EIP_712_ORDER_TYPE = {
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

export const WETH_ABI = [
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

export const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
