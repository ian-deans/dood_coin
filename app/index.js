const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const Blockchain = require('../blockchain')
const P2pServer = require('./p2p-server')

const HTTP_PORT = process.env.HTTP_PORT || 3001

const app = express()
const bc = new Blockchain()
const p2pServer = new P2pServer(bc)

app.use(bodyParser.json())
app.use(logger('dev'))

app.get('/blocks', (request, response) => 
  response.json(bc.chain))

app.post('/mine', (request, response) => {
  const {data} = request.body
  if (!data) {
    throw new Error('Body must have property "data".')
  }

  const block = bc.addBlock(data)
  console.log(`New block added: ${block.toString()}`)

  p2pServer.syncChains()
  
  response.redirect('/blocks')
})



app.listen(HTTP_PORT, () => 
  console.log(`Listening on port ${HTTP_PORT}`))
p2pServer.listen()