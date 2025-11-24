// src/Javascript/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state from localStorage on mount (for persistence across page refreshes)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const email = localStorage.getItem('userEmail');
    
    if (token && email) {
      setAuthToken(token);
      setUserEmail(email);
    }
    
    setIsLoading(false);
  }, []);

  // Login function
  const login = (token, email) => {
    setAuthToken(token);
    setUserEmail(email);
    
    // Also persist to localStorage for page refreshes
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email);
  };

  // Logout function
  const logout = () => {
    setAuthToken(null);
    setUserEmail(null);
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    localStorage.removeItem('redirectAfterLogin');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!authToken && !!userEmail;
  };

  const value = {
    authToken,
    userEmail,
    isLoading,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};