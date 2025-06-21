
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Layers, ChevronRight } from 'lucide-react';
import './CategoryManagement.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('categories');
  
  // Form states
  const [categoryForm, setCategoryForm] = useState({ Name: '', id: null });
  const [subCategoryForm, setSubCategoryForm] = useState({ Name: '', category_id: '', id: null });
  const [subSubCategoryForm, setSubSubCategoryForm] = useState({ Name: '', subCategory_id: '', id: null });
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [showSubSubCategoryModal, setShowSubSubCategoryModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, subCategoriesRes, subSubCategoriesRes] = await Promise.all([
        axios.get('http://localhost:3000/category/AllCategories'),
        axios.get('http://localhost:3000/subcategory/AllSubCategories'),
        axios.get('http://localhost:3000/subsubcategory/AllSubSubCategories')
      ]);

      if (categoriesRes.data.message === 'success') {
        setCategories(categoriesRes.data.Data);
      }
      if (subCategoriesRes.data.message === 'success') {
        setSubCategories(subCategoriesRes.data.Data);
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

  // Category CRUD
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (categoryForm.id) {
        await axios.put(`http://localhost:3000/category/UpdateCategory/${categoryForm.id}`, {
          Name: categoryForm.Name
        });
        toast.success('Category updated successfully');
      } else {
        await axios.post('http://localhost:3000/category/AddCategory', {
          Name: categoryForm.Name
        });
        toast.success('Category added successfully');
      }
      setCategoryForm({ Name: '', id: null });
      setShowCategoryModal(false);
      fetchData();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm('Are you sure? This will delete all related subcategories and products.')) {
      try {
        await axios.delete(`http://localhost:3000/category/DeleteCategory/${id}`);
        toast.success('Category deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  // SubCategory CRUD
  const handleSubCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (subCategoryForm.id) {
        await axios.put(`http://localhost:3000/subcategory/UpdateSubCategory/${subCategoryForm.id}`, {
          Name: subCategoryForm.Name,
          category_id: subCategoryForm.category_id
        });
        toast.success('Subcategory updated successfully');
      } else {
        await axios.post('http://localhost:3000/subcategory/AddSubCategory', {
          Name: subCategoryForm.Name,
          category_id: subCategoryForm.category_id
        });
        toast.success('Subcategory added successfully');
      }
      setSubCategoryForm({ Name: '', category_id: '', id: null });
      setShowSubCategoryModal(false);
      fetchData();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const deleteSubCategory = async (id) => {
    if (window.confirm('Are you sure? This will delete all related sub-subcategories and products.')) {
      try {
        await axios.delete(`http://localhost:3000/subcategory/DeleteSubCategory/${id}`);
        toast.success('Subcategory deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete subcategory');
      }
    }
  };

  // SubSubCategory CRUD
  const handleSubSubCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (subSubCategoryForm.id) {
        await axios.put(`http://localhost:3000/subsubcategory/UpdateSubSubCategory/${subSubCategoryForm.id}`, {
          Name: subSubCategoryForm.Name,
          subCategory_id: subSubCategoryForm.subCategory_id
        });
        toast.success('Sub-subcategory updated successfully');
      } else {
        await axios.post('http://localhost:3000/subsubcategory/AddSubSubCategory', {
          Name: subSubCategoryForm.Name,
          subCategory_id: subSubCategoryForm.subCategory_id
        });
        toast.success('Sub-subcategory added successfully');
      }
      setSubSubCategoryForm({ Name: '', subCategory_id: '', id: null });
      setShowSubSubCategoryModal(false);
      fetchData();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const deleteSubSubCategory = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`http://localhost:3000/subsubcategory/DeleteSubSubCategory/${id}`);
        toast.success('Sub-subcategory deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete sub-subcategory');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="category-management">
      <div className="category-container">
        <div className="category-header">
          <Layers className="header-icon" />
          <div>
            <h1>Category Management</h1>
            <p>Organize your products with categories</p>
          </div>
        </div>

        <div className="category-tabs">
          <button 
            className={activeTab === 'categories' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('categories')}
          >
            Categories ({categories.length})
          </button>
          <button 
            className={activeTab === 'subcategories' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('subcategories')}
          >
            Subcategories ({subCategories.length})
          </button>
          <button 
            className={activeTab === 'subsubcategories' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('subsubcategories')}
          >
            Sub-subcategories ({subSubCategories.length})
          </button>
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Categories</h2>
              <button 
                className="add-btn"
                onClick={() => {
                  setCategoryForm({ Name: '', id: null });
                  setShowCategoryModal(true);
                }}
              >
                <Plus className="btn-icon" />
                Add Category
              </button>
            </div>

            <div className="items-grid">
              {categories.map((category) => (
                <div key={category._id} className="item-card">
                  <div className="item-content">
                    <h3>{category.Name}</h3>
                    <p>Main Category</p>
                  </div>
                  <div className="item-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => {
                        setCategoryForm({ Name: category.Name, id: category._id });
                        setShowCategoryModal(true);
                      }}
                    >
                      <Edit className="btn-icon" />
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteCategory(category._id)}
                    >
                      <Trash2 className="btn-icon" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subcategories Tab */}
        {activeTab === 'subcategories' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Subcategories</h2>
              <button 
                className="add-btn"
                onClick={() => {
                  setSubCategoryForm({ Name: '', category_id: '', id: null });
                  setShowSubCategoryModal(true);
                }}
              >
                <Plus className="btn-icon" />
                Add Subcategory
              </button>
            </div>

            <div className="items-grid">
              {subCategories.map((subCategory) => (
                <div key={subCategory._id} className="item-card">
                  <div className="item-content">
                    <h3>{subCategory.Name}</h3>
                    <div className="breadcrumb">
                      <span>{subCategory.category_id?.Name}</span>
                      <ChevronRight className="breadcrumb-icon" />
                      <span>{subCategory.Name}</span>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => {
                        setSubCategoryForm({ 
                          Name: subCategory.Name, 
                          category_id: subCategory.category_id?._id, 
                          id: subCategory._id 
                        });
                        setShowSubCategoryModal(true);
                      }}
                    >
                      <Edit className="btn-icon" />
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteSubCategory(subCategory._id)}
                    >
                      <Trash2 className="btn-icon" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-subcategories Tab */}
        {activeTab === 'subsubcategories' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Sub-subcategories</h2>
              <button 
                className="add-btn"
                onClick={() => {
                  setSubSubCategoryForm({ Name: '', subCategory_id: '', id: null });
                  setShowSubSubCategoryModal(true);
                }}
              >
                <Plus className="btn-icon" />
                Add Sub-subcategory
              </button>
            </div>

            <div className="items-grid">
              {subSubCategories.map((subSubCategory) => (
                <div key={subSubCategory._id} className="item-card">
                  <div className="item-content">
                    <h3>{subSubCategory.Name}</h3>
                    <div className="breadcrumb">
                      <span>{subSubCategory.subCategory_id?.category_id?.Name}</span>
                      <ChevronRight className="breadcrumb-icon" />
                      <span>{subSubCategory.subCategory_id?.Name}</span>
                      <ChevronRight className="breadcrumb-icon" />
                      <span>{subSubCategory.Name}</span>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => {
                        setSubSubCategoryForm({ 
                          Name: subSubCategory.Name, 
                          subCategory_id: subSubCategory.subCategory_id?._id, 
                          id: subSubCategory._id 
                        });
                        setShowSubSubCategoryModal(true);
                      }}
                    >
                      <Edit className="btn-icon" />
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteSubSubCategory(subSubCategory._id)}
                    >
                      <Trash2 className="btn-icon" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{categoryForm.id ? 'Edit Category' : 'Add Category'}</h3>
            <form onSubmit={handleCategorySubmit}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={categoryForm.Name}
                  onChange={(e) => setCategoryForm({...categoryForm, Name: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCategoryModal(false)}>
                  Cancel
                </button>
                <button type="submit">
                  {categoryForm.id ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcategory Modal */}
      {showSubCategoryModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{subCategoryForm.id ? 'Edit Subcategory' : 'Add Subcategory'}</h3>
            <form onSubmit={handleSubCategorySubmit}>
              <div className="form-group">
                <label>Parent Category</label>
                <select
                  value={subCategoryForm.category_id}
                  onChange={(e) => setSubCategoryForm({...subCategoryForm, category_id: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.Name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Subcategory Name</label>
                <input
                  type="text"
                  value={subCategoryForm.Name}
                  onChange={(e) => setSubCategoryForm({...subCategoryForm, Name: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowSubCategoryModal(false)}>
                  Cancel
                </button>
                <button type="submit">
                  {subCategoryForm.id ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub-subcategory Modal */}
      {showSubSubCategoryModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{subSubCategoryForm.id ? 'Edit Sub-subcategory' : 'Add Sub-subcategory'}</h3>
            <form onSubmit={handleSubSubCategorySubmit}>
              <div className="form-group">
                <label>Parent Subcategory</label>
                <select
                  value={subSubCategoryForm.subCategory_id}
                  onChange={(e) => setSubSubCategoryForm({...subSubCategoryForm, subCategory_id: e.target.value})}
                  required
                >
                  <option value="">Select Subcategory</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory._id} value={subCategory._id}>
                      {subCategory.category_id?.Name} → {subCategory.Name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Sub-subcategory Name</label>
                <input
                  type="text"
                  value={subSubCategoryForm.Name}
                  onChange={(e) => setSubSubCategoryForm({...subSubCategoryForm, Name: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowSubSubCategoryModal(false)}>
                  Cancel
                </button>
                <button type="submit">
                  {subSubCategoryForm.id ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
