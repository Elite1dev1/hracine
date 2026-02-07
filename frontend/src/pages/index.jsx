import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import Header from "@/layout/headers/header";
import HairCareHero from "@/components/hero-banner/hair-care-hero";
import WhyScalpMatters from "@/components/home/why-scalp-matters";
import FeaturedRituals from "@/components/home/featured-rituals";
import FounderNote from "@/components/home/founder-note";
import BlogArea from "@/components/blog/electronic/blog-area";
import InstagramArea from "@/components/instagram/instagram-area";
import Footer from "@/layout/footers/footer";

export default function Home() {
  return (
    <Wrapper>
      <SEO pageTitle='Home'/>
      <Header/>
      <HairCareHero/>
      <WhyScalpMatters/>
      <FeaturedRituals/>
      <FounderNote/>
      <BlogArea/>
      <InstagramArea/>
      <Footer/>
    </Wrapper>
  )
}
