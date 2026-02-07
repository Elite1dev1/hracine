import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/layout/admin/AdminLayout';
import { useAdminUpdateBrandMutation, useAdminGetAllBrandsQuery } from '@/redux/features/admin/adminApi';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { getApiBaseUrl } from '@/utils/apiConfig';

const EditBrandPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: brandsData } = useAdminGetAllBrandsQuery();
  const [updateBrand, { isLoading }] = useAdminUpdateBrandMutation();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (brandsData?.result && id) {
      const brand = brandsData.result.find((b) => b._id === id);
      if (brand) {
        setFormData({
          name: brand.name || '',
          description: brand.description || '',
          email: brand.email || '',
          website: brand.website || '',
          location: brand.location || '',
          logo: brand.logo || '',
          status: brand.status || 'active',
        });
      }
    }
  }, [brandsData, id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
    try {
      await updateBrand({ id, data: formData }).unwrap();
      toast.success('Brand updated successfully!');
      router.push('/admin/brands');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update brand');
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
        <h1 style={{ marginBottom: '30px', color: '#2c3e50' }}>Edit Brand</h1>
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
              Brand Name * <span style={{ color: '#999', fontSize: '12px' }}>(must be unique)</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Website URL</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Logo URL</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
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
                  alt="Logo preview"
                  style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '5px', padding: '5px' }}
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
              {isLoading ? 'Updating...' : 'Update Brand'}
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

export default EditBrandPage;
