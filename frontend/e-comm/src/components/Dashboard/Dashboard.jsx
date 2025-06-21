
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingBag, Heart, Package, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    wishlistItems: 0,
    categories: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsResponse, wishlistResponse, categoriesResponse] = await Promise.all([
        axios.get('http://localhost:3000/product/AllProducts'),
        axios.get('http://localhost:3000/wishlist/GetProductinWishList').catch(() => ({ data: { Data: { product_id: [] } } })),
        axios.get('http://localhost:3000/category/AllCategories')
      ]);

      setStats({
        totalProducts: productsResponse.data.Data?.length || 0,
        wishlistItems: wishlistResponse.data.Data?.product_id?.length || 0,
        categories: categoriesResponse.data.Data?.length || 0
      });

      setRecentProducts(productsResponse.data.Data?.slice(0, 6) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back!</h1>
          <p>Here's what's happening in your store today.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon products">
              <Package />
            </div>
            <div className="stat-content">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon wishlist">
              <Heart />
            </div>
            <div className="stat-content">
              <h3>{stats.wishlistItems}</h3>
              <p>Wishlist Items</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon categories">
              <ShoppingBag />
            </div>
            <div className="stat-content">
              <h3>{stats.categories}</h3>
              <p>Categories</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon trending">
              <TrendingUp />
            </div>
            <div className="stat-content">
              <h3>Active</h3>
              <p>Status</p>
            </div>
          </div>
        </div>

        <div className="recent-products">
          <h2>Recent Products</h2>
          <div className="products-grid">
            {recentProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img src={product.image || '/placeholder-image.jpg'} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">${product.price}</p>
                  <p className="product-quantity">Qty: {product.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
