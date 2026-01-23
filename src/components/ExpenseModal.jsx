import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './dashboard.css';

const CATEGORIES = [
  'Groceries', 'Transport', 'Entertainment', 'Shopping', 
  'Utilities', 'Health', 'Insurance', 'House Rent', 'Food', 'Others'
];

const ExpenseModal = ({ isOpen, onClose, onSuccess, currentDate }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    amount: '',
    expense_date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        expense_date: new Date().toISOString().split('T')[0]
      }));
      setError(null);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Get budget_id for the selected date
      const budgetResponse = await api.getBudgetByDate(formData.expense_date);
      
      if (!budgetResponse.budgets || budgetResponse.budgets.length === 0) {
        throw new Error('No budget found for the selected date. Please set a budget first.');
      }

      const budgetId = budgetResponse.budgets[0].id;

      // 2. Add the expense
      await api.addDailyExpense({
        name: formData.name,
        category: formData.category,
        amount: parseFloat(formData.amount),
        budget_id: budgetId,
        expense_date: formData.expense_date
      });

      onSuccess('Expense added successfully!');
      onClose();
      // Reset form
      setFormData({
        name: '',
        category: CATEGORIES[0],
        amount: '',
        expense_date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error('Failed to add expense:', err);
      setError(err.message || 'Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Daily Expense</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message" style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Expense Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Grocery Shopping"
              className="modal-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="modal-input"
              required
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (₹) *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="modal-input"
              required
              min="0.01"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="expense_date">Date *</label>
            <input
              type="date"
              id="expense_date"
              name="expense_date"
              value={formData.expense_date}
              onChange={handleChange}
              className="modal-input"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="modal-btn modal-btn-cancel" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="modal-btn modal-btn-submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
