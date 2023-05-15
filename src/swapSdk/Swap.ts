import { aggregator } from "../asset/abi/aggregator";
import { ReqSwapVo } from "../api/vo/RequestVo";
import { chainsObj, walletsObj } from '@openocean.finance/wallet';
import { Transaction } from "@solana/web3.js";
import { LCDClient, MsgExecuteContract } from "@terra-money/terra.js";
import { utils } from "ontology-ts-sdk";
import { AptosClient } from "aptos";
import { ethers } from "ethers";
import BN8 from 'bn.js';
import { baseDecode } from 'borsh';
import { client } from "@ont-dev/ontology-dapi";
import { NotoMobile } from "./NotoMobile";
import Web3 from "web3";
import { getProxyContract } from "./../config";

import axios from "axios";
// import bs58 from "bs58";
const bs58 = require("bs58");
client.registerClient({});

const providerEth = new ethers.providers.JsonRpcProvider({
  url: "https://rpc.ankr.com/eth"
});

export { ReqSwapVo };
export class Swap {
  private getDataCallback: Function = () => { };
  private errorCallback: Function = () => { };
  private transactionHashCallback: Function = () => { };
  private receiptCallback: Function = () => { };
  private successCallback: Function = () => { };
  contract: any;
  res: any;
  wallet: any;
  chain: any;
  isNew: boolean;

  constructor(res: any, wallet: any, chain: any, isNew?: boolean) {
    this.res = res;
    this.wallet = wallet;
    this.chain = chain;
  }

  send() {
    setTimeout(() => {
      switch (this.chain.compiler) {
        case "EVM":
          console.log('this.res.data', this.res.data);
          if (this.res.data === '0x') {
            const e = new Error(
              `Transaction failed`
            );
            this.errorCallback(e.message);
          } else {
            if (this.isNew) {
              this.sendEthTransactionNew();
            } else {
              this.sendEthTransaction();
            }
          }
          break;
        case "SOL":
          this.sendSolanaTransaction();
          break;
        case "TRON":
          this.sendTronTransaction();
          break;
        case "TERRA":
          this.sendTerraTransaction();
          break;
        case "ONT":
          this.sendONTTransaction();
          break;
        case "APTOS":
          this.sendAptosTransaction();
          break;
        case "NEAR":
          this.sendNearTransaction();
          break;
        case "COSMOS":
          this.sendCosmosTransaction();
          break;
      }
    }, 200);
    return this;
  }
  getGas() {
    return new Promise((r, j) => {
      setTimeout(async () => {
        switch (this.chain.compiler) {
          case "EVM":
            if (this.isNew) {
              r(await this.getGasNew());
            } else {
              r(await this.getGasOld());
            }
            break;
        }
      }, 200);
    });
  }

  async sendONTTransaction() {
    const { approve, swap, transaction, inAmount, inToken } = this.res;
    if (this.wallet.key === "OntoMobile") {
      const instance = new NotoMobile(approve ? approve : swap);
      let account = await new Promise((r, q) => {
        instance.$on("close", (result: any, action: any, account: any) => {
          if (action === "login" && result === "success") {
            r(account);
          } else {
            q(action);
          }
        });
      });
      this.transactionHashCallback(account);
    } else {
      if (approve) {
        this.approveOnt(transaction, inAmount, inToken);
      } else {
        this.sendOntTransactionSdk(transaction);
      }
    }
  }

