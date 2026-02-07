import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// internal
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import Wrapper from '@/layout/wrapper';
import ErrorMsg from '@/components/common/error-msg';

const ProductDetailsIndexPage = () => {
  const router = useRouter();

  return (
    <Wrapper>
      <SEO pageTitle="Product Not Found" />
      <HeaderTwo style_2={true} />
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#22160E' }}>404</h1>
          <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#55585B' }}>Product Not Found</h2>
          <p style={{ fontSize: '16px', marginBottom: '30px', color: '#55585B' }}>
            Please select a product from our shop to view its details.
          </p>
          <Link href="/shop">
            <button style={{
              padding: '12px 30px',
              backgroundColor: '#C47070',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Browse Products
            </button>
          </Link>
        </div>
      </div>
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ProductDetailsIndexPage;
