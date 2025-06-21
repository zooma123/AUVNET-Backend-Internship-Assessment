
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Package, Users, Layers, BarChart3 } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const adminFeatures = [
    {
      title: 'Category Management',
      description: 'Manage categories, subcategories, and sub-subcategories',
      icon: <Layers className="feature-icon" />,
      link: '/admin/categories',
      color: 'blue'
    },
    {
      title: 'Product Management',
      description: 'Add, edit, and delete products with images',
      icon: <Package className="feature-icon" />,
      link: '/admin/products',
      color: 'green'
    },
    {
      title: 'User Management',
      description: 'Manage users and administrators',
      icon: <Users className="feature-icon" />,
      link: '/admin/users',
      color: 'purple'
    },
    {
      title: 'Analytics',
      description: 'View sales reports and statistics',
      icon: <BarChart3 className="feature-icon" />,
      link: '#',
      color: 'orange'
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-header">
          <Settings className="admin-icon" />
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage your ecommerce platform</p>
          </div>
        </div>

        <div className="admin-features">
          {adminFeatures.map((feature, index) => (
            <Link 
              key={index} 
              to={feature.link} 
              className={`admin-feature-card ${feature.color}`}
            >
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
