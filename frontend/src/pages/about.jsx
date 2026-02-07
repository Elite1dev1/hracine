import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import AboutArea from "@/components/about/about-area";

const AboutPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="About Us" />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="About Us" subtitle="About" center={true} />
      <AboutArea/>
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default AboutPage;
