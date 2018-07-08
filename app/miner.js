class Miner {
  constructor(blochain, transactionPool, wallet, p2pServer) {
    this.blockhain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransactions = this.transactionPool.validTransactions();
    // include a reward for the miner
    // create a block consisting of the valid transactions
    // synchronize the chains in the peer-to-peer server
    // clear the transaction pool
    // broadcast to every miner to clear their transactions pools as well

  }
};

module.exports = Miner;