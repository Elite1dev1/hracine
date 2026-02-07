import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/layout/admin/AdminLayout';
import { useAdminAddCouponMutation } from '@/redux/features/admin/adminApi';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { getApiBaseUrl } from '@/utils/apiConfig';
import { PRODUCT_TYPES } from '@/constants/productTypes';

const AddCouponPage = () => {
  const router = useRouter();
  const [addCoupon, { isLoading }] = useAdminAddCouponMutation();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    logo: '',
    couponCode: '',
    startTime: '',
    endTime: '',
    discountPercentage: '',
    minimumAmount: '',
    productType: 'electronics',
    status: 'active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      
      const response = await fetch(`${getApiBaseUrl()}/api/cloudinary/add-img`, {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setFormData(prev => ({ ...prev, logo: data.data.url }));
      toast.success('Logo uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload logo');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.couponCode || !formData.endTime || 
        !formData.discountPercentage || !formData.minimumAmount || !formData.productType) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.discountPercentage) < 0 || parseFloat(formData.discountPercentage) > 100) {
      toast.error('Discount percentage must be between 0 and 100');
      return;
    }

    if (parseFloat(formData.minimumAmount) < 0) {
      toast.error('Minimum amount must be greater than or equal to 0');
      return;
    }

    if (formData.startTime && formData.endTime && new Date(formData.startTime) >= new Date(formData.endTime)) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      const submitData = {
        ...formData,
        discountPercentage: parseFloat(formData.discountPercentage),
        minimumAmount: parseFloat(formData.minimumAmount),
        startTime: formData.startTime || undefined,
        endTime: formData.endTime,
      };
      
      await addCoupon(submitData).unwrap();
      toast.success('Coupon added successfully!');
      router.push('/admin/coupons');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add coupon');
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 style={{ marginBottom: '30px', color: '#2c3e50' }}>Add New Coupon</h1>
        <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Summer Sale 2024"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                Coupon Code *
              </label>
              <input
                type="text"
                name="couponCode"
                value={formData.couponCode}
                onChange={handleChange}
                required
                placeholder="e.g., SUMMER24"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontFamily: 'monospace' }}
              />
              <small style={{ color: '#666', fontSize: '12px' }}>This is the code customers will enter</small>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
              Logo URL *
            </label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                required
                placeholder="Or enter logo URL"
                style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              <label
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  borderRadius: '5px',
                  cursor: uploadingImage ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: uploadingImage ? 0.7 : 1,
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  style={{ display: 'none' }}
                />
                {uploadingImage ? <ClipLoader size={16} color="white" /> : '📤 Upload'}
              </label>
            </div>
            {formData.logo && (
              <div style={{ marginTop: '10px' }}>
                <img 
                  src={formData.logo} 
                  alt="Preview" 
                  style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '5px', border: '1px solid #ddd' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                Start Time (Optional)
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              <small style={{ color: '#666', fontSize: '12px' }}>Leave empty to start immediately</small>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                End Time *
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                Discount Percentage *
              </label>
              <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                required
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g., 15"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              <small style={{ color: '#666', fontSize: '12px' }}>Enter a value between 0 and 100</small>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                Minimum Amount (₦) *
              </label>
              <input
                type="number"
                name="minimumAmount"
                value={formData.minimumAmount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="e.g., 500"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              <small style={{ color: '#666', fontSize: '12px' }}>Minimum cart total to apply this coupon</small>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                Product Type *
              </label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              >
                {PRODUCT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <small style={{ color: '#666', fontSize: '12px' }}>Coupon will only apply to products of this type</small>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '5px', 
            marginBottom: '20px',
            border: '1px solid #dee2e6'
          }}>
            <h4 style={{ marginTop: 0, marginBottom: '10px', color: '#2c3e50' }}>Coupon Information:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
              <li>Discount will be applied only to products matching the selected product type</li>
              <li>Customers must meet the minimum amount requirement to use this coupon</li>
              <li>The coupon will automatically expire after the end time</li>
              <li>Inactive coupons won&apos;t be available to customers even if not expired</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '12px 30px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {isLoading && <ClipLoader size={16} color="white" />}
              {isLoading ? 'Adding...' : 'Add Coupon'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                padding: '12px 30px',
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddCouponPage;
