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
      <section className="tp-slider-area p-relative z-index-1">
        <div className="tp-slider-item tp-slider-height d-flex align-items-center" style={{ 
          backgroundColor: '#F8F8F8',
          minHeight: '600px'
        }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-6 col-lg-6 col-md-6">
                <div className="tp-slider-content p-relative z-index-1">
                  <h1 className="tp-slider-title" style={{ 
                    fontSize: '56px', 
                    lineHeight: '1.2',
                    marginBottom: '20px',
                    fontWeight: '700',
                    color: '#22160E'
                  }}>
                    Root-Deep Care & Moisture. That Lasts.
                  </h1>
                  <p style={{ 
                    fontSize: '20px', 
                    lineHeight: '1.6',
                    color: '#55585B',
                    marginBottom: '40px',
                    fontStyle: 'italic'
                  }}>
                    Healthy hair begins with a happy scalp.
                  </p>
                  <div className="tp-slider-btn">
                    <Link href="/community" className="tp-btn tp-btn-2" style={{ 
                      padding: '15px 40px',
                      fontSize: '16px'
                    }}>
                      Join the Roots and Rituals Tribe
                      {" "} <ArrowRightLong />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6">
                <div className="tp-slider-thumb text-end">
                  <Image src={slider_img_1} alt="hair-care-hero" style={{ maxWidth: '100%', height: 'auto' }} />
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
