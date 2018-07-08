const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');


const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);

app.use(bodyParser.json());
app.use(logger('dev'));

app.get('/blocks', (request, response) =>
  response.json(bc.chain));

app.post('/mine', (request, response) => {
  const {data} = request.body;
  if (!data) {
    throw new Error('Body must have property "data".');
  }

  const block = bc.addBlock(data);
  console.log(`New block added: ${block.toString()}`);

  p2pServer.syncChains();
  response.redirect('/blocks');
})

app.get('/transactions', (request, response) => response.json(tp.transactions));

app.post('/transact', (request, response) => {
  const {recipient, amount} = request.body;
  const transaction = wallet.createTransaction(recipient, amount, tp);
  p2pServer.broadcastTransaction(transaction);

  response.redirect('/transactions');
});

app.get('/public-key', (request, response) => {
  response.json({publicKey: wallet.publicKey})
});


app.listen(HTTP_PORT, () =>
  console.log(`Listening on port ${HTTP_PORT}`))
p2pServer.listen()