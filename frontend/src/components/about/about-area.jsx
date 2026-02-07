import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// internal
import { ArrowRightLong } from '@/svg';
// You'll need to add placeholder images or use existing ones
import founder_img from '@assets/img/about/about-1.jpg';

const AboutArea = () => {
  const valueCards = [
    {
      id: 1,
      title: 'Purity',
      description: 'Rooted in nature, powered by Ayurvedic wisdom. Every ingredient is carefully selected for its healing properties and sourced with intention.'
    },
    {
      id: 2,
      title: 'Ease',
      description: 'Simple rituals that fit seamlessly into your routine. No complicated steps, just effective care that nourishes your scalp and hair naturally.'
    },
    {
      id: 3,
      title: 'Community',
      description: 'Join a tribe of people who believe in root-deep care. Share your journey, learn from others, and grow together in your hair wellness journey.'
    }
  ];

  return (
    <>
      {/* Mission Section */}
      <section className="tp-about-mission-area pt-120 pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="tp-section-title-wrapper text-center mb-60">
                <h2 className="tp-section-title">Roots First</h2>
                <p className="tp-section-subtitle" style={{ fontSize: '18px', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto', color: '#55585B' }}>
                  We believe that healthy, beautiful hair starts with a healthy scalp. Our mission is to bring you 
                  scalp-first care rooted in Ayurvedic traditions and natural ingredients. Every product is crafted 
                  with intention, designed to nourish from the roots up.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Cards Section */}
      <section className="tp-about-values-area pb-100">
        <div className="container">
          <div className="row gx-4">
            {valueCards.map((card) => (
              <div key={card.id} className="col-xl-4 col-lg-4 col-md-6 mb-30">
                <div className="tp-about-value-card" style={{ 
                  padding: '40px 30px', 
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  height: '100%',
                  transition: 'transform 0.3s ease'
                }}>
                  <h3 className="tp-about-value-title" style={{ 
                    fontSize: '28px', 
                    marginBottom: '20px',
                    fontWeight: '600',
                    color: '#22160E'
                  }}>
                    {card.title}
                  </h3>
                  <p style={{ 
                    fontSize: '16px', 
                    lineHeight: '1.7', 
                    color: '#55585B',
                    margin: 0
                  }}>
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="tp-about-founder-area pt-100 pb-120">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-5 col-lg-6">
              <div className="tp-about-founder-thumb">
                <Image 
                  src={founder_img} 
                  alt="Founder" 
                  style={{ borderRadius: '8px', width: '100%', height: 'auto' }}
                />
              </div>
            </div>
            <div className="col-xl-7 col-lg-6">
              <div className="tp-about-founder-content pl-60">
                <div className="tp-section-title-wrapper mb-40">
                  <span className="tp-section-title-pre" style={{ 
                    fontSize: '14px', 
                    textTransform: 'uppercase', 
                    letterSpacing: '2px',
                    color: '#55585B',
                    marginBottom: '15px',
                    display: 'block'
                  }}>
                    Our Story
                  </span>
                  <h3 className="tp-section-title" style={{ fontSize: '42px', marginBottom: '30px' }}>
                    Meet the Founder
                  </h3>
                </div>
                <div className="tp-about-founder-text">
                  <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#55585B', marginBottom: '25px' }}>
                    After years of struggling with scalp issues and trying countless products, I discovered the 
                    power of Ayurvedic hair care. What started as a personal journey to find natural solutions 
                    became a mission to help others experience the same transformation.
                  </p>
                  <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#55585B', marginBottom: '30px' }}>
                    Roots & Rituals was born from the belief that healthy hair begins with a happy scalp. Every 
                    product is crafted with intention, using time-tested ingredients and modern formulations that 
                    honor both tradition and innovation.
                  </p>
                  <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#55585B', fontStyle: 'italic' }}>
                    &quot;We&apos;re not just selling products—we&apos;re building a community of people who believe in root-deep 
                    care and the beauty of natural wellness.&quot;
                  </p>
                </div>
                <div className="tp-about-founder-btn mt-40">
                  <Link href="/contact" className="tp-btn tp-btn-2">
                    Get In Touch <ArrowRightLong />
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

export default AboutArea;
