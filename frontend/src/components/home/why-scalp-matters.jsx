import React from 'react';

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

  return (
    <section className="tp-why-scalp-area pt-120 pb-100">
      <div className="container">
        <div className="row">
          <div className="col-xxl-12">
            <div className="tp-section-title-wrapper text-center mb-60">
              <h2 className="tp-section-title" style={{ fontSize: '42px', marginBottom: '20px' }}>
                Why Your Scalp Matters
              </h2>
              <p className="tp-section-subtitle" style={{ 
                fontSize: '18px', 
                lineHeight: '1.8', 
                maxWidth: '700px', 
                margin: '0 auto',
                color: '#55585B'
              }}>
                Your scalp is the foundation of healthy hair. Just like a garden needs healthy soil, 
                your hair needs a nourished, balanced scalp to thrive.
              </p>
            </div>
          </div>
        </div>
        <div className="row gx-4">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="col-xl-3 col-lg-6 col-md-6 mb-30">
              <div className="tp-scalp-benefit-card text-center" style={{ 
                padding: '40px 25px', 
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                height: '100%',
                transition: 'transform 0.3s ease'
              }}>
                <div className="tp-scalp-benefit-icon mb-25" style={{ fontSize: '50px' }}>
                  {benefit.icon}
                </div>
                <h4 style={{ 
                  fontSize: '22px', 
                  marginBottom: '15px',
                  fontWeight: '600',
                  color: '#22160E'
                }}>
                  {benefit.title}
                </h4>
                <p style={{ 
                  fontSize: '16px', 
                  lineHeight: '1.7', 
                  color: '#55585B',
                  margin: 0
                }}>
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyScalpMatters;
