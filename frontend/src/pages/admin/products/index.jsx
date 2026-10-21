import React, { useEffect, useState } from 'react';
import AdminImage from '@/components/admin/AdminImage';
import AdminLayout from '@/layout/admin/AdminLayout';
import {
  useAdminGetAllProductsQuery,
  useAdminDeleteProductMutation,
  useAdminImportProductsMutation,
  useAdminReorderProductsMutation,
} from '@/redux/features/admin/adminApi';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { getApiBaseUrl } from '@/utils/apiConfig';

const AdminProductsPage = () => {
  const { data, isLoading, error } = useAdminGetAllProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useAdminDeleteProductMutation();
  const [importProducts, { isLoading: isImporting }] = useAdminImportProductsMutation();
  const [reorderProducts, { isLoading: isSavingOrder }] = useAdminReorderProductsMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // null for bulk, id for single
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [isOrderDirty, setIsOrderDirty] = useState(false);

  useEffect(() => {
    if (!isReorderMode) {
      setOrderedProducts(data?.data || []);
    }
  }, [data, isReorderMode]);

  useEffect(() => {
    if (!isOrderDirty) return undefined;

    const warnAboutUnsavedOrder = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnAboutUnsavedOrder);
    return () => window.removeEventListener('beforeunload', warnAboutUnsavedOrder);
  }, [isOrderDirty]);

  const startReordering = () => {
    setSearchTerm('');
    setSelectedProducts([]);
    setOrderedProducts(data?.data || []);
    setIsOrderDirty(false);
    setIsReorderMode(true);
  };

  const cancelReordering = () => {
    if (isOrderDirty && !window.confirm('Discard your unsaved product order changes?')) {
      return;
    }
    setOrderedProducts(data?.data || []);
    setDraggingId(null);
    setIsOrderDirty(false);
    setIsReorderMode(false);
  };

  const moveProduct = (productId, nextIndex) => {
    setOrderedProducts((current) => {
      const currentIndex = current.findIndex((product) => product._id === productId);
      const boundedIndex = Math.max(0, Math.min(nextIndex, current.length - 1));
      if (currentIndex < 0 || currentIndex === boundedIndex) return current;

      const next = [...current];
      const [movedProduct] = next.splice(currentIndex, 1);
      next.splice(boundedIndex, 0, movedProduct);
      return next;
    });
    setIsOrderDirty(true);
  };

  const handleDragStart = (event, productId) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', productId);
    setDraggingId(productId);
  };

  const handleDragEnter = (targetId) => {
    if (!draggingId || draggingId === targetId) return;
    const targetIndex = orderedProducts.findIndex((product) => product._id === targetId);
    moveProduct(draggingId, targetIndex);
  };

  const handleSaveOrder = async () => {
    try {
      const result = await reorderProducts(orderedProducts.map((product) => product._id)).unwrap();
      toast.success(result?.message || 'Product display order saved successfully');
      setIsOrderDirty(false);
      setIsReorderMode(false);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save product display order');
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleDeleteClick = (id = null) => {
    setDeleteTarget(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deleteTarget) {
        // Single delete
        await deleteProduct(deleteTarget).unwrap();
        toast.success('Product deleted successfully');
      } else {
        // Bulk delete
        const deletePromises = selectedProducts.map(id => deleteProduct(id).unwrap());
        await Promise.all(deletePromises);
        toast.success(`${selectedProducts.length} product(s) deleted successfully`);
        setSelectedProducts([]);
      }
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete product(s)');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleExport = async (format) => {
    try {
      const apiUrl = getApiBaseUrl();
      const response = await fetch(`${apiUrl}/api/product/export/all?format=${format}`);
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `products_${Date.now()}.${format}`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Products exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export products');
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.error('Please select a file');
      return;
    }

    try {
      const result = await importProducts(importFile).unwrap();
      toast.success(result.message || 'Products imported successfully');
      setShowImportModal(false);
      setImportFile(null);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to import products');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
        'application/csv'
      ];
      if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
        toast.error('Invalid file type. Please select an Excel (.xlsx, .xls) or CSV file.');
        return;
      }
      setImportFile(file);
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

  const products = data?.data || [];
  const displayedProducts = isReorderMode ? orderedProducts : products;
  const filteredProducts = displayedProducts.filter((product) =>
    product.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p._id));
    }
  };

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Products Management</h1>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            {isReorderMode ? (
              <>
                <button
                  onClick={cancelReordering}
                  disabled={isSavingOrder}
                  style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: isSavingOrder ? 'not-allowed' : 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveOrder}
                  disabled={!isOrderDirty || isSavingOrder}
                  style={{ padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: !isOrderDirty || isSavingOrder ? 'not-allowed' : 'pointer', opacity: !isOrderDirty || isSavingOrder ? 0.65 : 1 }}
                >
                  {isSavingOrder ? 'Saving order...' : 'Save order'}
                </button>
              </>
            ) : (
              <button
                onClick={startReordering}
                disabled={products.length < 2}
                style={{ padding: '10px 20px', backgroundColor: '#8e5c5c', color: 'white', border: 'none', borderRadius: '5px', cursor: products.length < 2 ? 'not-allowed' : 'pointer', opacity: products.length < 2 ? 0.65 : 1 }}
              >
                Reorder Products
              </button>
            )}
            {selectedProducts.length > 0 && (
              <button
                onClick={() => handleDeleteClick(null)}
                disabled={isDeleting}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                🗑️ Delete Selected ({selectedProducts.length})
              </button>
            )}
            {!isReorderMode && <button
              onClick={() => handleExport('xlsx')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              📥 Export Excel
            </button>}
            {!isReorderMode && <button
              onClick={() => handleExport('csv')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#16a085',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              📥 Export CSV
            </button>}
            {!isReorderMode && <button
              onClick={() => setShowImportModal(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#e67e22',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              📤 Import Products
            </button>}
            {!isReorderMode && <Link
              href="/admin/products/add"
              style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
              }}
            >
              + Add Product
            </Link>}
          </div>
        </div>

        {isReorderMode && (
          <div role="status" style={{ marginBottom: '16px', padding: '12px 16px', backgroundColor: '#fff7ed', border: '1px solid #f1d2b6', borderRadius: '6px', color: '#70472f' }}>
            Drag products by the handle, use the arrow buttons, or enter a position. Reordering uses the complete product list; search and normal management actions are disabled until you save or cancel.
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isReorderMode}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              backgroundColor: isReorderMode ? '#f3f4f6' : 'white',
              cursor: isReorderMode ? 'not-allowed' : 'text',
            }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px', textAlign: 'left', width: isReorderMode ? '72px' : '50px' }}>
                  {isReorderMode ? 'Move' : <input
                    type="checkbox"
                    checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                  />}
                </th>
                <th style={{ padding: '12px', textAlign: 'left', width: '110px' }}>Position</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Image</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Quantity</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr 
                  key={product._id} 
                  onDragOver={isReorderMode ? (event) => event.preventDefault() : undefined}
                  onDragEnter={isReorderMode ? () => handleDragEnter(product._id) : undefined}
                  onDrop={isReorderMode ? (event) => { event.preventDefault(); setDraggingId(null); } : undefined}
                  style={{ 
                    borderBottom: '1px solid #dee2e6',
                    backgroundColor: draggingId === product._id ? '#fff2e8' : selectedProducts.includes(product._id) ? '#f0f8ff' : 'transparent',
                    opacity: draggingId === product._id ? 0.65 : 1,
                    transition: 'background-color 150ms ease, opacity 150ms ease, transform 150ms ease',
                  }}
                >
                  <td style={{ padding: '12px' }}>
                    {isReorderMode ? (
                      <button
                        type="button"
                        draggable
                        onDragStart={(event) => handleDragStart(event, product._id)}
                        onDragEnd={() => setDraggingId(null)}
                        aria-label={`Drag ${product.title} to a new display position`}
                        title="Drag to reorder"
                        style={{ border: 'none', background: 'transparent', color: '#6b7280', cursor: 'grab', fontSize: '23px', lineHeight: 1, padding: '8px', touchAction: 'none' }}
                      >
                        &#8942;&#8942;
                      </button>
                    ) : <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectProduct(product._id)}
                      style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                    />}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {isReorderMode ? (
                      <input
                        type="number"
                        min="1"
                        max={orderedProducts.length}
                        value={index + 1}
                        onChange={(event) => {
                          const position = Number(event.target.value);
                          if (Number.isInteger(position) && position >= 1) {
                            moveProduct(product._id, position - 1);
                          }
                        }}
                        aria-label={`Display position for ${product.title}`}
                        style={{ width: '72px', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                      />
                    ) : (product.sortOrder || products.findIndex((item) => item._id === product._id) + 1)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <AdminImage
                      src={product.img}
                      alt={product.title}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                  </td>
                  <td style={{ padding: '12px' }}>{product.title}</td>
                  <td style={{ padding: '12px' }}>₦{product.price}</td>
                  <td style={{ padding: '12px' }}>{product.quantity}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        backgroundColor:
                          product.status === 'in-stock'
                            ? '#d4edda'
                            : product.status === 'out-of-stock'
                            ? '#f8d7da'
                            : '#fff3cd',
                        color:
                          product.status === 'in-stock'
                            ? '#155724'
                            : product.status === 'out-of-stock'
                            ? '#721c24'
                            : '#856404',
                      }}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {isReorderMode ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => moveProduct(product._id, index - 1)}
                          disabled={index === 0}
                          aria-label={`Move ${product.title} up`}
                          style={{ padding: '5px 10px', border: '1px solid #cbd5e1', borderRadius: '3px', background: 'white', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.45 : 1 }}
                        >
                          &uarr;
                        </button>
                        <button
                          type="button"
                          onClick={() => moveProduct(product._id, index + 1)}
                          disabled={index === orderedProducts.length - 1}
                          aria-label={`Move ${product.title} down`}
                          style={{ padding: '5px 10px', border: '1px solid #cbd5e1', borderRadius: '3px', background: 'white', cursor: index === orderedProducts.length - 1 ? 'not-allowed' : 'pointer', opacity: index === orderedProducts.length - 1 ? 0.45 : 1 }}
                        >
                          &darr;
                        </button>
                      </div>
                    ) : <div style={{ display: 'flex', gap: '10px' }}>
                      <Link 
                        href={`/admin/products/edit/${product._id}`}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#3498db',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '3px',
                          fontSize: '14px',
                        }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(product._id)}
                        disabled={isDeleting}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: isDeleting ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          opacity: isDeleting ? 0.7 : 1,
                        }}
                      >
                        Delete
                      </button>
                    </div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: '#7f8c8d' }}>
            No products found
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={handleDeleteCancel}
          >
            <div
              style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '10px',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#2c3e50' }}>
                {deleteTarget ? 'Delete Product' : 'Delete Selected Products'}
              </h2>
              
              <p style={{ color: '#666', fontSize: '16px', marginBottom: '30px', lineHeight: '1.6' }}>
                {deleteTarget 
                  ? 'Are you sure you want to delete this product? This action cannot be undone.'
                  : `Are you sure you want to delete ${selectedProducts.length} selected product(s)? This action cannot be undone.`
                }
              </p>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleDeleteCancel}
                  disabled={isDeleting}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    opacity: isDeleting ? 0.7 : 1,
                  }}
                >
                  {isDeleting ? (
                    <>
                      <ClipLoader size={16} color="white" style={{ marginRight: '8px', display: 'inline-block' }} />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => !isImporting && setShowImportModal(false)}
          >
            <div
              style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '10px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#2c3e50' }}>
                Import Products
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                  Upload an Excel (.xlsx, .xls) or CSV file with product data. 
                  Make sure brands and categories exist before importing.
                </p>
                <p style={{ color: '#e67e22', fontSize: '12px', marginBottom: '15px', fontWeight: 'bold' }}>
                  Required columns: Title, Price, Brand Name, Category Parent, Main Image URL
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                  }}
                />
                {importFile && (
                  <p style={{ marginTop: '10px', color: '#27ae60', fontSize: '14px' }}>
                    Selected: {importFile.name}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                  }}
                  disabled={isImporting}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: isImporting ? 'not-allowed' : 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={!importFile || isImporting}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#e67e22',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: (!importFile || isImporting) ? 'not-allowed' : 'pointer',
                    opacity: (!importFile || isImporting) ? 0.7 : 1,
                  }}
                >
                  {isImporting ? (
                    <>
                      <ClipLoader size={16} color="white" style={{ marginRight: '8px', display: 'inline-block' }} />
                      Importing...
                    </>
                  ) : (
                    'Import'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProductsPage;
