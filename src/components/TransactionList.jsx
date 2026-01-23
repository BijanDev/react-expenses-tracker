import React from 'react';
import { ShoppingBag, Coffee, Car, Music, Home } from 'lucide-react';

const getIcon = (category) => {
  switch (category) {
    case 'Groceries': return <ShoppingBag size={20} />;
    case 'Entertainment': return <Music size={20} />;
    case 'Transport': return <Car size={20} />;
    case 'Shopping': return <ShoppingBag size={20} />;
    case 'Rent':
    case 'Home': return <Home size={20} />;
    default: return <Coffee size={20} />;
  }
};

const TransactionList = ({ transactions }) => {
  return (
    <div className="transaction-list card">
      <h3>Recent Transactions</h3>
      <div className="transactions">
        {transactions && transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div key={transaction.id || index} className="transaction-item">
                <div className="transaction-icon">
                    {getIcon(transaction.category)}
                </div>
                <div className="transaction-details">
                    <span className="transaction-name">{transaction.name}</span>
                    <span className="transaction-date">{transaction.date}</span>
                </div>
                <div className="transaction-amount-container">
                    <span className="transaction-amount">₹{transaction.amount.toLocaleString('en-IN')}</span>
                    <span className="transaction-category">{transaction.category}</span>
                </div>
            </div>
          ))
        ) : (
          <div className="no-transactions">No recent transactions found</div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