  async sendSolanaTransaction() {
    const res = this.res;
    try {
      if (res.dex == "jupiter") {
        let { setupTransaction, swapTransaction, cleanupTransaction } =
          JSON.parse(res.transaction);
        let list = [
          setupTransaction,
          swapTransaction,
          cleanupTransaction,
        ].filter(Boolean);

        let recentBlock = await this.wallet.connection.getLatestBlockhash();
        const transactions = list.map((tx) => {
          let transaction = Transaction.from(Buffer.from(tx, "base64"));
          transaction.recentBlockhash = recentBlock.blockhash;
          return transaction;
        });

        await await this.wallet.sdk.signAllTransactions(transactions);

        let i = 0;
        for (let transaction of transactions) {
          i++;
          const txid = await this.wallet.connection.sendRawTransaction(
            transaction.serialize({ requireAllSignatures: false })
          );
          if (i < list.length) {
            await this.wallet.connection.confirmTransaction(txid);
          } else {
            this.transactionHashCallback(txid);
          }
        }
        return;
      }
      const transaction: any = Transaction.from(
        Buffer.from(res.transaction, res.dex == "jupiter" ? "base64" : "hex")
      );

      let signed: any = null;
      let signature: any = null;

      if (this.wallet.sdk.isCoin98) {
        const result = await this.wallet.sdk.request({
          method: "sol_sign",
          params: [transaction],
        });
        console.log("Got signature, submitting transaction");
        const bytes = bs58.decode(result.signature);
        transaction.signatures[0].signature = bytes;
        transaction.feePayer = this.wallet.customPublicKey;
        signed = transaction;
      } else if (this.wallet.sdk.isSlopeWallet) {
        const { msg, data } = await this.wallet.sdk.signTransaction(
          bs58.encode(transaction.serializeMessage())
        );
        if (msg !== "ok") return;
        const bytes = bs58.decode(data.signature);
        transaction.signatures[0].signature = bytes;
        transaction.feePayer = this.wallet.customPublicKey;
        signed = transaction;
      } else {
        signed = await this.wallet.sdk.signTransaction(transaction);
      }
      signature = await this.wallet.connection.sendRawTransaction(
        signed.serialize({ 
          verifySignatures: false,
          requireAllSignatures: false
        }),
        {
          skipPreflight: true,
          preflightCommitment: "confirmed",
        }
      );
      // this.receiptCallback(signature)
      this.transactionHashCallback(signature);
    } catch (e: any) {
      this.errorCallback(e.message);
    }
  }

  async sendAptosTransaction() {
    try {
      const { data } = this.res;
      console.log("sendAptosTransaction", data, this.wallet.key);
      if (this.wallet.key === "MartianWallet") {
        const transaction = await this.wallet.sdk.generateTransaction(
          this.wallet.address,
          data
        );
        const hash = await this.wallet.sdk.signAndSubmitTransaction(
          transaction
        );
        this.transactionHashCallback(hash);
      } else if (this.wallet.key === "PontemWallet") {
        const { result = {} } = await this.wallet.sdk.signAndSubmit(data);
        const { hash } = result;
        console.log("sendAptosTransaction PontemWallet", hash);
        this.transactionHashCallback(hash);
      } else {
        const pendingTransaction =
          await this.wallet.sdk.signAndSubmitTransaction(data);
        const client = new AptosClient(
          "https://fullnode.mainnet.aptoslabs.com/v1"
        );
        const txn = await client.waitForTransactionWithResult(
          pendingTransaction.hash
        );
        console.log("sendAptosTransaction", txn);
        const { hash } = txn;
        this.transactionHashCallback(hash);
      }
    } catch (error) {
      // see "Errors"
      this.errorCallback(error);
    }
  }

  async _createTransaction(opt: any, wallet: any) {
    let accountId = wallet.sdk.getAccountId()
    const localKey = await wallet.sdk._connectedAccount.connection.signer.getPublicKey(
      accountId,
      wallet.sdk._connectedAccount.connection.networkId
    );
    let accessKey = await wallet.sdk._connectedAccount.accessKeyForTransaction(
      opt.receiverId,
      opt.actions,
      localKey
    );
    if (!accessKey) {
      throw new Error(
        `Cannot find matching key for transaction sent to ${opt.receiverId}`
      );
    }

    const block = await wallet.sdk._connectedAccount.connection.provider.block({ finality: 'final' });

    const blockHash = baseDecode(block.header.hash);

    const publicKey = wallet.PublicKey.from(accessKey.public_key);
    const nonce = accessKey.access_key.nonce + opt.nonceOffset;

    return wallet.createTransaction(
      accountId,
      publicKey,
      opt.receiverId,
      nonce,
      opt.actions,
      blockHash
    );
  }

