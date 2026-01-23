// const API_BASE_URL = 'http://127.0.0.1:8000';
const API_BASE_URL = 'https://expenses-tracker-xhm3.onrender.com';

const getHeaders = () => {
  const token = sessionStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  getBudget: async (budgetId) => {
    const response = await fetch(`${API_BASE_URL}/budget/budget/${budgetId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch budget');
    }
    return response.json();
  },

  setBudget: async (data) => {
    const response = await fetch(`${API_BASE_URL}/budget/set-budget`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to set budget');
    }
    return response.json();
  },

  getBudgetByDate: async (date) => {
    const response = await fetch(`${API_BASE_URL}/budget/budget-by-date?date=${date}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch budget by date');
    }
    return response.json();
  },

  updateBudget: async (budgetId, data) => {
    const response = await fetch(`${API_BASE_URL}/budget/update-budget/${budgetId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update budget');
    }
    return response.json();
  },

  getHistory: async (params = {}) => {
    const { month, year, date } = params;
    let url = `${API_BASE_URL}/budget/history-by-date`;
    const queryParams = new URLSearchParams();
    
    if (month) queryParams.append('month', month);
    if (year) queryParams.append('year', year);
    if (date) queryParams.append('date', date);
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch transaction history');
    }
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Login failed');
    }
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Registration failed');
    }
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return response.json();
  },

  addDailyExpense: async (data) => {
    const response = await fetch(`${API_BASE_URL}/budget/add-daily-expense`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to add daily expense');
    }
    return response.json();
  }
};
