import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This runs once on mount
    const checkAuth = () => {
      const savedUser = localStorage.getItem('edumanage_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('edumanage_user'); // Clean up corrupt data
        }
      }
      // Use setTimeout to avoid synchronous state updates
      setTimeout(() => {
        setIsLoading(false);
      }, 0);
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    const userWithTimestamp = {
      ...userData,
      loginTime: new Date().toISOString()
    };
    setUser(userWithTimestamp);
    localStorage.setItem('edumanage_user', JSON.stringify(userWithTimestamp));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edumanage_user');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};