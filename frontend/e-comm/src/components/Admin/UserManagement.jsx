
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Users, User, Shield } from 'lucide-react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [showModal, setShowModal] = useState(false);
  const [userForm, setUserForm] = useState({
    Username: '',
    Email: '',
    password: '',
    role: 'user',
    id: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, adminsRes] = await Promise.all([
        axios.get('http://localhost:3000/user/Users'),
        axios.get('http://localhost:3000/user/Admins')
      ]);

      if (usersRes.data['message '] === 'success') {
        setUsers(usersRes.data.data);
      }
      if (adminsRes.data['message '] === 'success') {
        setAdmins(adminsRes.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userForm.id) {
        // Update admin
        await axios.put(`http://localhost:3000/user/UpdateAdmin/${userForm.id}`, {
          Username: userForm.Username,
          Email: userForm.Email,
          ...(userForm.password && { password: userForm.password })
        });
        toast.success('User updated successfully');
      } else {
        // Create new admin
        await axios.post('http://localhost:3000/user/AddAdmin', {
          Username: userForm.Username,
          Email: userForm.Email,
          password: userForm.password
        });
        toast.success('Admin created successfully');
      }
      
      setUserForm({
        Username: '',
        Email: '',
        password: '',
        role: 'user',
        id: null
      });
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:3000/user/DeleteUsersandAdmins/${id}`);
        toast.success('User deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-container">
        <div className="user-header">
          <Users className="header-icon" />
          <div>
            <h1>User Management</h1>
            <p>Manage users and administrators</p>
          </div>
        </div>

        <div className="user-tabs">
          <button 
            className={activeTab === 'users' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('users')}
          >
            <User className="tab-icon" />
            Users ({users.length})
          </button>
          <button 
            className={activeTab === 'admins' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('admins')}
          >
            <Shield className="tab-icon" />
            Admins ({admins.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Regular Users</h2>
              <p>Users who can browse and purchase products</p>
            </div>

            <div className="users-table">
              <div className="table-header">
                <div className="table-cell">Username</div>
                <div className="table-cell">Email</div>
                <div className="table-cell">Role</div>
                <div className="table-cell">Actions</div>
              </div>

              {users.map((user) => (
                <div key={user._id} className="table-row">
                  <div className="table-cell">
                    <div className="user-info">
                      <div className="user-avatar">
                        <User className="avatar-icon" />
                      </div>
                      <span>{user.Username}</span>
                    </div>
                  </div>
                  <div className="table-cell">{user.Email}</div>
                  <div className="table-cell">
                    <span className="role-badge user">{user.role}</span>
                  </div>
                  <div className="table-cell">
                    <div className="action-buttons">
                      <button 
                        className="delete-btn"
                        onClick={() => deleteUser(user._id)}
                      >
                        <Trash2 className="btn-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {users.length === 0 && (
                <div className="empty-table">
                  <User className="empty-icon" />
                  <p>No users found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admins Tab */}
        {activeTab === 'admins' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Administrators</h2>
              <button 
                className="add-btn"
                onClick={() => {
                  setUserForm({
                    Username: '',
                    Email: '',
                    password: '',
                    role: 'admin',
                    id: null
                  });
                  setShowModal(true);
                }}
              >
                <Plus className="btn-icon" />
                Add Admin
              </button>
            </div>

            <div className="users-table">
              <div className="table-header">
                <div className="table-cell">Username</div>
                <div className="table-cell">Email</div>
                <div className="table-cell">Role</div>
                <div className="table-cell">Actions</div>
              </div>

              {admins.map((admin) => (
                <div key={admin._id} className="table-row">
                  <div className="table-cell">
                    <div className="user-info">
                      <div className="user-avatar admin">
                        <Shield className="avatar-icon" />
                      </div>
                      <span>{admin.Username}</span>
                    </div>
                  </div>
                  <div className="table-cell">{admin.Email}</div>
                  <div className="table-cell">
                    <span className="role-badge admin">{admin.role}</span>
                  </div>
                  <div className="table-cell">
                    <div className="action-buttons">
                      <button 
                        className="edit-btn"
                        onClick={() => {
                          setUserForm({
                            Username: admin.Username,
                            Email: admin.Email,
                            password: '',
                            role: 'admin',
                            id: admin._id
                          });
                          setShowModal(true);
                        }}
                      >
                        <Edit className="btn-icon" />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteUser(admin._id)}
                      >
                        <Trash2 className="btn-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {admins.length === 0 && (
                <div className="empty-table">
                  <Shield className="empty-icon" />
                  <p>No administrators found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{userForm.id ? 'Edit Administrator' : 'Add Administrator'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={userForm.Username}
                  onChange={(e) => setUserForm({...userForm, Username: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={userForm.Email}
                  onChange={(e) => setUserForm({...userForm, Email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password {userForm.id && '(leave blank to keep current)'}</label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                  required={!userForm.id}
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">
                  {userForm.id ? 'Update' : 'Create'} Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
