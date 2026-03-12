import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// internal
import logo from '@assets/img/logo/favicon.png';
import social_data from '@/data/social-data';
import { Email, Location } from '@/svg';

const MOBILE_SOCIAL_LINKS = [
  { id: 'instagram', url: 'https://www.instagram.com/theroot.tribe?igsh=MWwyM2U0cWk5djF3bQ%3D%3D&utm_source=qr', icon: 'fa-brands fa-instagram', label: 'Instagram' },
  { id: 'tiktok', url: 'https://www.tiktok.com/@hracine_?_r=1&_t=ZS-94NiEOX6A24', icon: 'fa-brands fa-tiktok', label: 'TikTok' },
  { id: 'pinterest', url: 'https://pin.it/7A0JjyP8x', icon: 'fa-brands fa-pinterest-p', label: 'Pinterest' },
];

const Footer = ({ style_2 = false, style_3 = false, primary_style = false }) => {
  const [mobileOpenSection, setMobileOpenSection] = useState(null);

  const toggleMobileSection = (key) => {
    setMobileOpenSection((prev) => (prev === key ? null : key));
  };

  return (
    <footer>
      <div className={`tp-footer-area ${primary_style?'tp-footer-style-2 tp-footer-style-primary tp-footer-style-6':''} ${style_2 ?'tp-footer-style-2':style_3 ? 'tp-footer-style-2 tp-footer-style-3': ''}`}
        data-bg-color={`${style_2 ? 'footer-bg-white' : 'footer-bg-grey'}`}>
        <div className="tp-footer-top pt-95 pb-40">
          <div className="container">
            {/* Desktop: Original 4-column layout */}
            <div className="row d-none d-lg-flex">
              <div className="col-xl-4 col-lg-3">
                <div className="tp-footer-widget footer-col-1 mb-50">
                  <div className="tp-footer-widget-content">
                    <div className="tp-footer-logo">
                      <Link href="/">
                        <Image 
                          src={logo} 
                          alt="logo" 
                          width={120} 
                          height={120} 
                          style={{ 
                            width: 'auto', 
                            height: 'auto', 
                            maxWidth: '150px',
                            maxHeight: '150px'
                          }}
                          className="d-none d-md-block"
                        />
                        <Image 
                          src={logo} 
                          alt="logo" 
                          width={50} 
                          height={50} 
                          style={{ 
                            width: 'auto', 
                            height: 'auto', 
                            maxWidth: '50px',
                            maxHeight: '50px'
                          }}
                          className="d-block d-md-none"
                        />
                      </Link>
                    </div>
                    <p className="tp-footer-desc" style={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                      fontSize: '16px'
                    }}>Root-Deep Care & Moisture. That Lasts.</p>
                    <div className="tp-footer-social">
                      {social_data.map(s => <a href={s.link} key={s.id} target="_blank">
                        <i className={s.icon}></i>
                      </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-3">
                <div className="tp-footer-widget footer-col-2 mb-50">
                  <h4 className="tp-footer-widget-title">My Account</h4>
                  <div className="tp-footer-widget-content">
                    <ul>
                      <li><a href="#">Track Orders</a></li>
                      <li><a href="#">Shipping</a></li>
                      <li><a href="#">Wishlist</a></li>
                      <li><a href="#">My Account</a></li>
                      <li><a href="#">Order History</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3">
                <div className="tp-footer-widget footer-col-3 mb-50">
                  <h4 className="tp-footer-widget-title">Information</h4>
                  <div className="tp-footer-widget-content">
                    <ul>
                      <li><a href="#">Our Story</a></li>
                      <li><a href="#">Careers</a></li>
                      <li><a href="#">Privacy Policy</a></li>
                      <li><a href="#">Terms & Conditions</a></li>
                      <li><a href="#">Latest Stories</a></li>
                      <li><a href="#">Contact Us</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3">
                <div className="tp-footer-widget footer-col-4 mb-50">
                  <h4 className="tp-footer-widget-title">Talk To Us</h4>
                  <div className="tp-footer-widget-content">
                    <div className="tp-footer-talk mb-20">
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#22160E' }}>Got Questions? Call us</span>
                      <h4 style={{ fontSize: '20px', marginTop: '6px', marginBottom: '0' }}>
                        <a href="tel:08039311425" style={{ color: '#22160E' }}>08039311425</a>
                      </h4>
                    </div>
                    <div className="tp-footer-contact">
                      <div className="tp-footer-contact-item d-flex align-items-start">
                        <div className="tp-footer-contact-icon">
                          <span>
                            <Email />
                          </span>
                        </div>
                        <div className="tp-footer-contact-content">
                          <p style={{ marginBottom: '6px', fontSize: '14px', color: '#55585B' }}>
                            <a href="mailto:support@hracine.com" style={{ color: '#22160E' }}>support@hracine.com</a>
                          </p>
                        </div>
                      </div>
                      <div className="tp-footer-contact-item d-flex align-items-start">
                        <div className="tp-footer-contact-icon">
                          <span>
                            <Location />
                          </span>
                        </div>
                        <div className="tp-footer-contact-content">
                          <p style={{ marginBottom: 0, fontSize: '14px', color: '#55585B' }}>
                            <a
                              href="https://www.google.com/maps/place/Lagos,+Nigeria"
                              target="_blank"
                              style={{ color: '#22160E' }}
                            >
                              Lagos, Nigeria
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile only: accordion layout (desktop unchanged above) */}
            <div className="d-lg-none tp-footer-mobile">
              {/* Logo + brand statement at top center */}
              <div className="tp-footer-mobile-brand">
                <Link href="/" className="tp-footer-mobile-logo-link">
                  <Image src={logo} alt="Hracine" width={80} height={80} style={{ width: 'auto', height: 'auto', maxWidth: '80px', maxHeight: '80px' }} />
                </Link>
                <p className="tp-footer-mobile-tagline">Root-Deep Care &amp; Moisture. That Lasts.</p>
              </div>

              {/* Accordion sections */}
              <div className="tp-footer-mobile-accordion">
                <div className="tp-footer-mobile-accordion-item">
                  <button
                    type="button"
                    className="tp-footer-mobile-accordion-head"
                    onClick={() => toggleMobileSection('information')}
                    aria-expanded={mobileOpenSection === 'information'}
                    aria-controls="footer-acc-information"
                    id="footer-acc-information-head"
                  >
                    <span>Information</span>
                    <span className="tp-footer-mobile-accordion-icon" aria-hidden>{mobileOpenSection === 'information' ? '−' : '+'}</span>
                  </button>
                  <div
                    id="footer-acc-information"
                    className={`tp-footer-mobile-accordion-body ${mobileOpenSection === 'information' ? 'is-open' : ''}`}
                    role="region"
                    aria-labelledby="footer-acc-information-head"
                  >
                    <div className="tp-footer-mobile-accordion-inner">
                      <ul>
                        <li><Link href="/about">Our Story</Link></li>
                        <li><Link href="#">Privacy Policy</Link></li>
                        <li><Link href="#">Terms &amp; Conditions</Link></li>
                        <li><Link href="/blog">Latest Stories</Link></li>
                        <li><Link href="/contact">Contact Us</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="tp-footer-mobile-accordion-divider" />

                <div className="tp-footer-mobile-accordion-item">
                  <button
                    type="button"
                    className="tp-footer-mobile-accordion-head"
                    onClick={() => toggleMobileSection('myaccount')}
                    aria-expanded={mobileOpenSection === 'myaccount'}
                    aria-controls="footer-acc-myaccount"
                    id="footer-acc-myaccount-head"
                  >
                    <span>My Account</span>
                    <span className="tp-footer-mobile-accordion-icon" aria-hidden>{mobileOpenSection === 'myaccount' ? '−' : '+'}</span>
                  </button>
                  <div
                    id="footer-acc-myaccount"
                    className={`tp-footer-mobile-accordion-body ${mobileOpenSection === 'myaccount' ? 'is-open' : ''}`}
                    role="region"
                    aria-labelledby="footer-acc-myaccount-head"
                  >
                    <div className="tp-footer-mobile-accordion-inner">
                      <ul>
                        <li><Link href="/order-tracking">Track Orders</Link></li>
                        <li><Link href="#">Shipping</Link></li>
                        <li><Link href="/wishlist">Wishlist</Link></li>
                        <li><Link href="/my-account">My Account</Link></li>
                        <li><Link href="/my-account/orders">Order History</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="tp-footer-mobile-accordion-divider" />

                <div className="tp-footer-mobile-accordion-item">
                  <button
                    type="button"
                    className="tp-footer-mobile-accordion-head"
                    onClick={() => toggleMobileSection('talktous')}
                    aria-expanded={mobileOpenSection === 'talktous'}
                    aria-controls="footer-acc-talktous"
                    id="footer-acc-talktous-head"
                  >
                    <span>Talk To Us</span>
                    <span className="tp-footer-mobile-accordion-icon" aria-hidden>{mobileOpenSection === 'talktous' ? '−' : '+'}</span>
                  </button>
                  <div
                    id="footer-acc-talktous"
                    className={`tp-footer-mobile-accordion-body ${mobileOpenSection === 'talktous' ? 'is-open' : ''}`}
                    role="region"
                    aria-labelledby="footer-acc-talktous-head"
                  >
                    <div className="tp-footer-mobile-accordion-inner">
                      <p className="tp-footer-mobile-got-questions">Got Questions?</p>
                      <a href="mailto:support@hracine.com" className="tp-footer-mobile-email-btn">
                        Email support@hracine.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: social + copyright */}
              <div className="tp-footer-mobile-bottom">
                <div className="tp-footer-mobile-social">
                  {MOBILE_SOCIAL_LINKS.map((s) => (
                    <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="tp-footer-mobile-social-link" aria-label={s.label}>
                      <i className={s.icon} />
                    </a>
                  ))}
                </div>
                <p className="tp-footer-mobile-copyright">© 2026 Hracine. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;