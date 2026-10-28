import React from 'react';
import AdminLayout from '@/layout/admin/AdminLayout';
import { useGetDashboardStatsQuery } from '@/redux/features/admin/adminApi';
import { ClipLoader } from 'react-spinners';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/utils/currency';

const Icon = ({ name }) => {
  const paths = {
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    orders: <><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></>,
    products: <><path d="m21 16-9 5-9-5V8l9-5 9 5z"/><path d="m3.3 7.5 8.7 5 8.7-5M12 22V12.5"/></>,
    categories: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></>,
    blogs: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></>,
    revenue: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/></>,
    pending: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
    processing: <><path d="M12 8v4l3 2"/><circle cx="12" cy="12" r="10"/></>,
    delivered: <><path d="m5 12 4 4L19 6"/><circle cx="12" cy="12" r="10"/></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>,
  };
  return <svg className="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

const ProductTable = ({ title, products, emptyText, reviewCountEmphasis = false }) => (
  <section className="admin-card admin-product-section">
    <div className="admin-section-heading"><div><h2>{title}</h2><p>Product performance at a glance</p></div></div>
    {products?.length ? <div className="admin-table-scroll"><table className="admin-table admin-products-table">
      <thead><tr><th>Product</th><th>Brand</th><th>Price</th><th>Rating</th><th>Reviews</th></tr></thead>
      <tbody>{products.map((product) => <tr key={product._id}>
        <td><div className="admin-product-name">{product.img ? <Image src={product.img} alt={product.title || 'Product'} width={48} height={48} /> : <span className="admin-product-placeholder"><Icon name="products" /></span>}<Link href={`/product-details/${product._id}`}>{product.title}</Link></div></td>
        <td>{product.brand || '—'}</td><td>{formatCurrency(product.price)}</td>
        <td><span className="admin-rating"><Icon name="star" />{Number(product.rating || 0).toFixed(1)}</span></td>
        <td className={reviewCountEmphasis ? 'admin-review-count' : ''}>{product.reviewCount || 0}</td>
      </tr>)}</tbody>
    </table></div> : <div className="admin-empty-state">{emptyText}</div>}
  </section>
);

const AdminDashboard = () => {
  const { data, isLoading, error } = useGetDashboardStatsQuery();
  if (isLoading) return <AdminLayout><div className="admin-state"><ClipLoader size={38} color="#85312C" /><span>Loading dashboard…</span></div></AdminLayout>;
  if (error) return <AdminLayout><div className="admin-alert">Dashboard data could not be loaded. Please refresh to try again.</div></AdminLayout>;

  const stats = data?.data || {};
  const cards = [
    { label: 'Total Users', value: stats.totalUsers || 0, icon: 'users' },
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: 'orders' },
    { label: 'Total Products', value: stats.totalProducts || 0, icon: 'products' },
    { label: 'Total Categories', value: stats.totalCategories || 0, icon: 'categories' },
    { label: 'Total Blogs', value: stats.totalBlogs || 0, icon: 'blogs' },
  ];
  const statuses = [
    { label: 'Pending Orders', value: stats.pendingOrders || 0, icon: 'pending', kind: 'pending' },
    { label: 'Processing Orders', value: stats.processingOrders || 0, icon: 'processing', kind: 'processing' },
    { label: 'Delivered Orders', value: stats.deliveredOrders || 0, icon: 'delivered', kind: 'delivered' },
  ];

  return <AdminLayout>
    <div className="admin-dashboard">
      <header className="admin-page-heading"><div><span className="admin-eyebrow">STORE OVERVIEW</span><h1>Dashboard Overview</h1><p>A clear view of your store’s activity and performance.</p></div></header>
      <section className="admin-stat-grid" aria-label="Store totals">
        {cards.map((card) => <article className="admin-stat-card" key={card.label}><span className="admin-stat-icon"><Icon name={card.icon} /></span><div><p>{card.label}</p><strong>{card.value}</strong></div></article>)}
      </section>
      <section className="admin-overview-grid">
        <article className="admin-revenue-card"><div className="admin-revenue-top"><span className="admin-stat-icon"><Icon name="revenue" /></span><div><p>Total Revenue</p><strong>{formatCurrency(stats.revenue)}</strong></div></div><span className="admin-revenue-caption">Revenue recorded across your store</span></article>
        <article className="admin-card admin-status-card"><div className="admin-section-heading"><div><h2>Order Status</h2><p>Current order counts</p></div><Link href="/admin/orders">Manage orders</Link></div><div className="admin-order-status-grid">{statuses.map((status) => <div className={`admin-order-status ${status.kind}`} key={status.label}><span className="admin-status-icon"><Icon name={status.icon} /></span><span>{status.label}</span><strong>{status.value}</strong></div>)}</div></article>
      </section>
      <ProductTable title="Top Rated Products" products={stats.topRatedProducts} emptyText="No rated products yet." />
      <ProductTable title="Most Reviewed Products" products={stats.mostReviewedProducts} emptyText="No reviewed products yet." reviewCountEmphasis />
    </div>
  </AdminLayout>;
};

export default AdminDashboard;
