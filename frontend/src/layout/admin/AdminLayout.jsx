import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ROLE_MENU_ACCESS = {
  'Super Admin': [
    { name: 'Product Reviews', icon: 'star', path: '/admin/reviews' }, { name: 'Dashboard', icon: 'dashboard', path: '/admin' },
    { name: 'Products', icon: 'products', path: '/admin/products' }, { name: 'Categories', icon: 'categories', path: '/admin/categories' },
    { name: 'Brands', icon: 'brands', path: '/admin/brands' }, { name: 'Coupons', icon: 'coupons', path: '/admin/coupons' },
    { name: 'Users', icon: 'users', path: '/admin/users' }, { name: 'Orders', icon: 'orders', path: '/admin/orders' },
    { name: 'Root Checks', icon: 'checks', path: '/admin/consultations' }, { name: 'Blogs', icon: 'blogs', path: '/admin/blogs' },
    { name: 'Marketing', icon: 'marketing', path: '/admin/marketing', submenu: [{ name: 'Newsletter Subscribers', path: '/admin/newsletter' }] },
    { name: 'Settings', icon: 'settings', path: '/admin/settings' }, { name: 'Staff Management', icon: 'staff', path: '/admin/staff' },
  ],
  'Order Manager': [
    { name: 'Dashboard', icon: 'dashboard', path: '/admin' }, { name: 'Orders', icon: 'orders', path: '/admin/orders' },
    { name: 'Users', icon: 'users', path: '/admin/users' }, { name: 'Root Checks', icon: 'checks', path: '/admin/consultations' },
  ],
  'Store Manager': [
    { name: 'Product Reviews', icon: 'star', path: '/admin/reviews' }, { name: 'Dashboard', icon: 'dashboard', path: '/admin' },
    { name: 'Products', icon: 'products', path: '/admin/products' }, { name: 'Categories', icon: 'categories', path: '/admin/categories' },
    { name: 'Brands', icon: 'brands', path: '/admin/brands' }, { name: 'Coupons', icon: 'coupons', path: '/admin/coupons' },
  ],
  'Support Staff': [
    { name: 'Dashboard', icon: 'dashboard', path: '/admin' }, { name: 'Orders', icon: 'orders', path: '/admin/orders' },
    { name: 'Root Checks', icon: 'checks', path: '/admin/consultations' }, { name: 'Users', icon: 'users', path: '/admin/users' },
  ],
};

const MenuIcon = ({ name }) => {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    products: <><path d="m21 16-9 5-9-5V8l9-5 9 5z"/><path d="m3 7.5 9 5 9-5M12 22v-9.5"/></>, categories: <><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></>,
    orders: <><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>,
    brands: <><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3.4 13.4a2 2 0 0 1 0-2.8l7.2-7.2A2 2 0 0 1 12 2.8H20v8a2 2 0 0 1-.6 1.4Z"/><circle cx="16.5" cy="7.5" r="1"/></>,
    coupons: <><path d="M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 1 0-4V4H3z"/><path d="M13 4v2m0 4v2m0 4v2"/></>,
    checks: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/></>,
    blogs: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></>,
    marketing: <><path d="m3 11 18-5v12L3 13z"/><path d="M11.6 15.4 13 21H8l-2-7"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.8 1L15.7 21h-2.8l-.3-1.9a8 8 0 0 1-1.8-1l-1.7.7-1.4-2.4L9.1 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.8-1L13 7h2.8l.3 1.9a8 8 0 0 1 1.8 1l1.7-.7 1.4 2.4L19.5 13a8 8 0 0 1-.1 2Z"/></>,
    staff: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6m-3-3h6"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.dashboard}</svg>;
};

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const adminInfo = Cookies.get('adminInfo');
    if (!adminInfo) router.push('/admin/login');
    else {
      try { const adminData = JSON.parse(adminInfo).admin; setAdmin(adminData); setMenuItems(ROLE_MENU_ACCESS[adminData.role] || ROLE_MENU_ACCESS['Super Admin']); }
      catch (error) { router.push('/admin/login'); }
    }
  }, [router]);

  const handleLogout = () => { Cookies.remove('adminInfo'); router.push('/admin/login'); };
  if (!admin) return null;

  return <div className={`admin-layout ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'} ${mobileNavOpen ? 'mobile-nav-open' : ''}`}>
    <button className="admin-mobile-scrim" type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-brand"><Image src="/assets/img/logo/favicon.png" alt="HRACINE" width={40} height={40} /><span><strong>HRACINE</strong><small>Admin Panel</small></span></Link>
      <nav className="admin-sidebar-nav" aria-label="Admin navigation">{menuItems.map((item) => {
        const active = (item.path === '/admin' ? router.pathname === '/admin' : router.pathname === item.path || router.pathname.startsWith(`${item.path}/`)) || item.submenu?.some((sub) => router.pathname === sub.path || router.pathname.startsWith(`${sub.path}/`));
        return <div key={item.path}><Link href={item.submenu ? item.submenu[0].path : item.path} onClick={() => setMobileNavOpen(false)} className={`admin-nav-link ${active ? 'active' : ''}`} title={!sidebarOpen ? item.name : undefined}><span className="admin-nav-icon"><MenuIcon name={item.icon} /></span><span className="admin-nav-label">{item.name}</span></Link>{sidebarOpen && item.submenu && active && <div className="admin-submenu">{item.submenu.map((sub) => <Link key={sub.path} href={sub.path} onClick={() => setMobileNavOpen(false)} className={router.pathname === sub.path ? 'active' : ''}>{sub.name}</Link>)}</div>}</div>;
      })}</nav>
      <div className="admin-sidebar-profile"><span className="admin-avatar">{(admin.name || 'A').slice(0, 1).toUpperCase()}</span><div className="admin-profile-copy"><strong>{admin.name}</strong><small>{admin.role}</small></div><button type="button" className="admin-logout" onClick={handleLogout} title="Sign out" aria-label="Sign out"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3M21 3v18"/></svg></button></div>
    </aside>
    <main className="admin-main"><header className="admin-topbar"><button type="button" className="admin-menu-toggle" onClick={() => { if (window.matchMedia('(max-width: 900px)').matches) setMobileNavOpen((open) => !open); else setSidebarOpen((open) => !open); }} aria-label="Toggle navigation"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button><div className="admin-topbar-title">HRACINE <span>Administration</span></div><Link href="/" className="admin-site-link">View store <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></Link></header><div className="admin-page-content">{children}</div></main>
    <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover={false} className="tp-toast-container" />
  </div>;
};

export default AdminLayout;
