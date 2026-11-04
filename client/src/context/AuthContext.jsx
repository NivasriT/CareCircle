import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('carecircle_token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch current user if token exists on initial load
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('carecircle_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('carecircle_token', res.data.token);
        localStorage.setItem('carecircle_user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        localStorage.setItem('carecircle_token', res.data.token);
        localStorage.setItem('carecircle_user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.',
      };
    }
  };

  const quickLogin = async (role) => {
    if (role === 'ngo') {
      return await login('asha.foundation@carecircle.org', 'password123');
    } else {
      return await login('nivasri@carecircle.org', 'password123');
    }
  };

  const logout = () => {
    localStorage.removeItem('carecircle_token');
    localStorage.removeItem('carecircle_user');
    setToken(null);
    setUser(null);
  };

  const updateUserState = (updatedUserData) => {
    setUser((prev) => ({ ...prev, ...updatedUserData }));
    localStorage.setItem(
      'carecircle_user',
      JSON.stringify({ ...user, ...updatedUserData })
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        quickLogin,
        logout,
        updateUserState,
        isAuthenticated: !!token && !!user,
        isNGO: user?.role === 'ngo',
        isVolunteer: user?.role === 'volunteer',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
