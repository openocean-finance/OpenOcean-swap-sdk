import JSBI from 'jsbi'

// exports for external consumption
export type BigintIsh = JSBI | bigint | string

export enum ChainId {
  ETH = 1,
  MAINNET = 56,
  ONTEVM = 56,
  BSCTESTNET = 97,
  POLYGON = 137,
  KAVA = 2222,
  AVAX = 43114
}

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP
}

// export const FACTORY_ADDRESS = '0xF22b5afBe6152ca43fAE20DDA4F75575BABD0c5A'

// export const INIT_CODE_HASH = '0xe7da666f616ba3bdb18c6908b22d556a41659bdd652762c246b8d1fa4f7506b4'

export const FACTORY_ADDRESS = {
  1: '0x1F8c25f8DA3990Ecd3632eE4F02C2eA37755C3c6',
  56: '0xd76d8C2A7CA0a1609Aea0b9b5017B3F7782891bf',
  58: '0x1AA8c24ac757758e27E66E619429cA87d3Fc28BB',
  97: '0xd76d8C2A7CA0a1609Aea0b9b5017B3F7782891bf',
  137: '0xd76d8C2A7CA0a1609Aea0b9b5017B3F7782891bf',
  2222: '0x6dd434082EAB5Cd134B33719ec1FF05fE985B97b',
  42161: '0x01Ec93c289cB003e741f621cDD4FE837243f8905',
  43114: '0x042AF448582d0a3cE3CFa5b65c2675e88610B18d'
}

export const INIT_CODE_HASH = {
  1: '0x338b9651a8c140547a88432caaff04a13e79d54b23e3cfec1e37fb3051125fab',
  56: '0xe7da666f616ba3bdb18c6908b22d556a41659bdd652762c246b8d1fa4f7506b4',
  58: '0xe7da666f616ba3bdb18c6908b22d556a41659bdd652762c246b8d1fa4f7506b4',
  97: '0xe7da666f616ba3bdb18c6908b22d556a41659bdd652762c246b8d1fa4f7506b4',
  137: '0x0415568b317738f62f1608a814ac51b81c10e7300e23f4b1395231fc8251e7e4',
  2222: '0xc26b7c10cfd3e76ca96f0c5d9191b4c2e08295897ffd6e452ae36b1f11f6fec3',
  42161: '0xc26b7c10cfd3e76ca96f0c5d9191b4c2e08295897ffd6e452ae36b1f11f6fec3',
  43114: '0x0761dc23a5b0e399fc92b9c3ea676b0314153899f2e30483c7217dcc02046630'
}

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const _998 = JSBI.BigInt(998)
export const _1000 = JSBI.BigInt(1000)

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256'
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}
