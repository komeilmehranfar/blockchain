function Blockchain() {
  this.chain = [];
  this.newTransactions = [];
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
    transactions: this.newTransactions,
    timestamp: Date.now(),
  };
  this.newTransactions = [];
  this.chain.push(newBlock);
  return newBlock;
};

Blockchain.prototype.getLastBlock = function () {
  return this.chain[this.chain.length - 1];
};
