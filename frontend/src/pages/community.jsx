import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import CommunityArea from "@/components/community/community-area";

const CommunityPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Community" />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="Community" subtitle="Community" center={true} />
      <CommunityArea/>
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default CommunityPage;
