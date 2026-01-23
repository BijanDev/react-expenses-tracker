import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import ExpenseModal from './ExpenseModal';
import Toast from './Toast';
import { api } from '../services/api';
import './expenses.css';

const Expenses = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const fetchTransactions = async () => {
        try {
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            const response = await api.getHistory({ month, year });
            if (response.history) {
                setTransactions(response.history);
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [currentDate]);

    const categories = useMemo(() => {
        const cats = ['All Categories', ...new Set(transactions.map(t => t.category))];
        return cats;
    }, [transactions]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All Categories' || t.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [transactions, searchTerm, selectedCategory]);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} activeTab="expenses" />

            <div className="main-content">
                <Header 
                    title="Expenses" 
                    currentDate={currentDate}
                    onMonthChange={setCurrentDate}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />

                <div className="expenses-view">
                    <div className="view-header">
                        <div className="header-info">
                            <h1>Transaction History</h1>
                            <p>View and manage all your past expenses</p>
                        </div>
                        <div className="header-actions">
                            <button 
                                className="add-expense-btn"
                                onClick={() => setIsExpenseModalOpen(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 16px',
                                    backgroundColor: 'var(--primary-blue)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <span style={{ fontSize: '18px' }}>+</span> Add New
                            </button>
                            <div className="search-wrapper">
                                <Search size={18} className="search-icon" />
                                <input 
                                    type="text" 
                                    placeholder="Search transactions..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="filter-wrapper">
                                <button 
                                    className="filter-btn"
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                >
                                    <span className="filter-icon">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 4.66667H14M4 8H12M6.66667 11.3333H9.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                    {selectedCategory}
                                    <ChevronDown size={14} />
                                </button>
                                {isFilterOpen && (
                                    <div className="filter-dropdown">
                                        {categories.map(cat => (
                                            <button 
                                                key={cat}
                                                className={selectedCategory === cat ? 'active' : ''}
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setIsFilterOpen(false);
                                                }}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="transactions-table-container">
                        <table className="transactions-table">
                            <thead>
                                <tr>
                                    <th>TRANSACTION</th>
                                    <th>CATEGORY</th>
                                    <th>DATE</th>
                                    <th className="amount-col">AMOUNT</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map(transaction => (
                                    <tr key={transaction.id}>
                                        <td className="transaction-name">{transaction.name}</td>
                                        <td>
                                            <span className={`category-badge ${transaction.category.toLowerCase().replace(' ', '-')}`}>
                                                {transaction.category}
                                            </span>
                                        </td>
                                        <td className="date-cell">{formatDate(transaction.created_at)}</td>
                                        <td className="amount-cell">
                                            -${Number(transaction.amount).toFixed(2)}
                                        </td>
                                        <td className="status-cell">
                                            <div className="status-dot"></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ExpenseModal
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                onSuccess={(msg) => {
                    setToast({ message: msg, type: 'success' });
                    fetchTransactions();
                }}
                currentDate={currentDate}
            />

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

export default Expenses;
