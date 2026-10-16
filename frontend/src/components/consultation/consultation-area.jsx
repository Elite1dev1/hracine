import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useInitializeRootCheckPaymentMutation } from '@/redux/features/consultationApi';
import { useGetSettingsQuery } from '@/redux/features/admin/adminApi';
import { notifyError } from '@/utils/toast';
import { ArrowRightLong } from '@/svg';
import { trackLead } from '@/lib/gtm';
import consultationImg from '@assets/img/about/about-1.jpeg';

const rootCheckSteps = [
  { number: '01', title: 'Tell Us About Your Hair', description: 'We discuss your current hair routine, styling habits and the concerns you’re experiencing.' },
  { number: '02', title: 'Scalp & Hair Assessment', description: 'We assess the condition of your scalp and hair to understand your care needs.' },
  { number: '03', title: 'Identify Your Care Needs', description: 'We discuss the key areas that need attention and what may be affecting your hair-care routine.' },
  { number: '04', title: 'Get Your Treatment Recommendation', description: 'Based on your assessment, we recommend the Hracine treatment that best suits your needs.' },
  { number: '05', title: 'Begin Your Hracine Journey', description: 'Your Root Check leads into a personalised treatment and home-care plan.' },
];

const rootCheckFor = [
  'Dry or uncomfortable scalp', 'Frequent scalp buildup', 'Itching or flaking',
  'Excessively oily scalp', 'Hair breakage', 'Dry or brittle hair',
  'Difficulty retaining length', 'A hair routine that isn’t working for you',
  'Uncertainty about what your scalp or hair actually needs',
];

const treatmentJourney = [
  { title: 'Root Check', description: 'Understand your scalp and hair.' },
  { title: 'Personalised Treatment', description: 'Receive care based on your identified needs.' },
  { title: 'Protective Style', description: 'Finish with a suitable low-tension style where applicable.' },
  { title: 'Homecare', description: 'Continue your routine with recommended hair-care products.' },
  { title: 'Follow-Up', description: 'Return for continued scalp and hair care.' },
];

const treatmentPackages = [
  { title: 'Root Reset', description: 'A foundational scalp and hair reset for clients looking to refresh and restore their routine.' },
  { title: 'Root Therapy', description: 'A more targeted scalp and hair treatment based on your Root Check assessment.' },
  { title: 'Root Ritual', description: 'Our complete Hracine scalp-first hair-care experience.' },
];

const leaveWith = [
  'A clearer understanding of your scalp and hair needs', 'Your key areas of concern identified',
  'Personalised care recommendations', 'A recommended Hracine treatment',
  'Guidance for maintaining your hair between treatments',
];

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
];

const formatNaira = (amount) => new Intl.NumberFormat('en-NG', {
  style: 'currency', currency: 'NGN', minimumFractionDigits: 0, maximumFractionDigits: 0,
}).format(amount);

