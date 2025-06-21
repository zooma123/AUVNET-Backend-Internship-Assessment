import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Heart, Filter, ShoppingBag, ChevronDown } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState('');

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(6); // products per page
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchInitialData(page);
  }, [page]);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, selectedSubCategory, selectedSubSubCategory, products]);

  const fetchInitialData = async (pageNum = 1) => {
    setLoading(true);
    try {
      const [categoriesRes, subCategoriesRes, subSubCategoriesRes, productsRes] = await Promise.all([
        axios.get('http://localhost:3000/category/AllCategories'),
        axios.get('http://localhost:3000/subcategory/AllSubCategories'),
        axios.get('http://localhost:3000/subsubcategory/AllSubSubCategories'),
        axios.get(`http://localhost:3000/product/AllProducts?page=${pageNum}&limit=${limit}`)
      ]);

      if (categoriesRes.data.message === 'success') setCategories(categoriesRes.data.Data);
      if (subCategoriesRes.data.message === 'success') setSubCategories(subCategoriesRes.data.Data);
      if (subSubCategoriesRes.data.message === 'success') setSubSubCategories(subSubCategoriesRes.data.Data);
      if (productsRes.data.message === 'success') {
        setProducts(productsRes.data.Data);
        setPage(productsRes.data.currentPage);
        setTotalPages(productsRes.data.totalPages);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!selectedCategory && !selectedSubCategory && !selectedSubSubCategory) {
      setFilteredProducts([]);
      return;
    }

    let filtered = products;

    if (selectedSubSubCategory) {
      filtered = products.filter(product =>
        product.subSubCategory_id._id === selectedSubSubCategory
      );
    } else if (selectedSubCategory) {
      const relevantSubSubCategories = subSubCategories.filter(subSub =>
        subSub.subCategory_id._id === selectedSubCategory
      );
      const subSubCategoryIds = relevantSubSubCategories.map(subSub => subSub._id);
      filtered = products.filter(product =>
        subSubCategoryIds.includes(product.subSubCategory_id._id)
      );
    } else if (selectedCategory) {
      const relevantSubCategories = subCategories.filter(sub =>
        sub.category_id._id === selectedCategory
      );
      const subCategoryIds = relevantSubCategories.map(sub => sub._id);
      const relevantSubSubCategories = subSubCategories.filter(subSub =>
        subCategoryIds.includes(subSub.subCategory_id._id)
      );
      const subSubCategoryIds = relevantSubSubCategories.map(subSub => subSub._id);
      filtered = products.filter(product =>
        subSubCategoryIds.includes(product.subSubCategory_id._id)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory('');
    setSelectedSubSubCategory('');
  };

  const handleSubCategoryChange = (subCategoryId) => {
    setSelectedSubCategory(subCategoryId);
    setSelectedSubSubCategory('');
  };

  const handleSubSubCategoryChange = (subSubCategoryId) => {
    setSelectedSubSubCategory(subSubCategoryId);
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSelectedSubSubCategory('');
    setPage(1);
  };

  const addToWishlist = async (productId) => {
    try {
      const response = await axios.post('http://localhost:3000/wishlist/addToWishList', { productId });
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

  const getFilteredSubCategories = () => {
    if (!selectedCategory) return [];
    return subCategories.filter(sub => sub.category_id._id === selectedCategory);
  };

  const getFilteredSubSubCategories = () => {
    if (!selectedSubCategory) return [];
    return subSubCategories.filter(subSub => subSub.subCategory_id._id === selectedSubCategory);
  };

  const getProductsDisplayMessage = () => {
    if (!selectedCategory && !selectedSubCategory && !selectedSubSubCategory) {
      return `All Products (Page ${page})`;
    }

    if (selectedSubSubCategory) {
      const subSubCat = getFilteredSubSubCategories().find(s => s._id === selectedSubSubCategory);
      return `Products in ${subSubCat?.Name} (${filteredProducts.length})`;
    } else if (selectedSubCategory) {
      const subCat = getFilteredSubCategories().find(s => s._id === selectedSubCategory);
      return `Products in ${subCat?.Name} (${filteredProducts.length})`;
    } else if (selectedCategory) {
      const cat = categories.find(c => c._id === selectedCategory);
      return `Products in ${cat?.Name} (${filteredProducts.length})`;
    }
  };

  const productsToDisplay = (selectedCategory || selectedSubCategory || selectedSubSubCategory)
    ? filteredProducts
    : products;

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome to Our Store</h1>
        <p>Select categories below to discover amazing products</p>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-header">
          <Filter className="filter-icon" />
          <h3>Browse Products by Category</h3>
          {(selectedCategory || selectedSubCategory || selectedSubSubCategory) && (
            <button className="reset-filters-btn" onClick={resetFilters}>
              Clear All
            </button>
          )}
        </div>

        <div className="filter-dropdowns">
          <div className="dropdown-group">
            <label>Category</label>
            <div className="custom-select">
              <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
                <option value="">Select a Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.Name}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-icon" />
            </div>
          </div>

          <div className="dropdown-group">
            <label>Subcategory</label>
            <div className="custom-select">
              <select
                value={selectedSubCategory}
                onChange={(e) => handleSubCategoryChange(e.target.value)}
                disabled={!selectedCategory}
              >
                <option value="">Select a Subcategory</option>
                {getFilteredSubCategories().map((subCategory) => (
                  <option key={subCategory._id} value={subCategory._id}>
                    {subCategory.Name}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-icon" />
            </div>
          </div>

          <div className="dropdown-group">
            <label>Sub-subcategory</label>
            <div className="custom-select">
              <select
                value={selectedSubSubCategory}
                onChange={(e) => handleSubSubCategoryChange(e.target.value)}
                disabled={!selectedSubCategory}
              >
                <option value="">Select a Sub-subcategory</option>
                {getFilteredSubSubCategories().map((subSubCategory) => (
                  <option key={subSubCategory._id} value={subSubCategory._id}>
                    {subSubCategory.Name}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <div className="products-header">
          <h2>{getProductsDisplayMessage()}</h2>
        </div>

        {productsToDisplay.length === 0 ? (
          <div className="no-products">
            <ShoppingBag className="no-products-icon" />
            <h3>No products found</h3>
            <p>Try selecting different categories or check back later for new products.</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {productsToDisplay.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image">
                    <img
                      src={product.image || '/placeholder-image.jpg'}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    <button className="wishlist-btn" onClick={() => addToWishlist(product._id)}>
                      <Heart className="heart-icon" />
                    </button>
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description || 'No description available'}</p>
                    <div className="product-category">
                      <span className="category-badge">{product.subSubCategory_id?.Name}</span>
                    </div>
                    <div className="product-footer">
                      <div className="product-price">${product.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {(!selectedCategory && totalPages > 1) && (
              <div className="pagination-controls">
                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
                  Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
