import React, { useState } from 'react';
import AdminLayout from '@/layout/admin/AdminLayout';
import {
  useAdminGetAllBlogsQuery,
  useAdminDeleteBlogMutation,
} from '@/redux/features/admin/adminApi';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';

const AdminBlogsPage = () => {
  const { data, isLoading, error } = useAdminGetAllBlogsQuery();
  const [deleteBlog, { isLoading: isDeleting }] = useAdminDeleteBlogMutation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id).unwrap();
        toast.success('Blog deleted successfully');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete blog');
      }
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

  const blogs = data?.data || [];
  const filteredBlogs = blogs.filter((blog) =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Blogs Management</h1>
          <Link 
            href="/admin/blogs/add"
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
            }}
          >
            + Add Blog
          </Link>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
            }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Image</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Author</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Views</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr key={blog._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px' }}>
                    <img
                      src={blog.img}
                      alt={blog.title}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                  </td>
                  <td style={{ padding: '12px' }}>{blog.title}</td>
                  <td style={{ padding: '12px' }}>{blog.author}</td>
                  <td style={{ padding: '12px' }}>{blog.category}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        backgroundColor:
                          blog.status === 'published'
                            ? '#d4edda'
                            : blog.status === 'draft'
                            ? '#fff3cd'
                            : '#f8d7da',
                        color:
                          blog.status === 'published'
                            ? '#155724'
                            : blog.status === 'draft'
                            ? '#856404'
                            : '#721c24',
                      }}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{blog.views || 0}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link 
                        href={`/admin/blogs/edit/${blog._id}`}
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
                        onClick={() => handleDelete(blog._id)}
                        disabled={isDeleting}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBlogs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: '#7f8c8d' }}>
            No blogs found
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlogsPage;
