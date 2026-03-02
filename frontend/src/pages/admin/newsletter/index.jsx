import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layout/admin/AdminLayout';
import Cookies from 'js-cookie';
import { getApiBaseUrl } from '@/utils/apiConfig';

const NewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchSubscribers();
    fetchStats();
  }, [page, search, statusFilter, startDate, endDate]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const adminInfo = Cookies.get('adminInfo');
      if (!adminInfo) return;

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
      });

      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${getApiBaseUrl()}/api/newsletter/subscribers?${params}`);
      const data = await response.json();

      if (data.success) {
        setSubscribers(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/newsletter/stats`);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${getApiBaseUrl()}/api/newsletter/export?${params}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `newsletter-subscribers-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting subscribers:', error);
      alert('Error exporting subscribers');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: { backgroundColor: '#d4edda', color: '#155724' },
      unsubscribed: { backgroundColor: '#f8d7da', color: '#721c24' },
      bounced: { backgroundColor: '#fff3cd', color: '#856404' },
    };

    return (
      <span
        style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'capitalize',
          ...styles[status] || styles.active,
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Newsletter Subscribers</h1>
          <button
            onClick={handleExport}
            style={{
              padding: '10px 20px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            Export to CSV
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: '#e8f5e9', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2e7d32' }}>{stats.total}</div>
              <div style={{ color: '#4caf50', marginTop: '5px' }}>Total Subscribers</div>
            </div>
            <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1565c0' }}>{stats.active}</div>
              <div style={{ color: '#2196f3', marginTop: '5px' }}>Active</div>
            </div>
            <div style={{ backgroundColor: '#fff3e0', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e65100' }}>{stats.unsubscribed}</div>
              <div style={{ color: '#ff9800', marginTop: '5px' }}>Unsubscribed</div>
            </div>
            <div style={{ backgroundColor: '#f3e5f5', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6a1b9a' }}>{stats.today}</div>
              <div style={{ color: '#9c27b0', marginTop: '5px' }}>Today</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600', color: '#555' }}>
                Search by Email
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Enter email..."
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600', color: '#555' }}>
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="unsubscribed">Unsubscribed</option>
                <option value="bounced">Bounced</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600', color: '#555' }}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600', color: '#555' }}>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
        ) : subscribers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#7f8c8d' }}>
            No subscribers found
          </div>
        ) : (
          <>
            <div style={{ backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Email</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Source</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Date Subscribed</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '15px', color: '#212529' }}>{subscriber.email}</td>
                      <td style={{ padding: '15px', color: '#6c757d', textTransform: 'capitalize' }}>{subscriber.source}</td>
                      <td style={{ padding: '15px', color: '#6c757d' }}>{formatDate(subscriber.subscribed_at)}</td>
                      <td style={{ padding: '15px' }}>{getStatusBadge(subscriber.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    backgroundColor: page === 1 ? '#f5f5f5' : 'white',
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                    color: page === 1 ? '#999' : '#333',
                  }}
                >
                  Previous
                </button>
                <span style={{ padding: '8px 16px', color: '#666' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    backgroundColor: page === totalPages ? '#f5f5f5' : 'white',
                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                    color: page === totalPages ? '#999' : '#333',
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default NewsletterSubscribers;
