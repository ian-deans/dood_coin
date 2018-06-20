const Block = require('./Block')

const fooBlock = Block.mineBlock(Block.genesis(), 'foo')
console.log(fooBlock.toString())