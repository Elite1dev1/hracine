import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// internal
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import Wrapper from '@/layout/wrapper';
import ErrorMsg from '@/components/common/error-msg';
import { useGetProductQuery } from '@/redux/features/productApi';
import ProductDetailsBreadcrumb from '@/components/breadcrumb/product-details-breadcrumb';
import ProductDetailsArea from '@/components/product-details/product-details-area';
import PrdDetailsLoader from '@/components/loader/prd-details-loader';
import { trackViewContent } from '@/lib/gtm';
import { getApiBaseUrl } from "@/utils/apiConfig";
import { getProductSeo } from "@/lib/seo";

const ProductDetailsPage = ({ query, initialProduct, seo }) => {
  const router = useRouter();
  const productId = query?.id;
  const { data: product, isLoading, isError, error } = useGetProductQuery(productId, { skip: !productId });
  const resolvedProduct = product || initialProduct || null;

  useEffect(() => {
    if (!resolvedProduct?._id) {
      return;
    }

    trackViewContent({
      id: resolvedProduct._id,
      title: resolvedProduct.title,
      category: resolvedProduct.category?.name,
      price: resolvedProduct.price,
      currency: 'NGN',
      contentType: resolvedProduct.isPreOrder ? 'product_group' : 'product',
    });
  }, [resolvedProduct]);
  
  // decide what to render
  let content = null;
  
  if (!productId) {
    content = (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#22160E' }}>404</h1>
          <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#55585B' }}>Product ID Required</h2>
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
    );
  } else if (isLoading && !resolvedProduct) {
    content = <PrdDetailsLoader loading={isLoading}/>;
  } else if (!isLoading && isError) {
    const errorMessage = error?.data?.message || error?.message || 'There was an error loading the product';
    content = (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#55585B' }}>Error Loading Product</h2>
          <p style={{ fontSize: '16px', marginBottom: '30px', color: '#55585B' }}>
            {errorMessage}
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
              Back to Shop
            </button>
          </Link>
        </div>
      </div>
    );
  } else if (resolvedProduct) {
    content = (
      <>
        <ProductDetailsBreadcrumb category={resolvedProduct.category?.name || 'Product'} title={resolvedProduct.title || 'Product Details'} />
        <ProductDetailsArea productItem={resolvedProduct} />
      </>
    );
  } else if (!isLoading && !isError && !resolvedProduct) {
    content = (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#55585B' }}>Product Not Found</h2>
          <p style={{ fontSize: '16px', marginBottom: '30px', color: '#55585B' }}>
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
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
    );
  }
  
  return (
    <Wrapper>
      <SEO {...seo} />
      <HeaderTwo style_2={true} />
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ProductDetailsPage;

export const getServerSideProps = async (context) => {
  const { query } = context;
  const productId = query?.id;
  let initialProduct = null;

  if (productId) {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/product/single-product/${productId}`);
      if (response.ok) {
        initialProduct = await response.json();
      }
    } catch (fetchError) {
      console.error("Failed to fetch product SEO data:", fetchError);
    }
  }

  return {
    props: {
      query,
      initialProduct,
      seo: getProductSeo(initialProduct, productId),
    },
  };
};
