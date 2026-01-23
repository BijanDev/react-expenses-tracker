import React from 'react';
import PropTypes from 'prop-types';

const DashboardCard = ({ title, amount, change, isPrimary, onEdit }) => {
  return (
    <div className={`dashboard-card ${isPrimary ? 'primary-card' : ''}`}>
      <div className="card-header">
        <div className="card-title-group">
          <span className="card-title">{title}</span>
          {onEdit && (
            <button
              type="button"
              className="card-edit-btn"
              onClick={onEdit}
              aria-label={`Edit ${title}`}
              title={`Edit ${title}`}
            >
              ✏️
            </button>
          )}
        </div>
        <div className="card-actions">
          {isPrimary && <span className="card-icon">💳</span>}
        </div>
      </div>
      <div className="card-amount">{amount}</div>
      {change && (
        <div className={`card-change ${change.includes('+') ? 'positive' : 'negative'}`}>
          {change}
        </div>
      )}
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string,
  isPrimary: PropTypes.bool,
  onEdit: PropTypes.func,
};

DashboardCard.defaultProps = {
  change: undefined,
  isPrimary: false,
  onEdit: undefined,
};

export default DashboardCard;
