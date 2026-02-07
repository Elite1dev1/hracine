import React, { useMemo, useState, useEffect } from 'react';

const RichTextEditor = ({ value, onChange, placeholder = 'Write your content here...' }) => {
  const [ReactQuill, setReactQuill] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only load on client side
    if (typeof window !== 'undefined') {
      setMounted(true);
      // Dynamically import ReactQuill and CSS
      Promise.all([
        import('react-quill'),
        import('react-quill/dist/quill.snow.css')
      ]).then(([quillModule]) => {
        setReactQuill(() => quillModule.default || quillModule);
      }).catch((error) => {
        console.error('Failed to load ReactQuill:', error);
      });
    }
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    },
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image'
  ];

  if (!mounted || !ReactQuill) {
    return (
      <div style={{ 
        minHeight: '300px', 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666'
      }}>
        Loading editor...
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          backgroundColor: 'white',
          minHeight: '300px',
        }}
      />
      <style dangerouslySetInnerHTML={{__html: `
        .quill {
          background: white;
        }
        .ql-container {
          min-height: 300px;
          font-size: 16px;
        }
        .ql-editor {
          min-height: 300px;
        }
        .ql-editor.ql-blank::before {
          font-style: normal;
          color: #999;
        }
        .ql-toolbar {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border: 1px solid #ddd;
          border-bottom: none;
        }
        .ql-container {
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          border: 1px solid #ddd;
          border-top: none;
        }
        .ql-snow .ql-stroke {
          stroke: #555;
        }
        .ql-snow .ql-fill {
          fill: #555;
        }
        .ql-snow .ql-picker-label {
          color: #555;
        }
      `}} />
    </div>
  );
};

export default RichTextEditor;
