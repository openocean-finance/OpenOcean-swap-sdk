import { ReqApproveVo } from "./RequestVo";
import Web3 from "web3";
import { ethers } from "ethers";
import { chainsObj } from '@openocean.finance/wallet';
import BigNumber from 'bignumber.js';

const providerEth = new ethers.providers.JsonRpcProvider({
  url: "https://rpc.ankr.com/eth"
});

export class Approve {
  errorCallback: Function = () => { };
  transactionHashCallback: Function = () => { };
  receiptCallback: Function = () => { };
  successCallback: Function = () => { };
  contract: any;
  approveContract: string;
  tokenAddress: string;
  account: string;
  amount: string;
  key: number;
  wallet: any;

  constructor(contract: any, wallet: any) {
    this.contract = contract;
    this.wallet = wallet;
  }

  async send(reqApproveVo: ReqApproveVo, address: string) {
    this.account = address;
    this.key = 0;
    this.approveContract = reqApproveVo.approveContract;
    this.tokenAddress = reqApproveVo.tokenAddress;

    if (reqApproveVo.gasPrice && (String(reqApproveVo.gasPrice).indexOf('.') > -1 || Number(reqApproveVo.gasPrice) < 10 ** 6)) {
      reqApproveVo.gasPrice = new BigNumber(reqApproveVo.gasPrice + '').times(10 ** 9).toFixed(0)
    }

    let _gasPrice;
    try {
      _gasPrice = await this.wallet.sdk.eth.getGasPrice();
    } catch(e) {
      console.log('this.wallet.sdk.eth.getGasPrice', e);
    }
    if (_gasPrice && reqApproveVo.gasPrice) {
      reqApproveVo.gasPrice = BigNumber(_gasPrice).comparedTo(reqApproveVo.gasPrice) > 0 ? reqApproveVo.gasPrice : _gasPrice;
    } else if (_gasPrice && !reqApproveVo.gasPrice) {
      reqApproveVo.gasPrice = _gasPrice
    }

    if (reqApproveVo.decimals) {
      reqApproveVo.amount = BigNumber(reqApproveVo.amount).times(10 ** reqApproveVo.decimals).toFixed(0)
    }

    if (this.wallet.key === "GnosisSafeWallet") {
      const web3 = new Web3();
      const data = web3.eth.abi.encodeFunctionCall(
        {
          inputs: [
            {
              name: "spender",
              type: "address",
            },
            {
              name: "value",
              type: "uint256",
            },
          ],
          name: "approve",
          type: "function",
        },
        [this.approveContract, reqApproveVo.amount]
      );
      console.log("data", this.approveContract, reqApproveVo.amount, data);
      try {
        const { safeTxHash } = await this.wallet.sdk.txs.send({
          txs: [
            {
              to: this.tokenAddress,
              value: 0,
              data,
            },
          ],
        });
        console.log("safeTxHash", safeTxHash);
        setTimeout(() => {
          console.log("successCallback");
          this.successCallback(1);
        }, 3000);
      } catch (e: any) {
        setTimeout(() => {
          this.errorCallback(e);
        }, 500);
      }
    } else if (this.wallet.key === "LedgerWallet") {
      this.signEthTransactionByLedger(reqApproveVo, address);
    } else if (this.wallet.key === "TronLink") {
      this.approveContract = "TRtQA3D9BFRLFw3rajKBziAof2eAWkAL7B";
      try {
        let hash = "";
        this.amount = reqApproveVo.amount + "";
        if (
          [
            "TMwFHYXLJaRUPeW6421aqXL4ZEzPRFGkGT",
            "TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9",
            "TKfjV9RNKJJCqPvBtK8L7Knykh7DNWvnYt",
            "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR"
          ].indexOf(this.tokenAddress) >= 0
        ) {
          hash = await this.contract.methods
            .approve(this.approveContract)
            .send({ feeLimit: 100000000 });
        } else {
          console.log('send approve', this.amount);
          hash = await this.contract.methods
            .approve(this.approveContract, this.amount)
            .send({ feeLimit: 100000000 });
        }
        console.log('hash', hash);
        this.successCallback(1);
      } catch (e) {
        this.errorCallback(e);
      }
    } else {
      if (!reqApproveVo.amount) {
        reqApproveVo.amount = await this.contract.methods.totalSupply().call();
      }

      if (this.tokenAddress === "0xfa17b330bcc4e7f3e2456996d89a5a54ab044831") {
        reqApproveVo.amount = await this.contract.methods
          .balanceOf(this.account)
          .call();
        if (Number(reqApproveVo.amount) == 0) {
          this.errorCallback("Insufficient Balance.");
          return;
        }
      }

      this.amount = reqApproveVo.amount + "";

      let gasAmount = "80000";
      try {
        gasAmount = await this.contract.methods
          .approve(this.approveContract, this.amount)
          .estimateGas({
            from: this.account,
          });
      } catch (error) {
        setTimeout(() => {
          this.errorCallback(error);
        }, 500);
        return;
      }

      let json: any = {
        from: address,
      };

      if (reqApproveVo.gasPrice) {
        json.gasPrice = reqApproveVo.gasPrice;
      }
      this.contract.methods
        .approve(this.approveContract, this.amount)
        .send(json)
        .on("error", (error: any) => {
          console.log('eee error1111', error);
          this.errorCallback(error);
        })
        .on("transactionHash", (transactionHash: any) => {
          console.log('eee transactionHash')
          this.transactionHashCallback(transactionHash);
        })
        .on("receipt", (receipt: any) => {
          console.log('eee receipt')
          this.receiptCallback(receipt);
          this.getSuccess(receipt);
        });
    }
  }
  on(events: string, callback: Function) {
    if (events === "error") {
      this.errorCallback = callback;
    } else if (events === "transactionHash") {
      this.transactionHashCallback = callback;
    } else if (events === "receipt") {
      this.receiptCallback = callback;
    } else if (events === "success") {
      this.successCallback = callback;
    }
    return this;
  }
  async signEthTransactionByLedger(reqApproveVo: any, address: string) {
    try {
      const web3 = new Web3();
      const data = web3.eth.abi.encodeFunctionCall(
        {
          inputs: [
            {
              name: "spender",
              type: "address",
            },
            {
              name: "value",
              type: "uint256",
            },
          ],
          name: "approve",
          type: "function",
        },
        [reqApproveVo.approveContract, reqApproveVo.amount]
      );
      console.log("data", reqApproveVo.approveContract, reqApproveVo.amount, data);

      console.log('signEthTransactionByLedger params', reqApproveVo);
      const account = address;
      const myWallet = this.wallet.sdk;
      const gasPrice = await providerEth.getGasPrice();
      const txParams = {
        to: this.tokenAddress,
        gasPrice: gasPrice._hex,
        gasLimit: Web3.utils.numberToHex(50000 * 2),
        nonce: await providerEth.getTransactionCount(account, "latest"),
        chainId: 1,
        data: data,
        value: Web3.utils.numberToHex(0),
      };
      const serializedTx = ethers.utils.serializeTransaction(txParams).slice(2);
      console.log('signEthTransactionByLedger serializeTransaction', txParams, serializedTx);

      const signature = await myWallet.signTransaction(
        "44'/60'/0'/0/0",
        serializedTx
      );
      console.log('signEthTransactionByLedger signature1', signature);
      signature.r = "0x" + signature.r;
      signature.s = "0x" + signature.s;
      signature.v = parseInt("0x" + signature.v);
      signature.from = account;
      console.log('signEthTransactionByLedger signature2', signature);

      const signedTx = ethers.utils.serializeTransaction(txParams, signature);
      console.log('signEthTransactionByLedger signedTx', signedTx);

      const { hash } = await providerEth.sendTransaction(signedTx);
      console.log('signEthTransactionByLedger hash', hash);
      setTimeout(() => {
        console.log("successCallback");
        this.successCallback(1);
      }, 3000);
    } catch (e: any) {
      setTimeout(() => {
        this.errorCallback(e);
      }, 500);
    }
  }
  async getSuccess(receipt: any) {
    const balance = await this.contract.methods
      .allowance(this.account, this.approveContract)
      .call();
    this.key++;
    if (this.key > 20) {
      this.successCallback(balance);
      return
    };
    if (balance >= Number(this.amount)) {
      this.successCallback(balance);
    } else {
      setTimeout(() => {
        this.getSuccess(receipt);
      }, 2000);
    }
  }
}
