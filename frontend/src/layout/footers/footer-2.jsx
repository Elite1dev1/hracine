import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// internal
import social_data from '@/data/social-data';
import { Email, Location } from '@/svg';
import logo from '@assets/img/logo/favicon.png';

const FooterTwo = () => {
  return (
    <>
      <footer>
        <div className="tp-footer-area tp-footer-style-2 tp-footer-style-3 tp-footer-style-4" data-bg-color="#85312C" style={{ backgroundColor: `#85312C` }}>
          <div className="tp-footer-top pt-95 pb-40">
            <div className="container">
              {/* Desktop: Original 4-column layout */}
              <div className="row d-none d-lg-flex">
                <div className="col-xl-3 col-lg-3">
                  <div className="tp-footer-widget footer-col-4-1 mb-50">
                    <div className="tp-footer-logo">
                      <Link href="/">
                        <Image 
                          src={logo} 
                          alt="logo" 
                          width={120} 
                          height={120} 
                          style={{ width: 'auto', height: 'auto', maxWidth: '150px' }}
                          className="d-none d-md-block"
                        />
                        <Image 
                          src={logo} 
                          alt="logo" 
                          width={50} 
                          height={50} 
                          style={{ width: 'auto', height: 'auto', maxWidth: '50px', maxHeight: '50px' }}
                          className="d-block d-md-none"
                        />
                      </Link>
                    </div>
                    <div className="tp-footer-widget-content">
                      <div className="tp-footer-talk mb-20">
                        <span>Got Questions? Call us</span>
                        <h4><a href="tel:08039311425">08039311425</a></h4>
                      </div>
                      <div className="tp-footer-contact">
                        <div className="tp-footer-contact-item d-flex align-items-start">
                          <div className="tp-footer-contact-icon">
                            <span>
                              <Email />
                            </span>
                          </div>
                          <div className="tp-footer-contact-content">
                            <p><a href="mailto:support@hracine.com">support@hracine.com</a></p>
                          </div>
                        </div>
                        <div className="tp-footer-contact-item d-flex align-items-start">
                          <div className="tp-footer-contact-icon">
                            <span>
                              <Location />
                            </span>
                          </div>
                          <div className="tp-footer-contact-content">
                            <p><a href="https://www.google.com/maps/place/Lagos,+Nigeria" target="_blank">Lagos, Nigeria</a></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-3">
                  <div className="tp-footer-widget footer-col-4-2 mb-50">
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
                <div className="col-xl-3 col-lg-2">
                  <div className="tp-footer-widget footer-col-4-3 mb-50">
                    <h4 className="tp-footer-widget-title">Infomation</h4>
                    <div className="tp-footer-widget-content">
                      <ul>
                        <li><a href="#">Our Story</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms & Conditions</a></li>
                        <li><a href="#">Latest News</a></li>
                        <li><a href="#">Contact Us</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4">
                  <div className="tp-footer-widget footer-col-4-4 mb-50">
                    <h4 className="tp-footer-widget-title">Subcribe.</h4>
                    <div className="tp-footer-widget-content">
                      <div className="tp-footer-subscribe">
                        <p>Our conversation is just getting started</p>
                        <div className="tp-footer-subscribe-form mb-30">
                          <form action="#">
                            <div className="tp-footer-subscribe-input">
                              <input type="email" placeholder="Enter Your Email" />
                              <button type="submit">Subscribe</button>
                            </div>
                          </form>
                        </div>
                        <div className="tp-footer-social-4 tp-footer-social">
                          <h4 className="tp-footer-social-title-4">Follow Us On</h4>
                          {social_data.map(s => <a href={s.link} key={s.id} target="_blank">
                            <i className={s.icon}></i>
                          </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Mobile/Tablet: 2-row layout */}
              <div className="d-lg-none">
                {/* Row 1: Information + My Account */}
                <div className="row mb-4 mb-md-5">
                  <div className="col-6 col-md-6 mb-4 mb-md-0">
                    <div className="tp-footer-widget footer-col-4-3">
                      <h4 className="tp-footer-widget-title" style={{ paddingLeft: '10px' }}>Infomation</h4>
                      <div className="tp-footer-widget-content">
                        <ul>
                          <li><a href="#">Our Story</a></li>
                          <li className="d-none d-md-block"><a href="#">Careers</a></li>
                          <li><a href="#">Privacy Policy</a></li>
                          <li><a href="#">Terms & Conditions</a></li>
                          <li><a href="#">Latest News</a></li>
                          <li><a href="#">Contact Us</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-6">
                    <div className="tp-footer-widget footer-col-4-2">
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
                </div>
                {/* Row 2: Logo + Talk To Us */}
                <div className="row">
                  <div className="col-6 col-md-6 mb-4 mb-md-0">
                    <div className="tp-footer-widget footer-col-4-1">
                      <div className="tp-footer-logo">
                        <Link href="/">
                          <Image src={logo} alt="logo" width={120} height={120} style={{ width: 'auto', height: 'auto', maxWidth: '150px' }} />
                        </Link>
                      </div>
                      <div className="tp-footer-widget-content">
                        <div className="tp-footer-social-4 tp-footer-social d-none d-md-flex">
                          <h4 className="tp-footer-social-title-4 d-none d-md-block">Follow Us On</h4>
                          {social_data.map(s => <a href={s.link} key={s.id} target="_blank">
                            <i className={s.icon}></i>
                          </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-6">
                    <div className="tp-footer-widget footer-col-4-1">
                      <h4 className="tp-footer-widget-title">Talk To Us</h4>
                      <div className="tp-footer-widget-content">
                        <div className="tp-footer-talk mb-20">
                          <span>Got Questions? Call us</span>
                          <h4><a href="tel:08039311425">08039311425</a></h4>
                        </div>
                        <div className="tp-footer-contact">
                          <div className="tp-footer-contact-item d-flex align-items-start d-none d-md-flex">
                            <div className="tp-footer-contact-icon">
                              <span>
                                <Email />
                              </span>
                            </div>
                            <div className="tp-footer-contact-content">
                              <p><a href="mailto:support@hracine.com">support@hracine.com</a></p>
                            </div>
                          </div>
                          <div className="tp-footer-contact-item d-flex align-items-start d-none d-md-flex">
                            <div className="tp-footer-contact-icon">
                              <span>
                                <Location />
                              </span>
                            </div>
                            <div className="tp-footer-contact-content">
                              <p><a href="https://www.google.com/maps/place/Lagos,+Nigeria" target="_blank">Lagos, Nigeria</a></p>
                            </div>
                          </div>
                        </div>
                        <div className="tp-footer-subscribe mt-4">
                          <p className="d-none d-md-block">Our conversation is just getting started</p>
                          <div className="tp-footer-subscribe-form mb-30 d-none d-md-block">
                            <form action="#">
                              <div className="tp-footer-subscribe-input">
                                <input type="email" placeholder="Enter Your Email" />
                                <button type="submit">Subscribe</button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterTwo;