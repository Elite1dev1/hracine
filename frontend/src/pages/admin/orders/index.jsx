import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import AdminImage from '@/components/admin/AdminImage';
import AdminLayout from '@/layout/admin/AdminLayout';
import { useAdminGetAllOrdersQuery, useAdminUpdateOrderStatusMutation } from '@/redux/features/admin/adminApi';
import { formatCurrency } from '@/utils/currency';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import ReactModal from 'react-modal';

const PAGE_SIZE = 10;
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancel', label: 'Cancelled' },
];
const STATUS_LABELS = { pending: 'Pending', processing: 'Processing', delivered: 'Delivered', cancel: 'Cancelled' };
const dateFormat = (date, includeTime = false) => date ? new Date(date).toLocaleString('en-NG', includeTime ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' }) : 'Date unavailable';
const Field = ({ label, value }) => <div className="admin-detail-field"><span>{label}</span><strong>{value || 'Not provided'}</strong></div>;

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;
  const items = Array.isArray(order.cart) ? order.cart : [];
  return <ReactModal isOpen onRequestClose={onClose} contentLabel={`Order details for invoice ${order.invoice || ''}`} className="admin-order-modal" overlayClassName="admin-order-overlay" bodyOpenClassName="ReactModal__Body--open" ariaHideApp={false}>
    <header className="admin-modal-header">
      <div><span className="admin-eyebrow">ORDER DETAILS</span><h2>Invoice #{order.invoice}</h2><p>Placed {dateFormat(order.createdAt, true)}</p></div>
      <div className="admin-modal-header-actions"><span className={`admin-status-badge ${order.status || 'pending'}`}>{STATUS_LABELS[order.status] || order.status || 'Pending'}</span><button className="admin-icon-button" type="button" onClick={onClose} aria-label="Close order details">×</button></div>
    </header>
    <div className="admin-modal-content">
      <div className="admin-detail-grid">
        <section className="admin-detail-card"><h3>Customer information</h3><div className="admin-detail-fields"><Field label="Name" value={order.name} /><Field label="Email" value={order.email} /><Field label="Phone" value={order.contact} /></div></section>
        <section className="admin-detail-card"><h3>Delivery address</h3><div className="admin-detail-fields"><Field label="Street address" value={order.address} /><Field label="City" value={order.city} /><Field label="State" value={order.state} /><Field label="Country" value={order.country} /><Field label="Postal code" value={order.zipCode} /><Field label="Shipping method" value={order.shippingOption} /></div></section>
      </div>
      <section className="admin-detail-card admin-items-card"><div className="admin-detail-title"><h3>Order items</h3><span>{items.length} {items.length === 1 ? 'item' : 'items'}</span></div>
        <div className="admin-table-scroll"><table className="admin-table admin-items-table"><thead><tr><th>Product</th><th>Quantity</th><th>Unit price</th><th className="numeric">Line total</th></tr></thead><tbody>
          {items.length ? items.map((item, index) => { const image = item.img || item.imageURLs?.[0]?.img; const quantity = Number(item.orderQuantity || item.quantity || 1); const price = Number(item.price || item.salePrice || 0); return <tr key={item._id || `${item.name || item.title}-${index}`}><td><div className="admin-product-name">{image ? <AdminImage src={image} alt={item.name || item.title || 'Product'} /> : <span className="admin-product-placeholder">—</span>}<div><strong>{item.name || item.title || 'Product'}</strong>{item.sku && <small>SKU: {item.sku}</small>}</div></div></td><td>{quantity}</td><td>{formatCurrency(price)}</td><td className="numeric">{formatCurrency(price * quantity)}</td></tr>; }) : <tr><td colSpan="4" className="admin-inline-empty">No items found for this order.</td></tr>}
        </tbody></table></div>
      </section>
      <div className="admin-detail-grid admin-bottom-grid">
        <section className="admin-detail-card admin-payment-card"><h3>Payment summary</h3><div className="admin-summary-row"><span>Subtotal</span><strong>{formatCurrency(order.subTotal)}</strong></div><div className="admin-summary-row"><span>Shipping cost</span><strong>{formatCurrency(order.shippingCost)}</strong></div>{Number(order.discount) > 0 && <div className="admin-summary-row admin-discount-row"><span>Discount</span><strong>−{formatCurrency(order.discount)}</strong></div>}<div className="admin-summary-row admin-total-row"><span>Total amount</span><strong>{formatCurrency(order.totalAmount)}</strong></div><div className="admin-summary-meta"><span>Payment method</span><strong>{order.paymentMethod || 'Not provided'}</strong></div></section>
        <section className="admin-detail-card admin-current-status"><h3>Current order status</h3><span className={`admin-status-badge ${order.status || 'pending'}`}>{STATUS_LABELS[order.status] || order.status || 'Pending'}</span><p>Status shown reflects the latest order information available.</p>{order.orderNote && <div className="admin-order-note"><span>Order note</span><p>{order.orderNote}</p></div>}</section>
      </div>
    </div>
    <footer className="admin-modal-footer"><button className="admin-button secondary" type="button" onClick={onClose}>Close</button><Link className="admin-button primary" href={`/order/${order._id}`}>Open order page</Link></footer>
  </ReactModal>;
};

