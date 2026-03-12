import React, { useState, useEffect } from 'react';
import { Close } from '@/svg';

const PromoBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const isDismissed = sessionStorage.getItem('promo_banner_dismissed');
        if (!isDismissed) {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        sessionStorage.setItem('promo_banner_dismissed', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                .tp-promo-banner .tp-promo-banner__row {
                    display: flex !important;
                    flex-direction: row !important;
                    flex-wrap: nowrap !important;
                    align-items: center !important;
                    justify-content: center !important;
                    position: relative;
                    min-height: 24px;
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
                    padding-right: 44px !important;
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
                    .tp-promo-banner .tp-promo-banner__row { padding: 0 10px; }
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
            `}} />
            <div className="tp-promo-banner">
                <div className="tp-promo-banner__row">
                    <p className="tp-promo-banner__text">
                        Free shipping on orders above ₦25,000.
                    </p>
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="tp-promo-banner__close"
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
