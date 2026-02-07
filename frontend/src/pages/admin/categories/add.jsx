import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/layout/admin/AdminLayout';
import { useAdminAddCategoryMutation } from '@/redux/features/admin/adminApi';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { getApiBaseUrl } from '@/utils/apiConfig';
import { PRODUCT_TYPES } from '@/constants/productTypes';

const AddCategoryPage = () => {
  const router = useRouter();
  const [addCategory, { isLoading }] = useAdminAddCategoryMutation();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    parent: '',
    children: [],
    productType: 'electronics',
    img: '',
    description: '',
    status: 'Show',
  });
  const [childInput, setChildInput] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddChild = () => {
    if (childInput.trim()) {
      setFormData({
        ...formData,
        children: [...formData.children, childInput.trim()],
      });
      setChildInput('');
    }
  };

  const handleRemoveChild = (index) => {
    setFormData({
      ...formData,
      children: formData.children.filter((_, i) => i !== index),
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
      setFormData(prev => ({ ...prev, img: data.data.url }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCategory(formData).unwrap();
      toast.success('Category added successfully!');
      router.push('/admin/categories');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add category');
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 style={{ marginBottom: '30px', color: '#2c3e50' }}>Add New Category</h1>
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Parent Category *</label>
            <input
              type="text"
              name="parent"
              value={formData.parent}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Children Categories</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                value={childInput}
                onChange={(e) => setChildInput(e.target.value)}
                placeholder="Add child category"
                style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              <button
                type="button"
                onClick={handleAddChild}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {formData.children.map((child, index) => (
                <span
                  key={index}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  {child}
                  <button
                    type="button"
                    onClick={() => handleRemoveChild(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#e74c3c',
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Product Type *</label>
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
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Image URL</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="url"
                name="img"
                value={formData.img}
                onChange={handleChange}
                placeholder="Or enter image URL"
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
            {formData.img && (
              <div style={{ marginTop: '10px' }}>
                <img
                  src={formData.img}
                  alt="Preview"
                  style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #ddd' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            >
              <option value="Show">Show</option>
              <option value="Hide">Hide</option>
            </select>
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
              }}
            >
              {isLoading ? 'Adding...' : 'Add Category'}
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

export default AddCategoryPage;
