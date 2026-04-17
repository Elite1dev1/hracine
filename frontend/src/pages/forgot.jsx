import React from 'react';
import SEO from '@/components/seo';
import Wrapper from '@/layout/wrapper';
import HeaderTwo from '@/layout/headers/header-2';
import CommonBreadcrumb from '@/components/breadcrumb/common-breadcrumb';
import ForgotArea from '@/components/login-register/forgot-area';
import Footer from '@/layout/footers/footer';
import { PAGE_SEO } from "@/lib/seo";

const ForgotPage = () => {
  return (
    <Wrapper>
      <SEO {...PAGE_SEO.forgot} />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="Forgot Password" subtitle="Reset Password" center={true} />
      <ForgotArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ForgotPage;
