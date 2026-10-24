import { useEffect } from "react";
import { useRouter } from "next/router";
import { ensureDataLayer, trackPageView } from "@/lib/gtm";
import { hasTrackingConsent } from "@/lib/tracking-consent";

const GTM = () => {
  const router = useRouter();

  useEffect(() => {
    ensureDataLayer();
    if (hasTrackingConsent() && window.__hracineTrackingReady) trackPageView(router.asPath);

    const handleRouteChange = (url) => {
      if (hasTrackingConsent() && window.__hracineTrackingReady) trackPageView(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    const handleConsentChange = () => {
      if (hasTrackingConsent() && window.__hracineTrackingReady) trackPageView(router.asPath);
    };
    window.addEventListener("hracine:tracking-consent", handleConsentChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      window.removeEventListener("hracine:tracking-consent", handleConsentChange);
    };
  }, [router.events, router.asPath]);

  return null;
};

export default GTM;
