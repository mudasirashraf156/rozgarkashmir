import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('rk_token');
    if (token) {
      getMe()
        .then(res => {
          setUser(res.data.user);
          setWorkerProfile(res.data.workerProfile);
        })
        .catch(() => {
          localStorage.removeItem('rk_token');
          localStorage.removeItem('rk_user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = (token, userData) => {
    localStorage.setItem('rk_token', token);
    localStorage.setItem('rk_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('rk_token');
    localStorage.removeItem('rk_user');
    setUser(null);
    setWorkerProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, workerProfile, setWorkerProfile, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
