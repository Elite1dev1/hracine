import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import ConsultationArea from "@/components/consultation/consultation-area";

const ConsultationPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Consultation" />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="Consultation" subtitle="Consultation" center={true} />
      <ConsultationArea/>
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ConsultationPage;
