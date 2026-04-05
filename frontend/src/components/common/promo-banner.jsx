import React, { useState, useEffect, useRef } from 'react';
import { Close } from '@/svg';
import { useGetSettingsQuery } from '@/redux/features/admin/adminApi';

const ANIMATION_MS = 320;

const PromoBanner = () => {
  const { data: settingsData } = useGetSettingsQuery();
  const [isVisible, setIsVisible] = useState(false); // controls open/close animation
  const [shouldRender, setShouldRender] = useState(false); // remove from layout after close
  const [rowHeight, setRowHeight] = useState(0);
  const rowRef = useRef(null);

  // on mount, decide whether to show
  useEffect(() => {
    const isDismissed = sessionStorage.getItem('promo_banner_dismissed');
    if (!isDismissed) {
      setShouldRender(true);
      // allow first paint before expanding for smoother anim
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, []);

  // measure height for smooth max-height animation
  useEffect(() => {
    if (rowRef.current) {
      setRowHeight(rowRef.current.scrollHeight);
    }
  }, [shouldRender, settingsData]);

  const handleDismiss = () => {
    sessionStorage.setItem('promo_banner_dismissed', 'true');
    setIsVisible(false);
    setTimeout(() => setShouldRender(false), ANIMATION_MS);
  };

  if (!shouldRender) return null;

  const bannerText = settingsData?.data?.freeShippingBannerText || "Free shipping on orders above NGN 25,000.";

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .tp-promo-banner {
              transition: max-height 0.32s ease, opacity 0.32s ease, padding 0.32s ease;
              overflow: hidden;
              background-color: #000;
              max-height: 200px;
              opacity: 1;
              padding: 12px 0;
              min-height: 44px;
            }
            .tp-promo-banner.closing {
              max-height: 0;
              opacity: 0;
              padding-top: 0;
              padding-bottom: 0;
            }
            .tp-promo-banner .tp-promo-banner__row {
              display: flex !important;
              flex-direction: row !important;
              flex-wrap: nowrap !important;
              align-items: center !important;
              justify-content: center !important;
              position: relative;
              min-height: 44px;
              width: 100%;
              max-width: 1230px;
              margin: 0 auto;
              padding: 0 15px;
              box-sizing: border-box;
            }
            .tp-promo-banner .tp-promo-banner__text {
              flex: 1 1 auto !important;
              text-align: center !important;
              margin: 0 !important;
              padding: 5px 44px 5px 0 !important;
              font-size: 14px;
              font-weight: 500;
              color: #fff;
              line-height: 1.3;
              display: block !important;
            }
            .tp-promo-banner .tp-promo-banner__close,
            .tp-promo-banner button.tp-promo-banner__close {
              position: absolute !important;
              right: 18px !important;
              top: 50% !important;
              transform: translateY(-50%) !important;
              flex-shrink: 0 !important;
              width: 28px !important;
              max-width: 28px !important;
              min-width: 28px !important;
              height: 28px !important;
              margin: 0 !important;
              padding: 0 !important;
              background: transparent;
              border: none;
              color: #fff;
              cursor: pointer;
              display: flex !important;
              align-items: center;
              justify-content: center;
              opacity: 0.8;
            }
            .tp-promo-banner .tp-promo-banner__close:hover {
              opacity: 1;
            }
            .tp-promo-banner .tp-promo-banner__close svg {
              width: 12px;
              height: 12px;
              fill: currentColor;
            }
            @media (max-width: 576px) {
              .tp-promo-banner .tp-promo-banner__row { padding: 0 10px; min-height: 30px; }
              .tp-promo-banner .tp-promo-banner__text { font-size: 12px; padding-right: 36px !important; }
              .tp-promo-banner .tp-promo-banner__close,
              .tp-promo-banner button.tp-promo-banner__close {
                right: 10px !important;
                width: 22px !important;
                max-width: 22px !important;
                min-width: 22px !important;
                height: 22px !important;
              }
              .tp-promo-banner .tp-promo-banner__close svg { width: 9px; height: 9px; }
            }
          `,
        }}
      />
      <div
        className={`tp-promo-banner ${isVisible ? 'visible' : 'closing'}`}
        style={{ maxHeight: isVisible ? `${rowHeight || 120}px` : 0 }}
        aria-hidden={!isVisible}
      >
        <div className="tp-promo-banner__row" ref={rowRef}>
          <p className="tp-promo-banner__text">
            {bannerText}
          </p>
          <button
            type="button"
            className="tp-promo-banner__close"
            onClick={handleDismiss}
            aria-label="Close promo banner"
          >
            <Close />
          </button>
        </div>
      </div>
    </>
  );
};

export default PromoBanner;
