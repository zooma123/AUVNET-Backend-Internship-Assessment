
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, ShoppingBag, Heart, Settings, LogOut, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login'); // Navigate anyway
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
        {user?.role === 'admin' && (
          <Link to="/dashboard">
            <ShoppingBag className="brand-icon" />
            <span>ECommerce</span>
          </Link>
        
        )}
        
        </div>

        <div className="navbar-menu">
        <Link to="/home" className="navbar-item">
            <Home className="nav-icon" />
            <span>Home</span>
          </Link>

          {user?.role === 'admin' && (
            <Link to="/dashboard" className="navbar-item">
              <ShoppingBag className="nav-icon" />
              <span>Dashboard</span>
            </Link>
          )}


          <Link to="/products" className="navbar-item">
            <ShoppingBag className="nav-icon" />
            <span>Products</span>
          </Link>

          <Link to="/wishlist" className="navbar-item">
            <Heart className="nav-icon" />
            <span>Wishlist</span>
          </Link>

          {user?.role === 'admin' && (
            <Link to="/admin" className="navbar-item">
              <Settings className="nav-icon" />
              <span>Admin</span>
            </Link>
          )}
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <User className="user-icon" />
            <span>{user?.role || 'User'}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut className="logout-icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
