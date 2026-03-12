import React, { useEffect } from "react";
import { useGetProductTypeQuery } from "@/redux/features/productApi";
import Link from "next/link";
import Image from "next/image";
import ErrorMsg from "@/components/common/error-msg";
import HomePrdLoader from "@/components/loader/home/home-prd-loader";

const FeaturedRituals = () => {
  const { data: products, isError, isLoading, refetch } = 
    useGetProductTypeQuery({ type: 'all', query: 'comingSoon=true' });

  useEffect(() => {
    refetch();
  }, [refetch]);

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <HomePrdLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    const product_items = products.data.slice(0, 4); // 4 on desktop; mobile shows 2 via CSS
    content = product_items.map((prd, i) => (
      <div key={i} className="col-xl-3 col-lg-3 col-sm-6 tp-featured-rituals-col" style={{
        paddingLeft: '10px',
        paddingRight: '10px',
        marginBottom: 'clamp(20px, 3vw, 30px)'
      }}>
        <div className="tp-product-item-2 tp-product-item mb-25" style={{ 
          position: 'relative',
          textAlign: 'center',
          padding: 'clamp(12px, 2vw, 20px)',
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          backgroundColor: '#fff',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div className="tp-product-thumb p-relative text-center" style={{
            marginBottom: 'clamp(8px, 1.5vw, 15px)'
          }}>
            <Link href={`/product-details/${prd._id}`}>
              <Image 
                src={prd.img} 
                alt={prd.title} 
                width={270} 
                height={270}
                style={{ 
                  borderRadius: '8px',
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100%',
                  maxHeight: 'clamp(180px, 35vw, 270px)',
                  objectFit: 'contain',
                  aspectRatio: '1 / 1'
                }}
              />
            </Link>
            {prd.comingSoon && (
              <div className="tp-product-badge" style={{
                position: 'absolute',
                top: 'clamp(8px, 1.5vw, 15px)',
                right: 'clamp(8px, 1.5vw, 15px)',
                backgroundColor: '#fff',
                padding: 'clamp(4px, 1vw, 6px) clamp(8px, 1.5vw, 12px)',
                borderRadius: '20px',
                fontSize: 'clamp(9px, 1.8vw, 11px)',
                fontWeight: '600',
                color: '#22160E',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                free shipping on orders above #25,000
              </div>
            )}
          </div>
          <div className="tp-product-content text-center" style={{
            paddingTop: '0',
            textAlign: 'center',
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <h3 className="tp-product-title" style={{ 
              fontSize: 'clamp(14px, 2.5vw, 18px)', 
              marginBottom: 'clamp(6px, 1vw, 10px)',
              marginTop: '0',
              textAlign: 'center',
              lineHeight: '1.3'
            }}>
              <Link href={`/product-details/${prd._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {prd.title}
              </Link>
            </h3>
            <p style={{ 
              fontSize: 'clamp(11px, 1.8vw, 14px)', 
              color: '#55585B', 
              marginBottom: 'clamp(10px, 1.5vw, 15px)',
              fontStyle: 'italic',
              minHeight: 'clamp(32px, 6vw, 40px)',
              textAlign: 'center',
              lineHeight: '1.5',
              flex: '1'
            }}>
              {prd.description?.substring(0, 60)}...
            </p>
            <div className="tp-product-btn" style={{ textAlign: 'center', marginTop: 'auto' }}>
              <Link href={`/product-details/${prd._id}`} className="tp-btn tp-btn-border" style={{
                padding: 'clamp(6px, 1.5vw, 10px) clamp(16px, 2.5vw, 25px)',
                fontSize: 'clamp(12px, 1.8vw, 14px)',
                display: 'inline-block',
                width: 'auto',
                maxWidth: '100%',
                borderRadius: '6px',
                backgroundColor: '#85312C',
                borderColor: '#85312C',
                color: '#fff'
              }}>
                Explore Our Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    ));
  }

  return (
    <section className="tp-featured-rituals-area tp-featured-rituals-mobile-two pt-100 pb-100 grey-bg" style={{
      paddingTop: 'clamp(40px, 8vw, 100px)',
      paddingBottom: 'clamp(40px, 8vw, 100px)'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767.98px) {
          .tp-featured-rituals-mobile-two .tp-featured-rituals-col:nth-child(n+3) {
            display: none !important;
          }
        }
      `}} />
      <div className="container">
        <div className="row">
          <div className="col-xxl-12">
            <div className="tp-section-title-wrapper text-center mb-50" style={{
              marginBottom: 'clamp(30px, 5vw, 50px)'
            }}>
              <h2 className="tp-section-title" style={{ 
                fontSize: 'clamp(24px, 5vw, 42px)', 
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                Featured Routine
              </h2>
              <p style={{ 
                fontSize: 'clamp(14px, 2.5vw, 18px)', 
                color: '#55585B', 
                maxWidth: '860px',
                margin: '0 auto 10px',
                padding: '0 15px',
                textAlign: 'center'
              }}>
                After years of struggling with hair growth, I discovered that the secret to beautiful and long hair isn&apos;t in the latest trend but in nurturing your roots. If you wish to have long, beautiful hair but your scalp is damaged, you&apos;re still struggling with dandruff, scalp itchiness, or product build-up, it&apos;s nearly impossible to achieve your hair goal.
              </p>
              <p style={{ 
                fontSize: 'clamp(14px, 2.3vw, 18px)', 
                color: '#55585B', 
                maxWidth: '860px',
                margin: '0 auto',
                padding: '0 15px',
                textAlign: 'center'
              }}>
                The first step in your hair care journey is to care for your hair root—your scalp. This is why every Hracine product starts with scalp health. Join us on this journey to healthier, longer, and fuller hair, one routine at a time.
              </p>
            </div>
          </div>
        </div>
        <div className="row" style={{
          marginLeft: '-10px',
          marginRight: '-10px'
        }}>
          {content}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRituals;
