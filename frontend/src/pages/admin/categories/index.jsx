import React, { useState } from 'react';
import AdminLayout from '@/layout/admin/AdminLayout';
import {
  useAdminGetAllCategoriesQuery,
  useAdminDeleteCategoryMutation,
} from '@/redux/features/admin/adminApi';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';

const AdminCategoriesPage = () => {
  const { data, isLoading, error } = useAdminGetAllCategoriesQuery();
  const [deleteCategory, { isLoading: isDeleting }] = useAdminDeleteCategoryMutation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id).unwrap();
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete category');
      }
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

  const categories = data?.result || [];
  const filteredCategories = categories.filter((category) =>
    category.parent?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Categories Management</h1>
          <Link 
            href="/admin/categories/add"
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
            }}
          >
            + Add Category
          </Link>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search categories..."
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
                <th style={{ padding: '12px', textAlign: 'left' }}>Image</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Parent</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Children</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Product Type</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px' }}>
                    {category.img && (
                      <img
                        src={category.img}
                        alt={category.parent}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                      />
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>{category.parent}</td>
                  <td style={{ padding: '12px' }}>
                    {Array.isArray(category.children) ? category.children.join(', ') : category.children}
                  </td>
                  <td style={{ padding: '12px' }}>{category.productType}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        backgroundColor: category.status === 'Show' ? '#d4edda' : '#f8d7da',
                        color: category.status === 'Show' ? '#155724' : '#721c24',
                      }}
                    >
                      {category.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link 
                        href={`/admin/categories/edit/${category._id}`}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#3498db',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '3px',
                          fontSize: '14px',
                        }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(category._id)}
                        disabled={isDeleting}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
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

        {filteredCategories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: '#7f8c8d' }}>
            No categories found
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategoriesPage;
