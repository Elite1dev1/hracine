import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
// internal
import Menus from './header-com/menus';
import logo from '@assets/img/logo/favicon.png';
import useSticky from '@/hooks/use-sticky';
import useCartInfo from '@/hooks/use-cart-info';
import { openCartMini } from '@/redux/features/cartSlice';
import { handleFilterSidebarOpen } from '@/redux/features/shop-filter-slice';
import { useGetSettingsQuery } from '@/redux/features/admin/adminApi';
import HeaderTopRight from './header-com/header-top-right';
import CartMiniSidebar from '@/components/common/cart-mini-sidebar';
import { CartTwo, Compare, Facebook, Menu, PhoneTwo, Wishlist, Search, Filter } from '@/svg';
import useSearchFormSubmit from '@/hooks/use-search-form-submit';
import OffCanvas from '@/components/common/off-canvas';
import PromoBanner from "@/components/common/promo-banner";

const HeaderTwo = ({ style_2 = false }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { data: settingsData } = useGetSettingsQuery();
  const [isOffCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { setSearchText, handleSubmit, searchText } = useSearchFormSubmit();
  const { quantity } = useCartInfo();
  const { sticky } = useSticky();
  const dispatch = useDispatch();
  const router = useRouter();
  const { query } = router;
  const isHomeNavbar = router.pathname === "/" || router.pathname.startsWith("/home");

  // Count active filters from URL query (for shop page)
  const countActiveFilters = () => {
    if (router.pathname !== '/shop') return 0;
    let count = 0;
    if (query.category) count++;
    if (query.subCategory) count++;
    if (query.status) count++;
    if (query.minPrice || query.maxPrice) count++;
    return count;
  };

  const activeFilterCount = countActiveFilters();

  // Handle filter click
  const handleFilterClick = () => {
    dispatch(handleFilterSidebarOpen());
  };

  // Mobile scroll detection - show header only at top
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header when at top (within 10px of top)
      if (currentScrollY <= 10) {
        setIsHeaderVisible(true);
      }
      // Hide header when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
  return (
    <>
      <header style={{ position: 'relative', zIndex: 100 }}>
        <PromoBanner />
        <div
          className={`tp-header-area tp-header-style-${style_2 ? 'primary' : 'darkRed'} tp-header-height ${isHomeNavbar ? "" : "tp-header-non-home"
            }`}
        >
          <div className="tp-header-top-2 p-relative z-index-11 tp-header-top-border d-none d-md-block">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="tp-header-info d-flex align-items-center">
                    <div className="tp-header-info-item">
                      <a href="#">
                        <span>
                          <Facebook />
                        </span> {settingsData?.data?.freeShippingBannerText || "free shipping on orders above #25,000"}
                      </a>
                    </div>
                    <div className="tp-header-info-item">
                      <Link href="/contact">
                        <span>
                          <PhoneTwo />
                        </span> Contact
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="tp-header-top-right tp-header-top-black d-flex align-items-center justify-content-end">
                    <HeaderTopRight />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            id="header-sticky"
            className={`tp-header-bottom-2 tp-header-sticky ${sticky ? 'header-sticky' : ''} ${isHeaderVisible ? 'header-visible' : 'header-hidden'}`}
            style={sticky ? { backgroundColor: '#C47070', background: '#C47070' } : {}}
          >
            <div className="container">
              <div className="tp-mega-menu-wrapper p-relative">
                <div className="row align-items-center">
                  <div className="col-xl-2 col-lg-5 col-md-5 col-sm-4 col-6">
                    <div className="logo">
                      <Link href="/">
                        <Image
                          src={logo}
                          alt="logo"
                          width={120}
                          height={120}
                          priority
                          style={{ width: 'auto', height: 'auto', maxWidth: '150px' }}
                          className="d-none d-md-block"
                        />
                        <Image
                          src={logo}
                          alt="logo"
                          width={50}
                          height={50}
                          priority
                          style={{ width: 'auto', height: 'auto', maxWidth: '50px', maxHeight: '50px' }}
                          className="d-block d-md-none"
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="col-xl-5 d-none d-xl-block">
                    <div className="main-menu menu-style-2">
                      <nav className="tp-main-menu-content">
                        <Menus />
                      </nav>
                    </div>
                  </div>
                  <div className="col-xl-5 col-lg-7 col-md-7 col-sm-8 col-6">
                    <div className="tp-header-bottom-right d-flex align-items-center justify-content-end pl-30">
                      <div className="tp-header-search-2 d-none d-sm-block">
                        <form onSubmit={handleSubmit}>
                          <input
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                            type="text"
                            placeholder="Search for Products..." />
                          <button type="submit">
                            <Search />
                          </button>
                        </form>
                      </div>
                      <div className="tp-header-action d-flex align-items-center ml-30">
                        <div className="tp-header-action-item d-none d-lg-block">
                          <Link href="/compare" className="tp-header-action-btn">
                            <Compare />
                          </Link>
                        </div>
                        <div className="tp-header-action-item d-none d-lg-block">
                          <Link href="/wishlist" className="tp-header-action-btn">
                            <Wishlist />
                            <span className="tp-header-action-badge">{wishlist.length}</span>
                          </Link>
                        </div>
                        <div className="tp-header-action-item">
                          <button onClick={() => dispatch(openCartMini())} className="tp-header-action-btn cartmini-open-btn" >
                            <CartTwo />
                            <span className="tp-header-action-badge">{quantity}</span>
                          </button>
                        </div>
                        {/* Filter Icon - Mobile Only */}
                        {router.pathname === '/shop' && (
                          <div className="tp-header-action-item d-xl-none">
                            <button
                              onClick={handleFilterClick}
                              type="button"
                              className="tp-header-action-btn tp-header-filter-btn"
                            >
                              <Filter />
                              {activeFilterCount > 0 && (
                                <span className="tp-header-action-badge">{activeFilterCount}</span>
                              )}
                            </button>
                          </div>
                        )}
                        <div className="tp-header-action-item tp-header-hamburger mr-20 d-xl-none">
                          <button onClick={() => setIsCanvasOpen(true)} type="button" className="tp-offcanvas-open-btn">
                            <Menu />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* cart mini sidebar start */}
      <CartMiniSidebar />
      {/* cart mini sidebar end */}

      {/* off canvas start */}
      <OffCanvas isOffCanvasOpen={isOffCanvasOpen} setIsCanvasOpen={setIsCanvasOpen} categoryType="fashion" />
      {/* off canvas end */}
    </>
  );
};

export default HeaderTwo;