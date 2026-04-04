import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// internal
import { ArrowRightLong } from '@/svg';
import founder_img from '@assets/img/about/founders.jpeg';
import user_1 from '@assets/profile picture/1.jpg';
import user_2 from '@assets/profile picture/2p.jpg';
import user_3 from '@assets/profile picture/3p.jpg';
import user_4 from '@assets/profile picture/4p.jpg';
import author_img from '@assets/profile picture/5p.jpg';

const reviews = [
  {
    id: 1,
    name: 'Sophia T.',
    rating: 5,
    avatar: user_1,
    headline: 'Stronger hair from the roots',
    quote:
      'I’ve been trying to grow my hair out for years and nothing seemed right. What I like about Hracine is that it focuses on scalp health first. After a few weeks of using it with regular scalp massages, my hair feels stronger at the roots and my scalp feels clean and comfortable.',
    highlights: [
      'focuses on scalp health first',
      'my hair feels stronger at the roots',
    ],
  },
  {
    id: 2,
    name: 'Ife A.',
    rating: 4,
    avatar: user_2,
    headline: 'A new ritual that actually works',
    quote:
      'What I appreciate most about Hracine is how it changed my haircare routine. Instead of just applying oil on my hair, I now focus on scalp care. The scalp relief serum absorbs well and the massage ritual has become part of my weekly care. My hair feels stronger and I’m seeing less shedding when I detangle.',
    highlights: [
      'changed my haircare routine',
      'I now focus on scalp care',
      'less shedding when I detangle',
    ],
  },
  {
    id: 3,
    name: 'Amara O.',
    rating: 4,
    avatar: user_3,
    headline: 'Itchy scalp relief in days',
    quote:
      'I’ve always struggled with an itchy scalp whenever I keep braids for more than two weeks. I started using Hracine directly on my scalp and the difference was noticeable within days. My scalp feels calmer and hydrated, not greasy. I love that it’s lightweight and actually feels like it’s caring for my scalp, not just coating my hair.',
    highlights: [
      'itchy scalp whenever I keep braids for more than two weeks',
      'the difference was noticeable within days',
      'My scalp feels calmer and hydrated, not greasy',
    ],
  },
  {
    id: 4,
    name: 'Ada N.',
    rating: 3,
    avatar: user_4,
    headline: 'Lightweight but deeply nourishing',
    quote:
      'I’m very picky with oils because most of them are heavy and clog my scalp. Hracine surprised me. It’s nourishing but still lightweight, and it absorbs quickly. My scalp feels balanced and my hair looks healthier overall.',
    highlights: [
      'Hracine surprised me',
      'nourishing but still lightweight',
      'My scalp feels balanced and my hair looks healthier overall',
    ],
  },
  {
    id: 5,
    name: 'Chelsea A.',
    rating: 5,
    avatar: author_img,
    headline: 'All-week moisture for dry hair',
    quote:
      'My hair is usually very dry but this butter has helped keep it moisturized throughout the week. My strands feel healthier.',
    highlights: [
      'helped keep it moisturized throughout the week',
      'My strands feel healthier',
    ],
  },
];

const getInitials = (name) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const renderHighlightedQuote = (quote, highlights = []) => {
  if (!highlights.length) return quote;

  let parts = [quote];

  highlights.forEach((phrase, phraseIdx) => {
    const nextParts = [];

    parts.forEach((part, partIdx) => {
      if (typeof part !== 'string') {
        nextParts.push(part);
        return;
      }

      const segments = part.split(phrase);

      if (segments.length === 1) {
        nextParts.push(part);
        return;
      }

      segments.forEach((segment, segIdx) => {
        if (segment) {
          nextParts.push(segment);
        }
        if (segIdx < segments.length - 1) {
          nextParts.push(
            <strong key={`${phrase}-${phraseIdx}-${partIdx}-${segIdx}`}>{phrase}</strong>
          );
        }
      });
    });

    parts = nextParts;
  });

  return parts;
};

const renderRatingStars = (rating = 5) => {
  const maxStars = 5;
  return Array.from({ length: maxStars }, (_, index) => (
    <span key={index}>{index < rating ? '★' : '☆'}</span>
  ));
};

