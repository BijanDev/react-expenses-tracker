import React, { useState, useEffect } from 'react';
import './budget.css';
import Sidebar from './Sidebar';
import Header from './Header';
import Toast from './Toast';
import { api } from '../services/api';
import { CreditCard, Calendar, Plus, Trash2 } from 'lucide-react';

const BudgetPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [toast, setToast] = useState(null);
    
    // State for Monthly Limit
    const [monthlyBudget, setMonthlyBudget] = useState('');
    const [budgetId, setBudgetId] = useState(null);

    // State for Fixed Expenses
    const [fixedExpenses, setFixedExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({
        name: '',
        category: '',
        amount: ''
    });

    // Helper to format date as YYYY-MM-DD
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Load initial data
    const fetchBudget = async () => {
        try {
          const dateStr = formatDate(currentDate);
          const budgetResponse = await api.getBudgetByDate(dateStr);
          
          if (budgetResponse.budgets && budgetResponse.budgets.length > 0) {
            setMonthlyBudget(budgetResponse.budgets[0].amount);
            setBudgetId(budgetResponse.budgets[0].id);
          } else {
            setMonthlyBudget('');
            setBudgetId(null);
          }
        } catch (error) {
          console.error('Failed to fetch budget:', error);
        }
    };

    const fetchFixedExpenses = async () => {
        try {
            const response = await api.getFixedMonthlyExpenses();
            console.log('Fixed expenses response:', response);
            
            let expenses = [];
            if (Array.isArray(response)) {
                expenses = response;
            } else if (response.fixed_expenses && Array.isArray(response.fixed_expenses)) {
                expenses = response.fixed_expenses;
            } else if (response.data && Array.isArray(response.data)) {
                expenses = response.data;
            } else {
                // Fallback: try to find any array property in the response
                const possibleArray = Object.values(response).find(val => Array.isArray(val));
                if (possibleArray) {
                    expenses = possibleArray;
                } else {
                    console.warn('Could not find array in fixed expenses response:', response);
                }
            }
            setFixedExpenses(expenses);
        } catch (error) {
            console.error('Failed to fetch fixed expenses:', error);
            setToast({ message: 'Failed to load fixed expenses', type: 'error' });
        }
    };

    useEffect(() => {
        fetchBudget();
        fetchFixedExpenses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDate]);


    // Handlers
    const handleBudgetSave = async () => {
        try {
            const amount = parseFloat(monthlyBudget);
            if (!amount || amount <= 0) {
                setToast({ message: 'Please enter a valid budget amount', type: 'error' });
                return;
            }

            if (budgetId) {
                await api.updateBudget(budgetId, { amount });
                setToast({ message: 'Budget updated successfully!', type: 'success' });
            } else {
                // Create budget for current month
                const monthIndex = currentDate.getMonth();
                const year = currentDate.getFullYear();
                const startDate = new Date(year, monthIndex, 1);
                const endDate = new Date(year, monthIndex + 1, 0);
                const months = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];

                await api.setBudget({
                    amount,
                    name: months[monthIndex],
                    start_date: formatDate(startDate),
                    end_date: formatDate(endDate)
                });
                setToast({ message: 'Budget set successfully!', type: 'success' });
                // Refresh to get the new budget ID
                fetchBudget();
            }
        } catch (error) {
            console.error('Failed to save budget:', error);
            setToast({ message: 'Failed to save budget', type: 'error' });
        }
    };

    const handleAddFixedExpense = async (e) => {
        e.preventDefault();
        try {
            if (!newExpense.name || !newExpense.category || !newExpense.amount) {
                setToast({ message: 'Please fill all fields', type: 'error' });
                return;
            }

            const payload = {
                name: newExpense.name,
                category: newExpense.category,
                amount: parseFloat(newExpense.amount)
            };

            await api.setFixedMonthlyExpense(payload);
            setToast({ message: 'Fixed monthly expense added!', type: 'success' });
            setNewExpense({ name: '', category: '', amount: '' });
            fetchFixedExpenses();
        } catch (error) {
            console.error('Failed to add fixed expense:', error);
            setToast({ message: 'Failed to add fixed expense', type: 'error' });
        }
    };

    const handleDeleteFixedExpense = async (id) => {
        try {
            await api.deleteFixedMonthlyExpense(id);
            setToast({ message: 'Fixed expense deleted', type: 'success' });
            fetchFixedExpenses();
        } catch (error) {
            console.error('Failed to delete fixed expense:', error);
            setToast({ message: 'Failed to delete fixed expense', type: 'error' });
        }
    };

    return (
        <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="main-content">
                <Header 
                    title="Budget & Fixed"
                    currentDate={currentDate}
                    onMonthChange={setCurrentDate}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />

                <div className="budget-content">
                    <div className="budget-header-text">
                        <h2>Budget & Expenses</h2>
                        <p>Manage your monthly spending limits and fixed expenses</p>
                    </div>

                    {/* Monthly Limit Card */}
                    <div className="limit-card">
                        <div className="limit-header">
                            <CreditCard className="limit-icon" size={24} />
                            <h3>Monthly Limit</h3>
                        </div>
                        <p className="limit-desc">Set your spending target for the month</p>
                        
                        <div className="limit-form">
                            <div className="limit-input-group">
                                <label htmlFor="boundary-amount">Total Budget (USD)</label>
                                <input 
                                    type="number" 
                                    id="boundary-amount"
                                    className="modern-input" 
                                    placeholder="3000"
                                    value={monthlyBudget}
                                    onChange={(e) => setMonthlyBudget(e.target.value)}
                                />
                            </div>
                            <button className="modern-button" onClick={handleBudgetSave}>
                                Save Changes
                            </button>
                        </div>
                    </div>

                    <div className="budget-grid">
                        {/* Add Monthly Fixed Expense */}
                        <div className="add-fixed-card">
                            <div className="add-fixed-header">
                                <Plus className="limit-icon" size={24} />
                                <h3>Add Monthly Fixed Expense</h3>
                            </div>
                            <p className="add-fixed-desc">Quickly record a new spending</p>

                            <form className="fixed-form" onSubmit={handleAddFixedExpense}>
                                <div className="fixed-input-group">
                                    <label>What did you buy?</label>
                                    <input 
                                        type="text" 
                                        className="modern-input" 
                                        placeholder="e.g. Morning Coffee"
                                        value={newExpense.name}
                                        onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
                                    />
                                </div>
                                <div className="fixed-input-group">
                                    <label>Category</label>
                                    <select 
                                        className="modern-input"
                                        value={newExpense.category}
                                        onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Home">Home</option>
                                        <option value="Food">Food</option>
                                        <option value="Transport">Transport</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Health">Health</option>
                                        <option value="Education">Education</option>
                                        <option value="Shopping">Shopping</option>
                                        <option value="Utilities">Utilities</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="fixed-input-group">
                                    <label>Amount ($)</label>
                                    <input 
                                        type="number" 
                                        className="modern-input" 
                                        placeholder="0.00"
                                        value={newExpense.amount}
                                        onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                                    />
                                </div>
                                <button type="submit" className="modern-button record-btn">
                                    + Record Expense
                                </button>
                            </form>
                        </div>

                        {/* Fixed Recurring List */}
                        <div className="recurring-card">
                            <div className="recurring-header">
                                <Calendar className="limit-icon" size={24} />
                                <h3>Fixed Recurring</h3>
                            </div>
                            <p className="recurring-desc">Upcoming regular bills</p>

                            <div className="recurring-list">
                                {fixedExpenses.length === 0 ? (
                                    <div className="no-data-message" style={{height: '100px'}}>No fixed expenses found</div>
                                ) : (
                                    fixedExpenses.map((expense, index) => (
                                        <div className="recurring-item" key={expense.id || index}>
                                            <div className="recurring-info">
                                                <span className="recurring-name">{expense.name}</span>
                                                <span className="recurring-sub">Category: {expense.category}</span>
                                            </div>
                                            <div className="recurring-right">
                                                <span className="recurring-amount">₹{parseFloat(expense.amount).toFixed(2)}</span>
                                                <button 
                                                    className="recurring-delete" 
                                                    onClick={() => handleDeleteFixedExpense(expense.id)}
                                                    title="Delete Expense"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default BudgetPage;
