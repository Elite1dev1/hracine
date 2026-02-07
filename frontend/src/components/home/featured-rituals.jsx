import React, { useEffect, useState } from "react";
import { useGetProductTypeQuery } from "@/redux/features/productApi";
import { ShapeLine } from "@/svg";
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
    const product_items = products.data.slice(0, 4); // Show only 4 products
    content = product_items.map((prd, i) => (
      <div key={i} className="col-xl-3 col-lg-3 col-sm-6">
        <div className="tp-product-item-2 tp-product-item mb-25" style={{ position: 'relative' }}>
          <div className="tp-product-thumb p-relative text-center">
            <Link href={`/product-details/${prd._id}`}>
              <Image 
                src={prd.img} 
                alt={prd.title} 
                width={270} 
                height={270}
                style={{ borderRadius: '8px' }}
              />
            </Link>
            {prd.comingSoon && (
              <div className="tp-product-badge" style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                backgroundColor: '#fff',
                padding: '8px 15px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#22160E',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                Coming Soon
              </div>
            )}
          </div>
          <div className="tp-product-content text-center pt-15">
            <h3 className="tp-product-title" style={{ fontSize: '18px', marginBottom: '10px' }}>
              <Link href={`/product-details/${prd._id}`}>{prd.title}</Link>
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: '#55585B', 
              marginBottom: '15px',
              fontStyle: 'italic',
              minHeight: '40px'
            }}>
              {prd.description?.substring(0, 60)}...
            </p>
            <div className="tp-product-btn">
              <Link href={`/product-details/${prd._id}`} className="tp-btn tp-btn-border" style={{
                padding: '10px 25px',
                fontSize: '14px'
              }}>
                Explore Rituals
              </Link>
            </div>
          </div>
        </div>
      </div>
    ));
  }

  return (
    <section className="tp-featured-rituals-area pt-100 pb-100 grey-bg">
      <div className="container">
        <div className="row">
          <div className="col-xxl-12">
            <div className="tp-section-title-wrapper text-center mb-50">
              <h2 className="tp-section-title" style={{ fontSize: '42px', marginBottom: '15px' }}>
                Featured Rituals
                <ShapeLine />
              </h2>
              <p style={{ fontSize: '18px', color: '#55585B', maxWidth: '600px', margin: '0 auto' }}>
                Discover our collection of scalp-first hair care products, each designed to nourish and restore.
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          {content}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRituals;
