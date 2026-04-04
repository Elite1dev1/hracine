// external
import React from "react";
import Image from "next/image";
import Link from "next/link";
// internal
import slider_img_1 from "@assets/img/slider/slider-img-1.png";
import { ArrowRightLong } from "@/svg";

const HairCareHero = () => {
  return (
    <>
      <section className="tp-slider-area p-relative z-index-1" style={{ 
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden'
      }}>
        {/* Video Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}>
          {/* Desktop Video */}
          <video
            className="d-none d-md-block"
            autoPlay
            loop
            muted
            playsInline
            poster={slider_img_1.src}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          >
            <source src="/videos/landscape.mp4" type="video/mp4" />
          </video>
          
          {/* Mobile Video */}
          <video
            className="d-block d-md-none"
            autoPlay
            loop
            muted
            playsInline
            poster={slider_img_1.src}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          >
            <source src="/videos/potriait.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1
        }}></div>

        {/* Content */}
        <div className="tp-slider-item tp-slider-height d-flex align-items-center justify-content-center" style={{ 
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          width: '100%',
          paddingTop: '80px' /* Push content down slightly to clear fixed header on mobile */
        }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-10 col-lg-10 col-md-12">
                <div className="tp-slider-content p-relative z-index-1 text-center">
                  <h1 className="tp-slider-title" style={{ 
                    fontSize: 'clamp(32px, 5vw, 56px)', 
                    lineHeight: '1.2',
                    marginBottom: '20px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                    fontFamily: "'Playfair Display', serif",
                    letterSpacing: '0.5px'
                  }}>
                    Root-Deep Care & Moisture. That Lasts.
                  </h1>
                  <p style={{ 
                    fontSize: 'clamp(16px, 2.5vw, 20px)', 
                    lineHeight: '1.6',
                    color: '#FFFFFF',
                    marginBottom: '40px',
                    fontStyle: 'italic',
                    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)'
                  }}>
                    Healthy hair begins with a happy scalp.
                  </p>
                  <div className="tp-slider-btn">
                    <Link href="/community" className="tp-btn tp-btn-2" style={{ 
                      padding: 'clamp(12px, 2vw, 15px) clamp(30px, 5vw, 40px)',
                      fontSize: 'clamp(14px, 2vw, 16px)',
                      display: 'inline-block'
                    }}>
                      Join the Root Tribe
                      {" "} <ArrowRightLong />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HairCareHero;
