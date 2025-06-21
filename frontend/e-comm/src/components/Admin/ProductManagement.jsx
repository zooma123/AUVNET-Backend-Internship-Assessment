import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Package, Upload } from 'lucide-react';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    quantity: '',
    SubSubCategoryName: '',
    description: '',
    image: null,
    id: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, subSubCategoriesRes] = await Promise.all([
        axios.get('http://localhost:3000/product/AllProducts'),
        axios.get('http://localhost:3000/subsubcategory/AllSubSubCategories')
      ]);

      if (productsRes.data.message === 'success') {
        setProducts(productsRes.data.Data);
      }
      if (subSubCategoriesRes.data.message === 'success') {
        setSubSubCategories(subSubCategoriesRes.data.Data);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('price', productForm.price);
    formData.append('quantity', productForm.quantity);
    formData.append('SubSubCategoryName', productForm.SubSubCategoryName);
    formData.append('description', productForm.description);

    if (productForm.image) {
      formData.append('image', productForm.image);
    }

    try {
      if (productForm.id) {
        // For update, use FormData to support image upload
        await axios.put(`http://localhost:3000/product/UpdateProduct/${productForm.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Product updated successfully');
      } else {
        await axios.post('http://localhost:3000/product/AddProduct', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Product added successfully');
      }

      setProductForm({
        name: '',
        price: '',
        quantity: '',
        SubSubCategoryName: '',
        description: '',
        image: null,
        id: null
      });
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:3000/product/DeleteProduct/${id}`);
        toast.success('Product deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductForm({...productForm, image: file});
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="product-management">
      <div className="product-container">
        <div className="product-header">
          <Package className="header-icon" />
          <div>
            <h1>Product Management</h1>
            <p>Manage your product catalog</p>
          </div>
        </div>

        <div className="content-header">
          <h2>Products ({products.length})</h2>
          <button 
            className="add-btn"
            onClick={() => {
              setProductForm({
                name: '',
                price: '',
                quantity: '',
                SubSubCategoryName: '',
                description: '',
                image: null,
                id: null
              });
              setShowModal(true);
            }}
          >
            <Plus className="btn-icon" />
            Add Product
          </button>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img
                  src={product.image || '/placeholder-image.jpg'}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              </div>

              <div className="product-info">
                <div className="product-category">
                  {product.subSubCategory_id?.Name || 'Uncategorized'}
                </div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">
                  {product.description || 'No description'}
                </p>
                <div className="product-details">
                  <div className="product-price">${product.price}</div>
                  <div className="product-quantity">Stock: {product.quantity}</div>
                </div>
              </div>

              <div className="product-actions">
                <button 
                  className="edit-btn"
                  onClick={() => {
                    setProductForm({
                      name: product.name,
                      price: product.price,
                      quantity: product.quantity,
                      SubSubCategoryName: product.subSubCategory_id?.Name || '',
                      description: product.description || '',
                      image: null,
                      id: product._id
                    });
                    setShowModal(true);
                  }}
                >
                  <Edit className="btn-icon" />
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => deleteProduct(product._id)}
                >
                  <Trash2 className="btn-icon" />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="empty-state">
              <Package className="empty-icon" />
              <h3>No products found</h3>
              <p>Start by adding your first product</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{productForm.id ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={productForm.SubSubCategoryName}
                    onChange={(e) => setProductForm({...productForm, SubSubCategoryName: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    {subSubCategories.map((category) => (
                      <option key={category._id} value={category.Name}>
                        {category.subCategory_id?.category_id?.Name} → {category.subCategory_id?.Name} → {category.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={productForm.quantity}
                    onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows="3"
                />
              </div>

              {productForm.id && (
                <div className="form-group">
                  <label>Product Image</label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      id="product-image"
                    />
                    <label htmlFor="product-image" className="file-input-label">
                      <Upload className="upload-icon" />
                      {productForm.image ? productForm.image.name : 'Choose image...'}
                    </label>
                  </div>
                </div>
              )}

              {!productForm.id && (
                <div className="form-group">
                  <label>Product Image</label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      id="product-image"
                      required
                    />
                    <label htmlFor="product-image" className="file-input-label">
                      <Upload className="upload-icon" />
                      {productForm.image ? productForm.image.name : 'Choose image...'}
                    </label>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">
                  {productForm.id ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;