
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import './WishList.css';

const WishList = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get('http://localhost:3000/wishlist/GetProductinWishList');
      if (response.data.message === 'success' && response.data.Data) {
        setWishlistItems(response.data.Data.product_id || []);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setWishlistItems([]);
      } else {
        toast.error('Failed to fetch wishlist');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      console.log('Removing product with ID:', productId);
      
      const response = await axios.delete('http://localhost:3000/wishlist/deleteProductWishList', {
        data: { productId: productId }
      });

      console.log('Backend response:', response.data);

      if (response.data.message === 'success' || response.data.message === ' success') {
        setWishlistItems(prevItems => 
          prevItems.filter(item => item._id !== productId)
        );
        toast.success('Product removed from wishlist');
      } else {
        toast.error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error.response?.data || error.message);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to remove from wishlist');
      }
    }
  };

  const clearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {    
        const response = await axios.delete(`http://localhost:3000/wishlist/ClearWishList`);
        
        if (response.data.message === 'success') {
          setWishlistItems([]);
          toast.success('Wishlist cleared successfully');
        }
      } catch (error) {
        toast.error('Failed to clear wishlist');
      }
    }
  };

  if (loading) {
    return (
      <div className="wishlist-loading">
        <div className="loading-spinner"></div>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <div className="header-content">
            <Heart className="header-icon" />
            <div>
              <h1>My Wishlist</h1>
              <p>Items you've saved for later ({wishlistItems.length})</p>
            </div>
          </div>
          {wishlistItems.length > 0 && (
            <button onClick={clearWishlist} className="clear-wishlist-btn">
              <Trash2 className="trash-icon" />
              Clear All
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <Heart className="empty-icon" />
            <h3>Your wishlist is empty</h3>
            <p>Start browsing and add items you love to your wishlist</p>
            <a href="/products" className="browse-btn">
              <ShoppingBag className="browse-icon" />
              Browse Products
            </a>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <div key={item._id} className="wishlist-item">
                <div className="item-image">
                  <img
                    src={item.image || '/placeholder-image.jpg'}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>

                <div className="item-info">
                 
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-description">
                    {item.description || 'No description available'}
                  </p>
                  
                  <div className="item-footer">
                    <div className="item-price">${item.price}</div>
                   
                  </div>

                  <div className="item-actions">
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="remove-btn"
                    >
                      <Trash2 className="remove-icon" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;
