import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './dashboard.css'; // Assuming styles will be added here or reuse existing

const MonthSelector = ({ currentDate, onMonthChange }) => {
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="month-selector">
      <button onClick={handlePrevious} className="month-nav-btn" aria-label="Previous Month">
        <ChevronLeft size={24} />
      </button>
      <h2 className="current-month">{monthName}</h2>
      <button onClick={handleNext} className="month-nav-btn" aria-label="Next Month">
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default MonthSelector;
