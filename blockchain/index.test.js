const Blockchain = require('./index')
const Block = require('./Block')

describe('Blockchain', () => {
  let bc;

  beforeEach(() => {
    bc = new Blockchain()
    bc2 = new Blockchain()
  })

  it('starts with a genesis block', () => {
    expect(bc.chain[0]).toEqual(Block.genesis())
  })

  it('adds a new block to the chain', () => {
    const data = 'foo'
    bc.addBlock(data)
    
    expect(bc.chain[bc.chain.length-1].data).toEqual(data)
  })

  it('validates a valid chain', () => {
    bc2.addBlock('foo')

    expect(bc.isValidChain(bc2.chain)).toBe(true)
  })

  it('invalidates a chain with a corrupt genesis block', () => {
    bc2.chain[0].data = 'Bad data'

    expect(bc.isValidChain(bc2.chain)).toBe(false)
  })

  it('invalidates a corrupt chain', () => {
    bc2.addBlock('foo')
    bc2.chain[1].data = 'Not foo'

    expect(bc.isValidChain(bc2.chain)).toBe(false)
  })

  it('replaces the chain with a valid chain', () => {
    bc2.addBlock('goo')
    bc.replaceChain(bc2.chain)

    expect(bc.chain).toEqual(bc2.chain)
  })

  it('does not replace the chain one of less than or equal to length', () => {
    bc.addBlock('poo')
    bc.replaceChain(bc2.chain)
    const error = new Error('Received chain is not longer than the current chain.')

    expect(bc.chain).not.toEqual(bc2.chain)    
  })

})