const AboutArea = () => {
  const mobileCarouselRef = useRef(null);
  const [activeReview, setActiveReview] = useState(0);

  const scrollMobileReviews = (direction) => {
    if (!mobileCarouselRef.current) return;
    const container = mobileCarouselRef.current;
    const card = container.querySelector('.tp-about-review-card');
    const cardWidth = card ? card.getBoundingClientRect().width + 16 : container.clientWidth;
    const nextIndex = Math.min(
      Math.max(activeReview + direction, 0),
      reviews.length - 1
    );
    container.scrollBy({
      left: direction * cardWidth,
      behavior: 'smooth',
    });
    setActiveReview(nextIndex);
  };

  useEffect(() => {
    const container = mobileCarouselRef.current;
    if (!container) return;

    const handleScroll = () => {
      const card = container.querySelector('.tp-about-review-card');
      if (!card) return;
      const cardWidth = card.getBoundingClientRect().width + 16;
      const index = Math.round(container.scrollLeft / cardWidth);
      setActiveReview(Math.min(Math.max(index, 0), reviews.length - 1));
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);
  const valueCards = [
    {
      id: 1,
      title: 'Purity',
      description: 'Rooted in nature, powered by Ayurvedic wisdom. Every ingredient is carefully selected for its healing properties and sourced with intention.',
      descriptionShort: 'Rooted in nature. Every ingredient is chosen for its healing power.'
    },
    {
      id: 2,
      title: 'Ease',
      description: 'Simple rituals that fit seamlessly into your routine. No complicated steps, just effective care that nourishes your scalp and hair naturally.',
      descriptionShort: 'Simple rituals that fit your routine. No fuss, just results.'
    },
    {
      id: 3,
      title: 'Community',
      description: 'Join a tribe of people who believe in root-deep care. Share your journey, learn from others, and grow together in your hair wellness journey.',
      descriptionShort: 'A tribe that believes in root-deep care. Grow with us.'
    },
    {
      id: 4,
      title: 'Integrity',
      description: 'Honest formulations and transparent practices you can trust.',
      descriptionShort: 'Honest formulations and transparent practices you can trust.'
    }
  ];

  return (
    <>
      {/* Mobile-only styles: constrained width, spacing, CTA */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 991.98px) {
            .tp-about-mobile-hero-inner { max-width: 90%; margin-left: auto; margin-right: auto; }
            .tp-about-mobile-hero-body { text-align: left !important; line-height: 1.7; }
            .tp-about-mobile-value-card { padding: 1.5rem 1.25rem; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(34,22,14,0.06); height: 100%; }
            .tp-about-mobile-founder-inner { max-width: 90%; margin-left: auto; margin-right: auto; text-align: center; }
            .tp-about-mobile-cta-wrap { max-width: 90%; margin-left: auto; margin-right: auto; display: flex; justify-content: center; }
            .tp-about-mobile-cta-wrap .tp-about-mobile-cta-btn { width: 100%; max-width: 280px; display: inline-flex; align-items: center; justify-content: center; }
          }

          /* Mobile testimonials carousel */
          .tp-about-mobile-reviews-scroll {
            display: flex;
            flex-direction: row;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            gap: 16px;
            padding: 4px 16px 8px;
          }

          .tp-about-mobile-reviews-scroll::-webkit-scrollbar {
            display: none;
          }

          .tp-about-review-card {
            scroll-snap-align: center;
            flex: 0 0 86%;
            max-width: 86%;
          }

          .tp-about-review-stars {
            display: flex;
            gap: 2px;
            margin-bottom: 10px;
            color: #F5B544;
            font-size: 14px;
          }

          .tp-about-review-meta {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
          }

          .tp-about-review-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            overflow: hidden;
            background: #F3E7E4;
            flex-shrink: 0;
          }

          .tp-about-review-name {
            font-size: 13px;
            font-weight: 600;
            color: #22160E;
          }

          .tp-about-review-nav {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 16px;
          }
          .tp-about-review-dots {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .tp-about-review-dot {
            width: 6px;
            height: 6px;
            border-radius: 999px;
            background-color: rgba(34,22,14,0.18);
            transition: background-color 0.2s ease, transform 0.2s ease;
          }

          .tp-about-review-dot.is-active {
            background-color: #85312C;
            transform: scale(1.25);
          }

          .tp-about-trust-bar {
            border-radius: 999px;
            background-color: rgba(133, 49, 44, 0.06);
            padding: 10px 22px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 13px;
            color: #55585B;
          }

          .tp-about-trust-bar-dot {
            width: 4px;
            height: 4px;
            border-radius: 999px;
            background-color: rgba(34,22,14,0.35);
          }

          @media (min-width: 992px) {
            .tp-about-reviews-grid {
              column-count: 3;
              column-gap: 24px;
            }

            .tp-about-review-card-desktop {
              display: inline-block;
              width: 100%;
              break-inside: avoid;
              -webkit-column-break-inside: avoid;
              -moz-column-break-inside: avoid;
              background-color: #fff;
              border-radius: 14px;
              padding: 26px 24px 24px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.04);
              margin-bottom: 24px;
              transition: transform 0.25s ease, box-shadow 0.25s ease;
            }

            .tp-about-review-card-desktop:hover {
              transform: translateY(-6px);
              box-shadow: 0 26px 52px rgba(0,0,0,0.08);
            }

            .tp-about-review-stars-desktop {
              display: flex;
              gap: 3px;
              color: #F5B544;
              font-size: 13px;
              margin-bottom: 10px;
            }

            .tp-about-review-headline-desktop {
              font-size: 18px;
              font-weight: 600;
              color: #22160E;
              margin-bottom: 8px;
            }

            .tp-about-review-body-desktop {
              font-size: 15px;
              line-height: 1.8;
              color: #55585B;
              margin-bottom: 18px;
            }

            .tp-about-review-footer-desktop {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-top: auto;
            }

            .tp-about-review-avatar-desktop {
              width: 36px;
              height: 36px;
              border-radius: 50%;
            overflow: hidden;
            background: #F3E7E4;
              flex-shrink: 0;
            }

            .tp-about-review-meta-desktop {
              display: flex;
              flex-direction: column;
              gap: 2px;
            }

            .tp-about-review-name-desktop {
              font-size: 14px;
              font-weight: 600;
              color: #22160E;
            }

            .tp-about-review-verified-desktop {
              font-size: 12px;
              font-weight: 500;
              color: #8A8E92;
            }
          }
        `,
      }} />

      {/* ========== DESKTOP (lg and up): original layout ========== */}
      <div className="d-none d-lg-block">
        {/* Hero Section: Hracine Heritage */}
        <section className="tp-about-heritage-hero pt-120 pb-80">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-6 col-lg-6 mb-4 mb-lg-0">
                <div className="tp-about-heritage-hero-text">
                  <span
                    style={{
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      color: '#55585B',
                      marginBottom: '15px',
                      display: 'block',
                    }}
                  >
                    Hracine Heritage
                  </span>
                  <h1
                    className="tp-section-title"
                    style={{
                      fontSize: '46px',
                      marginBottom: '20px',
                      lineHeight: 1.2,
                      fontFamily: "'Playfair Display', 'Times New Roman', serif",
                    }}
                  >
                    Nurturing your roots, honoring your heritage.
                  </h1>
                  <p
                    style={{
                      fontSize: '18px',
                      lineHeight: '1.8',
                      color: '#55585B',
                      maxWidth: '520px',
                    }}
                  >
                    Hracine was created for women who are ready to care for their hair from the root up—starting
                    with a healthy, balanced scalp.
                  </p>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6">
                <div
                  className="tp-about-heritage-hero-image"
                  style={{
                    maxWidth: '520px',
                    marginLeft: 'auto',
                  }}
                >
                  <Image
                    src={founder_img}
                    alt="Hracine Heritage"
                    style={{
                      borderRadius: '16px',
                      width: '100%',
                      height: 'auto',
                      maxHeight: '520px',
                      objectFit: 'cover',
                      boxShadow: '0 18px 45px rgba(0,0,0,0.18)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="tp-about-mission-area pt-120 pb-80">
          <div className="container">
            <div className="row">
              <div className="col-xxl-12">
                <div className="tp-section-title-wrapper text-center mb-60">
                  <h2 className="tp-section-title">Roots First</h2>
                  <p
                    className="tp-section-subtitle"
                    style={{
                      fontSize: '18px',
                      lineHeight: '1.8',
                      maxWidth: '800px',
                      margin: '0 auto 10px',
                      color: '#55585B',
                    }}
                  >
                    Healthy, beautiful hair begins beneath the surface—with a calm, nourished scalp.
                  </p>
                  <p
                    style={{
                      fontSize: '17px',
                      lineHeight: '1.8',
                      maxWidth: '800px',
                      margin: '0 auto',
                      color: '#55585B',
                    }}
                  >
                    At Hracine, every formula is created to support scalp health first, so your length, volume, and
                    shine can follow naturally.
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
              {valueCards
                .filter((card) => card.title !== 'Integrity')
                .map((card) => (
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
                      Hracine was born from the belief that healthy hair begins with a happy scalp. Every product is
                      crafted with intention, using time-tested botanicals and modern formulations that honor both
                      tradition and innovation.
                    </p>
                    <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#55585B', fontStyle: 'italic' }}>
                      &quot;We&apos;re not just selling products—we&apos;re building a community of people who believe in root-deep
                      care and the beauty of natural wellness.&quot;
                    </p>
                  </div>
                  <div className="tp-about-founder-btn mt-40">
                    <Link href="/contact" className="tp-btn tp-btn-2">
                      Join the Root Tribe <ArrowRightLong />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ========== MOBILE (below lg): improved layout ========== */}
      <div className="d-lg-none">
        {/* Hero — image with Hracine Heritage text */}
        <section className="tp-about-mobile-hero pt-80 pb-40">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="tp-about-mobile-hero-inner">
                  <div style={{ marginBottom: '24px' }}>
                    <Image
                      src={founder_img}
                      alt="Hracine Heritage"
                      style={{
                        borderRadius: 14,
                        width: '100%',
                        height: 'auto',
                        maxHeight: 360,
                        objectFit: 'cover',
                        boxShadow: '0 14px 36px rgba(0,0,0,0.18)',
                      }}
                    />
                  </div>
                  <h2
                    className="tp-section-title text-center mb-20"
                    style={{
                      fontSize: 'clamp(26px, 5vw, 34px)',
                      fontWeight: 700,
                      color: '#22160E',
                      fontFamily: "'Playfair Display', 'Times New Roman', serif",
                    }}
                  >
                    Hracine Heritage
                  </h2>
                  <p className="tp-about-mobile-hero-body mb-0" style={{ fontSize: '15px', color: '#55585B' }}>
                    Scalp-first care for longer, fuller, healthier hair—rooted in ritual, crafted with intention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values — 2-col, short copy */}
        <section className="tp-about-mobile-values pt-30 pb-60" style={{ backgroundColor: '#F8F6F3' }}>
          <div className="container">
            <div className="row g-3">
              {valueCards.map((card) => (
                <div key={card.id} className="col-6">
                  <div className="tp-about-mobile-value-card">
                    <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#22160E', marginBottom: '0.4rem' }}>
                      {card.title}
                    </h3>
                    <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#55585B', margin: 0 }}>
                      {card.descriptionShort}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visual break */}
        <section className="py-30" style={{ backgroundColor: '#fff' }} aria-hidden="true">
          <div className="container">
            <div style={{ maxWidth: 100, height: 1, margin: '0 auto', backgroundColor: 'rgba(34,22,14,0.12)' }} />
          </div>
        </section>

        {/* Founder — order: label → heading → image → text → CTA */}
        <section className="tp-about-mobile-founder pt-50 pb-60" style={{ backgroundColor: '#22160E' }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="tp-about-mobile-founder-inner">
                  <span className="d-block mb-12" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(232,232,232,0.9)' }}>
                    Our Story
                  </span>
                  <h2 className="mb-25" style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, color: '#fff' }}>
                    Meet the Founder
                  </h2>
                  <div className="mb-30">
                    <Image
                      src={founder_img}
                      alt="Founder"
                      style={{
                        borderRadius: 12,
                        width: '100%',
                        maxWidth: 320,
                        height: 'auto',
                        margin: '0 auto',
                        display: 'block',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.25)'
                      }}
                    />
                  </div>
                  <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#E8E8E8', marginBottom: '1rem' }}>
                    After years of struggling with scalp issues, I found healing in Ayurvedic hair care. That personal journey became a mission to help others experience the same transformation.
                  </p>
                  <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(232,232,232,0.95)', fontStyle: 'italic', marginBottom: 0 }}>
                    &quot;We&apos;re not just selling products—we&apos;re building a community that believes in root-deep care and the beauty of natural wellness.&quot;
                  </p>
                  <div className="tp-about-mobile-cta-wrap mt-35">
                    <Link
                      href="/contact"
                      className="tp-btn tp-btn-2 tp-about-mobile-cta-btn"
                      style={{
                        backgroundColor: '#fff',
                        color: '#22160E',
                        borderColor: '#fff',
                        padding: '12px 24px',
                        borderRadius: 8,
                        fontWeight: 600
                      }}
                    >
                      Join the Root Tribe <ArrowRightLong />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews - mobile */}
        <section
          className="tp-about-mobile-reviews"
          style={{
            backgroundColor: '#F8F6F3',
            paddingTop: 28,
            paddingBottom: 40,
          }}
        >
          <div className="container">
            <div className="row" style={{ marginBottom: 16 }}>
              <div className="col-12">
                <h2
                  className="tp-section-title text-center mb-10"
                  style={{
                    fontSize: 'clamp(20px, 4.5vw, 26px)',
                    fontWeight: 700,
                    color: '#22160E',
                    lineHeight: 1.35,
                    marginBottom: 6,
                    fontFamily: "'Playfair Display', 'Times New Roman', serif",
                  }}
                >
                  What Our Root Tribe Is Saying
                </h2>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#55585B',
                    marginBottom: 0,
                    lineHeight: 1.6,
                  }}
                >
                  Real experiences from women nourishing their roots with Hracine.
                </p>
              </div>
            </div>
            <div ref={mobileCarouselRef} className="tp-about-mobile-reviews-scroll">
              {reviews.map((review) => {
                return (
                  <article
                    key={review.id}
                    className="tp-about-review-card"
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 16,
                      padding: 20,
                      boxShadow: '0 10px 32px rgba(34,22,14,0.08)',
                      textAlign: 'left',
                    }}
                  >
                    <div
                      className="tp-about-review-stars"
                      aria-hidden="true"
                      title={`${review.rating} out of 5 stars`}
                    >
                      {renderRatingStars(review.rating)}
                    </div>
                    <div className="tp-about-review-meta">
                      <div className="tp-about-review-avatar">
                        {review.avatar ? (
                          <Image
                            src={review.avatar}
                            alt={review.name}
                            width={32}
                            height={32}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                          />
                        ) : (
                          getInitials(review.name)
                        )}
                      </div>
                      <div className="tp-about-review-name">{review.name}</div>
                    </div>
                    <p
                      style={{
                        fontSize: '13px',
                        lineHeight: 1.6,
                        color: '#55585B',
                        marginBottom: 0,
                      }}
                    >
                      “{review.quote}”
                    </p>
                  </article>
                );
              })}
            </div>
            <div className="tp-about-review-nav" aria-hidden="true">
              <div className="tp-about-review-dots">
                {reviews.map((r, index) => (
                  <span
                    key={r.id}
                    className={`tp-about-review-dot ${index === activeReview ? 'is-active' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Shared Reviews section for desktop & tablet */}
      <div className="d-none d-lg-block">
        <section className="tp-about-reviews-area pt-100 pb-120 grey-bg">
          <div className="container">
            <div className="row justify-content-center mb-60">
              <div className="col-xl-8 col-lg-9 text-center">
                <div style={{ marginBottom: '18px' }}>
                  <div className="tp-about-trust-bar">
                    <span>Trusted by 5,000+ healthy scalps</span>
                    <span className="tp-about-trust-bar-dot" aria-hidden="true" />
                    <span>4.9/5 average rating</span>
                  </div>
                </div>
                <h2
                  className="tp-section-title"
                  style={{
                    fontSize: '36px',
                    marginBottom: '15px',
                    fontFamily: "'Playfair Display', 'Times New Roman', serif",
                  }}
                >
                  What Our Root Tribe Is Saying
                </h2>
                <p
                  style={{
                    fontSize: '18px',
                    lineHeight: '1.8',
                    color: '#55585B',
                    maxWidth: '620px',
                    margin: '0 auto',
                  }}
                >
                  Real stories from women who chose to start their hair journey at the root—with Hracine.
                </p>
              </div>
            </div>
            <div className="tp-about-reviews-grid">
              {reviews.map((review) => (
                <article key={review.id} className="tp-about-review-card-desktop">
                  <div
                    className="tp-about-review-stars-desktop"
                    aria-hidden="true"
                    title={`${review.rating} out of 5 stars`}
                  >
                    {renderRatingStars(review.rating)}
                  </div>
                  <h3 className="tp-about-review-headline-desktop">
                    {review.headline}
                  </h3>
                  <p className="tp-about-review-body-desktop">
                    “{renderHighlightedQuote(review.quote, review.highlights)}”
                  </p>
                  <div className="tp-about-review-footer-desktop">
                    <div className="tp-about-review-avatar-desktop">
                      {review.avatar ? (
                        <Image
                          src={review.avatar}
                          alt={review.name}
                          width={36}
                          height={36}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                        />
                      ) : (
                        getInitials(review.name)
                      )}
                    </div>
                    <div className="tp-about-review-meta-desktop">
                      <span className="tp-about-review-name-desktop">{review.name}</span>
                      <span className="tp-about-review-verified-desktop">Verified Customer</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutArea;
