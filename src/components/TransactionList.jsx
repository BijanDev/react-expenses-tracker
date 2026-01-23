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

const TransactionList = ({ transactions, onAddClick }) => {
  return (
    <div className="transaction-list card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>Recent Transactions</h3>
        <button 
          onClick={onAddClick}
          title="Add Daily Expense"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'var(--active-bg)',
            color: 'var(--primary-blue)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-blue)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--active-bg)';
            e.currentTarget.style.color = 'var(--primary-blue)';
          }}
        >
          +
        </button>
      </div>
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
