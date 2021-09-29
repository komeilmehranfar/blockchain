const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { v1: uuid } = require("uuid");
const Blockchain = require("./blockchain");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const nodeAddress = uuid().split("-").join("");
const blockchain = new Blockchain();
app.get("/blockchain", function (req, res) {
  res.send(blockchain);
});

app.post("/transaction", function (req, res) {
  const blockIndex = blockchain.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  res.json({ node: `Transaction will be added in block ${blockIndex}.` });
});

app.get("/mine", function (req, res) {
  const lastBlock = blockchain.getLastBlock();
  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: blockchain.pendingTransactions,
    index: lastBlock["index"],
  };
  const nonce = blockchain.proofOfWork(previousBlockHash, currentBlockData);
  const hash = blockchain.hashBlock(previousBlockHash, currentBlockData, nonce);
  blockchain.createNewTransaction(12.5, "00", nodeAddress);
  const newBlock = blockchain.createNewBlock(nonce, previousBlockHash, hash);
  res.json({ note: "New Block is Successfully mined", block: newBlock });
});

app.listen(3000, () => console.log("listen to port 3000..."));
