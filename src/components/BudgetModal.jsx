import React, { useState, useEffect } from 'react';
import './dashboard.css';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const BudgetModal = ({ isOpen, onClose, onSubmit, currentDate, existingBudget }) => {
  const [formData, setFormData] = useState({
    month: '',
    amount: '',
    startDate: '',
    endDate: ''
  });

  const isUpdateMode = !!existingBudget;

  useEffect(() => {
    if (isOpen) {
      if (existingBudget) {
        // Update mode - populate with existing budget data
        setFormData({
          month: existingBudget.name,
          amount: existingBudget.amount.toString(),
          startDate: existingBudget.start_date,
          endDate: existingBudget.end_date
        });
      } else if (currentDate) {
        // Create mode - auto-populate with current month data
        const monthIndex = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const startDate = new Date(year, monthIndex, 1);
        const endDate = new Date(year, monthIndex + 1, 0);

        setFormData({
          month: MONTHS[monthIndex],
          amount: '',
          startDate: formatDateForInput(startDate),
          endDate: formatDateForInput(endDate)
        });
      }
    }
  }, [isOpen, currentDate, existingBudget]);

  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-update dates when month changes
    if (name === 'month') {
      const monthIndex = MONTHS.indexOf(value);
      const year = currentDate.getFullYear();
      const startDate = new Date(year, monthIndex, 1);
      const endDate = new Date(year, monthIndex + 1, 0);
      
      setFormData(prev => ({
        ...prev,
        startDate: formatDateForInput(startDate),
        endDate: formatDateForInput(endDate)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    if (isUpdateMode) {
      // Update mode - only send amount
      onSubmit({
        amount: parseFloat(formData.amount)
      }, existingBudget.id);
    } else {
      // Create mode - send all fields
      onSubmit({
        name: formData.month,
        amount: parseFloat(formData.amount),
        start_date: formData.startDate,
        end_date: formData.endDate
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isUpdateMode ? 'Update Budget' : 'Set Budget'}</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="month">Month</label>
            <select
              id="month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="modal-input"
              disabled={isUpdateMode}
            >
              {MONTHS.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Budget Amount (₹) *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter budget amount"
              className="modal-input"
              required
              min="1"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="modal-input"
              disabled={isUpdateMode}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="modal-input"
              disabled={isUpdateMode}
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="modal-btn modal-btn-cancel">
              Cancel
            </button>
            <button type="submit" className="modal-btn modal-btn-submit">
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
