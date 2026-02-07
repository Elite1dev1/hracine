import React from 'react';
import AdminLayout from '@/layout/admin/AdminLayout';
import { useGetDashboardStatsQuery } from '@/redux/features/admin/adminApi';
import { ClipLoader } from 'react-spinners';
import Image from 'next/image';
import Link from 'next/link';

const AdminDashboard = () => {
  const { data, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <ClipLoader size={50} color="#3498db" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '50px', color: '#e74c3c' }}>
          Error loading dashboard data
        </div>
      </AdminLayout>
    );
  }

  const stats = data?.data || {};

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers || 0, icon: '👥', color: '#3498db' },
    { title: 'Total Orders', value: stats.totalOrders || 0, icon: '🛒', color: '#2ecc71' },
    { title: 'Total Products', value: stats.totalProducts || 0, icon: '📦', color: '#e67e22' },
    { title: 'Total Categories', value: stats.totalCategories || 0, icon: '📁', color: '#9b59b6' },
    { title: 'Total Blogs', value: stats.totalBlogs || 0, icon: '📝', color: '#1abc9c' },
    { title: 'Total Revenue', value: `₦${stats.revenue?.toFixed(2) || '0.00'}`, icon: '💰', color: '#27ae60' },
  ];

  const orderStats = [
    { title: 'Pending Orders', value: stats.pendingOrders || 0, color: '#f39c12' },
    { title: 'Processing Orders', value: stats.processingOrders || 0, color: '#3498db' },
    { title: 'Delivered Orders', value: stats.deliveredOrders || 0, color: '#2ecc71' },
  ];

  return (
    <AdminLayout>
      <div>
        <h1 style={{ marginBottom: '30px', color: '#2c3e50' }}>Dashboard Overview</h1>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
          }}
        >
          {statCards.map((stat, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${stat.color}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '10px' }}>{stat.title}</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2c3e50' }}>{stat.value}</div>
                </div>
                <div style={{ fontSize: '48px' }}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Status */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Order Status</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
            }}
          >
            {orderStats.map((stat, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  borderTop: `4px solid ${stat.color}`,
                }}
              >
                <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '10px' }}>{stat.title}</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Rated Products */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Top Rated Products</h2>
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {stats.topRatedProducts && stats.topRatedProducts.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Image</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Brand</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Rating</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Reviews</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topRatedProducts.map((product) => (
                      <tr key={product._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '12px' }}>
                          {product.img && (
                            <Image
                              src={product.img}
                              alt={product.title}
                              width={50}
                              height={50}
                              style={{ objectFit: 'cover', borderRadius: '5px' }}
                            />
                          )}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <Link
                            href={`/product-details/${product._id}`}
                            style={{ color: '#3498db', textDecoration: 'none' }}
                          >
                            {product.title}
                          </Link>
                        </td>
                        <td style={{ padding: '12px' }}>{product.brand}</td>
                        <td style={{ padding: '12px' }}>₦{product.price?.toFixed(2) || '0.00'}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontWeight: 'bold', color: '#f39c12' }}>
                            {product.rating?.toFixed(1) || '0.0'} ⭐
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>{product.reviewCount || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#7f8c8d' }}>
                No rated products yet
              </div>
            )}
          </div>
        </div>

        {/* Most Reviewed Products */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Most Reviewed Products</h2>
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {stats.mostReviewedProducts && stats.mostReviewedProducts.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Image</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Brand</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Rating</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Reviews</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.mostReviewedProducts.map((product) => (
                      <tr key={product._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '12px' }}>
                          {product.img && (
                            <Image
                              src={product.img}
                              alt={product.title}
                              width={50}
                              height={50}
                              style={{ objectFit: 'cover', borderRadius: '5px' }}
                            />
                          )}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <Link
                            href={`/product-details/${product._id}`}
                            style={{ color: '#3498db', textDecoration: 'none' }}
                          >
                            {product.title}
                          </Link>
                        </td>
                        <td style={{ padding: '12px' }}>{product.brand}</td>
                        <td style={{ padding: '12px' }}>₦{product.price?.toFixed(2) || '0.00'}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontWeight: 'bold', color: '#f39c12' }}>
                            {product.rating?.toFixed(1) || '0.0'} ⭐
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#3498db' }}>
                          {product.reviewCount || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#7f8c8d' }}>
                No reviewed products yet
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