  async sendNearTransaction() {
    try {
      const { transaction } = this.res;
      const wallet = this.wallet
      console.log("sendNearTransaction", transaction, wallet.key);
      let transactions = JSON.parse(Buffer.from(transaction, 'base64').toString())

      if (wallet.key === "NearWallet" || wallet.key === "MyNearWallet") {
        try {
          let currentTransactions = await Promise.all(
            transactions.map((t: any, i: number) => {
              return this._createTransaction(
                {
                  receiverId: t.receiverId,
                  nonceOffset: i + 1,
                  actions: t.functionCalls.map((fc: any) => {
                    let data = wallet.functionCall(
                      fc.methodName,
                      fc.args,
                      fc.gas ? new BN8(fc.gas) : new BN8('100000000000000'),
                      // fc.deposit ? new BN8(fc.deposit) : new BN8('0')
                      fc.deposit ? new BN8(wallet.utils.format.parseNearAmount(fc.deposit) || '0') : new BN8('0')
                    )
                    return data
                  }
                  )
                }, wallet);
            })
          );
          await wallet.sdk.requestSignTransactions(currentTransactions)
          // this.transactionHashCallback(hash);
        } catch (e: any) {
          let err = e
          console.warn(e);
          console.log("Error: " + e.message);
          this.errorCallback(e.message);
        }
      } else if (wallet.key === "MeteorWallet" || wallet.key === "SenderWallet") {
        const txResult = await wallet.sdk.signAndSendTransactions({ transactions: transactions.map((t: any, i: number) => {
            return {
              receiverId: t.receiverId,
              nonceOffset: i + 1,
              actions: t.functionCalls.map((fc: any) => {
                let actions = wallet.functionCall(
                  fc.methodName,
                  fc.args,
                  fc.gas ? fc.gas : '100000000000000',
                  // fc.deposit ? new BN8(fc.deposit) : new BN8('0')
                  fc.deposit ? wallet.utils.format.parseNearAmount(fc.deposit) : '0'
                )
                console.log("FunctionCall", actions);
                return {
                  type: "FunctionCall",
                  enum: actions.enum,
                  params: actions.functionCall
                }
              })
            };
          })
        });
        console.log('signAndSendTransactions', txResult);
        let transaction: any = { hash: "" };
        if (txResult && txResult.length === 1) {
          transaction = txResult[txResult.length - 1].transaction || {};
        } else if (txResult && txResult.length > 1){
          transaction = txResult.filter((item: any) => {
            const { actions = [] } = item && item.transaction || {};
            const _actions = actions.filter((fc: any) => {
              const { FunctionCall = {} } = fc;
              const { method_name } = FunctionCall;
              return method_name === 'ft_transfer_call';
            });
            return _actions && _actions.length > 0;
          });
          if (transaction && transaction.length) {
            transaction = transaction[0].transaction;
          }
        }
        console.log('signAndSendTransactions', transaction);
        const { hash } = transaction;
        this.transactionHashCallback(hash);
      }
    } catch (error) {
      // see "Errors"
      this.errorCallback(error);
    }
  }

  async sendCosmosTransaction() {
    try {
      const { transaction, cosmosReceiver } = this.res;
      const wallet = this.wallet
      console.log("sendNearTransaction", transaction, wallet.key);

      if (wallet.key === "KeplrWallet") {
        let transactions = JSON.parse(Buffer.from(transaction, 'base64').toString())

        if (cosmosReceiver && transactions.msgTransfer) {
          transactions.msgTransfer.value.receiver = cosmosReceiver
          transactions.msg.push(transactions.msgTransfer)
        }
        console.log('transactions', transactions)

        try {
          const result = await wallet.sdk.signAndBroadcast(transactions.account, transactions.msg, transactions.fee, transactions.memo);
          // assertIsDeliverTxSuccess(result);
          // console.log('result', result)
          if (result.code !== undefined && result.code !== 0) {
            this.errorCallback(result.log || result.rawLog);
          } else {
            this.transactionHashCallback(result.transactionHash);
          }
        } catch (e: any) {
          let err = e
          console.warn(e);
          console.log("Error: " + e.message);
          this.errorCallback(e.message);
        }
      }
    } catch (error) {
      // see "Errors"
      this.errorCallback(error);
    }
  }

