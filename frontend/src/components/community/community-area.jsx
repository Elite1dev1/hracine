import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// internal
import { ArrowRightLong } from '@/svg';
// You'll need to add placeholder images or use existing ones
import community_img from '@assets/img/about/about-1.jpg';

const CommunityArea = () => {
  const benefits = [
    {
      id: 1,
      icon: '🎁',
      title: 'Early Access',
      description: 'Be the first to try new products and exclusive launches'
    },
    {
      id: 2,
      icon: '🏆',
      title: 'Challenges',
      description: 'Join our monthly hair care challenges and track your progress'
    },
    {
      id: 3,
      icon: '🎉',
      title: 'Giveaways',
      description: 'Enter exclusive giveaways and win free products'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="tp-community-hero-area pt-120 pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="tp-section-title-wrapper text-center mb-60">
                <h2 className="tp-section-title" style={{ fontSize: '48px', marginBottom: '20px' }}>
                  Roots & Rituals Tribe
                </h2>
                <p className="tp-section-subtitle" style={{ 
                  fontSize: '18px', 
                  lineHeight: '1.8', 
                  maxWidth: '700px', 
                  margin: '0 auto',
                  color: '#55585B'
                }}>
                  Join a community of people who believe in root-deep care and natural wellness. 
                  Share your journey, learn from others, and grow together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="tp-community-benefits-area pb-100">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12 mb-50">
              <h3 className="text-center" style={{ fontSize: '36px', marginBottom: '50px' }}>
                Why Join?
              </h3>
            </div>
          </div>
          <div className="row gx-4">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="col-xl-4 col-lg-4 col-md-6 mb-30">
                <div className="tp-community-benefit-card text-center" style={{ 
                  padding: '50px 30px', 
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  height: '100%'
                }}>
                  <div className="tp-community-benefit-icon mb-30" style={{ fontSize: '60px' }}>
                    {benefit.icon}
                  </div>
                  <h4 style={{ fontSize: '24px', marginBottom: '15px', fontWeight: '600' }}>
                    {benefit.title}
                  </h4>
                  <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#55585B', margin: 0 }}>
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UGC & Challenges Section */}
      <section className="tp-community-ugc-area pt-100 pb-100 grey-bg">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-6 col-lg-6">
              <div className="tp-community-ugc-content pr-50">
                <div className="tp-section-title-wrapper mb-40">
                  <h3 className="tp-section-title" style={{ fontSize: '36px', marginBottom: '20px' }}>
                    Share Your Journey
                  </h3>
                  <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#55585B', marginBottom: '30px' }}>
                    We love seeing how our community uses Roots & Rituals products in their daily routines. 
                    Share your #HracineRoutine and inspire others on their hair wellness journey.
                  </p>
                  <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#55585B', marginBottom: '40px' }}>
                    Tag us on Instagram and use #HracineRoutine for a chance to be featured on our page!
                  </p>
                  <div className="tp-community-ugc-cta">
                    <Link href="/shop" className="tp-btn tp-btn-2">
                      Explore Our Products <ArrowRightLong />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="tp-community-ugc-visual">
                <div style={{ 
                  backgroundColor: '#f8f8f8', 
                  borderRadius: '8px', 
                  padding: '60px 40px',
                  textAlign: 'center',
                  minHeight: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>📸</div>
                    <p style={{ fontSize: '18px', color: '#55585B' }}>
                      Your #HracineRoutine photos will appear here
                    </p>
                    <p style={{ fontSize: '14px', color: '#90969B', marginTop: '10px' }}>
                      Follow us on Instagram to see community posts
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA Section */}
      <section className="tp-community-join-area pt-100 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="tp-community-join-cta text-center" style={{ 
                padding: '80px 40px',
                backgroundColor: '#f8f8f8',
                borderRadius: '8px'
              }}>
                <h3 style={{ fontSize: '36px', marginBottom: '20px' }}>
                  Ready to Join the Tribe?
                </h3>
                <p style={{ fontSize: '18px', color: '#55585B', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
                  Start your root-deep care journey today. Join our community and discover the power of natural, 
                  scalp-first hair care.
                </p>
                <div className="tp-community-join-buttons">
                  <Link href="/shop" className="tp-btn tp-btn-2 mr-20">
                    Shop Products <ArrowRightLong />
                  </Link>
                  <Link href="/consultation" className="tp-btn tp-btn-border">
                    Book Consultation <ArrowRightLong />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CommunityArea;
