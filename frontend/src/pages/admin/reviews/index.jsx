import React, { useMemo, useState } from 'react';
import AdminLayout from '@/layout/admin/AdminLayout';
import {
  useAdminGetAllProductsQuery,
  useAdminGetReviewsQuery,
  useAdminCreateReviewMutation,
  useAdminImportReviewsMutation,
  useAdminUpdateReviewMutation,
  useAdminDeleteReviewMutation,
} from '@/redux/features/admin/adminApi';
import { toast } from 'react-toastify';

const emptyForm = { productId: '', displayName: '', comment: '', rating: '', reviewDate: '', isPublished: false };
const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #d5dbe1', borderRadius: 6, font: 'inherit' };
const buttonStyle = { border: 0, borderRadius: 5, padding: '8px 12px', cursor: 'pointer', fontWeight: 600 };

const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') { cell += '"'; index += 1; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(cell); cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[index + 1] === '\n') index += 1;
      row.push(cell); cell = '';
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
    } else cell += char;
  }
  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);
  if (rows.length < 2) throw new Error('CSV must include a header row and at least one review.');
  const headers = rows.shift().map((value) => value.trim().replace(/^\uFEFF/, '').toLowerCase());
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, (values[index] || '').trim()])));
};

const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const AdminReviewsPage = () => {
  const [filters, setFilters] = useState({ source: '', published: '', productId: '' });
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { data: reviewResponse, isLoading, error } = useAdminGetReviewsQuery(filters);
  const { data: productResponse } = useAdminGetAllProductsQuery();
  const [createReview, { isLoading: isCreating }] = useAdminCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useAdminUpdateReviewMutation();
  const [deleteReview] = useAdminDeleteReviewMutation();
  const [importReviews, { isLoading: isImporting }] = useAdminImportReviewsMutation();
  const reviews = useMemo(() => reviewResponse?.data || [], [reviewResponse?.data]);
  const products = productResponse?.data || [];
  const visibleReviews = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return reviews;
    return reviews.filter((review) => [review.displayName, review.comment, review.productId?.title, review.source]
      .some((value) => String(value || '').toLowerCase().includes(query)));
  }, [reviews, search]);

  const setField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const startEdit = (review) => {
    setShowForm(true);
    setEditingId(review._id);
    setForm({
      productId: review.productId?._id || review.productId || '',
      displayName: review.displayName || review.userId?.name || '',
      comment: review.comment || '',
      rating: review.rating ?? '',
      reviewDate: review.reviewDate ? new Date(review.reviewDate).toISOString().slice(0, 10) : '',
      isPublished: Boolean(review.isPublished),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const resetForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(false); };
  const exportReviews = () => {
    const columns = ['productId', 'productTitle', 'customerName', 'reviewText', 'rating', 'reviewDate', 'source', 'published'];
    const lines = [columns.map(csvCell).join(',')];
    reviews.forEach((review) => lines.push([
      review.productId?._id || review.productId,
      review.productId?.title,
      review.displayName || review.userId?.name,
      review.comment,
      review.rating ?? '',
      review.reviewDate ? new Date(review.reviewDate).toISOString().slice(0, 10) : '',
      review.source || 'website',
      review.isPublished ? 'true' : 'false',
    ].map(csvCell).join(',')));
    const blob = new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    const downloadUrl = URL.createObjectURL(blob);
    link.href = downloadUrl;
    link.download = `product-reviews-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  };
  const downloadTemplate = () => {
    const headers = ['productId', 'productTitle', 'sku', 'customerName', 'reviewText', 'rating', 'reviewDate', 'published'];
    const blob = new Blob([`\uFEFF${headers.map(csvCell).join(',')}\r\n`], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    const downloadUrl = URL.createObjectURL(blob);
    link.href = downloadUrl;
    link.download = 'product-reviews-import-template.csv';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  };
  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('CSV files must be 5 MB or smaller.');
      const parsedRows = parseCsv(await file.text());
      const mappedRows = parsedRows.map((row) => {
        const product = products.find((item) =>
          (row.productid && String(item._id).toLowerCase() === row.productid.toLowerCase()) ||
          (row.producttitle && item.title.toLowerCase() === row.producttitle.toLowerCase()) ||
          (row.sku && String(item.sku || '').toLowerCase() === row.sku.toLowerCase())
        );
        const rating = row.rating ? Number(row.rating) : null;
        return {
          productId: row.productid || product?._id || '',
          displayName: row.customername || row.displayname || '',
          comment: row.reviewtext || row.comment || '',
          rating: rating === null ? null : rating,
          reviewDate: row.reviewdate || null,
          isPublished: ['true', 'yes', '1', 'published'].includes((row.published || '').toLowerCase()),
        };
      });
      const result = await importReviews(mappedRows).unwrap();
      toast.success(result?.message || 'Reviews imported');
      if (result?.errors?.length) {
        const errorSummary = result.errors.slice(0, 4).map((item) => `Row ${item.row}: ${item.message}`).join(' · ');
        toast.warning(`${result.errors.length} row(s) skipped. ${errorSummary}`);
      }
    } catch (err) {
      const details = err?.data?.errors?.length ? ` ${err.data.errors.map((item) => `Row ${item.row}: ${item.message}`).join(' ')}` : '';
      toast.error(`${err?.data?.message || err.message || 'Could not import reviews.'}${details}`);
    }
  };
  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...form, rating: form.rating === '' ? null : Number(form.rating), reviewDate: form.reviewDate || null };
    try {
      const result = editingId
        ? await updateReview({ id: editingId, data: payload }).unwrap()
        : await createReview(payload).unwrap();
      toast.success(result?.message || (editingId ? 'Review updated' : 'Review added'));
      resetForm();
    } catch (err) {
      toast.error(err?.data?.message || 'Could not save review');
    }
  };
  const togglePublished = async (review) => {
    try {
      await updateReview({ id: review._id, data: { isPublished: !review.isPublished } }).unwrap();
      toast.success(review.isPublished ? 'Review unpublished' : 'Review published');
    } catch (err) { toast.error(err?.data?.message || 'Could not update review'); }
  };
  const removeReview = async (review) => {
    if (!window.confirm(`Delete this review by ${review.displayName || review.userId?.name || 'customer'}?`)) return;
    try { await deleteReview(review._id).unwrap(); toast.success('Review deleted'); }
    catch (err) { toast.error(err?.data?.message || 'Could not delete review'); }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ margin: 0, color: '#2c3e50', fontSize: 28 }}>Product Reviews</h1>
          <p style={{ color: '#68737d', marginBottom: 0 }}>Add and manage customer feedback. Manual reviews are marked separately from website submissions.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            <button type="button" onClick={() => { resetForm(); setShowForm(true); }} style={{ ...buttonStyle, background: '#2c3e50', color: '#fff' }}>+ Add Review</button>
            <button type="button" disabled={isImporting || !products.length} onClick={() => document.getElementById('reviews-csv-import').click()} style={{ ...buttonStyle, background: '#e9ecef' }}>{isImporting ? 'Importing…' : 'Import CSV'}</button>
            <input id="reviews-csv-import" type="file" accept=".csv,text/csv" onChange={handleImport} style={{ display: 'none' }} />
            <button type="button" onClick={exportReviews} disabled={!reviews.length} style={{ ...buttonStyle, background: '#e9ecef' }}>Export CSV</button>
            <button type="button" onClick={downloadTemplate} style={{ ...buttonStyle, background: '#e9ecef' }}>CSV Template</button>
            <span style={{ alignSelf: 'center', color: '#68737d', fontSize: 13 }}>CSV columns: productId, customerName, reviewText, rating, reviewDate, published. Product title or SKU can replace productId.</span>
          </div>
        </div>

        {showForm && <form onSubmit={submit} style={{ padding: 20, border: '1px solid #e3e7eb', borderRadius: 8, marginBottom: 24, background: '#fbfcfd' }}>
          <h2 style={{ marginTop: 0, fontSize: 19 }}>{editingId ? 'Edit review' : 'Add customer review'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
            <label>Product<select required name="productId" value={form.productId} onChange={setField} style={inputStyle}>
              <option value="">Select a product</option>{products.map((product) => <option key={product._id} value={product._id}>{product.title}</option>)}
            </select></label>
            <label>Customer name<input required maxLength={120} name="displayName" value={form.displayName} onChange={setField} style={inputStyle} /></label>
            <label>Rating (optional)<select name="rating" value={form.rating} onChange={setField} style={inputStyle}>
              <option value="">No rating supplied</option>{[1, 2, 3, 4, 5].map((rating) => <option value={rating} key={rating}>{rating} {rating === 1 ? 'star' : 'stars'}</option>)}
            </select></label>
            <label>Review date (optional)<input type="date" name="reviewDate" value={form.reviewDate} onChange={setField} style={inputStyle} /></label>
          </div>
          <label style={{ display: 'block', marginTop: 14 }}>Review text<textarea required maxLength={5000} rows={4} name="comment" value={form.comment} onChange={setField} style={{ ...inputStyle, resize: 'vertical' }} /></label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 0' }}>
            <input type="checkbox" checked={form.isPublished} onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))} /> Publish on the website
          </label>
          <button disabled={isCreating || isUpdating} type="submit" style={{ ...buttonStyle, background: '#2c3e50', color: 'white' }}>{isCreating || isUpdating ? 'Saving…' : editingId ? 'Save changes' : 'Add review'}</button>
          {editingId && <button type="button" onClick={resetForm} style={{ ...buttonStyle, marginLeft: 8, background: '#e9ecef' }}>Cancel</button>}
        </form>}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <input aria-label="Search reviews" placeholder="Search customer, product, or review text" value={search} onChange={(event) => setSearch(event.target.value)} style={{ ...inputStyle, flex: '1 1 280px' }} />
          <select aria-label="Filter by product" value={filters.productId} onChange={(event) => setFilters((current) => ({ ...current, productId: event.target.value }))} style={{ ...inputStyle, width: 'auto', minWidth: 190 }}>
            <option value="">All products</option>{products.map((product) => <option key={product._id} value={product._id}>{product.title}</option>)}
          </select>
          <select aria-label="Filter by source" value={filters.source} onChange={(event) => setFilters((current) => ({ ...current, source: event.target.value }))} style={{ ...inputStyle, width: 'auto', minWidth: 170 }}>
            <option value="">All sources</option><option value="manual">Manually imported</option><option value="website">Website submission</option>
          </select>
          <select aria-label="Filter by publication status" value={filters.published} onChange={(event) => setFilters((current) => ({ ...current, published: event.target.value }))} style={{ ...inputStyle, width: 'auto', minWidth: 150 }}>
            <option value="">All statuses</option><option value="true">Published</option><option value="false">Unpublished</option>
          </select>
        </div>

        {isLoading ? <p>Loading reviews…</p> : error ? <p role="alert">Could not load reviews.</p> : (
          <div style={{ overflowX: 'auto', border: '1px solid #e3e7eb', borderRadius: 8 }}>
            <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#f4f6f8', textAlign: 'left' }}>{['Product', 'Customer', 'Review', 'Rating', 'Source', 'Status', 'Actions'].map((label) => <th key={label} style={{ padding: 12, borderBottom: '1px solid #e3e7eb' }}>{label}</th>)}</tr></thead>
              <tbody>{visibleReviews.map((review) => (
                <tr key={review._id}>
                  <td style={{ padding: 12, borderBottom: '1px solid #edf0f2' }}>{review.productId?.title || 'Product removed'}{review.reviewDate && <small style={{ display: 'block', color: '#68737d' }}>{new Date(review.reviewDate).toLocaleDateString()}</small>}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #edf0f2' }}>{review.displayName || review.userId?.name || 'Customer'}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #edf0f2', maxWidth: 350 }}>{review.comment}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #edf0f2' }}>{review.rating ? `${review.rating}/5` : 'Not provided'}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #edf0f2' }}>{review.source === 'manual' ? 'Manual' : 'Website'}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #edf0f2' }}>{review.isPublished ? 'Published' : 'Unpublished'}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #edf0f2', whiteSpace: 'nowrap' }}>
                    <button type="button" onClick={() => startEdit(review)} style={{ ...buttonStyle, background: '#e9ecef', marginRight: 6 }}>Edit</button>
                    <button type="button" onClick={() => togglePublished(review)} style={{ ...buttonStyle, background: review.isPublished ? '#fff0d6' : '#dff3e8', marginRight: 6 }}>{review.isPublished ? 'Unpublish' : 'Publish'}</button>
                    <button type="button" onClick={() => removeReview(review)} style={{ ...buttonStyle, color: '#fff', background: '#c0392b' }}>Delete</button>
                  </td>
                </tr>
              ))}
              {visibleReviews.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: 28, color: '#68737d' }}>No reviews match these filters.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReviewsPage;
