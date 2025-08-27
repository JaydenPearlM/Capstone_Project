import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'https://capstone-project-f.onrender.com/api/v1';
git
  // Set up axios interceptor or fetch headers
  const authFetch = async (url, options = {}) => {
    // Get the current token from state or localStorage
    const currentToken = token || localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (currentToken) {
      headers.Authorization = `Bearer ${currentToken}`;
    }

    // Check if url is already a full URL or just a path
    const fetchUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

    const response = await fetch(fetchUrl, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      logout();
      throw new Error('Unauthorized');
    }

    return response;
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true, data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true, data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const getCurrentUser = async () => {
    const currentToken = token || localStorage.getItem('token');
    
    if (!currentToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await authFetch('/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only get current user on initial load if there's a token in localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken && !user) {
      getCurrentUser();
    } else if (!storedToken) {
      setLoading(false);
    }
  }, []); // Run only once on mount

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    authFetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