  async getGasOld() {
    const { inToken, inAmount, data, to } = this.res;
    const gas = await this.wallet.sdk.eth.estimateGas({
      from: this.wallet.address,
      to,
      data,
      value: chainsObj.isNativeToken(this.chain.key, inToken.address)
        ? inAmount
        : 0,
    });
    return Math.ceil(gas * 1.15);
  }
  async getGasNew() {
    try {
      console.log('getGasNew');
      const { inToken, inAmount, outAmount, outToken, data, to } = this.res;
      const myWallet = this.wallet.sdk;
      const contract = new myWallet.eth.Contract(
        aggregator,
        getProxyContract(this.chain.key)
      );
      const invitee = this.wallet.address;
      const path = [inToken.address, outToken.address];
      const amounts = [inAmount, outAmount];
      const swapAddr = to;
      const swapExtraData = data;
      const gas = await contract.methods
        .swap(invitee, path, amounts, swapAddr, swapExtraData)
        .estimateGas({
          from: this.wallet.address,
          value: chainsObj.isNativeToken(this.chain.key, inToken.address)
            ? inAmount
            : 0,
        });
      return Math.ceil(gas * 1.5);
    } catch(e) {
      console.log('getGasNew error', e);
    }
  }
  async sendEthTransactionNew() {
    const {
      inToken,
      inAmount,
      outAmount,
      outToken,
      data,
      to,
      ethGasPrice,
      gasPrice,
    } = this.res;
    console.log('sendEthTransactionNew')
    const myWallet = this.wallet.sdk;
    const contract = new myWallet.eth.Contract(
      aggregator,
      getProxyContract(this.chain.key)
    );
    const invitee = this.wallet.address;
    const path = [inToken.address, outToken.address];
    const amounts = [inAmount, outAmount];
    const swapAddr = to;
    const swapExtraData = data;

    let swapParams: any = {
      from: this.wallet.address,
      gas: await this.getGasNew(),
      to,
      data,
    };

    if (ethGasPrice) {
      const { maxFeePerGas, maxPriorityFeePerGas } = ethGasPrice;
      if (maxFeePerGas && maxPriorityFeePerGas) {
        swapParams.maxFeePerGas = +maxFeePerGas;
        swapParams.maxPriorityFeePerGas = +maxPriorityFeePerGas;
      }
    } else {
      swapParams.gasPrice = +gasPrice;
    }

    if (chainsObj.isNativeToken(this.chain.key, inToken.address)) {
      swapParams.value = inAmount;
    }

    contract.methods
      .swap(invitee, path, amounts, swapAddr, swapExtraData)
      .send(swapParams)
      .on("error", (error: any) => {
        this.errorCallback(error);
      })
      .on("transactionHash", (transactionHash: any) => {
        this.transactionHashCallback(transactionHash);
      })
      .on("receipt", (receipt: any) => {
        this.receiptCallback(receipt);
        // this.getSuccess()
      });
  }
  async sendEthTransaction() {
    const { inToken, inAmount, data, to, ethGasPrice, gasPrice, estimatedGas } = this.res;
    console.log('sendEthTransaction')
    let swapParams: any = {
      from: this.wallet.address,
      to,
      data,
    };
    if (ethGasPrice) {
      const { maxFeePerGas, maxPriorityFeePerGas } = ethGasPrice;
      if (maxFeePerGas && maxPriorityFeePerGas) {
        swapParams.maxFeePerGas = +maxFeePerGas;
        swapParams.maxPriorityFeePerGas = +maxPriorityFeePerGas;
      }
    } else if (gasPrice) {
      swapParams.gasPrice = +gasPrice;
    }
    if (chainsObj.isNativeToken(this.chain.key, inToken.address)) {
      swapParams.value = inAmount;
    }
    if (this.wallet.key === "GnosisSafeWallet") {
      try {
        const { safeTxHash } = await this.wallet.sdk.txs.send({
          txs: [
            {
              to: swapParams.to,
              value: swapParams.value || "0",
              data: swapParams.data,
            },
          ],
        });
        this.getGnosisSafeTransaction(safeTxHash);
      } catch (e: any) {
        this.errorCallback((e && e.message) || e);
      }
      return;
    } else if (this.wallet.key === "LedgerWallet") {
      swapParams.estimatedGas = estimatedGas;
      this.signEthTransactionByLedger(swapParams);
      return;
    }
    try {
      let gas = await this.getGasOld();
      swapParams.gas = gas;
    } catch (e: any) {
      if (e && e.message.indexOf("JSON-RPC error.") != -1) {
        e = JSON.parse(e.message.split("JSON-RPC error.")[1]);
      }
      this.errorCallback((e && e.message) || e);
    }
    this.wallet.sdk.eth
      .sendTransaction(swapParams)
      .on("error", (error: any) => {
        this.errorCallback(error);
      })
      .on("transactionHash", (transactionHash: any) => {
        this.transactionHashCallback(transactionHash);
      })
      .on("receipt", (receipt: any) => {
        this.receiptCallback(receipt);
        // this.getSuccess()
      });
  }
  async signEthTransactionByLedger(swapParams: any) {
    try {
      console.log('signEthTransactionByLedger params', swapParams);
      const account = this.wallet.address;
      const myWallet = this.wallet.sdk;
      const gasPrice = await providerEth.getGasPrice();
      const txParams = {
        to: swapParams.to,
        gasPrice: gasPrice._hex,
        gasLimit: Web3.utils.numberToHex(swapParams.estimatedGas * 2),
        nonce: await providerEth.getTransactionCount(account, "latest"),
        chainId: 1,
        data: swapParams.data,
        value: Web3.utils.numberToHex(swapParams.value || 0),
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
      this.transactionHashCallback(hash);
    } catch(e: any) {
      this.errorCallback(e);
    }
  }
  async getGnosisSafeTransaction(safeTxHash: string) {
    const { txHash } = await this.wallet.sdk.txs.getBySafeTxHash(safeTxHash);
    console.log("safeTxHash", safeTxHash, txHash);
    if (txHash) {
      this.transactionHashCallback(txHash);
    } else {
      setTimeout(async () => {
        await this.getGnosisSafeTransaction(safeTxHash);
      }, 2000);
    }
  }
  async sendTronTransaction() {
    const {
      inToken,
      outToken,
      inAmount,
      outAmount,
      minOutAmount,
      addresses,
      calldata,
      offsets,
      gasLimitsAndValues,
    } = this.res;
    // const { abi, contract } = res2;
    // let { data }: any = await axios.get(`https://ethapi.openocean.finance/v1/tron/exchange`);
    // const { abi, contract } = data;
    const abi = [
      {
        "outputs": [
          {
            "name": "outAmount",
            "type": "uint256"
          }
        ],
        "inputs": [
          {
            "name": "inToken",
            "type": "address"
          },
          {
            "name": "outToken",
            "type": "address"
          },
          {
            "name": "inAmount",
            "type": "uint256"
          },
          {
            "name": "minOutAmount",
            "type": "uint256"
          },
          {
            "name": "referrer",
            "type": "address"
          },
          {
            "name": "addressesToCall",
            "type": "address[]"
          },
          {
            "name": "dataToCall",
            "type": "bytes"
          },
          {
            "name": "offsets",
            "type": "uint256[]"
          },
          {
            "name": "gasLimitsAndValues",
            "type": "uint256[]"
          }
        ],
        "name": "swap",
        "stateMutability": "Payable",
        "type": "Function"
      }
    ];
    const contract = "TAPJbS45zHWv6ogXFfnw3seiCSfb3RPa6V";
    console.log("sendTronTransaction", this.res);
    const _contract = await this.wallet.sdk.contract(abi, contract);
    // const _contract = await this.wallet.sdk.contract(aggregator, getProxyContract(this.chain.key));

    let swapParams: any = {
      feeLimit: 100000000,
    };
    if (inToken.toLowerCase() === "t9yd14nj9j7xab4dbgeix9h8unkkhxuwwb") {
      swapParams.callValue = inAmount;
    }
    try {
      await _contract.methods
        .swap(
          inToken,
          outToken,
          inAmount,
          minOutAmount,
          '0x0000000000000000000000000000000000000000',
          addresses,
          calldata,
          offsets,
          gasLimitsAndValues
        ).send(swapParams, (result: any, txHash: any) => {
          console.log("state.multicall.methods.swap", result);
          if (result) {
            this.errorCallback(result.message || result);
          } else {
            this.transactionHashCallback(txHash);
          }
        });
    } catch (e: any) {
      this.errorCallback(e || e.message);
    }
  }

  async sendTerraTransaction() {
    try {
      let { data }: any = await axios.get(
        `https://ethapi.openocean.finance/v1/terra/exchange`
      );
      const address = this.wallet.address; //state.default_account;
      const gasPrices = await axios.get(
        "https://ethapi.openocean.finance/v1/terra/gas-price"
      );
      const msg = await this.getTerraMsgExecuteContract(
        this.res,
        data,
        address,
        gasPrices.data
      );
      const { fee, accountInfo }: any = await this.getTerraFee(
        address,
        msg,
        gasPrices.data
      );
      await this.wallet.sdk.post({
        msgs: [msg],
        gasAdjustment: 1.5,
        waitForConfirmation: true,
        fee,
        account_number: accountInfo.account_number,
        sequence: accountInfo.sequence,
        purgeQueue: true,
      });
      this.wallet.sdk.on("onPost", (data: any) => {
        const { result, success } = data || {};
        if (success) {
          const { txhash } = result || {};
          this.transactionHashCallback(txhash);
        } else {
          this.errorCallback("Transaction failed");
        }
      });
    } catch (e: any) {
      this.errorCallback(e.message || e);
    }
  }

  private async approveOnt(transaction: any, _amount: any, inToken: string) {
    try {
      const { scriptHash, operation, gasLimit, args } = transaction;
      const params: any = {
        contract: inToken,
        operation: "approve",
        args: [
          {
            type: "Address",
            value: this.wallet.address,
          },
          {
            type: "ByteArray",
            value: utils.reverseHex(scriptHash),
          },
          {
            type: "ByteArray",
            value: utils.bigIntToBytes(_amount + ""),
          },
        ],
        gasPrice: 2500,
        gasLimit: 40000,
      };
      const result = await client.api.smartContract.invoke(params);
      console.log("approveOnt params, result", params, result);
      this.sendOntTransactionSdk(transaction);
    } catch (e: any) {
      // tslint:disable-next-line:no-console
      console.log("onScCall error:", e);
      this.errorCallback((e && e.message) || e);
    }
  }
  private async sendOntTransactionSdk(transaction: any) {
    try {
      const { scriptHash, operation, gasLimit, args } = transaction;
      const params = {
        scriptHash,
        operation,
        args: args.map((item: any) => {
          const { type } = item;
          if (["Long", "Integer"].indexOf(type) >= 0) {
            item.value = Number(item.value);
          }
          return item;
        }),
        gasPrice: 2500,
        gasLimit: 60000,
        requireIdentity: false,
      };
      const result = await client.api.smartContract.invoke(params);
      if (result && result.transaction) {
        this.transactionHashCallback(result.transaction);
      } else {
        this.errorCallback("Progress transactions submitted.");
      }
    } catch (e: any) {
      this.errorCallback((e && e.message) || e);
    }
  }

  private async getTerraFee(address: string, msg: any, gasPrices: any) {
    try {
      const terra = new LCDClient({
        chainID: "columbus-5",
        URL: "https://lcd.terra.dev",
        gasPrices,
        gasAdjustment: 1.75,
      });
      const accountInfo: any = await terra.auth.accountInfo(address);
      const fee = await terra.tx.estimateFee(
        [
          {
            sequenceNumber: accountInfo.sequence,
            publicKey: accountInfo.public_key,
          },
        ],
        {
          msgs: [msg],
          feeDenoms: ["uusd"],
        }
      );
      return {
        fee,
        accountInfo,
      };
    } catch (e) {
      return null;
    }
  }
  private getTerraMsgExecuteContract(
    res: any,
    res2: any,
    sender: any,
    gasPrices: any
  ) {
    try {
      const { inToken, inAmount, data } = res;
      let dataObj: any = data.msgs.map((item: any) => {
        return JSON.parse(item);
      });
      let execute_swap_operations =
        dataObj[0].execute_msg.execute_swap_operations;

      const { contract } = res2;
      const { address } = inToken;
      let msg = null;

      if (gasPrices[address]) {
        const coins: any = {};
        coins[address] = +inAmount;
        msg = new MsgExecuteContract(
          sender,
          contract,
          {
            execute_swap_operations,
          },
          coins
        );
      } else {
        msg = new MsgExecuteContract(
          sender,
          address,
          {
            send: {
              contract,
              amount: inAmount,
              msg: btoa(JSON.stringify({ execute_swap_operations })),
            },
          },
          []
        );
      }
      return msg;
    } catch (e) {
      return null;
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
    } else if (events === "getDataSuccess") {
      this.getDataCallback = callback;
    }

    return this;
  }
}
