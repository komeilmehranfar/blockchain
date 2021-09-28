const sha256 = require("sha256");

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];
}

Blockchain.prototype.createNewBlock = function (
  nonce,
  previousBlockHash,
  hash
) {
  const newBlock = {
    nonce,
    previousBlockHash,
    hash,
    index: this.chain.length + 1,
    transactions: this.pendingTransactions,
    timestamp: Date.now(),
  };
  this.pendingTransactions = [];
  this.chain.push(newBlock);
  return newBlock;
};

Blockchain.prototype.getLastBlock = function () {
  return this.chain[this.chain.length - 1];
};

Blockchain.prototype.createNewTransaction = function (
  amount,
  sender,
  recipient
) {
  const newTransaction = {
    amount,
    sender,
    recipient,
  };
  this.pendingTransactions.push(newTransaction);
  return newTransaction;
};

Blockchain.prototype.hashBlock = function (
  previousBlockHash,
  currentBlockData,
  nonce
) {
  const dataAsString =
    nonce.toString() + JSON.stringify(currentBlockData) + previousBlockHash;
  const hash = sha256(dataAsString);
  return hash;
};
