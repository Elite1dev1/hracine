import React, { useState } from 'react';
import AdminLayout from '@/layout/admin/AdminLayout';
import {
  useAdminGetAllOrdersQuery,
  useAdminUpdateOrderStatusMutation,
} from '@/redux/features/admin/adminApi';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import ReactModal from 'react-modal';

const AdminOrdersPage = () => {
  const { data, isLoading, error } = useAdminGetAllOrdersQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] = useAdminUpdateOrderStatusMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update order status');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
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

  const orders = data?.data || [];
  const filteredOrders = orders.filter(
    (order) =>
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.invoice?.toString().includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div>
        <h1 style={{ marginBottom: '20px', color: '#2c3e50' }}>Orders Management</h1>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search orders by name, email, or invoice..."
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
                <th style={{ padding: '12px', textAlign: 'left' }}>Invoice</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Customer</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Total</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px' }}>#{order.invoice}</td>
                  <td style={{ padding: '12px' }}>{order.name}</td>
                  <td style={{ padding: '12px' }}>{order.email}</td>
                  <td style={{ padding: '12px' }}>₦{order.totalAmount?.toFixed(2)}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        backgroundColor:
                          order.status === 'delivered'
                            ? '#d4edda'
                            : order.status === 'processing'
                            ? '#d1ecf1'
                            : order.status === 'cancel'
                            ? '#f8d7da'
                            : '#fff3cd',
                        color:
                          order.status === 'delivered'
                            ? '#155724'
                            : order.status === 'processing'
                            ? '#0c5460'
                            : order.status === 'cancel'
                            ? '#721c24'
                            : '#856404',
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={isUpdating}
                        style={{
                          padding: '5px 10px',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          cursor: isUpdating ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancel">Cancel</option>
                      </select>
                      <button
                        onClick={() => handleViewOrder(order)}
                        style={{
                          padding: '5px 15px',
                          backgroundColor: '#3498db',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#2980b9')}
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#3498db')}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: '#7f8c8d' }}>
            No orders found
          </div>
        )}

        {/* Order Details Modal */}
        <ReactModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '30px',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          }}
          contentLabel="Order Details"
        >
          {selectedOrder && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#2c3e50' }}>Order Details - Invoice #{selectedOrder.invoice}</h2>
                <button
                  onClick={closeModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#7f8c8d',
                    padding: '0',
                    width: '30px',
                    height: '30px',
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'grid', gap: '20px' }}>
                {/* Customer Information */}
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#2c3e50', fontSize: '18px' }}>Customer Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <div>
                      <strong>Name:</strong> {selectedOrder.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedOrder.email}
                    </div>
                    <div>
                      <strong>Contact:</strong> {selectedOrder.contact}
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#2c3e50', fontSize: '18px' }}>Delivery Address</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <div>
                      <strong>Address:</strong> {selectedOrder.address}
                    </div>
                    <div>
                      <strong>City:</strong> {selectedOrder.city}
                    </div>
                    <div>
                      <strong>Country:</strong> {selectedOrder.country}
                    </div>
                    <div>
                      <strong>Zip Code:</strong> {selectedOrder.zipCode}
                    </div>
                    {selectedOrder.shippingOption && (
                      <div>
                        <strong>Shipping Option:</strong> {selectedOrder.shippingOption}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#2c3e50', fontSize: '18px' }}>Order Items</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#e9ecef', borderBottom: '2px solid #dee2e6' }}>
                          <th style={{ padding: '10px', textAlign: 'left' }}>Image</th>
                          <th style={{ padding: '10px', textAlign: 'left' }}>Product</th>
                          <th style={{ padding: '10px', textAlign: 'left' }}>Quantity</th>
                          <th style={{ padding: '10px', textAlign: 'right' }}>Price</th>
                          <th style={{ padding: '10px', textAlign: 'right' }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.cart && selectedOrder.cart.length > 0 ? (
                          selectedOrder.cart.map((item, index) => {
                            const productImage = item.img || item.imageURLs?.[0]?.img || '/assets/img/product/product-1.jpg';
                            return (
                              <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                                <td style={{ padding: '10px' }}>
                                  <div style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    position: 'relative',
                                    borderRadius: '5px',
                                    overflow: 'hidden',
                                    backgroundColor: '#f8f9fa',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    {productImage ? (
                                      <img
                                        src={productImage}
                                        alt={item.name || item.title || 'Product'}
                                        style={{ 
                                          width: '100%', 
                                          height: '100%', 
                                          objectFit: 'cover',
                                          display: 'block'
                                        }}
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                          e.target.nextSibling.style.display = 'flex';
                                        }}
                                      />
                                    ) : null}
                                    <div style={{ 
                                      display: productImage ? 'none' : 'flex',
                                      width: '100%', 
                                      height: '100%', 
                                      alignItems: 'center', 
                                      justifyContent: 'center',
                                      fontSize: '24px',
                                      color: '#6c757d'
                                    }}>
                                      📦
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: '10px' }}>
                                  <div>
                                    <strong>{item.name || item.title || 'Product'}</strong>
                                    {item.sku && <div style={{ fontSize: '12px', color: '#7f8c8d' }}>SKU: {item.sku}</div>}
                                  </div>
                                </td>
                                <td style={{ padding: '10px' }}>{item.orderQuantity || item.quantity || 1}</td>
                                <td style={{ padding: '10px', textAlign: 'right' }}>
                                  ₦{(item.price || item.salePrice || 0).toFixed(2)}
                                </td>
                                <td style={{ padding: '10px', textAlign: 'right' }}>
                                  ₦{((item.price || item.salePrice || 0) * (item.orderQuantity || item.quantity || 1)).toFixed(2)}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" style={{ padding: '10px', textAlign: 'center', color: '#7f8c8d' }}>
                              No items found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Payment & Order Summary */}
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#2c3e50', fontSize: '18px' }}>Payment & Order Summary</h3>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>Subtotal:</strong>
                      <span>₦{selectedOrder.subTotal?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>Shipping Cost:</strong>
                      <span>₦{selectedOrder.shippingCost?.toFixed(2) || '0.00'}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#28a745' }}>
                        <strong>Discount:</strong>
                        <span>-₦{selectedOrder.discount?.toFixed(2) || '0.00'}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', paddingTop: '10px', borderTop: '2px solid #dee2e6' }}>
                      <strong>Total Amount:</strong>
                      <span>₦{selectedOrder.totalAmount?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <strong>Payment Method:</strong> {selectedOrder.paymentMethod || 'N/A'}
                    </div>
                    <div>
                      <strong>Order Status:</strong>{' '}
                      <span
                        style={{
                          padding: '5px 10px',
                          borderRadius: '5px',
                          fontSize: '12px',
                          backgroundColor:
                            selectedOrder.status === 'delivered'
                              ? '#d4edda'
                              : selectedOrder.status === 'processing'
                              ? '#d1ecf1'
                              : selectedOrder.status === 'cancel'
                              ? '#f8d7da'
                              : '#fff3cd',
                          color:
                            selectedOrder.status === 'delivered'
                              ? '#155724'
                              : selectedOrder.status === 'processing'
                              ? '#0c5460'
                              : selectedOrder.status === 'cancel'
                              ? '#721c24'
                              : '#856404',
                          textTransform: 'capitalize',
                        }}
                      >
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div>
                      <strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
                    </div>
                    {selectedOrder.orderNote && (
                      <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff', borderRadius: '5px' }}>
                        <strong>Order Note:</strong>
                        <div style={{ marginTop: '5px', color: '#495057' }}>{selectedOrder.orderNote}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </ReactModal>
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
