import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/layout/admin/AdminLayout';
import { 
  useAdminUpdateProductMutation,
  useAdminGetAllCategoriesQuery,
  useAdminGetAllBrandsQuery,
} from '@/redux/features/admin/adminApi';
import { useGetProductQuery } from '@/redux/features/productApi';
import { toast } from 'react-toastify';
import { getApiBaseUrl } from '@/utils/apiConfig';
import { ClipLoader } from 'react-spinners';
import { PRODUCT_TYPES } from '@/constants/productTypes';

const EditProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: productData, isLoading: isLoadingProduct } = useGetProductQuery(id, { skip: !id });
  const { data: categoriesData } = useAdminGetAllCategoriesQuery();
  const { data: brandsData } = useAdminGetAllBrandsQuery();
  const [updateProduct, { isLoading }] = useAdminUpdateProductMutation();
  
  const [formData, setFormData] = useState(null);
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingAdditionalImages, setUploadingAdditionalImages] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState('');

  const categories = categoriesData?.result || [];
  const brands = brandsData?.result || [];

  useEffect(() => {
    if (productData) {
      setFormData({
        title: productData.title || '',
        img: productData.img || '',
        price: productData.price || '',
        quantity: productData.quantity || '',
        discount: productData.discount || '',
        unit: productData.unit || '',
        parent: productData.parent || '',
        children: productData.children || '',
        description: productData.description || '',
        status: productData.status || 'in-stock',
        productType: productData.productType || 'electronics',
        brand: productData.brand || { name: '', id: '' },
        category: productData.category || { name: '', id: '' },
        imageURLs: productData.imageURLs || [],
        tags: productData.tags || [],
        sizes: productData.sizes || [],
        ingredients: productData.ingredients || '',
        howToUse: productData.howToUse || '',
        keyBenefits: productData.keyBenefits || [],
        comingSoon: productData.comingSoon || false,
      });
      
      // Set selected category and brand
      if (productData.category?.id) {
        setSelectedCategoryId(productData.category.id);
      }
      if (productData.brand?.id) {
        setSelectedBrandId(productData.brand.id);
      }
    }
  }, [productData]);

  // Auto-fill category when selected
  useEffect(() => {
    if (selectedCategoryId && categories.length > 0 && formData) {
      const selectedCategory = categories.find(cat => cat._id === selectedCategoryId);
      if (selectedCategory) {
        setFormData(prev => ({
          ...prev,
          parent: selectedCategory.parent,
          category: {
            name: selectedCategory.parent,
            id: selectedCategory._id,
          },
          productType: selectedCategory.productType || prev.productType,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId, categories]);

  // Auto-fill brand when selected
  useEffect(() => {
    if (selectedBrandId && brands.length > 0 && formData) {
      const selectedBrand = brands.find(brand => brand._id === selectedBrandId);
      if (selectedBrand) {
        setFormData(prev => ({
          ...prev,
          brand: {
            name: selectedBrand.name,
            id: selectedBrand._id,
          },
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrandId, brands]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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

  const handleAdditionalImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      toast.error('Please select only image files');
      return;
    }

    setUploadingAdditionalImages(true);
    try {
      const formDataUpload = new FormData();
      files.forEach(file => {
        formDataUpload.append('images', file);
      });
      
      const response = await fetch(`${getApiBaseUrl()}/api/cloudinary/add-multiple-img`, {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      const newImageURLs = data.data.map(url => ({
        color: { name: '', clrCode: '' },
        img: url,
        sizes: [],
      }));
      
      setFormData(prev => ({
        ...prev,
        imageURLs: [...prev.imageURLs, ...newImageURLs],
      }));
      toast.success(`${files.length} image(s) uploaded successfully!`);
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploadingAdditionalImages(false);
      e.target.value = '';
    }
  };

  const handleRemoveAdditionalImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imageURLs: prev.imageURLs.filter((_, i) => i !== index),
    }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    
    if (categoryId) {
      const selectedCategory = categories.find(cat => cat._id === categoryId);
      if (selectedCategory) {
        const firstChild = Array.isArray(selectedCategory.children) && selectedCategory.children.length > 0
          ? selectedCategory.children[0]
          : '';
        
        setFormData(prev => ({
          ...prev,
          parent: selectedCategory.parent,
          children: firstChild,
          category: {
            name: selectedCategory.parent,
            id: selectedCategory._id,
          },
          productType: selectedCategory.productType || prev.productType,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.img) {
      toast.error('Please upload a main image');
      return;
    }
    
    if (!formData.category.id || !formData.brand.id) {
      toast.error('Please select both category and brand');
      return;
    }

    // Clean up keyBenefits - filter out empty lines
    const cleanedData = {
      ...formData,
      keyBenefits: Array.isArray(formData.keyBenefits) 
        ? formData.keyBenefits.filter(b => b.trim() !== '') 
        : [],
    };

    try {
      await updateProduct({ id, data: cleanedData }).unwrap();
      toast.success('Product updated successfully!');
      router.push('/admin/products');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update product');
    }
  };

  if (isLoadingProduct || !formData) {
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
        <h1 style={{ marginBottom: '30px', color: '#2c3e50' }}>Edit Product</h1>
        <form onSubmit={handleSubmit} style={{ maxWidth: '1000px' }}>
          {/* Basic Information */}
          <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Basic Information</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>
                Product Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>
                  Main Image *
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    disabled={uploadingMainImage}
                    style={{ flex: 1, padding: '8px' }}
                  />
                  {uploadingMainImage && <ClipLoader size={20} color="#3498db" />}
                </div>
                {formData.img && (
                  <div style={{ marginTop: '10px' }}>
                    <img 
                      src={formData.img} 
                      alt="Main product" 
                      style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #ddd' }}
                    />
                    <input
                      type="text"
                      value={formData.img}
                      readOnly
                      style={{ width: '100%', marginTop: '10px', padding: '8px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '12px' }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>
                  Unit *
                </label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Pricing & Inventory</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>
            </div>
          </div>

          {/* Category & Brand */}
          <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Category & Brand</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>
                  Category * (Auto-fills Parent & Children)
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={handleCategoryChange}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.parent} {Array.isArray(category.children) && category.children.length > 0 && `(${category.children.join(', ')})`}
                    </option>
                  ))}
                </select>
                {formData.parent && (
                  <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '5px', fontSize: '12px' }}>
                    <strong>Parent:</strong> {formData.parent}<br />
                    <strong>Children:</strong> {Array.isArray(categories.find(c => c._id === selectedCategoryId)?.children) 
                      ? categories.find(c => c._id === selectedCategoryId).children.join(', ')
                      : formData.children}
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>
                  Category Children (Subcategory) *
                </label>
                <select
                  value={formData.children}
                  onChange={(e) => setFormData(prev => ({ ...prev, children: e.target.value }))}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                >
                  <option value="">Select subcategory</option>
                  {selectedCategoryId && categories.find(c => c._id === selectedCategoryId)?.children?.map((child, idx) => (
                    <option key={idx} value={child}>{child}</option>
                  ))}
                </select>
                {!selectedCategoryId && (
                  <input
                    type="text"
                    value={formData.children}
                    onChange={(e) => setFormData(prev => ({ ...prev, children: e.target.value }))}
                    required
                    style={{ width: '100%', marginTop: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                  />
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Brand *</label>
                <select
                  value={selectedBrandId}
                  onChange={(e) => setSelectedBrandId(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                >
                  <option value="">Select a brand</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Product Type *</label>
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
            </div>
          </div>

          {/* Additional Images */}
          <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Additional Images</h3>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
              These images will be shown in the product details page. You can upload multiple images at once.
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesUpload}
                disabled={uploadingAdditionalImages}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              {uploadingAdditionalImages && (
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ClipLoader size={20} color="#3498db" />
                  <span>Uploading images...</span>
                </div>
              )}
            </div>

            {formData.imageURLs.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                {formData.imageURLs.map((item, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={item.img}
                      alt={`Additional ${index + 1}`}
                      style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #ddd' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAdditionalImage(index)}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '25px',
                        height: '25px',
                        cursor: 'pointer',
                        fontSize: '16px',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Description</h3>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="8"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontFamily: 'inherit' }}
            />
          </div>

          {/* Product Details for Hair Care */}
          <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Product Details (Hair Care)</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>
                Ingredients
              </label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                rows="4"
                placeholder="Enter product ingredients (e.g., Organic coconut oil, argan oil, jojoba oil...)"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>
                How to Use
              </label>
              <textarea
                name="howToUse"
                value={formData.howToUse}
                onChange={handleChange}
                rows="6"
                placeholder="Enter usage instructions (e.g., Apply to clean, damp scalp and hair. Massage gently...)"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>
                Key Benefits (one per line)
              </label>
              <textarea
                value={formData.keyBenefits.join('\n')}
                onChange={(e) => {
                  // Preserve all lines including empty ones for better UX
                  const lines = e.target.value.split('\n');
                  setFormData(prev => ({ ...prev, keyBenefits: lines }));
                }}
                onBlur={(e) => {
                  // Filter out empty lines only when user leaves the field
                  const benefits = e.target.value.split('\n').filter(b => b.trim() !== '');
                  setFormData(prev => ({ ...prev, keyBenefits: benefits }));
                }}
                rows="6"
                placeholder="Enter key benefits, one per line:&#10;Promotes healthy scalp&#10;Reduces hair breakage&#10;Adds natural shine"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontFamily: 'inherit', resize: 'vertical' }}
              />
              <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                Enter each benefit on a new line. These will be displayed as bullet points.
              </p>
            </div>
          </div>

          {/* Status */}
          <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Status</h3>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              style={{ width: '100%', maxWidth: '300px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            >
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>

          {/* Product Flags */}
          <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Product Flags</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="comingSoon"
                  checked={formData.comingSoon || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, comingSoon: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '16px', color: '#555' }}>
                  Coming Soon
                  <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>
                    (Product will appear in Featured Rituals section)
                  </span>
                </span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={isLoading || uploadingMainImage || uploadingAdditionalImages}
              style={{
                padding: '12px 30px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: (isLoading || uploadingMainImage || uploadingAdditionalImages) ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                opacity: (isLoading || uploadingMainImage || uploadingAdditionalImages) ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Updating...' : 'Update Product'}
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

export default EditProductPage;
