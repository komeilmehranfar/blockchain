const express = require("express");

const bodyParser = require("body-parser");
const { v1: uuid } = require("uuid");
const Blockchain = require("./blockchain");
const request = require("request");
const ports = [3000, 3001, 3002, 3003, 3004];

ports.forEach((port) => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  const nodeAddress = uuid().split("-").join("");
  const blockchain = new Blockchain({
    currentNodeUrl: `http://localhost:${port}`,
  });
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
    const hash = blockchain.hashBlock(
      previousBlockHash,
      currentBlockData,
      nonce
    );
    blockchain.createNewTransaction(12.5, "00", nodeAddress);
    const newBlock = blockchain.createNewBlock(nonce, previousBlockHash, hash);
    res.json({ note: "New Block is Successfully mined", block: newBlock });
  });

  app.post("/register-and-broadcast-node", async function (req, res) {
    const { newNodeUrl } = req.body;
    if (blockchain.networkNodes.indexOf(newNodeUrl) === -1) {
      blockchain.networkNodes.push(newNodeUrl);
    }
    const promises = blockchain.networkNodes.map((nodeUrl) => {
      return request(`${nodeUrl}/register-node`, {
        method: "POST",
        body: { newNodeUrl: nodeUrl },
        json: true,
      });
    });
    Promise.all(promises)
      .then(() => {
        return request(`${newNodeUrl}/register-nodes-bulk`, {
          method: "POST",
          body: {
            allNodes: [...blockchain.networkNodes, blockchain.currentNodeUrl],
          },
          json: true,
        });
      })
      .then(() => res.json({ success: true }));
  });
  app.post("/register-node", function (req, res) {
    const { newNodeUrl } = req.body;
    if (
      blockchain.networkNodes.indexOf(newNodeUrl) === -1 &&
      blockchain.currentNodeUrl !== newNodeUrl
    ) {
      blockchain.networkNodes.push(newNodeUrl);
    }
    res.json({ success: true });
  });
  app.post("/register-nodes-bulk", function (req, res) {
    const { allNodes } = req.body;
    allNodes.forEach((url) => {
      if (
        blockchain.networkNodes.indexOf(url) === -1 &&
        blockchain.currentNodeUrl !== url
      ) {
        blockchain.networkNodes.push(url);
      }
      res.json({ success: true });
    });
  });
  app.listen(port, () => console.log(`listen to port ${port}...`));
});
