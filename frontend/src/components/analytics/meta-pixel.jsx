import { useEffect } from "react";
import { useRouter } from "next/router";
import { META_PIXEL_ID } from "@/lib/meta-pixel";

const INITIALIZED_PIXEL_KEY = "__hracineMetaPixelInitialized";
const LAST_PAGE_VIEW_KEY = "__hracineMetaPixelLastPageView";

const trackPageView = () => {
  if (typeof window.fbq !== "function") return;

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

  if (window[INITIALIZED_PIXEL_KEY] !== META_PIXEL_ID) {
    window.fbq("init", META_PIXEL_ID);
    window[INITIALIZED_PIXEL_KEY] = META_PIXEL_ID;
  }

  trackPageView();
};

const MetaPixel = () => {
  const router = useRouter();

  useEffect(() => {
    initializePixel();

    const handleRouteChange = () => {
      trackPageView();
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return null;
};

export default MetaPixel;
