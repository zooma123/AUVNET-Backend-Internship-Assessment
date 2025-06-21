import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children}) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const clearAuthState = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
          // Restore user from token
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userRole = payload.role || 'user';
            setUser({ id: payload.id, role: userRole });
          } catch (error) {
            console.error('Error decoding token:', error);
            clearAuthState();
          }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/SignIn', {
        Username: username,
        password: password
      });

      if (response.data.status === 'ok') {
        const receivedToken = response.data.data;
        setToken(receivedToken);
        localStorage.setItem('token', receivedToken);
      
        // Decode the token to get user info
        const payload = JSON.parse(atob(receivedToken.split('.')[1]));
        const role = payload.role || 'user';
        console.log("Decoded JWT payload:", payload);
        console.log("Login result role:", role);
        setUser({ id: payload.id, role });
        setIsAuthenticated(true);
      
        toast.success('Login successful!');
        return { success: true, role }; // ✅ return role
      }
       else {
        toast.error(response.data.error || 'Login failed');
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const register = async (username, email, password, role = 'user') => {
    try {
      const response = await axios.post('http://localhost:3000/auth/SignUp', {
        Username: username,
        Email: email,
        password: password,
        role: role
      });

      if (response.data.message === 'success') {
        toast.success('Registration successful! Please login.');
        return true;
      } else {
        toast.error(response.data.error || 'Registration failed');
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};