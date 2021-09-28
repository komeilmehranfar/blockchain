const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const blockchain = new Blockchain();

app.get("/blockchain", function (req, res) {
  res.send(blockchain);
});

app.post("/transaction", function (req, res) {
  res.json(req.body);
});

app.get("/mine", function (req, res) {
  res.send("mine");
});

app.listen(3000, () => console.log("listen to port 3000..."));
