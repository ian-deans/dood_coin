const Block = require('./Block')

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()]
  }

  addBlock(data) {
    const block = Block.mineBlock(
      this.chain[this.chain.length - 1],
      data
    )
    this.chain.push(block)

    return block
  }

  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false
    }

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]
      const lastBlock = chain[i - 1]

      if (
        block.lastHash !== lastBlock.hash ||
        block.hash !== Block.blockHash(block)
      ) {
        return false
      }
    }
    return true
  }

  replaceChain(newChain) {
    if (this.chain.length >= newChain.length) {
      // throw 'Received chain is not longer than the current chain.'
      console.error('Received chain is not longer than the current chain.')
      return
    }
    if (!this.isValidChain(newChain)) {
      console.error('New chain is not a valid chain.')
    } else {
      this.chain = newChain
      console.log('Replacing blockchain with new chain.')
    }
  }
}

module.exports = Blockchain
