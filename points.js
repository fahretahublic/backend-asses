const Payer = require("./payerClass");
const payerMap = new Map();

const Points = 
{
    
    addTransaction : function (transaction) 
    {
        const payerTranscation = transaction.payer; 
        if (!payerMap.has(payerTranscation)) 
        {
            payerMap.set(payerTranscation, new Payer(payerTranscation));
        }

        let tempPayer = payerMap.get(payerTranscation); 
        const wasAdded = tempPayer.addTransaction(transaction);
        if (wasAdded)      
        {
            return message = 'Transcation completed'; 
        }


        else
            return errormessage = 'Error: transcation will cause balance to be negative'; 

    },

    getPoints: function () 
    { 
        let totalPoints = {};
        for (const [name, payer] of payerMap) 
        {
            // This will update point values before adding them to the returned JSON string.
            // The balance values should be correct at this point, but in case updatePoint balance
            // has deviated from the positive and negative point values, the function is run again.
            totalPoints[name] = payer.totalBalance();
        }
        return totalPoints;
    },
    
    spendPoints: function (transaction) 
    {
        let pointsToSpend = parseInt(transaction.points);
        if(pointsToSpend <= 0) 
        {
             return errorResult = "Error: Points should be greater than 0"; 
        }

        const pointsInAccount = this.getTotal();
        if(pointsToSpend > pointsInAccount) {
            
            return errorResult  = "Error: insufficient points"; 
        }

        let payers = this.mappedPayers();
        return this.spend(payers, pointsToSpend);
    },

    getTotal: function() 
    { 
        let points = 0;
        for(const [name, payer] of payerMap) 
        {
            points += payer.totalBalance();
        }
        return points;
    },

    mappedPayers: function() 
    {  
        // At this point payers may have negative balances associated with their point values.
        // This function will ask each payer in payerMap to resolve the negative
        // transactions so that only positive transactions remain.
        let payersInSystem = []; 

        for(const [name, payer] of payerMap) 
        {
            payer.handleNegativeTransactions();
            if(payer.totalBalance() > 0 ) 
            {
                payersInSystem.push(payer);
            }
        }

        return payersInSystem;
    },

    spend: function(payers, points) 
    {
        let sortByOldestTransactions = function(payerA, payerB) 
        { 
            const payerATransactions = payerA.transactions;
            const payerBTransactions = payerB.transactions;
            
            const oldestTransactionA = payerATransactions[payerATransactions.length - 1];
            const oldestTransactionB = payerBTransactions[payerBTransactions.length - 1];
            return new Date(oldestTransactionB.timestamp) - new Date(oldestTransactionA.timestamp);
        }

        let debits = [];
        while(points > 0) 
        {
            payers.sort(sortByOldestTransactions);
            const oldestPayer = payers[payers.length - 1];
            const oldestTransaction = oldestPayer.transactions[oldestPayer.transactions.length - 1];

            let pointsToUse = parseInt(oldestTransaction.points);  

            // This implies that the current oldest transaction can be fully consumed and forgotten.
            if(points >= pointsToUse) 
            {
                points -= pointsToUse;
                this.trackPointDeduction(debits, oldestPayer.name, pointsToUse);
                oldestPayer.positivePoints -= pointsToUse;
                oldestPayer.transactions.pop();
                if(oldestPayer.transactions.length === 0) {
                    payers.pop();
                }
            }
            // This implies that the current points left to spend aren't enough to consume the full transaction
            // so the transaction is partially consumed, and the remained is saved.
            else 
            {
                this.trackPointDeduction(debits, oldestPayer.name, points);
                pointsToUse -= points;
                oldestPayer.positivePoints -= points;
                oldestTransaction.points = pointsToUse;
                points = 0;
            }
            oldestPayer.totalBalance();
        }
        return debits;
    },

    trackPointDeduction: function(debits, amountPayer, amount) 
    {
        // This function helps build the message returned when points are spent.
        // When point values are deducted from the same payer multiple times,
        // instead of showing up as different instances of paying, this consolidates
        // those payments into one lump value for that payer.
        let payerFound = false;
        for(let i = 0; i < debits.length; i++) 
        {
            if(debits[i].payer === amountPayer) 
            {
                payerFound = true;
                debits[i].points -= amount;
                break; 
            }
        }
        if(!payerFound) 
        {
            debits.push( 
                {
                payer: amountPayer,
                points: -amount
            });
        }
    }
};

exports.Points = Points;
