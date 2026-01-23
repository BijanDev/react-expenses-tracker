import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Wallet, PieChart, LogOut, X } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
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
            <div className="logo-icon-container">
              <span className="logo-letter">S</span>
            </div>
            <span className="logo-text-f">Spendly</span>
          </div>
          <button className="mobile-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <nav className="nav-menu">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/expenses" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Wallet size={20} />
            <span>Expenses</span>
          </NavLink>
          <NavLink to="/budget" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <PieChart size={20} />
            <span>Budget & Fixed</span>
          </NavLink>
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

      <style jsx="true">{`
        .logo-icon-container {
          width: 32px;
          height: 32px;
          background: var(--active-bg);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-letter {
          color: var(--primary-blue);
          font-weight: 800;
          font-size: 20px;
        }
        .logo-text-f {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-main);
        }
        .nav-item {
          text-decoration: none;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
