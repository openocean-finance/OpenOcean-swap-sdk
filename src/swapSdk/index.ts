
import { ReqApproveVo, ReqBalanceVo, ReqAllowanceVo } from "./RequestVo";
import { validateReq } from "../utils/ajx";
import { utils } from "../utils";
import { Approve } from "./Approve";
import { ERC20_abi } from "../config";
import { Swap, ReqSwapVo } from "./Swap";
import { Api } from "../api";
import { getBalance } from "./getBalance";
import { getAllowance } from "./getAllowance";
import BigNumber from 'bignumber.js';

import { tryWalletConnect, ReqConnectWalletVo } from '@openocean.finance/wallet';


export class SwapSdk {
  i: number = 0;
  chain: any;
  wallet: any;
  localProvider: any;
  localRpcUrl: string;

  private api: Api
  constructor() { }

  public setApi(api: Api) {
    this.api = api
  }

  public async swapQuote(reqSwapVo: ReqSwapVo) {
    if (!this.wallet) throw new Error('No linked wallet')
    if (this.wallet && this.chain.key != reqSwapVo.chain) {
      throw new Error('Need to switch chains')
    }
    return await this.api.swapQuote(reqSwapVo)
  }
  public swap(swapData: any) {
    let swap = new Swap(swapData, this.wallet, this.chain)
    setTimeout(() => {
      swap.send()
    }, 200);
    return swap
  }

  public fastSwap(swapData: any) {
    return new Promise(async (resolve, reject) => {
      if (this.chain.compiler == 'EVM' && swapData.chainId && this.wallet.key !== "GnosisSafeWallet") {
        let chainId = await this.wallet.sdk.eth.getChainId()
        console.log('chainId', chainId, swapData.chainId);
        if (chainId != swapData.chainId || !chainId) {
          reject({
            message: "Please be aware: Your wallet's network is different from OpenOcean's. Switch networks before sending transaction."
          })
          return
        }
      }
      let _gasPrice;
      try {
        _gasPrice = await this.wallet.sdk.eth.getGasPrice();
      } catch(e) {
        console.log('this.wallet.sdk.eth.getGasPrice', e);
      }
      if (_gasPrice && swapData.gasPrice) {
        swapData.gasPrice = BigNumber(_gasPrice).comparedTo(swapData.gasPrice) > 0 ? swapData.gasPrice : _gasPrice;
      } else if (_gasPrice && !swapData.gasPrice) {
        swapData.gasPrice = _gasPrice
      }

      this.swap(swapData)
        .on('transactionHash', resolve)
        .on('error', reject);
    })
  }

  public getGas(swapData: any) {
    let swap = new Swap(swapData, this.wallet, this.chain)
    return swap.getGas()
  }
  public getGasLocal(swapData: any) {
    let swap = new Swap(swapData, this.wallet, this.chain, true)
    return swap.getGas()
  }

  public async approve(reqApproveVo: ReqApproveVo) {
    if (!this.wallet) throw new Error('No linked wallet')
    if (this.wallet && this.chain.key != reqApproveVo.chain) throw new Error('Network error')
    const errors = await validateReq(reqApproveVo, ReqApproveVo)
    if (errors) throw new Error(errors)

    if (!reqApproveVo.tokenAbi) reqApproveVo.tokenAbi = ERC20_abi
    let contract = null;
    if (this.wallet.key === "TronLink") {
      contract = await this.wallet.sdk.contract().at(reqApproveVo.tokenAddress);
    } else if (this.wallet.sdk && this.wallet.sdk.eth && this.wallet.sdk.eth.Contract) {
      contract = new this.wallet.sdk.eth.Contract(reqApproveVo.tokenAbi, reqApproveVo.tokenAddress);
      if (!contract || !contract.methods || !contract.methods.approve) throw new Error('Contract error')
    }
    let approve = new Approve(contract, this.wallet);
    setTimeout(() => {
      approve.send(reqApproveVo, this.wallet.address)
    }, 200);
    return approve
  }
  public async connectWallet(reqConnectWalletVo: ReqConnectWalletVo) {

    let data = await tryWalletConnect(reqConnectWalletVo)
    this.wallet = data.wallet
    this.chain = data.chain
    this.localRpcUrl = data.localRpcUrl
    this.localProvider = data.localProvider
    return this

    // let data: any = await ConnectWallet.link(reqConnectWalletVo)
    // if (data) {
    //   if (reqConnectWalletVo.localRpcUrl) {
    //     this.localProvider = new Web3(new Web3.providers.HttpProvider(reqConnectWalletVo.localRpcUrl))
    //     this.localRpcUrl = reqConnectWalletVo.localRpcUrl
    //   } else {
    //     this.localProvider = null
    //     this.localRpcUrl = ''
    //     if (data.chain.compiler == 'EVM') {
    //       const params = chains.ethereumChainParams[reqConnectWalletVo.chain];
    //       if (params) {
    //         this.localRpcUrl = params[0].rpcUrls[0]
    //       } else if (data.chain.chainId == '1') {
    //         this.localRpcUrl = 'https://mainnet.infura.io/v3/'
    //       } else if (data.chain.chainId == '4') {
    //         this.localRpcUrl = 'https://rinkeby.infura.io/v3/'
    //       }
    //       if (this.localRpcUrl) {
    //         this.localProvider = data.wallet.sdk
    //       }
    //     }
    //   }
    //   this.wallet = data.wallet
    //   this.chain = data.chain
    // }
  }
  public async getWallet(): Promise<any> {
    if (this.wallet) return this.wallet
    await utils.sleep(1000)
    return this.getWallet()
  }
  public async getChain(): Promise<any> {
    if (this.chain) return this.chain
    await utils.sleep(1000)
    return this.getChain()
  }
  public async getBalance(reqBalanceVo: ReqBalanceVo): Promise<number> {
    const errors = await validateReq(reqBalanceVo, ReqBalanceVo)
    if (errors) throw new Error(errors)
    if (!reqBalanceVo.account) reqBalanceVo.account = this.wallet.address
    if (this.localProvider) {
      return await getBalance(reqBalanceVo.account, reqBalanceVo.tokenAddressOrSymbol, reqBalanceVo.decimals, reqBalanceVo.chain, {
        sdk: this.localProvider,
        key: this.wallet.key
      })
    }
    return await getBalance(reqBalanceVo.account, reqBalanceVo.tokenAddressOrSymbol, reqBalanceVo.decimals, reqBalanceVo.chain, this.wallet, reqBalanceVo.customAddress)
  }
  public async getAllowance(reqAllowanceVo: ReqAllowanceVo): Promise<string> {
    const errors = await validateReq(reqAllowanceVo, ReqAllowanceVo)
    if (errors) throw new Error(errors)
    if (!reqAllowanceVo.account) reqAllowanceVo.account = this.wallet.sdk.address
    if (this.localProvider) {
      return await getAllowance(reqAllowanceVo.account, reqAllowanceVo.tokenAddress, reqAllowanceVo.decimals, reqAllowanceVo.chain, reqAllowanceVo.approveContract, this.localProvider)
    }
    return await getAllowance(reqAllowanceVo.account, reqAllowanceVo.tokenAddress, reqAllowanceVo.decimals, reqAllowanceVo.chain, reqAllowanceVo.approveContract, this.wallet.sdk)
  }

}

export const swapSdk = new SwapSdk()
