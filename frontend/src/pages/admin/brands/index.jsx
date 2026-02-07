import React, { useState } from 'react';
import AdminLayout from '@/layout/admin/AdminLayout';
import {
  useAdminGetAllBrandsQuery,
  useAdminDeleteBrandMutation,
} from '@/redux/features/admin/adminApi';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';

const AdminBrandsPage = () => {
  const { data, isLoading, error } = useAdminGetAllBrandsQuery();
  const [deleteBrand, { isLoading: isDeleting }] = useAdminDeleteBrandMutation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand? This will not delete associated products, but they will lose their brand reference.')) {
      try {
        await deleteBrand(id).unwrap();
        toast.success('Brand deleted successfully');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete brand');
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

  const brands = data?.result || [];
  const filteredBrands = brands.filter((brand) =>
    brand.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Brands Management</h1>
          <Link 
            href="/admin/brands/add"
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
            }}
          >
            + Add Brand
          </Link>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search brands by name, email, or location..."
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
                <th style={{ padding: '12px', textAlign: 'left' }}>Logo</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Website</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Location</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Products</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.map((brand) => (
                <tr key={brand._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px' }}>
                    {brand.logo && (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                      />
                    )}
                  </td>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{brand.name}</td>
                  <td style={{ padding: '12px' }}>{brand.email || '-'}</td>
                  <td style={{ padding: '12px' }}>
                    {brand.website ? (
                      <a href={brand.website} target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>
                        {brand.website}
                      </a>
                    ) : '-'}
                  </td>
                  <td style={{ padding: '12px' }}>{brand.location || '-'}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        backgroundColor: brand.status === 'active' ? '#d4edda' : '#f8d7da',
                        color: brand.status === 'active' ? '#155724' : '#721c24',
                      }}
                    >
                      {brand.status || 'active'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {Array.isArray(brand.products) ? brand.products.length : 0}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link 
                        href={`/admin/brands/edit/${brand._id}`}
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
                        onClick={() => handleDelete(brand._id)}
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

        {filteredBrands.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: '#7f8c8d' }}>
            {searchTerm ? 'No brands found matching your search' : 'No brands found'}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBrandsPage;