const ConsultationArea = () => {
  const [initializeRootCheckPayment, { isLoading }] = useInitializeRootCheckPaymentMutation();
  const { data: settingsData } = useGetSettingsQuery();
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', biggestConcern: '', protectiveStyle: '',
    preferredDate: '', preferredTime: '', notes: '',
  });

  const rootCheckFee = Number(settingsData?.data?.rootCheckFee ?? 5000);
  const formattedFee = formatNaira(Number.isFinite(rootCheckFee) ? rootCheckFee : 5000);

  const faqs = useMemo(() => [
    { id: 1, question: 'How much is the Root Check?', answer: `The Hracine Root Check is ${formattedFee}.` },
    { id: 2, question: 'Does the Root Check fee count toward my treatment?', answer: `Yes. Your ${formattedFee} fee is credited toward your Hracine treatment when you proceed within 7 days.` },
    { id: 3, question: 'Do I need to know which treatment I want before booking?', answer: 'No. The Root Check is designed to help determine which Hracine treatment is appropriate for your needs.' },
    { id: 4, question: 'Is the Root Check a medical consultation?', answer: 'No. It is a cosmetic scalp and hair assessment and does not replace medical care.' },
    { id: 5, question: 'Can I book a treatment without the Root Check?', answer: 'For your first Hracine treatment, we recommend starting with the Root Check so your treatment can be matched to your needs.' },
  ], [formattedFee]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await initializeRootCheckPayment(formData).unwrap();
      if (result.success && result.data?.authorization_url) {
        trackLead({ lead_type: 'root_check_payment', content_name: 'The Hracine Root Check', content_category: 'consultation', status: 'payment_initialized' });
        window.location.assign(result.data.authorization_url);
        return;
      }
      notifyError('Could not start payment. Please try again.');
    } catch (error) {
      notifyError(error?.data?.message || 'Failed to start payment. Please try again.');
    }
  };

  return (
    <>
      <section className="root-check-hero section-space">
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-xl-6 col-lg-6">
              <div className="root-check-hero-copy">
                <span className="root-check-eyebrow">Scalp-first hair care</span>
                <h1>The Hracine Root Check</h1>
                <p className="root-check-lead">A personalised scalp and hair assessment designed to understand what your scalp and hair need before recommending your hair-care treatment.</p>
                <a href="#booking-form" className="tp-btn tp-btn-2 root-check-button">Book Your Root Check {formattedFee} <ArrowRightLong /></a>
                <p className="root-check-credit"><strong>Important:</strong> Your {formattedFee} Root Check fee is credited toward your Hracine treatment when you proceed within 7 days.</p>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="root-check-hero-image">
                <Image src={consultationImg} alt="A Hracine scalp and hair Root Check" priority />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space root-check-dark">
        <div className="container">
          <div className="section-heading light">
            <span className="root-check-eyebrow">Your appointment</span>
            <h2>What Happens During Your Root Check</h2>
          </div>
          <div className="root-check-steps">
            {rootCheckSteps.map((step) => (
              <article className="root-check-step" key={step.number}>
                <span>{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space root-check-who">
        <div className="container">
          <div className="row gy-5 align-items-start">
            <div className="col-lg-5">
              <div className="section-heading sticky-heading">
                <span className="root-check-eyebrow">Is this for you?</span>
                <h2>Who Is the Root Check For?</h2>
                <p>The Root Check is for you if you’re experiencing:</p>
              </div>
            </div>
            <div className="col-lg-7">
              <ul className="root-check-list two-column">{rootCheckFor.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space root-check-journey-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="root-check-eyebrow">From assessment to aftercare</span>
            <h2>The Hracine Treatment Journey</h2>
          </div>
          <div className="root-check-journey">
            {treatmentJourney.map((item, index) => (
              <React.Fragment key={item.title}>
                <article className="journey-card">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3><p>{item.description}</p>
                </article>
                {index < treatmentJourney.length - 1 && <div className="journey-arrow" aria-hidden="true">↓</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space root-check-packages">
        <div className="container">
          <div className="section-heading centered light">
            <span className="root-check-eyebrow">Treatment packages</span>
            <h2>Care That Meets You Where You Are</h2>
          </div>
          <div className="row gy-4 justify-content-center">
            {treatmentPackages.map((item) => (
              <div className="col-lg-4 col-md-6" key={item.title}>
                <article className="package-card"><h3>{item.title}</h3><p>{item.description}</p></article>
              </div>
            ))}
          </div>
          <div className="package-cta">
            <p>Not sure which treatment you need? Start with the Root Check.</p>
            <a href="#booking-form">Book Your Root Check {formattedFee}</a>
          </div>
        </div>
      </section>

      <section className="section-space root-check-philosophy">
        <div className="container">
          <div className="row gy-5 align-items-center">
            <div className="col-lg-5">
              <span className="root-check-eyebrow">The Hracine Philosophy</span>
              <h2>Care for the scalp.<br />Nourish the strands.<br />Protect the hair.</h2>
            </div>
            <div className="col-lg-7">
              <p className="philosophy-copy">Hracine takes an Ayurvedic-inspired approach to hair care, with the scalp at the centre of the routine. We focus on caring for the scalp, nourishing the hair and building healthier hair-care habits from the root.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space root-check-outcomes">
        <div className="container">
          <div className="row gy-5 align-items-center">
            <div className="col-lg-5">
              <div className="section-heading">
                <span className="root-check-eyebrow">Clarity and a plan</span>
                <h2>What You’ll Leave With</h2><p>After your Root Check, you’ll have:</p>
              </div>
            </div>
            <div className="col-lg-7"><ul className="root-check-list">{leaveWith.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>
        </div>
      </section>

      <section className="root-check-disclaimer">
        <div className="container">
          <div className="disclaimer-box">
            <strong>Important Disclaimer</strong>
            <p>Please note: Hracine provides cosmetic scalp and hair-care services. Our Root Check is not a medical diagnosis or treatment. If your concerns require medical attention, we recommend consulting a qualified healthcare professional.</p>
          </div>
        </div>
      </section>

      <section id="booking-form" className="section-space root-check-booking">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-9 col-lg-10">
              <div className="booking-card">
                <div className="section-heading centered">
                  <span className="root-check-eyebrow">Begin your journey</span>
                  <h2 className="booking-title">Book Your Root Check {formattedFee}</h2>
                  <p>Your fee is credited toward your Hracine treatment when you proceed within 7 days.</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row gx-4">
                    <div className="col-md-6 form-field"><label htmlFor="root-check-name">Name *</label><input id="root-check-name" type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
                    <div className="col-md-6 form-field"><label htmlFor="root-check-email">Email *</label><input id="root-check-email" type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
                    <div className="col-md-6 form-field"><label htmlFor="root-check-phone">Phone (Optional)</label><input id="root-check-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} /></div>
                    <div className="col-md-6 form-field">
                      <label htmlFor="root-check-concern">Your biggest scalp/hair concern *</label>
                      <select id="root-check-concern" name="biggestConcern" value={formData.biggestConcern} onChange={handleChange} required>
                        <option value="">Select a concern</option><option value="dry-scalp">Dry or uncomfortable scalp</option><option value="itching-flaking">Itching or flaking</option><option value="oily-scalp">Excessively oily scalp</option><option value="build-up">Frequent scalp buildup</option><option value="breakage">Hair breakage</option><option value="dry-brittle-hair">Dry or brittle hair</option><option value="length-retention">Difficulty retaining length</option><option value="other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6 form-field">
                      <label htmlFor="root-check-style">Your current or preferred style *</label>
                      <select id="root-check-style" name="protectiveStyle" value={formData.protectiveStyle} onChange={handleChange} required>
                        <option value="">Select a style</option><option value="braids">Braids</option><option value="locs">Locs</option><option value="wigs">Wigs</option><option value="natural">Natural</option><option value="weaves">Weaves</option><option value="twists">Twists</option><option value="other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6 form-field"><label htmlFor="root-check-date">Preferred Date *</label><input id="root-check-date" type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} /></div>
                    <div className="col-md-6 form-field">
                      <label htmlFor="root-check-time">Preferred Time *</label>
                      <select id="root-check-time" name="preferredTime" value={formData.preferredTime} onChange={handleChange} required><option value="">Select a time</option>{timeSlots.map((time) => <option key={time} value={time}>{time}</option>)}</select>
                    </div>
                    <div className="col-12 form-field"><label htmlFor="root-check-notes">Anything else you’d like us to know?</label><textarea id="root-check-notes" name="notes" value={formData.notes} onChange={handleChange} rows="4" /></div>
                    <div className="col-12 text-center"><button type="submit" disabled={isLoading} className="tp-btn tp-btn-2 root-check-button">{isLoading ? 'Redirecting to Paystack...' : `Pay & Book Your Root Check ${formattedFee}`} <ArrowRightLong /></button></div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space root-check-faq">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10">
              <div className="section-heading centered"><span className="root-check-eyebrow">Good to know</span><h2>Frequently Asked Questions</h2></div>
              <div className="faq-list">
                {faqs.map((faq) => (
                  <article className="faq-item" key={faq.id}>
                    <button type="button" onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)} aria-expanded={openFaq === faq.id}><span>{faq.question}</span><span aria-hidden="true">{openFaq === faq.id ? '−' : '+'}</span></button>
                    {openFaq === faq.id && <p>{faq.answer}</p>}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space root-check-final">
        <div className="container text-center">
          <span className="root-check-eyebrow">The next step is clarity</span>
          <h2>Your hair-care journey starts at the root.</h2>
          <p>Understand your scalp. Understand your hair. Know what to do next.</p>
          <a href="#booking-form" className="tp-btn tp-btn-2 root-check-button">Book Your Root Check {formattedFee} <ArrowRightLong /></a>
        </div>
      </section>

      <style jsx>{`
        :global(html) { scroll-behavior: smooth; }
        .section-space { padding: 100px 0; }
        .root-check-hero { background: #f3eee7; padding-top: 130px; overflow: hidden; }
        .root-check-hero-copy { max-width: 630px; }
        .root-check-eyebrow { display: inline-block; color: #9a633a; font-size: 12px; font-weight: 700; letter-spacing: 0.18em; margin-bottom: 16px; text-transform: uppercase; }
        h1, h2, h3 { color: #22160e; }
        h1 { font-size: clamp(42px, 6vw, 72px); line-height: 1.02; margin-bottom: 24px; }
        h2 { font-size: clamp(32px, 4.5vw, 50px); line-height: 1.12; margin-bottom: 18px; }
        .root-check-lead { color: #5d5149; font-size: clamp(17px, 2vw, 21px); line-height: 1.75; margin-bottom: 30px; }
        .root-check-button { align-items: center; border-radius: 999px; display: inline-flex; font-size: 14px; gap: 10px; padding: 15px 28px; }
        .root-check-credit { border-left: 3px solid #9a633a; color: #5d5149; font-size: 14px; line-height: 1.6; margin: 24px 0 0; max-width: 590px; padding-left: 16px; }
        .root-check-hero-image { border-radius: 180px 180px 18px 18px; box-shadow: 0 24px 60px rgba(34, 22, 14, 0.18); margin-left: auto; max-width: 520px; overflow: hidden; }
        .root-check-hero-image :global(img) { display: block; height: 620px; object-fit: cover; width: 100%; }
        .section-heading { margin-bottom: 48px; }
        .section-heading.centered { margin-left: auto; margin-right: auto; max-width: 760px; text-align: center; }
        .section-heading p { color: #655b54; font-size: 18px; line-height: 1.7; margin: 0; }
        .section-heading.light h2, .root-check-dark h3 { color: #fff; }
        .section-heading.light .root-check-eyebrow { color: #d8b18f; }
        .root-check-dark { background: #22160e; }
        .root-check-steps { border-top: 1px solid rgba(255,255,255,.18); }
        .root-check-step { align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,.18); display: grid; gap: 32px; grid-template-columns: 70px 1fr; padding: 28px 0; }
        .root-check-step > span { color: #d8b18f; font-size: 14px; font-weight: 700; letter-spacing: .15em; }
        .root-check-step h3 { font-size: 24px; margin: 0 0 8px; }
        .root-check-step p { color: #c8c1bc; line-height: 1.7; margin: 0; max-width: 720px; }
        .root-check-who { background: #fff; }
        .sticky-heading { position: sticky; top: 120px; }
        .root-check-list { display: grid; gap: 12px; list-style: none; margin: 0; padding: 0; }
        .root-check-list.two-column { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .root-check-list li { align-items: center; background: #f7f3ee; border-radius: 10px; color: #3d322b; display: flex; font-size: 16px; min-height: 70px; padding: 18px 20px 18px 52px; position: relative; }
        .root-check-list li::before { color: #9a633a; content: '✓'; font-size: 18px; font-weight: 700; left: 22px; position: absolute; }
        .root-check-journey-section { background: #f7f3ee; }
        .root-check-journey { align-items: stretch; display: grid; grid-template-columns: 1fr 30px 1fr 30px 1fr 30px 1fr 30px 1fr; }
        .journey-card { background: #fff; border: 1px solid #e6ddd3; border-radius: 12px; min-height: 215px; padding: 30px 24px; }
        .journey-card > span { color: #9a633a; display: block; font-size: 12px; font-weight: 700; letter-spacing: .18em; margin-bottom: 28px; }
        .journey-card h3 { font-size: 17px; letter-spacing: .06em; margin-bottom: 12px; text-transform: uppercase; }
        .journey-card p { color: #655b54; line-height: 1.65; margin: 0; }
        .journey-arrow { align-items: center; color: #9a633a; display: flex; font-size: 25px; justify-content: center; transform: rotate(-90deg); }
        .root-check-packages { background: #5b3926; }
        .package-card { background: #fff; border-radius: 12px; height: 100%; padding: 38px 32px; }
        .package-card h3 { font-size: 22px; letter-spacing: .08em; margin-bottom: 18px; text-transform: uppercase; }
        .package-card p { color: #655b54; line-height: 1.7; margin: 0; }
        .package-cta { color: #fff; margin-top: 42px; text-align: center; }
        .package-cta p { color: #eadfd6; font-size: 18px; margin-bottom: 12px; }
        .package-cta a { border-bottom: 1px solid #fff; color: #fff; font-weight: 600; padding-bottom: 3px; }
        .root-check-philosophy { background: #efe3d4; }
        .root-check-philosophy h2 { font-size: clamp(30px, 4vw, 46px); line-height: 1.25; }
        .philosophy-copy { color: #4f4239; font-size: clamp(20px, 2.5vw, 28px); line-height: 1.55; margin: 0; }
        .root-check-outcomes { background: #fff; }
        .root-check-disclaimer { background: #fff; padding: 0 0 100px; }
        .disclaimer-box { align-items: flex-start; background: #f7f3ee; border-left: 4px solid #9a633a; display: grid; gap: 20px; grid-template-columns: 200px 1fr; padding: 28px 32px; }
        .disclaimer-box strong { color: #22160e; font-size: 17px; }
        .disclaimer-box p { color: #655b54; line-height: 1.7; margin: 0; }
        .root-check-booking { background: #22160e; }
        .booking-card { background: #fff; border-radius: 18px; padding: 58px 50px; }
        .booking-title { font-size: clamp(26px, 3.2vw, 38px); }
        .form-field { margin-bottom: 22px; }
        .form-field label { color: #342820; display: block; font-size: 14px; font-weight: 600; margin-bottom: 9px; }
        .form-field input, .form-field select, .form-field textarea { background: #fff; border: 1px solid #ddd3c8; border-radius: 10px; color: #342820; font-size: 15px; min-height: 52px; padding: 12px 14px; width: 100%; }
        .form-field textarea { min-height: 115px; resize: vertical; }
        .form-field input:focus, .form-field select:focus, .form-field textarea:focus { border-color: #9a633a; outline: none; }
        .root-check-faq { background: #f7f3ee; }
        .faq-item { background: #fff; border-bottom: 1px solid #e4dbd1; }
        .faq-item:first-child { border-radius: 12px 12px 0 0; }
        .faq-item:last-child { border-bottom: 0; border-radius: 0 0 12px 12px; }
        .faq-item button { align-items: center; background: transparent; border: 0; color: #22160e; display: flex; font-size: 18px; font-weight: 600; justify-content: space-between; padding: 23px 26px; text-align: left; width: 100%; }
        .faq-item button span:last-child { color: #9a633a; font-size: 25px; margin-left: 20px; }
        .faq-item p { color: #655b54; line-height: 1.7; margin: 0; padding: 0 60px 24px 26px; }
        .root-check-final { background: #c9a27e; }
        .root-check-final h2 { font-size: clamp(36px, 5vw, 58px); }
        .root-check-final p { color: #4d3829; font-size: 19px; margin-bottom: 30px; }
        .root-check-final .root-check-eyebrow { color: #5b3926; }
        @media (max-width: 1199px) {
          .root-check-journey { grid-template-columns: 1fr; gap: 0; margin: 0 auto; max-width: 700px; }
          .journey-card { min-height: auto; }
          .journey-arrow { min-height: 45px; transform: none; }
        }
        @media (max-width: 991px) {
          .section-space { padding: 80px 0; }
          .root-check-hero { padding-top: 110px; }
          .root-check-hero-copy { text-align: center; }
          .root-check-credit { margin-left: auto; margin-right: auto; text-align: left; }
          .root-check-hero-image { margin: 10px auto 0; }
          .root-check-hero-image :global(img) { height: 520px; }
          .sticky-heading { position: static; }
          .disclaimer-box { grid-template-columns: 1fr; }
        }
        @media (max-width: 767px) {
          .section-space { padding: 64px 0; }
          .root-check-hero { padding-top: 46px; }
          .root-check-hero-image { border-radius: 110px 110px 14px 14px; max-width: 360px; }
          .root-check-hero-image :global(img) { height: 410px; }
          .root-check-button { font-size: 13px; justify-content: center; padding: 13px 20px; }
          .root-check-step { gap: 12px; grid-template-columns: 45px 1fr; }
          .root-check-step h3 { font-size: 20px; }
          .root-check-list.two-column { grid-template-columns: 1fr; }
          .booking-card { padding: 38px 20px; }
          .root-check-disclaimer { padding-bottom: 64px; }
          .disclaimer-box { padding: 24px 20px; }
          .faq-item button { font-size: 16px; padding: 20px; }
          .faq-item p { padding: 0 45px 20px 20px; }
        }
      `}</style>
    </>
  );
};

export default ConsultationArea;
