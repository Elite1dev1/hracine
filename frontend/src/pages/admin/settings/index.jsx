import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layout/admin/AdminLayout';
import {
  useAdminGetSettingsQuery,
  useAdminUpdateSettingsMutation,
} from '@/redux/features/admin/adminApi';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const AdminSettingsPage = () => {
  const { data, isLoading, error } = useAdminGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useAdminUpdateSettingsMutation();
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(200);

  useEffect(() => {
    if (data?.data) {
      setFreeShippingThreshold(data.data.freeShippingThreshold || 200);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings({
        freeShippingThreshold: Number(freeShippingThreshold),
      }).unwrap();
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update settings');
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
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '50px', color: '#e74c3c' }}>
          Error loading settings
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 style={{ marginBottom: '30px', color: '#2c3e50' }}>Settings</h1>

        <div style={{ maxWidth: '600px' }}>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '5px',
                marginBottom: '20px',
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#2c3e50' }}>
                Shipping Settings
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="freeShippingThreshold"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: '#34495e',
                  }}
                >
                  Free Shipping Threshold (₦)
                </label>
                <input
                  type="number"
                  id="freeShippingThreshold"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px',
                  }}
                />
                <p style={{ marginTop: '8px', color: '#7f8c8d', fontSize: '14px' }}>
                  Customers need to spend this amount or more to qualify for free shipping.
                </p>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  opacity: isUpdating ? 0.6 : 1,
                }}
              >
                {isUpdating ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
