import React, { useState } from 'react';
import AdminLayout from '@/layout/admin/AdminLayout';
import {
  useGetAllConsultationsQuery,
  useUpdateConsultationStatusMutation,
  useDeleteConsultationMutation,
} from '@/redux/features/consultationApi';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const AdminConsultationsPage = () => {
  const { data, isLoading, error, refetch } = useGetAllConsultationsQuery();
  
  // Debug logging
  React.useEffect(() => {
    if (error) {
      console.error('Consultation fetch error:', error);
      console.error('Error status:', error?.status);
      console.error('Error data:', error?.data);
    }
    if (data) {
      console.log('Consultation data received:', data);
    }
  }, [error, data]);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateConsultationStatusMutation();
  const [deleteConsultation, { isLoading: isDeleting }] = useDeleteConsultationMutation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success('Consultation status updated successfully');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update consultation status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this consultation?')) {
      try {
        await deleteConsultation(id).unwrap();
        toast.success('Consultation deleted successfully');
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete consultation');
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

  if (error) {
    console.error('Consultation error:', error);
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '50px', color: '#e74c3c' }}>
          <div>Error loading consultations</div>
          <div style={{ marginTop: '20px', fontSize: '14px', color: '#7f8c8d' }}>
            {error?.data?.message || error?.message || 'Unknown error'}
          </div>
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#95a5a6' }}>
            Status: {error?.status || 'N/A'}
          </div>
        </div>
      </AdminLayout>
    );
  }

  const consultations = data?.data || [];
  const filteredConsultations = consultations.filter(
    (consultation) =>
      consultation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return { bg: '#d1ecf1', color: '#0c5460' };
      case 'completed':
        return { bg: '#d4edda', color: '#155724' };
      case 'cancelled':
        return { bg: '#f8d7da', color: '#721c24' };
      default:
        return { bg: '#fff3cd', color: '#856404' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AdminLayout>
      <div>
        <h1 style={{ marginBottom: '20px', color: '#2c3e50' }}>Consultations Management</h1>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search consultations by name, email, or phone..."
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

        <div style={{ marginBottom: '20px', color: '#7f8c8d' }}>
          Total Consultations: {filteredConsultations.length}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Concern</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Style</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Preferred Date</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Preferred Time</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Booked Date</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredConsultations.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
                    No consultations found
                  </td>
                </tr>
              ) : (
                filteredConsultations.map((consultation) => {
                  const statusColors = getStatusColor(consultation.status);
                  return (
                    <tr key={consultation._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>{consultation.name}</td>
                      <td style={{ padding: '12px' }}>{consultation.email}</td>
                      <td style={{ padding: '12px' }}>{consultation.phone || 'N/A'}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ textTransform: 'capitalize' }}>
                          {consultation.biggestConcern?.replace('-', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textTransform: 'capitalize' }}>
                        {consultation.protectiveStyle}
                      </td>
                      <td style={{ padding: '12px' }}>{formatDate(consultation.preferredDate)}</td>
                      <td style={{ padding: '12px' }}>{consultation.preferredTime}</td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            padding: '5px 10px',
                            borderRadius: '5px',
                            fontSize: '12px',
                            backgroundColor: statusColors.bg,
                            color: statusColors.color,
                            textTransform: 'capitalize',
                          }}
                        >
                          {consultation.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>{formatDate(consultation.createdAt)}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <select
                            value={consultation.status}
                            onChange={(e) => handleStatusChange(consultation._id, e.target.value)}
                            disabled={isUpdating}
                            style={{
                              padding: '5px 10px',
                              border: '1px solid #ddd',
                              borderRadius: '5px',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => handleDelete(consultation._id)}
                            disabled={isDeleting}
                            style={{
                              padding: '5px 10px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '12px',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Consultation Details Modal/Expansion */}
        {filteredConsultations.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Consultation Details</h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              {filteredConsultations.map((consultation) => (
                <div
                  key={consultation._id}
                  style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <h3 style={{ color: '#2c3e50', margin: 0 }}>{consultation.name}</h3>
                    <span
                      style={{
                        padding: '5px 15px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        backgroundColor: getStatusColor(consultation.status).bg,
                        color: getStatusColor(consultation.status).color,
                        textTransform: 'capitalize',
                      }}
                    >
                      {consultation.status}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                    <div>
                      <strong>Email:</strong> {consultation.email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {consultation.phone || 'N/A'}
                    </div>
                    <div>
                      <strong>Biggest Concern:</strong>{' '}
                      <span style={{ textTransform: 'capitalize' }}>
                        {consultation.biggestConcern?.replace('-', ' ')}
                      </span>
                    </div>
                    <div>
                      <strong>Protective Style:</strong>{' '}
                      <span style={{ textTransform: 'capitalize' }}>{consultation.protectiveStyle}</span>
                    </div>
                    <div>
                      <strong>Preferred Date:</strong> {formatDate(consultation.preferredDate)}
                    </div>
                    <div>
                      <strong>Preferred Time:</strong> {consultation.preferredTime}
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <strong>Notes:</strong>{' '}
                      <span style={{ color: '#7f8c8d' }}>
                        {consultation.notes || 'No additional notes provided'}
                      </span>
                    </div>
                    <div>
                      <strong>Booked On:</strong> {formatDate(consultation.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminConsultationsPage;
