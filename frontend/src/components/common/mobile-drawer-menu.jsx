import React from 'react';
import Link from 'next/link';

const MOBILE_DRAWER_SECTIONS = [
  {
    id: 'shop',
    label: 'SHOP',
    items: [
      { title: 'Home', href: '/' },
      { title: 'Products', href: '/shop' },
      { title: 'Cart', href: '/cart' },
      { title: 'Coupons', href: '/coupon' },
    ],
  },
  {
    id: 'account',
    label: 'ACCOUNT',
    items: [
      { title: 'My Account', href: '/profile' },
      { title: 'Consultations', href: '/consultation' },
    ],
  },
  {
    id: 'content',
    label: 'CONTENT',
    items: [
      { title: 'Blog', href: '/blog' },
      { title: 'Community', href: '/community' },
    ],
  },
];

const MobileDrawerMenu = () => {
  return (
    <nav className="tp-mobile-drawer-menu" aria-label="Mobile navigation">
      {MOBILE_DRAWER_SECTIONS.map((section) => (
        <div key={section.id} className="tp-mobile-drawer-section">
          <h3 className="tp-mobile-drawer-section-head">{section.label}</h3>
          <ul className="tp-mobile-drawer-list">
            {section.items.map((item) => (
              <li key={item.href + item.title}>
                <Link href={item.href} className="tp-mobile-drawer-link">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default MobileDrawerMenu;
