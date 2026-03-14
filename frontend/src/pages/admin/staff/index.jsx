import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layout/admin/AdminLayout';
import Link from 'next/link';
import { toast } from 'react-toastify';
import api from '@/lib/api';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Fetch staff list
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/staff/all');
      setStaff(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load staff');
      toast.error('Failed to load staff list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddNew = () => {
    setEditingStaff(null);
    setShowModal(true);
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStaff(null);
  };

  const handleStaffSaved = () => {
    fetchStaff();
    handleCloseModal();
  };

  const handleStatusChange = async (staffId, newStatus) => {
    try {
      await api.patch(`/api/admin/staff/status/${staffId}`, { status: newStatus });
      toast.success(`Staff status updated to ${newStatus}`);
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) {
      return;
    }

    try {
      await api.delete(`/api/admin/staff/${staffId}`);
      toast.success('Staff member deleted successfully');
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete staff');
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'Super Admin': '#e74c3c',
      'Order Manager': '#3498db',
      'Store Manager': '#2ecc71',
      'Support Staff': '#f39c12',
    };
    return colors[role] || '#95a5a6';
  };

  const getStatusBadgeColor = (status) => {
    return status === 'Active' ? '#2ecc71' : '#e74c3c';
  };

  // Filter staff
  const filteredStaff = staff.filter(s => {
    if (filterRole && s.role !== filterRole) return false;
    if (filterStatus && s.status !== filterStatus) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            marginBottom: 0,
            color: '#2c3e50',
            fontSize: 'clamp(1.5rem, 2vw, 1.95rem)',
            lineHeight: 1.25,
          }}>
            Staff Management
          </h1>
          <button
            onClick={handleAddNew}
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            + Add New Staff
          </button>
        </div>

        {/* Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '20px',
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#7f8c8d', fontSize: '14px' }}>
              Filter by Role
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #bdc3c7',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              <option value="">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Order Manager">Order Manager</option>
              <option value="Store Manager">Store Manager</option>
              <option value="Support Staff">Support Staff</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#7f8c8d', fontSize: '14px' }}>
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #bdc3c7',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Staff Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading staff list...</p>
          </div>
        ) : error ? (
          <div style={{
            backgroundColor: '#ffe6e6',
            color: '#c0392b',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        ) : filteredStaff.length > 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#2c3e50', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#2c3e50', fontWeight: '600' }}>Email</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#2c3e50', fontWeight: '600' }}>Role</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#2c3e50', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#2c3e50', fontWeight: '600' }}>Created Date</th>
                  <th style={{ padding: '15px', textAlign: 'center', color: '#2c3e50', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staffMember) => (
                  <tr key={staffMember._id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '15px', color: '#2c3e50' }}>
                      <div style={{ fontWeight: '600' }}>{staffMember.name}</div>
                    </td>
                    <td style={{ padding: '15px', color: '#7f8c8d' }}>{staffMember.email}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        backgroundColor: getRoleBadgeColor(staffMember.role),
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {staffMember.role}
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        backgroundColor: getStatusBadgeColor(staffMember.status),
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {staffMember.status}
                      </span>
                    </td>
                    <td style={{ padding: '15px', color: '#7f8c8d' }}>
                      {new Date(staffMember.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEdit(staffMember)}
                          style={{
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleStatusChange(
                            staffMember._id,
                            staffMember.status === 'Active' ? 'Inactive' : 'Active'
                          )}
                          style={{
                            backgroundColor: staffMember.status === 'Active' ? '#e67e22' : '#2ecc71',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                          onMouseLeave={(e) => e.target.style.opacity = '1'}
                        >
                          {staffMember.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(staffMember._id)}
                          style={{
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#ecf0f1',
            padding: '40px',
            borderRadius: '5px',
            textAlign: 'center',
            color: '#7f8c8d'
          }}>
            <p>No staff members found. Click &quot;Add New Staff&quot; to create one.</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <StaffModal
            staff={editingStaff}
            onClose={handleCloseModal}
            onSave={handleStaffSaved}
          />
        )}
      </div>
    </AdminLayout>
  );
};

// Add/Edit Staff Modal Component
const StaffModal = ({ staff, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Order Manager',
    status: 'Active',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name,
        email: staff.email,
        password: '',
        role: staff.role,
        status: staff.status,
        phone: staff.phone || '',
      });
    }
  }, [staff]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!staff && !formData.password) newErrors.password = 'Password is required';
    if (formData.email && !formData.email.includes('@')) newErrors.email = 'Invalid email';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const url = staff ? `/api/admin/staff/${staff._id}` : '/api/admin/staff/add';
      const method = staff ? 'patch' : 'post';

      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        phone: formData.phone,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      await api[method](url, payload);
      toast.success(staff ? 'Staff updated successfully' : 'Staff added successfully');
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save staff');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>
            {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#7f8c8d'
            }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#2c3e50', fontWeight: '600' }}>
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: errors.name ? '2px solid #e74c3c' : '1px solid #bdc3c7',
                borderRadius: '5px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Enter staff name"
            />
            {errors.name && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.name}</p>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#2c3e50', fontWeight: '600' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!!staff}
              style={{
                width: '100%',
                padding: '10px',
                border: errors.email ? '2px solid #e74c3c' : '1px solid #bdc3c7',
                borderRadius: '5px',
                fontSize: '14px',
                boxSizing: 'border-box',
                backgroundColor: staff ? '#f5f5f5' : 'white'
              }}
              placeholder="Enter email address"
            />
            {errors.email && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.email}</p>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#2c3e50', fontWeight: '600' }}>
              Password {staff ? '(leave empty to keep current)' : '*'}
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  paddingRight: '40px',
                  border: errors.password ? '2px solid #e74c3c' : '1px solid #bdc3c7',
                  borderRadius: '5px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder={staff ? 'Leave empty to keep current password' : 'Enter password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  fontSize: '18px',
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.password}</p>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#2c3e50', fontWeight: '600' }}>
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #bdc3c7',
                borderRadius: '5px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Enter phone number"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#2c3e50', fontWeight: '600' }}>
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #bdc3c7',
                borderRadius: '5px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Order Manager">Order Manager</option>
              <option value="Store Manager">Store Manager</option>
              <option value="Support Staff">Support Staff</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#2c3e50', fontWeight: '600' }}>
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #bdc3c7',
                borderRadius: '5px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: loading ? '#95a5a6' : '#3498db',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? 'Saving...' : 'Save Staff Member'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: '#ecf0f1',
                color: '#7f8c8d',
                border: 'none',
                padding: '12px',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffManagement;
