import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// internal
import { ArrowRightLong } from '@/svg';

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

  const openNewsletterModal = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-newsletter-modal'));
    }
  };

  const WHATSAPP_CHAT_URL = 'https://chat.whatsapp.com/KZNgF0snHw5DwTdODVk8oH';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .tp-community-explore-btn { background-color: #85312C !important; border-color: #85312C !important; }
        .tp-community-explore-btn:hover { background-color: #6b2824 !important; border-color: #6b2824 !important; }
        .tp-community-ugc-area .tp-community-ugc-content { text-align: center !important; padding-right: 0 !important; }
        .tp-community-ugc-area .tp-community-ugc-content .tp-section-title,
        .tp-community-ugc-area .tp-community-ugc-content .tp-section-title-wrapper,
        .tp-community-ugc-area .tp-community-ugc-content p { text-align: center !important; }
        .tp-community-ugc-area .tp-community-ugc-cta { display: flex !important; justify-content: center !important; }
        .tp-community-ugc-visual-img { border-radius: 8px; overflow: hidden; max-width: 100%; margin-left: auto; margin-right: auto; }
        .tp-community-ugc-visual-img img { display: block; width: 100%; height: auto; max-height: 420px; object-fit: cover; vertical-align: middle; }
        @media (min-width: 992px) {
          .tp-community-ugc-visual-img { max-width: 380px; }
          .tp-community-ugc-visual-img img { max-height: 480px; }
        }
        @media (max-width: 991px) {
          .tp-community-ugc-visual-img { margin-top: 2rem; max-width: 420px; }
          .tp-community-ugc-visual-img img { max-height: 360px; }
        }
        @media (max-width: 575.98px) {
          .tp-community-ugc-visual-img { max-width: 100%; margin-left: 0; margin-right: 0; }
          .tp-community-ugc-visual-img img { max-height: 320px; }
        }
        @media (max-width: 767.98px) {
          .tp-community-hero-area { padding-top: 56px !important; }
          .tp-community-ugc-mobile-center .tp-community-ugc-content { text-align: center !important; }
          .tp-community-ugc-mobile-center .tp-community-ugc-content p { text-align: center !important; }
          .tp-community-ugc-mobile-center .tp-community-ugc-cta { justify-content: center; display: flex !important; }
        }
      `}} />
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
      <section className="tp-community-ugc-area tp-community-ugc-mobile-center pt-100 pb-100 grey-bg">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-6 col-lg-6">
              <div className="tp-community-ugc-content">
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
                  <div className="tp-community-ugc-cta d-flex justify-content-center">
                    <Link href="/shop" className="tp-btn tp-btn-2 tp-community-explore-btn">
                      Explore Our Products <ArrowRightLong />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="tp-community-ugc-visual tp-community-ugc-visual-img">
                <Image
                  src="/comuunity.jpg"
                  alt="Community - Share your journey"
                  width={380}
                  height={480}
                  sizes="(max-width: 575px) 100vw, (max-width: 991px) 420px, 380px"
                  style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                />
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
                  <button type="button" onClick={openNewsletterModal} className="tp-btn tp-btn-2 mr-20">
                    Subscribe <ArrowRightLong />
                  </button>
                  <a href={WHATSAPP_CHAT_URL} target="_blank" rel="noopener noreferrer" className="tp-btn tp-btn-border">
                    Join our chat
                  </a>
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
