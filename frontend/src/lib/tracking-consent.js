import { GA4_MEASUREMENT_ID, GTM_ID, sanitizePagePath } from "@/lib/gtm";

export const TRACKING_CONSENT_KEY = "hracine-tracking-consent";

export const hasTrackingConsent = () =>
  typeof window !== "undefined" &&
  window.localStorage.getItem(TRACKING_CONSENT_KEY) === "granted";

let scriptsStarted = false;

export const startTrackingScripts = () => {
  if (typeof window === "undefined") return;
  if (!sanitizePagePath(window.location.href)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  });
  if (!scriptsStarted) {
    scriptsStarted = true;
    window.gtag("js", new Date());
    window.gtag("config", GA4_MEASUREMENT_ID, { send_page_view: false });

    if (!document.querySelector(`script[data-hracine-ga="${GA4_MEASUREMENT_ID}"]`)) {
      const gaScript = document.createElement("script");
      gaScript.async = true;
      gaScript.dataset.hracineGa = GA4_MEASUREMENT_ID;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
      document.head.appendChild(gaScript);
    }

    if (GTM_ID && !window.__hracineGtmLoaded) {
      window.__hracineGtmLoaded = true;
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      const gtmScript = document.createElement("script");
      gtmScript.async = true;
      gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
      document.head.appendChild(gtmScript);
    }
  }

  window.__hracineTrackingReady = true;
  window.dispatchEvent(new Event("hracine:tracking-consent"));
};

export const revokeTrackingConsent = () => {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") window.fbq("consent", "revoke");
  window.__hracineTrackingReady = false;
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
  window.dispatchEvent(new Event("hracine:tracking-consent"));
};
