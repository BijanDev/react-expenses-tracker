import React from 'react';

import { useTheme } from '../context/ThemeContext';
import MonthSelector from './MonthSelector';
import { Menu } from 'lucide-react';

const Header = ({ title, currentDate, onMonthChange, onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="main-header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
            <Menu size={24} />
        </button>
        <h1>{title}</h1>
      </div>
      {currentDate && onMonthChange && (
        <MonthSelector currentDate={currentDate} onMonthChange={onMonthChange} />
      )}
      <button 
        onClick={toggleTheme} 
        className="theme-toggle-btn"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  );
};

export default Header;
