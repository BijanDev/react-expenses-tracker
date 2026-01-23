import React from 'react';

const BudgetOverview = ({ spentPercentage }) => {
  return (
    <div className="budget-overview card">
      <div className="overview-header">
        <h3>Budget Overview</h3>
        <span className="percentage">{spentPercentage}%</span>
      </div>
      <p className="overview-subtitle">You have spent {spentPercentage}% of your monthly budget</p>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${spentPercentage}%` }}></div>
      </div>
    </div>
  );
};

export default BudgetOverview;
