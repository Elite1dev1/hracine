import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const adminInfo = Cookies.get('adminInfo');
    if (!adminInfo) {
      router.push('/admin/login');
    } else {
      try {
        const parsed = JSON.parse(adminInfo);
        setAdmin(parsed.admin);
      } catch (error) {
        router.push('/admin/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('adminInfo');
    router.push('/admin/login');
  };

  if (!admin) {
    return null;
  }

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/admin' },
    { name: 'Products', icon: '📦', path: '/admin/products' },
    { name: 'Categories', icon: '📁', path: '/admin/categories' },
    { name: 'Brands', icon: '🏷️', path: '/admin/brands' },
    { name: 'Coupons', icon: '🎫', path: '/admin/coupons' },
    { name: 'Users', icon: '👥', path: '/admin/users' },
    { name: 'Orders', icon: '🛒', path: '/admin/orders' },
    { name: 'Consultations', icon: '💬', path: '/admin/consultations' },
    { name: 'Blogs', icon: '📝', path: '/admin/blogs' },
    { name: 'Marketing', icon: '📧', path: '/admin/marketing', submenu: [
      { name: 'Newsletter Subscribers', path: '/admin/newsletter' },
    ]},
    { name: 'Settings', icon: '⚙️', path: '/admin/settings' },
  ];

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '250px' : '70px',
          backgroundColor: '#2c3e50',
          color: 'white',
          transition: 'width 0.3s',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          zIndex: 1000,
        }}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid #34495e', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {sidebarOpen && (
            <Image 
              src="/assets/img/logo/favicon.png" 
              alt="Logo" 
              width={40} 
              height={40}
              style={{ width: 'auto', height: 'auto', maxWidth: '40px' }}
            />
          )}
          <h3 style={{ margin: 0, fontSize: sidebarOpen ? '20px' : '14px', whiteSpace: 'nowrap', overflow: 'hidden' }}>
            {sidebarOpen ? 'Admin Panel' : 'AP'}
          </h3>
        </div>
        <nav style={{ padding: '10px 0' }}>
          {menuItems.map((item) => {
            const isActive = router.pathname === item.path || 
              router.pathname.startsWith(item.path + '/') ||
              (item.submenu && item.submenu.some(sub => router.pathname === sub.path || router.pathname.startsWith(sub.path + '/')));
            
            return (
              <div key={item.path}>
                <Link 
                  href={item.submenu ? item.submenu[0].path : item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px 20px',
                    color: isActive ? '#3498db' : 'white',
                    textDecoration: 'none',
                    backgroundColor: isActive ? '#34495e' : 'transparent',
                    borderLeft: isActive ? '4px solid #3498db' : '4px solid transparent',
                  }}
                >
                  <span style={{ fontSize: '20px', marginRight: sidebarOpen ? '10px' : '0', minWidth: '20px' }}>
                    {item.icon}
                  </span>
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
                {sidebarOpen && item.submenu && isActive && (
                  <div style={{ paddingLeft: '20px', backgroundColor: '#1a252f' }}>
                    {item.submenu.map((subItem) => {
                      const isSubActive = router.pathname === subItem.path || router.pathname.startsWith(subItem.path + '/');
                      return (
                        <Link
                          key={subItem.path}
                          href={subItem.path}
                          style={{
                            display: 'block',
                            padding: '10px 20px',
                            color: isSubActive ? '#3498db' : '#bdc3c7',
                            textDecoration: 'none',
                            fontSize: '14px',
                            borderLeft: isSubActive ? '3px solid #3498db' : '3px solid transparent',
                            paddingLeft: isSubActive ? '17px' : '20px',
                          }}
                        >
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid #34495e', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '20px', marginRight: sidebarOpen ? '10px' : '0' }}>👤</span>
            {sidebarOpen && (
              <div>
                <div style={{ fontWeight: 'bold' }}>{admin.name}</div>
                <div style={{ fontSize: '12px', color: '#95a5a6' }}>{admin.email}</div>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {sidebarOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          marginLeft: sidebarOpen ? '250px' : '70px',
          flex: 1,
          transition: 'margin-left 0.3s',
          padding: '20px',
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '15px 20px',
            marginBottom: '20px',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ☰
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link href="/" style={{ color: '#3498db', textDecoration: 'none' }}>
              View Site
            </Link>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          {children}
        </div>
      </main>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        className="tp-toast-container"
      />
    </div>
  );
};

export default AdminLayout;
