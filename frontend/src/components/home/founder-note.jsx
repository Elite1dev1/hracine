import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// internal
import { ArrowRightLong } from '@/svg';
import founder_img from '@assets/img/about/about-1.jpg';

const FounderNote = () => {
  return (
    <section className="tp-founder-note-area pt-120 pb-120">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-5 col-lg-6">
            <div className="tp-founder-note-thumb">
              <Image 
                src={founder_img} 
                alt="Founder" 
                style={{ 
                  borderRadius: '8px', 
                  width: '100%', 
                  height: 'auto',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }} 
              />
            </div>
          </div>
          <div className="col-xl-7 col-lg-6">
            <div className="tp-founder-note-content pl-60">
              <div className="tp-section-title-wrapper mb-40">
                <span className="tp-section-title-pre" style={{ 
                  fontSize: '14px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '2px',
                  color: '#55585B',
                  marginBottom: '15px',
                  display: 'block'
                }}>
                  A Note From Our Founder
                </span>
                <h3 className="tp-section-title" style={{ fontSize: '36px', marginBottom: '30px' }}>
                  Rooted in Purpose
                </h3>
              </div>
              <div className="tp-founder-note-text">
                <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#55585B', marginBottom: '25px' }}>
                  &quot;After years of struggling with scalp issues, I discovered that the secret to beautiful hair 
                  isn&apos;t in the latest trend—it&apos;s in nurturing your roots. That&apos;s why every product we create 
                  starts with scalp health.&quot;
                </p>
                <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#55585B', fontStyle: 'italic' }}>
                  Join us on this journey to healthier, happier hair—one ritual at a time.
                </p>
              </div>
              <div className="tp-founder-note-btn mt-40">
                <Link href="/about" className="tp-btn tp-btn-2">
                  Our Story <ArrowRightLong />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderNote;
