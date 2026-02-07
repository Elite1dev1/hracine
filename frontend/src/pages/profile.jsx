import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
// internal
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import ProfileArea from "@/components/my-account/profile-area";
import { useGetUserOrdersQuery } from "@/redux/features/order/orderApi";
import Loader from "@/components/loader/loader";

const ProfilePage = () => {
  const router = useRouter();
  const {data: orderData, isError, isLoading, refetch } = useGetUserOrdersQuery(undefined, {
    // Force refetch on mount to avoid stale cache
    refetchOnMountOrArgChange: true,
  });
  
  useEffect(() => {
    const isAuthenticate = Cookies.get("userInfo");
    if (!isAuthenticate) {
      router.push("/login");
    } else {
      // Refetch orders when component mounts to ensure fresh data
      refetch();
    }
  }, [router, refetch]);
  
  // Debug: Log order data to console
  useEffect(() => {
    if (orderData) {
      console.log('Order Data:', orderData);
      console.log('Orders:', orderData?.orders);
      console.log('Total Orders:', orderData?.totalDoc);
    }
    if (isError) {
      console.error('Error fetching orders:', isError);
    }
  }, [orderData, isError]);

  if (isLoading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <Loader loading={isLoading} />
      </div>
    );
  }

  return (
    <Wrapper>
      <SEO pageTitle="Profile" />
      <HeaderTwo style_2={true} />
      <ProfileArea orderData={orderData} />
      <Footer style_2={true} />
    </Wrapper>
  );
};

export default ProfilePage;
