import React, { useState } from 'react';
import AdminLayout from '@/layout/admin/AdminLayout';
import {
  useAdminGetAllCouponsQuery,
  useAdminDeleteCouponMutation,
} from '@/redux/features/admin/adminApi';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';
import * as dayjs from 'dayjs';

const AdminCouponsPage = () => {
  const { data, isLoading, error } = useAdminGetAllCouponsQuery();
  const [deleteCoupon, { isLoading: isDeleting }] = useAdminDeleteCouponMutation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon(id).unwrap();
        toast.success('Coupon deleted successfully');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete coupon');
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

  const coupons = data || [];
  const filteredCoupons = coupons.filter((coupon) =>
    coupon.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.couponCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Coupons Management</h1>
          <Link 
            href="/admin/coupons/add"
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
            }}
          >
            + Add Coupon
          </Link>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search coupons by title or code..."
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
                <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Coupon Code</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Discount</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Min Amount</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Product Type</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>End Time</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((coupon) => {
                const isExpired = dayjs().isAfter(dayjs(coupon.endTime));
                const isActive = coupon.status === 'active' && !isExpired;
                
                return (
                  <tr key={coupon._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>
                      {coupon.logo && (
                        <img
                          src={coupon.logo}
                          alt={coupon.title}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                        />
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>{coupon.title}</td>
                    <td style={{ padding: '12px' }}>
                      <code style={{ 
                        padding: '4px 8px', 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: '3px',
                        fontFamily: 'monospace'
                      }}>
                        {coupon.couponCode}
                      </code>
                    </td>
                    <td style={{ padding: '12px' }}>{coupon.discountPercentage}%</td>
                    <td style={{ padding: '12px' }}>₦{coupon.minimumAmount}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '3px',
                        fontSize: '12px',
                        textTransform: 'capitalize'
                      }}>
                        {coupon.productType}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {dayjs(coupon.endTime).format('MMM DD, YYYY HH:mm')}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          padding: '5px 10px',
                          borderRadius: '5px',
                          fontSize: '12px',
                          backgroundColor: isActive ? '#d4edda' : '#f8d7da',
                          color: isActive ? '#155724' : '#721c24',
                        }}
                      >
                        {isExpired ? 'Expired' : coupon.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Link 
                          href={`/admin/coupons/edit/${coupon._id}`}
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
                          onClick={() => handleDelete(coupon._id)}
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
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCoupons.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: '#7f8c8d' }}>
            {searchTerm ? 'No coupons found matching your search' : 'No coupons found'}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCouponsPage;
