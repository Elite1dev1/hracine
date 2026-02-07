import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/layout/admin/AdminLayout';
import { useAdminAddBlogMutation } from '@/redux/features/admin/adminApi';
import { toast } from 'react-toastify';
import { getApiBaseUrl } from '@/utils/apiConfig';
import RichTextEditor from '@/components/admin/RichTextEditor';

const AddBlogPage = () => {
  const router = useRouter();
  const [addBlog, { isLoading }] = useAdminAddBlogMutation();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    img: '',
    list_img: '',
    author: '',
    category: 'electronics',
    sm_desc: '',
    desc: '',
    content: '',
    status: 'draft',
    tags: [],
    featured: false,
    blog_type: 'blog-grid',
    video: false,
    video_id: '',
    audio: false,
    audio_id: '',
    slider: false,
    slider_images: [],
    blockquote: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [sliderImageInput, setSliderImageInput] = useState('');
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingListImage, setUploadingListImage] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()],
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (index) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((_, i) => i !== index),
    });
  };

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      // Auto-generate slug if not manually set
      slug: formData.slug || title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, ''),
      // Auto-generate metaTitle if not set
      metaTitle: formData.metaTitle || title,
    });
  };

  const handleAddSliderImage = () => {
    if (sliderImageInput.trim()) {
      setFormData({
        ...formData,
        slider_images: [...formData.slider_images, sliderImageInput.trim()],
      });
      setSliderImageInput('');
    }
  };

  const handleRemoveSliderImage = (index) => {
    setFormData({
      ...formData,
      slider_images: formData.slider_images.filter((_, i) => i !== index),
    });
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploadingMainImage(true);
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
      toast.success('Main image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingMainImage(false);
    }
  };

  const handleListImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploadingListImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      
      const response = await fetch(`${getApiBaseUrl()}/api/cloudinary/add-img`, {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setFormData(prev => ({ ...prev, list_img: data.data.url }));
      toast.success('List image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingListImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBlog(formData).unwrap();
      toast.success('Blog added successfully!');
      router.push('/admin/blogs');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add blog');
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 style={{ marginBottom: '30px', color: '#2c3e50' }}>Add New Blog</h1>
        <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>

          {/* SEO Fields Section */}
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '5px', border: '1px solid #3498db' }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '18px', color: '#2c3e50' }}>SEO Optimization</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                Slug / URL *
                <small style={{ color: '#888', marginLeft: '5px' }}>(SEO-friendly URL)</small>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="blog-post-title"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              <small style={{ color: '#888' }}>Auto-generated from title. Edit if needed. Use lowercase letters, numbers, and hyphens only.</small>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                Meta Title
                <small style={{ color: '#888', marginLeft: '5px' }}>(Max 60 characters)</small>
              </label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                maxLength={60}
                placeholder="Title shown on Google search results"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              <small style={{ color: formData.metaTitle?.length > 60 ? '#e74c3c' : '#888' }}>
                {formData.metaTitle?.length || 0}/60 characters
              </small>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                Meta Description
                <small style={{ color: '#888', marginLeft: '5px' }}>(Max 160 characters)</small>
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                maxLength={160}
                rows="3"
                placeholder="Short description for search engines"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              <small style={{ color: formData.metaDescription?.length > 160 ? '#e74c3c' : '#888' }}>
                {formData.metaDescription?.length || 0}/160 characters
              </small>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Keywords</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                  placeholder="Add keyword (press Enter)"
                  style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
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
                {formData.keywords.map((keyword, index) => (
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
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(index)}
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
              <small style={{ color: '#888' }}>Helps SEO optimization. Separate keywords with commas or add one at a time.</small>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Main Image *</label>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageUpload}
                  disabled={uploadingMainImage}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
                {uploadingMainImage && (
                  <div style={{ marginTop: '5px', color: '#3498db' }}>Uploading...</div>
                )}
              </div>
              <input
                type="url"
                name="img"
                value={formData.img}
                onChange={handleChange}
                required
                placeholder="Or enter image URL"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              {formData.img && (
                <img src={formData.img} alt="Preview" style={{ width: '100%', maxWidth: '200px', marginTop: '10px', borderRadius: '5px' }} />
              )}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>List Image (Optional)</label>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleListImageUpload}
                  disabled={uploadingListImage}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
                {uploadingListImage && (
                  <div style={{ marginTop: '5px', color: '#3498db' }}>Uploading...</div>
                )}
              </div>
              <input
                type="url"
                name="list_img"
                value={formData.list_img}
                onChange={handleChange}
                placeholder="Or enter image URL"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              <small style={{ color: '#888' }}>Used for list view. If empty, main image will be used.</small>
              {formData.list_img && (
                <img src={formData.list_img} alt="Preview" style={{ width: '100%', maxWidth: '200px', marginTop: '10px', borderRadius: '5px' }} />
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Author *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Short Description *</label>
            <textarea
              name="sm_desc"
              value={formData.sm_desc}
              onChange={handleChange}
              required
              rows="3"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Description (Optional)</label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              rows="4"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
            <small style={{ color: '#888' }}>Longer description for postbox view. If empty, short description will be used.</small>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Content *</label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Write your blog content here..."
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Tags</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag"
                style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              <button
                type="button"
                onClick={handleAddTag}
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
              {formData.tags.map((tag, index) => (
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
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
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
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Blog Type *</label>
            <select
              name="blog_type"
              value={formData.blog_type}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            >
              <option value="blog-grid">Blog Grid</option>
              <option value="blog-postbox">Blog Postbox</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
            </select>
            <small style={{ color: '#888' }}>Determines which page displays this blog</small>
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px', color: '#555' }}>Special Post Types</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <input
                  type="checkbox"
                  name="video"
                  checked={formData.video}
                  onChange={handleChange}
                  style={{ marginRight: '10px', width: '20px', height: '20px' }}
                />
                <span style={{ color: '#555' }}>Video Post</span>
              </label>
              {formData.video && (
                <input
                  type="text"
                  name="video_id"
                  value={formData.video_id}
                  onChange={handleChange}
                  placeholder="YouTube Video ID (e.g., 457mlqV1gzA)"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginTop: '5px' }}
                />
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <input
                  type="checkbox"
                  name="audio"
                  checked={formData.audio}
                  onChange={handleChange}
                  style={{ marginRight: '10px', width: '20px', height: '20px' }}
                />
                <span style={{ color: '#555' }}>Audio Post</span>
              </label>
              {formData.audio && (
                <input
                  type="url"
                  name="audio_id"
                  value={formData.audio_id}
                  onChange={handleChange}
                  placeholder="SoundCloud embed URL"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginTop: '5px' }}
                />
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <input
                  type="checkbox"
                  name="slider"
                  checked={formData.slider}
                  onChange={handleChange}
                  style={{ marginRight: '10px', width: '20px', height: '20px' }}
                />
                <span style={{ color: '#555' }}>Slider Post</span>
              </label>
              {formData.slider && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="url"
                      value={sliderImageInput}
                      onChange={(e) => setSliderImageInput(e.target.value)}
                      placeholder="Add slider image URL"
                      style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                    <button
                      type="button"
                      onClick={handleAddSliderImage}
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
                    {formData.slider_images.map((img, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#e3f2fd',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '12px',
                        }}
                      >
                        {img.substring(0, 30)}...
                        <button
                          type="button"
                          onClick={() => handleRemoveSliderImage(index)}
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
              )}
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  name="blockquote"
                  checked={formData.blockquote}
                  onChange={handleChange}
                  style={{ marginRight: '10px', width: '20px', height: '20px' }}
                />
                <span style={{ color: '#555' }}>Blockquote Post (Quote format)</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                style={{ marginRight: '10px', width: '20px', height: '20px' }}
              />
              <label style={{ color: '#555' }}>Featured Blog</label>
            </div>
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
              {isLoading ? 'Adding...' : 'Add Blog'}
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

export default AddBlogPage;
