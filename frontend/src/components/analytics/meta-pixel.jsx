import { useEffect } from "react";
import { useRouter } from "next/router";
import { META_PIXEL_ID } from "@/lib/meta-pixel";
import { hasTrackingConsent } from "@/lib/tracking-consent";
import { sanitizePagePath } from "@/lib/gtm";

const INITIALIZED_PIXEL_KEY = "__hracineMetaPixelInitialized";
const LAST_PAGE_VIEW_KEY = "__hracineMetaPixelLastPageView";

const trackPageView = () => {
  if (typeof window.fbq !== "function") return;
  if (!sanitizePagePath(window.location.href)) return;

  const currentUrl = window.location.href;
  if (window[LAST_PAGE_VIEW_KEY] === currentUrl) return;

  window[LAST_PAGE_VIEW_KEY] = currentUrl;
  window.fbq("track", "PageView");
};

const initializePixel = () => {
  if (typeof window.fbq !== "function") {
    const fbq = function (...args) {
      if (fbq.callMethod) {
        fbq.callMethod.apply(fbq, args);
      } else {
        fbq.queue.push(args);
      }
    };

    fbq.queue = [];
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    window.fbq = window._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  window.fbq("consent", "grant");

  if (window[INITIALIZED_PIXEL_KEY] !== META_PIXEL_ID) {
    window.fbq("init", META_PIXEL_ID);
    window[INITIALIZED_PIXEL_KEY] = META_PIXEL_ID;
  }

  trackPageView();
};

const MetaPixel = () => {
  const router = useRouter();

  useEffect(() => {
    if (hasTrackingConsent() && sanitizePagePath(window.location.href)) initializePixel();

    const handleRouteChange = () => {
      if (hasTrackingConsent() && sanitizePagePath(window.location.href)) initializePixel();
    };
    const handleConsentChange = () => {
      if (hasTrackingConsent() && sanitizePagePath(window.location.href)) initializePixel();
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    window.addEventListener("hracine:tracking-consent", handleConsentChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      window.removeEventListener("hracine:tracking-consent", handleConsentChange);
    };
  }, [router.events]);

  return null;
};

export default MetaPixel;
