function Blockchain() {
  this.chain = [];
  this.newTransactions = [];
}

Blockchain.prototype.createNewBlock = function (
  nonce,
  previousBlockHash,
  hash
) {
  const block = {
    nonce,
    previousBlockHash,
    hash,
    index: this.chain.length + 1,
    transactions: this.newTransactions,
    timestamp: Date.now(),
  };
  this.newTransactions = [];
  this.chain.push(block);
  return block;
};
