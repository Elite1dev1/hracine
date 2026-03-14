import React, { useState, useMemo } from 'react';
import AdminLayout from '@/layout/admin/AdminLayout';
import {
  useGetAllConsultationsQuery,
  useUpdateConsultationStatusMutation,
  useDeleteConsultationMutation,
} from '@/redux/features/consultationApi';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import ReactModal from 'react-modal';
import dayjs from 'dayjs';

const AdminConsultationsPage = () => {
  const { data, isLoading, error, refetch } = useGetAllConsultationsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateConsultationStatusMutation();
  const [deleteConsultation, { isLoading: isDeleting }] = useDeleteConsultationMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const consultations = data?.data || [];

  // Calculate metrics - Move this hook up before any conditional returns
  const metrics = useMemo(() => {
    const today = dayjs().startOf('day');
    const todayEnd = dayjs().endOf('day');
    
    return {
      total: consultations.length,
      pending: consultations.filter(c => c.status === 'pending').length,
      completed: consultations.filter(c => c.status === 'completed').length,
      today: consultations.filter(c => {
        const createdDate = dayjs(c.createdAt);
        return createdDate.isAfter(today) && createdDate.isBefore(todayEnd);
      }).length
    };
  }, [consultations]);

  // Filter consultations - Move this hook up as well
  const filteredConsultations = useMemo(() => {
    let filtered = consultations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (consultation) =>
          consultation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consultation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consultation.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = dayjs().startOf('day');
      filtered = filtered.filter(c => {
        const createdDate = dayjs(c.createdAt);
        switch (dateFilter) {
          case 'today':
            return createdDate.isAfter(today) && createdDate.isBefore(today.endOf('day'));
          case 'week':
            return createdDate.isAfter(today.startOf('week'));
          case 'month':
            return createdDate.isAfter(today.startOf('month'));
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [consultations, searchTerm, statusFilter, dateFilter]);

  // Pagination - Move this hook up as well
  const paginatedConsultations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredConsultations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredConsultations, currentPage]);

  const totalPages = Math.ceil(filteredConsultations.length / itemsPerPage);

  // Helper functions - Move these after all hooks
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return { bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' };
      case 'completed':
        return { bg: '#dcfce7', color: '#166534', border: '#22c55e' };
      case 'cancelled':
        return { bg: '#fef2f2', color: '#991b1b', border: '#ef4444' };
      default:
        return { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dayjs(dateString).format('MMM D, YYYY');
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return dayjs(`2000-01-01 ${timeString}`).format('h:mm A');
  };

  const getInitials = (name) => {
    if (!name) return 'NA';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Event handlers
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

  const openModal = (consultation) => {
    setSelectedConsultation(consultation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedConsultation(null);
  };

  const handleQuickAction = (action, consultation) => {
    switch (action) {
      case 'call':
        window.open(`tel:${consultation.phone}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${consultation.phone?.replace(/[^0-9]/g, '')}`);
        break;
      case 'email':
        window.open(`mailto:${consultation.email}`);
        break;
      default:
        break;
    }
  };

  // Early returns for loading and error states - Move these after all hooks
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

  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0 fw-bold" style={{ color: '#1f2937' }}>Consultations</h1>
        </div>

        {/* Metrics Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-sm-6">
            <div className="card border-0 shadow-sm" style={{ backgroundColor: '#f8fafc' }}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <p className="text-muted mb-1 small fw-semibold">Total Consultations</p>
                    <h3 className="mb-0 fw-bold" style={{ color: '#1f2937' }}>{metrics.total}</h3>
                  </div>
                  <div className="ms-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: '#e0e7ff' }}>
                      <svg width="24" height="24" fill="none" stroke="#6366f1" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="m22 21-3-3 3-3"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="card border-0 shadow-sm" style={{ backgroundColor: '#fffbeb' }}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <p className="text-muted mb-1 small fw-semibold">Pending</p>
                    <h3 className="mb-0 fw-bold" style={{ color: '#d97706' }}>{metrics.pending}</h3>
                  </div>
                  <div className="ms-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: '#fef3c7' }}>
                      <svg width="24" height="24" fill="none" stroke="#f59e0b" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="card border-0 shadow-sm" style={{ backgroundColor: '#f0fdf4' }}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <p className="text-muted mb-1 small fw-semibold">Completed</p>
                    <h3 className="mb-0 fw-bold" style={{ color: '#16a34a' }}>{metrics.completed}</h3>
                  </div>
                  <div className="ms-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: '#dcfce7' }}>
                      <svg width="24" height="24" fill="none" stroke="#22c55e" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="card border-0 shadow-sm" style={{ backgroundColor: '#fefce8' }}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <p className="text-muted mb-1 small fw-semibold">Today</p>
                    <h3 className="mb-0 fw-bold" style={{ color: '#ca8a04' }}>{metrics.today}</h3>
                  </div>
                  <div className="ms-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: '#fde047' }}>
                      <svg width="24" height="24" fill="none" stroke="#eab308" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-muted">Search</label>
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control border-0 bg-light"
                />
              </div>
              <div className="col-md-2">
                <label className="form-label small fw-semibold text-muted">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-select border-0 bg-light"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label small fw-semibold text-muted">Date Range</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="form-select border-0 bg-light"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              <div className="col-md-4">
                <div className="d-flex gap-2">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setDateFilter('all');
                      setCurrentPage(1);
                    }}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Consultations Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {paginatedConsultations.length === 0 ? (
              <div className="text-center py-5">
                <div className="text-muted">
                  <svg width="48" height="48" fill="none" stroke="#9ca3af" strokeWidth="1" className="mb-3">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="m22 21-3-3 3-3"></path>
                  </svg>
                  <p className="mb-0">No consultations found</p>
                  <small>Try adjusting your filters or search terms</small>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 fw-semibold text-muted small text-uppercase ps-4" style={{ width: '25%' }}>Client</th>
                      <th className="border-0 fw-semibold text-muted small text-uppercase" style={{ width: '20%' }}>Concern</th>
                      <th className="border-0 fw-semibold text-muted small text-uppercase" style={{ width: '20%' }}>Appointment</th>
                      <th className="border-0 fw-semibold text-muted small text-uppercase" style={{ width: '15%' }}>Status</th>
                      <th className="border-0 fw-semibold text-muted small text-uppercase text-end pe-4" style={{ width: '20%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedConsultations.map((consultation) => {
                      const statusColors = getStatusColor(consultation.status);
                      return (
                        <tr 
                          key={consultation._id} 
                          className="cursor-pointer"
                          onClick={() => openModal(consultation)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td className="ps-4">
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                                   style={{ 
                                     width: '40px', 
                                     height: '40px', 
                                     backgroundColor: '#f3f4f6',
                                     fontSize: '14px',
                                     fontWeight: '600',
                                     color: '#6b7280'
                                   }}>
                                {getInitials(consultation.name)}
                              </div>
                              <div>
                                <div className="fw-semibold text-dark">{consultation.name}</div>
                                <div className="small text-muted">{consultation.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="fw-medium text-dark" style={{ textTransform: 'capitalize' }}>
                                {consultation.biggestConcern?.replace('-', ' ')}
                              </div>
                              <div className="small text-muted" style={{ textTransform: 'capitalize' }}>
                                {consultation.protectiveStyle}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="fw-medium text-dark">{formatDate(consultation.preferredDate)}</div>
                              <div className="small text-muted">{formatTime(consultation.preferredTime)}</div>
                            </div>
                          </td>
                          <td>
                            <span 
                              className="badge rounded-pill"
                              style={{
                                backgroundColor: statusColors.bg,
                                color: statusColors.color,
                                border: `1px solid ${statusColors.border}`,
                                fontSize: '12px',
                                fontWeight: '500',
                                textTransform: 'capitalize'
                              }}
                            >
                              {consultation.status}
                            </span>
                          </td>
                          <td className="text-end pe-4">
                            <div className="btn-group" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={() => openModal(consultation)}
                                className="btn btn-sm btn-outline-primary"
                              >
                                View
                              </button>
                              {consultation.status === 'pending' && (
                                <button 
                                  onClick={() => handleStatusChange(consultation._id, 'completed')}
                                  disabled={isUpdating}
                                  className="btn btn-sm btn-outline-success"
                                >
                                  Complete
                                </button>
                              )}
                              <button 
                                onClick={() => handleDelete(consultation._id)}
                                disabled={isDeleting}
                                className="btn btn-sm btn-outline-danger"
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
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted small">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredConsultations.length)} of {filteredConsultations.length} consultations
            </div>
            <div className="btn-group" role="group">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn btn-outline-secondary btn-sm"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-outline-secondary'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="btn btn-sm btn-outline-secondary disabled">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`btn btn-sm ${currentPage === totalPages ? 'btn-primary' : 'btn-outline-secondary'}`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-outline-secondary btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Consultation Details Modal */}
        <ReactModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            content: {
              position: 'relative',
              inset: 'auto',
              border: 'none',
              background: 'transparent',
              padding: 0,
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'visible',
            },
          }}
          contentLabel="Consultation Details"
          ariaHideApp={false}
        >
          {selectedConsultation && (
            <div className="card shadow-lg">
              <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0 fw-bold">{selectedConsultation.name}</h5>
                  <span 
                    className="badge rounded-pill"
                    style={{
                      backgroundColor: getStatusColor(selectedConsultation.status).bg,
                      color: getStatusColor(selectedConsultation.status).color,
                      border: `1px solid ${getStatusColor(selectedConsultation.status).border}`,
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}
                  >
                    {selectedConsultation.status}
                  </span>
                </div>
                <button 
                  onClick={closeModal}
                  className="btn btn-sm btn-light rounded-circle"
                  style={{ width: '32px', height: '32px', padding: '0' }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6L18 18"></path>
                  </svg>
                </button>
              </div>
              <div className="card-body">
                {/* Contact Information */}
                <div className="mb-4">
                  <h6 className="text-muted small fw-semibold text-uppercase mb-3">Contact Information</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <svg width="16" height="16" fill="none" stroke="#6b7280" strokeWidth="2" className="me-2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <div>
                          <div className="small text-muted">Email</div>
                          <div className="fw-medium">{selectedConsultation.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <svg width="16" height="16" fill="none" stroke="#6b7280" strokeWidth="2" className="me-2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <div>
                          <div className="small text-muted">Phone</div>
                          <div className="fw-medium">{selectedConsultation.phone || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-4">
                  <h6 className="text-muted small fw-semibold text-uppercase mb-3">Quick Actions</h6>
                  <div className="d-flex gap-2">
                    <button 
                      onClick={() => handleQuickAction('call', selectedConsultation)}
                      className="btn btn-sm btn-outline-primary"
                      disabled={!selectedConsultation.phone}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      Call
                    </button>
                    <button 
                      onClick={() => handleQuickAction('whatsapp', selectedConsultation)}
                      className="btn btn-sm btn-outline-success"
                      disabled={!selectedConsultation.phone}
                    >
                      <svg width="14" height="14" fill="currentColor" className="me-1">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      WhatsApp
                    </button>
                    <button 
                      onClick={() => handleQuickAction('email', selectedConsultation)}
                      className="btn btn-sm btn-outline-info"
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      Email
                    </button>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="mb-4">
                  <h6 className="text-muted small fw-semibold text-uppercase mb-3">Appointment Details</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <svg width="16" height="16" fill="none" stroke="#6b7280" strokeWidth="2" className="me-2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <div>
                          <div className="small text-muted">Preferred Date</div>
                          <div className="fw-medium">{formatDate(selectedConsultation.preferredDate)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <svg width="16" height="16" fill="none" stroke="#6b7280" strokeWidth="2" className="me-2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <div>
                          <div className="small text-muted">Preferred Time</div>
                          <div className="fw-medium">{formatTime(selectedConsultation.preferredTime)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hair Details */}
                <div className="mb-4">
                  <h6 className="text-muted small fw-semibold text-uppercase mb-3">Hair Details</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <svg width="16" height="16" fill="none" stroke="#6b7280" strokeWidth="2" className="me-2">
                          <path d="M9 11H3v2h6v-2zm0-4H3v2h6V7zm0-4H3v2h6V3zm2 0h6v2h-6V3zm0 4h6v2h-6V7zm0 4h6v2h-6v-2z"></path>
                        </svg>
                        <div>
                          <div className="small text-muted">Biggest Concern</div>
                          <div className="fw-medium" style={{ textTransform: 'capitalize' }}>
                            {selectedConsultation.biggestConcern?.replace('-', ' ')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <svg width="16" height="16" fill="none" stroke="#6b7280" strokeWidth="2" className="me-2">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                          <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                        <div>
                          <div className="small text-muted">Protective Style</div>
                          <div className="fw-medium" style={{ textTransform: 'capitalize' }}>
                            {selectedConsultation.protectiveStyle}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-4">
                  <h6 className="text-muted small fw-semibold text-uppercase mb-3">Notes</h6>
                  <div className="bg-light rounded p-3">
                    <p className="mb-0">
                      {selectedConsultation.notes || (
                        <span className="text-muted">No notes provided</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Booking Info */}
                <div>
                  <h6 className="text-muted small fw-semibold text-uppercase mb-3">Booking Information</h6>
                  <div className="d-flex align-items-center">
                    <svg width="16" height="16" fill="none" stroke="#6b7280" strokeWidth="2" className="me-2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <div>
                      <div className="small text-muted">Booked On</div>
                      <div className="fw-medium">{formatDate(selectedConsultation.createdAt)}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer bg-white border-top">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="btn-group">
                    {selectedConsultation.status === 'pending' && (
                      <button 
                        onClick={() => {
                          handleStatusChange(selectedConsultation._id, 'completed');
                          closeModal();
                        }}
                        disabled={isUpdating}
                        className="btn btn-success btn-sm"
                      >
                        Mark Complete
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        handleDelete(selectedConsultation._id);
                        closeModal();
                      }}
                      disabled={isDeleting}
                      className="btn btn-danger btn-sm"
                    >
                      Delete Consultation
                    </button>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="btn btn-secondary btn-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </ReactModal>
      </div>
    </AdminLayout>
  );
};

export default AdminConsultationsPage;
