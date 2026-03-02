import React from "react";
import Image from "next/image";
import Link from "next/link";
// internal
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import Wrapper from "@/layout/wrapper";
import error from '@assets/img/error/error.png';

const ErrorPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="404" />
      <HeaderTwo style_2={true} />
      {/* 404 area start */}
      <section className="tp-error-area pt-110 pb-110" style={{
        paddingTop: 'clamp(60px, 10vw, 110px)',
        paddingBottom: 'clamp(60px, 10vw, 110px)'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8 col-md-10 col-12">
              <div className="tp-error-content text-center" style={{ textAlign: 'center' }}>
                <div className="tp-error-thumb" style={{ 
                  marginBottom: '30px',
                  textAlign: 'center'
                }}>
                  <Image 
                    src={error} 
                    alt="error img" 
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      height: 'auto'
                    }}
                  />
                </div>

                <h3 className="tp-error-title" style={{ 
                  fontSize: 'clamp(24px, 5vw, 36px)',
                  textAlign: 'center',
                  marginBottom: '20px'
                }}>Oops! Page not found</h3>
                <p style={{ 
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                  textAlign: 'center',
                  marginBottom: '30px',
                  padding: '0 15px'
                }}>
                  Whoops, this is embarrassing. Looks like the page you were
                  looking for was not found.
                </p>

                <Link href="/" className="tp-error-btn" style={{
                  display: 'inline-block',
                  padding: 'clamp(10px, 2vw, 12px) clamp(20px, 4vw, 30px)',
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                  width: 'auto',
                  maxWidth: '100%'
                }}>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 404 area end */}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ErrorPage;
