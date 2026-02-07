import React, { useState } from 'react';
import AdminLayout from '@/layout/admin/AdminLayout';
import {
  useAdminGetAllUsersQuery,
  useAdminUpdateUserStatusMutation,
} from '@/redux/features/admin/adminApi';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const AdminUsersPage = () => {
  const { data, isLoading, error } = useAdminGetAllUsersQuery();
  const [updateUserStatus, { isLoading: isUpdating }] = useAdminUpdateUserStatusMutation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateUserStatus({ id: userId, status: newStatus }).unwrap();
      toast.success('User status updated successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update user status');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <ClipLoader size={50} color="#3498db" />
        </div>
      </AdminLayout>
    );
  }

  const users = data?.data || [];
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div>
        <h1 style={{ marginBottom: '20px', color: '#2c3e50' }}>Users Management</h1>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
            }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px' }}>{user.name}</td>
                  <td style={{ padding: '12px' }}>{user.email}</td>
                  <td style={{ padding: '12px' }}>{user.phone || '-'}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        backgroundColor:
                          user.status === 'active'
                            ? '#d4edda'
                            : user.status === 'blocked'
                            ? '#f8d7da'
                            : '#fff3cd',
                        color:
                          user.status === 'active'
                            ? '#155724'
                            : user.status === 'blocked'
                            ? '#721c24'
                            : '#856404',
                      }}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{user.role || 'user'}</td>
                  <td style={{ padding: '12px' }}>
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user._id, e.target.value)}
                      disabled={isUpdating}
                      style={{
                        padding: '5px 10px',
                        border: '1px solid #ddd',
                        borderRadius: '3px',
                        cursor: isUpdating ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: '#7f8c8d' }}>
            No users found
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
