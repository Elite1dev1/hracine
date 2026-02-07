import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/layout/admin/AdminLayout';
import { useAdminUpdateCategoryMutation, useAdminGetAllCategoriesQuery } from '@/redux/features/admin/adminApi';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { getApiBaseUrl } from '@/utils/apiConfig';
import { PRODUCT_TYPES } from '@/constants/productTypes';

const EditCategoryPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: categoriesData } = useAdminGetAllCategoriesQuery();
  const [updateCategory, { isLoading }] = useAdminUpdateCategoryMutation();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState(null);
  const [childInput, setChildInput] = useState('');

  useEffect(() => {
    if (categoriesData?.result && id) {
      const category = categoriesData.result.find((c) => c._id === id);
      if (category) {
        setFormData({
          parent: category.parent || '',
          children: Array.isArray(category.children) ? category.children : [],
          productType: category.productType || 'electronics',
          img: category.img || '',
          description: category.description || '',
          status: category.status || 'Show',
        });
      }
    }
  }, [categoriesData, id]);

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
    
    // Ensure productType is included in the data being sent
    const dataToSend = {
      ...formData,
      productType: formData.productType || 'electronics',
    };
    
    try {
      const result = await updateCategory({ id, data: dataToSend }).unwrap();
      // Update local formData with the response to ensure consistency
      if (result?.result) {
        setFormData({
          parent: result.result.parent || '',
          children: Array.isArray(result.result.children) ? result.result.children : [],
          productType: result.result.productType || 'electronics',
          img: result.result.img || '',
          description: result.result.description || '',
          status: result.result.status || 'Show',
        });
      }
      toast.success('Category updated successfully!');
      // Small delay to ensure the cache is updated before redirecting
      setTimeout(() => {
        router.push('/admin/categories');
      }, 100);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update category');
    }
  };

  if (!formData) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <ClipLoader size={50} color="#3498db" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 style={{ marginBottom: '30px', color: '#2c3e50' }}>Edit Category</h1>
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
              {isLoading ? 'Updating...' : 'Update Category'}
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

export default EditCategoryPage;
