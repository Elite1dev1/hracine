import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// internal
import { ArrowRightLong } from '@/svg';
import founder_img from '@assets/img/about/founders.jpeg';

const FounderNote = () => {
  return (
    <section className="tp-founder-note-area pt-120 pb-120" style={{ backgroundColor: '#22160E' }}>
      <div className="container" style={{ margin: '0 auto', width: '100%', maxWidth: '100%' }}>
        <div className="row align-items-center" style={{ marginLeft: '0', marginRight: '0' }}>
          <div className="col-xl-5 col-lg-6 col-12">
            <div className="tp-founder-note-thumb" style={{
              marginBottom: 'clamp(30px, 5vw, 0px)',
              textAlign: 'center'
            }}>
              <Image
                src={founder_img}
                alt="Founder"
                style={{
                  borderRadius: '8px',
                  width: '82%',
                  height: 'auto',
                  maxWidth: '420px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  margin: '0 auto'
                }}
              />
            </div>
          </div>
          <div className="col-xl-7 col-lg-6 col-12">
            <div className="tp-founder-note-content" style={{
              paddingLeft: 'clamp(15px, 5vw, 60px)',
              paddingRight: 'clamp(15px, 5vw, 60px)',
              margin: '0 auto',
              maxWidth: '100%',
              textAlign: 'center'
            }}>
              <div className="tp-section-title-wrapper mb-40" style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '100%'
              }}>
                <span className="tp-section-title-pre" style={{
                  fontSize: 'clamp(12px, 2vw, 14px)',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  color: '#E8E8E8',
                  marginBottom: '15px',
                  display: 'block',
                  textAlign: 'center'
                }}>
                  A Note From Our Founder
                </span>
                <h3 className="tp-section-title" style={{
                  fontSize: 'clamp(24px, 5vw, 36px)',
                  marginBottom: '30px',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}>
                  Rooted in Purpose
                </h3>
              </div>
              <div className="tp-founder-note-text" style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '100%'
              }}>
                <p style={{
                  fontSize: 'clamp(14px, 2.5vw, 18px)',
                  lineHeight: '1.8',
                  color: '#E8E8E8',
                  marginBottom: '25px',
                  textAlign: 'center',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}>
                  &quot;After years of struggling with scalp issues, I discovered that the secret to beautiful hair
                  isn&apos;t in the latest trend—it&apos;s in nurturing your roots. That&apos;s why every product we create
                  starts with scalp health.&quot;
                </p>
                <p style={{
                  fontSize: 'clamp(14px, 2.5vw, 18px)',
                  lineHeight: '1.8',
                  color: '#E8E8E8',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}>
                  Join us on this journey to healthier, happier hair—one ritual at a time.
                </p>
              </div>
              <div className="tp-founder-note-btn mt-40" style={{
                textAlign: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '100%'
              }}>
                <Link href="/about" className="tp-btn tp-btn-2" style={{
                  backgroundColor: '#FFFFFF',
                  color: '#22160E',
                  borderColor: '#FFFFFF',
                  display: 'inline-block',
                  margin: '0 auto'
                }}>
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
