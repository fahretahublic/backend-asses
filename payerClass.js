class payerClass {   ////converted function to class
    constructor(name) 
    {
        this.name = name;

        // An array of all pending, unprocessed transactions.
        this.transactions = [];

        // The point total from all active transactions with a positive balance.
        this.positivePoints = 0;   ////changed var name to positivePoints

        // Points accrued in transactions with negative point values. The transactions aren't stored and are instead
        // represented in this class membet;
        this.negativePoints = 0; ////changed var name to negativePoints


        this.pointBalance = 0;
        this.totalBalance = function ()   
        { 
            this.pointBalance = this.positivePoints - this.negativePoints;
            return this.pointBalance;
        };

        this.sortTransactions = function () 
        {
            this.transactions.sort((transactionA, transactionB) => 
            {
                // The transactions are sorted with the newest timestamp first.
                // When the transactions array is iterated over, it'll be in reverse
                // so that transactions can be removed when the transaction balance hits 0.
                 return new Date(transactionB.timestamp) - new Date(transactionA.timestamp);  /// the dot timestamp is who the object gets the timestamp from the json string
            });
        };

        this.addTransaction = function (transaction) {   //// changed function name to PostTransaction
            const transactionPoints = parseInt(transaction.points);
            if ( this.totalBalance() + transactionPoints < 0) ////changed 
            {   // This would mean a negative transaction is being requested and there aren't enough 
                // points remaining to stop the payerClass's balance from going negative.
                return false;
            }
            else if (transactionPoints < 0) 
            {
                // Add the negative points to the sum of all negative points that aren't yet processed.
                this.negativePoints += Math.abs(transactionPoints);
            }
            else 
            {
                this.transactions.push(transaction);
                this.sortTransactions();
                this.positivePoints += transactionPoints;
            }
            this.totalBalance();
            return true;
        };

        this.handleNegativeTransactions = function () 
        {
            // Instead of tracking negative POST request transactions in their entirety, only the amount the the 
            // transaction was for is tracked. When the user is finally ready to spend points, the negative
            // values are resolved by canceling out an equal amount of positive points in transactions, starting
            // with the oldest transactions. In this way, older transactions can be added with POST requests
            // and the pending negative transactions will not affect any positive ones until a spending
            // request is made.
            for (let i = this.transactions.length - 1; i >= 0; i--)
             { 
                if (this.negativePoints === 0)
                    break;
                let pointsInTransaction = parseInt(this.transactions[i].points);
                if (this.negativePoints >= pointsInTransaction) {
                    this.negativePoints -= pointsInTransaction;
                    this.positivePoints -= pointsInTransaction;
                    this.transactions.pop();
                }
                else {
                    pointsInTransaction -= this.negativePoints;
                    this.positivePoints -= this.negativePoints;
                    this.negativePoints = 0;
                    this.transactions[i].points = pointsInTransaction;
                }
            }
            this.totalBalance();
        };
    }
}

module.exports = payerClass;
