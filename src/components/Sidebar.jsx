import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Wallet, PieChart, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const displayName = (profile?.first_name && profile?.last_name) 
    ? `${profile.first_name} ${profile.last_name}` 
    : (profile?.email || sessionStorage.getItem('user') || 'User');

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">F</div>
            <span className="logo-text-d">FinTrack</span>
          </div>
          <button className="mobile-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <nav className="nav-menu">
          <button className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button className="nav-item" onClick={onClose}>
            <Wallet size={20} />
            <span>Expenses</span>
          </button>
          <button className="nav-item" onClick={onClose}>
            <PieChart size={20} />
            <span>Budget & Fixed</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
              <div className="avatar">
                  {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                  <span className="user-name">{displayName}</span>
                  <span className="user-plan">Free Plan</span>
              </div>
          </div>
          <button onClick={handleLogout} className="logout-btn" title="Logout">
               <LogOut size={18} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
