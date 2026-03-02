import React, { useEffect, useRef } from 'react';

const WhyScalpMatters = () => {
  const benefits = [
    {
      id: 1,
      icon: '💧',
      title: 'Moisture',
      description: 'A well-nourished scalp maintains optimal moisture levels, preventing dryness and flakiness.'
    },
    {
      id: 2,
      icon: '✨',
      title: 'Itch-Free Scalp',
      description: 'Healthy scalp care eliminates irritation and itching, providing comfort throughout the day.'
    },
    {
      id: 3,
      icon: '🌱',
      title: 'Growth',
      description: 'Strong roots lead to stronger, longer, and healthier hair growth from the foundation up.'
    },
    {
      id: 4,
      icon: '🌸',
      title: 'Easy Care',
      description: 'When your scalp is healthy, your hair care routine becomes simpler and more effective.'
    }
  ];

  // Duplicate benefits for seamless loop
  const duplicatedBenefits = [...benefits, ...benefits];

  const carouselRef = useRef(null);

  useEffect(() => {
    // Add CSS animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scroll {
        0% {
          transform: translateX(-50%);
        }
        100% {
          transform: translateX(0);
        }
      }
      
      .tp-scalp-carousel-track {
        display: flex;
        animation: scroll 18s linear infinite;
        will-change: transform;
      }
      
      .tp-scalp-carousel-track:hover {
        animation-play-state: paused;
      }
      
      .tp-scalp-carousel-wrapper {
        overflow: hidden;
        position: relative;
        width: 100%;
      }
      
      .tp-scalp-carousel-item {
        flex: 0 0 auto;
        padding: 0 clamp(8px, 1.5vw, 16px);
      }
      
      @media (max-width: 768px) {
        .tp-scalp-carousel-item {
          padding: 0 clamp(6px, 2vw, 12px);
        }
        @keyframes scroll {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const renderCard = (benefit, index) => (
    <div 
      key={`${benefit.id}-${index}`}
      className="tp-scalp-carousel-item"
      style={{
        width: 'clamp(200px, 25vw, 300px)',
        minWidth: 'clamp(200px, 25vw, 300px)'
      }}
    >
      <div 
        className="tp-scalp-benefit-card text-center" 
        style={{ 
          padding: 'clamp(25px, 3vw, 40px) clamp(12px, 2.5vw, 25px)', 
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(196, 112, 112, 0.15)',
          minHeight: 'clamp(180px, 25vw, auto)',
          transition: 'all 0.3s ease',
          border: '1px solid rgba(196, 112, 112, 0.1)',
          height: '100%'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(196, 112, 112, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(196, 112, 112, 0.15)';
        }}
      >
        <div 
          className="tp-scalp-benefit-icon mb-25" 
          style={{ 
            fontSize: 'clamp(24px, 5vw, 50px)',
            lineHeight: '1',
            marginBottom: 'clamp(10px, 2vw, 25px)'
          }}
        >
          {benefit.icon}
        </div>
        <h4 style={{ 
          fontSize: 'clamp(14px, 2.2vw, 22px)', 
          marginBottom: 'clamp(8px, 1.5vw, 15px)',
          fontWeight: '600',
          color: '#85312C',
          lineHeight: '1.3'
        }}>
          {benefit.title}
        </h4>
        <p style={{ 
          fontSize: 'clamp(11px, 1.5vw, 16px)', 
          lineHeight: '1.7', 
          color: '#6d5d47',
          margin: 0
        }}>
          {benefit.description}
        </p>
      </div>
    </div>
  );

  return (
    <section 
      className="tp-why-scalp-area pt-120"
      style={{
        backgroundColor: '#F8F4F0',
        background: 'linear-gradient(135deg, #F8F4F0 0%, #F5EFE8 100%)',
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: 'clamp(60px, 12vw, 150px)'
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-xxl-12">
            <div className="tp-section-title-wrapper text-center mb-60">
              <h2 
                className="tp-section-title" 
                style={{ 
                  fontSize: 'clamp(28px, 4vw, 42px)', 
                  marginBottom: '20px',
                  color: '#85312C',
                  fontWeight: '700',
                  fontFamily: "'Playfair Display', serif"
                }}
              >
                Why Your Scalp Matters
              </h2>
              <p 
                className="tp-section-subtitle" 
                style={{ 
                  fontSize: 'clamp(16px, 1.5vw, 18px)', 
                  lineHeight: '1.8', 
                  maxWidth: '700px', 
                  margin: '0 auto',
                  color: '#6d5d47',
                  fontWeight: '400'
                }}
              >
                Your scalp is the foundation of healthy hair. Just like a garden needs healthy soil, 
                your hair needs a nourished, balanced scalp to thrive.
              </p>
            </div>
          </div>
        </div>
        
        <div className="tp-scalp-carousel-wrapper" ref={carouselRef}>
          <div className="tp-scalp-carousel-track">
            {duplicatedBenefits.map((benefit, index) => renderCard(benefit, index))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyScalpMatters;
