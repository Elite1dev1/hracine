import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAdminLoginMutation } from '@/redux/features/admin/adminApi';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const AdminLoginPage = () => {
  const router = useRouter();
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const adminInfo = Cookies.get('adminInfo');
    if (adminInfo) {
      router.push('/admin');
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await adminLogin(formData).unwrap();
      toast.success('Login successful!');
      router.push('/admin');
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error data:', error?.data);
      console.error('Error status:', error?.status);
      
      // RTK Query error structure: error.data contains the response body
      const errorMessage = 
        error?.data?.message || 
        error?.data?.error || 
        (typeof error?.data === 'string' ? error.data : null) ||
        error?.message || 
        'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
