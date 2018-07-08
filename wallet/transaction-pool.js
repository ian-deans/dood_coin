const Transaction = require('./Transaction')

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  updateOrAddTransaction(transaction) {
    let transactionWithId = this.transactions.find(t => t.id === transaction.id);

    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
    } else {
      this.transactions.push(transaction)
    }
  }

  existingTransaction(address) {
    return this.transactions.find(t => t.input.address === address);
  }

  validTransactions() {
    return this.transactions.filter(transaction => {
      const outputTotal = transaction.outputs.reduce(
        (total, output) => total + output.amount,
        0
      );

      if (transaction.input.amount !== outputTotal) {
        console.error(`Invalid transaction from ${transaction.input.address}.`);
        return;
      }

      if(!Transaction.verifyTransaction(transaction)) {
        console.error(`Invalid signature from ${transaction.input.address}.`);
        return;
      }

      return transaction;
    });
  }
}

module.exports = TransactionPool