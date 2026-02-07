import React, { useState } from 'react';
import Image from 'next/image';
import { useCreateConsultationMutation } from '@/redux/features/consultationApi';
import { notifySuccess, notifyError } from '@/utils/toast';
import { ArrowRightLong } from '@/svg';
// You'll need to add placeholder images
import consultation_img from '@assets/img/about/about-1.jpg';

const ConsultationArea = () => {
  const [createConsultation, { isLoading }] = useCreateConsultationMutation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    biggestConcern: '',
    protectiveStyle: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createConsultation(formData).unwrap();
      if (result.success) {
        setShowSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          biggestConcern: '',
          protectiveStyle: '',
          preferredDate: '',
          preferredTime: '',
          notes: ''
        });
        notifySuccess('Consultation booked successfully! We\'ll be in touch soon.');
        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (error) {
      notifyError(error?.data?.message || 'Failed to book consultation. Please try again.');
    }
  };

  const services = [
    {
      id: 1,
      title: 'Scalp + Style Assessment',
      description: 'We analyze your scalp condition, hair type, and protective style needs.',
      icon: '🔍'
    },
    {
      id: 2,
      title: 'Customized Hair Routine',
      description: 'A daily + weekly plan using Hracine products tailored to your goals.',
      icon: '✨'
    },
    {
      id: 3,
      title: 'Ingredient Guidance',
      description: 'Learn which botanicals and herbs your scalp responds best to.',
      icon: '🌿'
    },
    {
      id: 4,
      title: 'Follow-Up Tips',
      description: 'Get recommendations to maintain moisture, health, and growth.',
      icon: '💡'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Book your session',
      description: 'Choose a time that works for you.'
    },
    {
      number: 2,
      title: 'Tell us about your hair & scalp',
      description: 'Fill a short form so we understand your goals.'
    },
    {
      number: 3,
      title: 'Meet your consultant',
      description: 'Receive a customized routine + product guide.'
    }
  ];

  const faqs = [
    {
      id: 1,
      question: 'How long is the session?',
      answer: 'Each consultation session typically lasts 30-45 minutes. This gives us enough time to assess your scalp, discuss your goals, and create a personalized routine.'
    },
    {
      id: 2,
      question: 'Is it virtual?',
      answer: 'Yes, all our consultations are conducted virtually via video call. This allows you to participate from the comfort of your home at a time that works best for you.'
    },
    {
      id: 3,
      question: 'Will I need to buy products?',
      answer: 'No, you are not required to purchase any products. We will recommend products based on your needs, but the decision to purchase is entirely yours.'
    },
    {
      id: 4,
      question: 'Do I need to show my hair?',
      answer: 'Yes, showing your hair and scalp during the video consultation helps us provide the most accurate assessment and recommendations. However, we understand privacy concerns and can work with photos if preferred.'
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  // Generate time slots
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="tp-consultation-hero-area pt-120 pb-100" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-6 col-lg-6">
              <div className="tp-consultation-hero-content pr-50">
                <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: '700', color: '#22160E' }}>
                  Rooted Consultations
                </h1>
                <p style={{ fontSize: '20px', lineHeight: '1.8', color: '#55585B', marginBottom: '40px' }}>
                  A personalized scalp + hair routine designed just for you.
                </p>
                <a href="#booking-form" className="tp-btn tp-btn-2" style={{ padding: '15px 40px', fontSize: '16px' }}>
                  Book My Consultation
                  {" "} <ArrowRightLong />
                </a>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="tp-consultation-hero-image">
                <Image 
                  src={consultation_img} 
                  alt="Consultation" 
                  style={{ borderRadius: '8px', width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="tp-consultation-whats-inside pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12 mb-50">
              <h2 className="text-center" style={{ fontSize: '42px', marginBottom: '20px' }}>
                What's Inside Your Consultation
              </h2>
            </div>
          </div>
          <div className="row gx-4">
            {services.map((service) => (
              <div key={service.id} className="col-xl-3 col-lg-6 col-md-6 mb-30">
                <div className="tp-consultation-service-card text-center" style={{ 
                  padding: '40px 25px', 
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  height: '100%'
                }}>
                  <div className="tp-consultation-service-icon mb-25" style={{ fontSize: '50px' }}>
                    {service.icon}
                  </div>
                  <h3 style={{ 
                    fontSize: '22px', 
                    marginBottom: '15px',
                    fontWeight: '600',
                    color: '#22160E'
                  }}>
                    {service.title}
                  </h3>
                  <p style={{ 
                    fontSize: '16px', 
                    lineHeight: '1.7', 
                    color: '#55585B',
                    margin: 0
                  }}>
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="tp-consultation-process-area pt-100 pb-100 grey-bg">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12 mb-50">
              <h2 className="text-center" style={{ fontSize: '42px', marginBottom: '50px' }}>
                How the Consultation Works
              </h2>
            </div>
          </div>
          <div className="row">
            {steps.map((step) => (
              <div key={step.number} className="col-xl-4 col-lg-4 col-md-6 mb-30">
                <div className="tp-consultation-step text-center">
                  <div className="tp-consultation-step-number" style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%',
                    backgroundColor: '#f8f8f8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#22160E'
                }}>
                  {step.number}
                  </div>
                  <h4 style={{ fontSize: '20px', marginBottom: '15px', fontWeight: '600' }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: '16px', color: '#55585B', lineHeight: '1.6' }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking-form" className="tp-consultation-booking-area pt-100 pb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10">
              <div className="tp-consultation-booking-wrapper" style={{ 
                padding: '60px 40px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}>
                {showSuccess && (
                  <div className="tp-consultation-success mb-30" style={{
                    padding: '20px',
                    backgroundColor: '#d4edda',
                    border: '1px solid #c3e6cb',
                    borderRadius: '8px',
                    color: '#155724'
                  }}>
                    <strong>Success!</strong> Your consultation has been booked. We'll be in touch soon to confirm your appointment.
                  </div>
                )}
                <h2 className="text-center mb-40" style={{ fontSize: '36px' }}>
                  Book Your Consultation
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="row gx-3">
                    <div className="col-md-6 mb-20">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '1px solid #EAEBED',
                          borderRadius: '4px',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                    <div className="col-md-6 mb-20">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '1px solid #EAEBED',
                          borderRadius: '4px',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                    <div className="col-md-6 mb-20">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '1px solid #EAEBED',
                          borderRadius: '4px',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                    <div className="col-md-6 mb-20">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Your biggest scalp/hair concern *
                      </label>
                      <select
                        name="biggestConcern"
                        value={formData.biggestConcern}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '1px solid #EAEBED',
                          borderRadius: '4px',
                          fontSize: '16px',
                          backgroundColor: '#fff'
                        }}
                      >
                        <option value="">Select a concern</option>
                        <option value="dry-scalp">Dry Scalp</option>
                        <option value="itchy-scalp">Itchy Scalp</option>
                        <option value="hair-loss">Hair Loss</option>
                        <option value="breakage">Breakage</option>
                        <option value="lack-of-growth">Lack of Growth</option>
                        <option value="product-build-up">Product Build-up</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-20">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Your protective style *
                      </label>
                      <select
                        name="protectiveStyle"
                        value={formData.protectiveStyle}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '1px solid #EAEBED',
                          borderRadius: '4px',
                          fontSize: '16px',
                          backgroundColor: '#fff'
                        }}
                      >
                        <option value="">Select a style</option>
                        <option value="braids">Braids</option>
                        <option value="locs">Locs</option>
                        <option value="wigs">Wigs</option>
                        <option value="natural">Natural</option>
                        <option value="weaves">Weaves</option>
                        <option value="twists">Twists</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-20">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '1px solid #EAEBED',
                          borderRadius: '4px',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                    <div className="col-md-6 mb-20">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Preferred Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '1px solid #EAEBED',
                          borderRadius: '4px',
                          fontSize: '16px',
                          backgroundColor: '#fff'
                        }}
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 mb-30">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Extra Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="4"
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '1px solid #EAEBED',
                          borderRadius: '4px',
                          fontSize: '16px',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                    <div className="col-12 text-center">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="tp-btn tp-btn-2"
                        style={{ padding: '15px 50px', fontSize: '16px' }}
                      >
                        {isLoading ? 'Booking...' : 'Book My Consultation'}
                        {" "} <ArrowRightLong />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="tp-consultation-faq-area pt-100 pb-120 grey-bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10">
              <h2 className="text-center mb-50" style={{ fontSize: '42px' }}>
                Frequently Asked Questions
              </h2>
              <div className="tp-consultation-faq-wrapper">
                {faqs.map((faq) => (
                  <div key={faq.id} className="tp-consultation-faq-item mb-15" style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}>
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      style={{
                        width: '100%',
                        padding: '20px 25px',
                        textAlign: 'left',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#22160E'
                      }}
                    >
                      <span>{faq.question}</span>
                      <span style={{ fontSize: '24px', color: '#55585B' }}>
                        {openFaq === faq.id ? '−' : '+'}
                      </span>
                    </button>
                    {openFaq === faq.id && (
                      <div style={{
                        padding: '0 25px 20px 25px',
                        fontSize: '16px',
                        lineHeight: '1.7',
                        color: '#55585B'
                      }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ConsultationArea;
