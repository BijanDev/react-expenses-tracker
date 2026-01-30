import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import BudgetPage from './components/BudgetPage';
import { ThemeProvider } from './context/ThemeContext';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/expenses" element={
          <ProtectedRoute>
            <Expenses />
          </ProtectedRoute>
        } />
        <Route path="/budget" element={
          <ProtectedRoute>
            <BudgetPage />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          <div className="App">
            <header className="App-header">
              <p>
                Budget Dashboard - <a href="/login" style={{color: '#61dafb'}}>Login to continue</a>
              </p>
            </header>
          </div>
        } />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
