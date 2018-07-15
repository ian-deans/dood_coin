// require('dotenv').config()
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => response.sendFile('index.html'));
app.get('/dashboard-data', (request, response) => {
  // balance, public key, peers public keys
  let dashData= {
    publicKey: wallet.publicKey,
    balance: wallet.calculateBalance(bc),
    webSocket: 'ws://localhost:' + (process.env.P2P_PORT || '5001'),
  }
  response.json(dashData)
})

app.get('/balance', (request, response) =>
  response.json({balance: wallet.calculateBalance(bc)}))

app.get('/blocks', (request, response) =>
  response.json(bc.chain));

app.get('/public-key', (request, response) => {
  response.json({publicKey: wallet.publicKey})
});

app.get('/peer-urls', (request, response) => {
  const urls = p2pServer.getPeerURLs()
  response.json({data: urls})
})

app.get('/transactions', (request, response) => response.json(tp.transactions));

app.get('/mine-transactions', (request, response) => {
  const block = miner.mine();
  console.log(`New block added: ${block.toString()}`);
  response.redirect('/blocks');
})


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

app.post('/transact', (request, response) => {
  const {recipient, amount} = request.body;
  const transaction = wallet.createTransaction(recipient, amount, bc, tp);
  p2pServer.broadcastTransaction(transaction);

  response.redirect('/transactions');
});


app.listen(HTTP_PORT, () =>
  console.log(`Listening on port ${HTTP_PORT}`))

p2pServer.listen()