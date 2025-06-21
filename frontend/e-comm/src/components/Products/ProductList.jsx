import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Heart, ShoppingBag, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6); // Items per page

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/product/AllProducts?page=${page}&limit=${limit}`);
      if (response.data.message === 'success') {
        setProducts(response.data.Data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/category/AllCategories');
      if (response.data.message === 'success') {
        setCategories(response.data.Data);
      }
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.subSubCategory_id?.Name?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const addToWishlist = async (productId) => {
    try {
      const response = await axios.post('http://localhost:3000/wishlist/addToWishList', {
        productId: productId
      });

      if (response.data.message === 'success') {
        toast.success('Product added to wishlist!');
      }
    } catch (error) {
      if (error.response?.data?.message === 'Product already in wishlist') {
        toast.info('Product is already in your wishlist');
      } else {
        toast.error('Failed to add to wishlist');
      }
    }
  };

  const handlePageChange = (direction) => {
    if (direction === 'prev' && page > 1) {
      setPage(prev => prev - 1);
    } else if (direction === 'next' && page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-header">
          <h1>Our Products</h1>
          <p>Discover amazing products at great prices</p>
        </div>

        {/* Filters */}
        <div className="products-filters">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

        
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <ShoppingBag className="no-products-icon" />
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img
                    src={product.image || '/placeholder-image.jpg'}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  <button
                    className="wishlist-btn"
                    onClick={() => addToWishlist(product._id)}
                  >
                    <Heart className="heart-icon" />
                  </button>
                </div>

                <div className="product-info">
                  <div className="product-category">
                    {product.subSubCategory_id?.Name || 'Uncategorized'}
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">
                    {product.description || 'No description available'}
                  </p>
                  <div className="product-footer">
                    <div className="product-price">${product.price}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange('prev')}
            disabled={page === 1}
          >
            <ChevronLeft size={20} /> Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            onClick={() => handlePageChange('next')}
            disabled={page === totalPages}
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
