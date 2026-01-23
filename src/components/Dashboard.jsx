import React, { useEffect, useMemo, useState } from 'react';
import './dashboard.css';

import Sidebar from './Sidebar';
import Header from './Header';
import DashboardCard from './DashboardCard';
import BudgetOverview from './BudgetOverview';
import SpendingChart from './SpendingChart';
import TransactionList from './TransactionList';
import BudgetModal from './BudgetModal';
import ExpenseModal from './ExpenseModal';
import Toast from './Toast';
import { api } from '../services/api';

const Dashboard = () => {
  /* ---------------- API Integration ---------------- */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [budget, setBudget] = useState(null);
  const [prevBudget, setPrevBudget] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const fetchBudget = async () => {
    try {
      const dateStr = formatDate(currentDate);
      const budgetResponse = await api.getBudgetByDate(dateStr);
      
      if (budgetResponse.budgets && budgetResponse.budgets.length > 0) {
        setBudget(budgetResponse.budgets[0]);
      } else {
        setBudget(null);
      }

      // Fetch Previous Month Budget for Comparison
      const prevDate = new Date(currentDate);
      prevDate.setMonth(prevDate.getMonth() - 1);
      const prevDateStr = formatDate(prevDate);
      const prevBudgetResponse = await api.getBudgetByDate(prevDateStr);
      
      if (prevBudgetResponse.budgets && prevBudgetResponse.budgets.length > 0) {
        setPrevBudget(prevBudgetResponse.budgets[0]);
      } else {
        setPrevBudget(null);
      }

      // Fetch History for the selected month/year
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const historyResponse = await api.getHistory({ month, year });
      if (historyResponse.history) {
        const transformedHistory = historyResponse.history.map(item => ({
          id: item.id,
          name: item.name,
          amount: item.amount,
          category: item.category,
          date: new Date(item.created_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
        }));
        setTransactions(transformedHistory);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setBudget(null);
      setPrevBudget(null);
    }
  };

  useEffect(() => {
    fetchBudget();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  /* ---------------- Handlers ---------------- */
  const handleEditMonthlyBudget = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (budgetData, budgetId) => {
    try {
      if (budgetId) {
        // Update existing budget
        await api.updateBudget(budgetId, budgetData);
        setToast({ message: 'Budget updated successfully!', type: 'success' });
      } else {
        // Create new budget
        await api.setBudget(budgetData);
        setToast({ message: 'Budget created successfully!', type: 'success' });
      }
      // Refresh the budget data
      fetchBudget();
    } catch (error) {
      console.error('Failed to save budget:', error);
      setToast({ message: 'Failed to save budget. Please try again.', type: 'error' });
    }
  };

  /* ---------------- Format currency ---------------- */
  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }),
    []
  );

  /* ---------------- Derived State from API ---------------- */
  const totalSpent = budget?.total_spent || 0;
  const monthlyBudgetAmount = budget?.amount || 0;
  const remainingAmount = budget?.remaining_amount || 0;

  const budgetData = useMemo(() => {
    const spentPercentage =
      monthlyBudgetAmount > 0
        ? Math.round((totalSpent / monthlyBudgetAmount) * 100)
        : 0;

    // Calculate changes comparing to previous month
    const calculateChange = (current, previous) => {
      if (!previous || previous === 0) return '0%';
      const change = ((current - previous) / previous) * 100;
      return `${change >= 0 ? '+' : ''}${Math.round(change)}%`;
    };

    const prevSpent = prevBudget?.total_spent || 0;
    const prevRemaining = prevBudget?.remaining_amount || 0;

    return {
      monthlyBudget: currencyFormatter.format(monthlyBudgetAmount),
      totalSpent: currencyFormatter.format(totalSpent),
      remaining: currencyFormatter.format(remainingAmount),
      spentPercentage,
      changeSpent: `${calculateChange(totalSpent, prevSpent)} from last month`,
      changeRemaining: `${calculateChange(remainingAmount, prevRemaining)} than last month`,
    };
  }, [monthlyBudgetAmount, totalSpent, remainingAmount, prevBudget, currencyFormatter]);

  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const categoryTotals = transactions.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    const colors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

    return Object.keys(categoryTotals).map((category, index) => ({
      name: category,
      value: categoryTotals[category],
      color: colors[index % colors.length]
    }));
  }, [transactions]);

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="main-content">
        <Header 
          title="Dashboard" 
          currentDate={currentDate} 
          onMonthChange={setCurrentDate} 
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <div className="dashboard-content">
          <div className="top-cards">
            <DashboardCard
              title="Monthly Budget"
              amount={budgetData.monthlyBudget}
              isPrimary
              onEdit={handleEditMonthlyBudget}
            />

            <DashboardCard
              title="Total Spent"
              amount={budgetData.totalSpent}
              change={budgetData.changeSpent}
            />

            <DashboardCard
              title="Remaining"
              amount={budgetData.remaining}
              change={budgetData.changeRemaining}
            />
          </div>

          <div className="dashboard-grid">
            <div className="col-left">
              <BudgetOverview spentPercentage={budgetData.spentPercentage} />
              <SpendingChart data={chartData} />
            </div>

            <div className="col-right">
              <TransactionList 
                transactions={transactions} 
                onAddClick={() => setIsExpenseModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        currentDate={currentDate}
        existingBudget={budget}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSuccess={(msg) => {
          setToast({ message: msg, type: 'success' });
          fetchBudget();
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

export default Dashboard;
