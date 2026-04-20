import { useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import { ensureDataLayer, GTM_ID, trackPageView } from "@/lib/gtm";

const GTM = () => {
  const router = useRouter();
  const isEnabled = Boolean(GTM_ID);

  useEffect(() => {
    if (!isEnabled) {
      return undefined;
    }

    ensureDataLayer();
    trackPageView();

    const handleRouteChange = (url) => {
      trackPageView(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [isEnabled, router.events]);

  if (!isEnabled) {
    return null;
  }

  return (
    <Script id={`gtm-${GTM_ID}`} strategy="afterInteractive">{`
      (function(w,d,s,l,i){
        w[l]=w[l]||[];
        if (w.google_tag_manager && w.google_tag_manager[i]) return;
        w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),
            dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;
        j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');
    `}</Script>
  );
};

export default GTM;