const AdminOrdersPage = () => {
  const { data, isLoading, error } = useAdminGetAllOrdersQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] = useAdminUpdateOrderStatusMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);

  const handleStatusChange = async (orderId, newStatus) => {
    try { await updateOrderStatus({ id: orderId, status: newStatus }).unwrap(); toast.success('Order status updated successfully'); }
    catch (updateError) { toast.error(updateError?.data?.message || 'Failed to update order status'); }
  };
  const orders = useMemo(() => data?.data || [], [data]);
  const filteredOrders = useMemo(() => orders.filter((order) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = !term || order.name?.toLowerCase().includes(term) || order.email?.toLowerCase().includes(term) || String(order.invoice || '').toLowerCase().includes(term);
    return matchesSearch && (statusFilter === 'all' || order.status === statusFilter);
  }), [orders, searchTerm, statusFilter]);
  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const visibleOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return <AdminLayout>
    <main className="admin-orders-page">
      <header className="admin-page-heading admin-orders-heading"><div><span className="admin-eyebrow">FULFILMENT</span><h1>Orders Management</h1><p>Review customer orders, update their status, and open order details.</p></div><span className="admin-order-count">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span></header>
      {isLoading ? <div className="admin-state"><ClipLoader size={38} color="#85312C" /><span>Loading orders…</span></div> : error ? <div className="admin-alert">Orders could not be loaded. Please refresh to try again.</div> : <>
        <section className="admin-card admin-orders-card">
          <div className="admin-order-toolbar"><label className="admin-search-control"><span aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg></span><input type="search" value={searchTerm} onChange={(event) => { setSearchTerm(event.target.value); setPage(1); }} placeholder="Search name, email, or invoice" aria-label="Search orders by customer name, email, or invoice" /></label>
            <label className="admin-filter-control"><span>Status</span><select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} aria-label="Filter orders by status"><option value="all">All statuses</option>{STATUS_OPTIONS.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></label>
            {(searchTerm || statusFilter !== 'all') && <button type="button" className="admin-reset-button" onClick={() => { setSearchTerm(''); setStatusFilter('all'); setPage(1); }}>Reset filters</button>}
          </div>
          <div className="admin-table-scroll"><table className="admin-table admin-orders-table"><thead><tr><th>Invoice</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead><tbody>
            {visibleOrders.map((order) => <tr key={order._id}><td><span className="admin-invoice-number">#{order.invoice}</span></td><td><div className="admin-customer-cell"><strong>{order.name || 'Customer'}</strong><span>{order.email || 'Email unavailable'}</span></div></td><td className="admin-order-total">{formatCurrency(order.totalAmount)}</td><td><span className={`admin-status-badge ${order.status || 'pending'}`}>{STATUS_LABELS[order.status] || order.status || 'Pending'}</span></td><td><time dateTime={order.createdAt}>{dateFormat(order.createdAt)}</time></td><td><div className="admin-order-actions"><select value={order.status || 'pending'} onChange={(event) => handleStatusChange(order._id, event.target.value)} disabled={isUpdating} aria-label={`Update status for invoice ${order.invoice}`}><option value={order.status} disabled>{STATUS_LABELS[order.status] || order.status || 'Pending'}</option>{STATUS_OPTIONS.filter((status) => status.value !== order.status).map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select><button type="button" className="admin-view-button" onClick={() => setSelectedOrder(order)}>View details</button></div></td></tr>)}
            {!visibleOrders.length && <tr><td colSpan="6"><div className="admin-empty-state"><strong>No orders found</strong><span>Try another search or reset the filters.</span></div></td></tr>}
          </tbody></table></div>
          {filteredOrders.length > 0 && <footer className="admin-pagination"><span>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length}</span><div><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} aria-label="Previous page">‹</button><span>Page {page} of {pageCount}</span><button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount} aria-label="Next page">›</button></div></footer>}
        </section>
      </>}
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </main>
  </AdminLayout>;
};

export default AdminOrdersPage;
