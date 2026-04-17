import { useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import {
  flushMetaPixelQueue,
  getMetaPixelScriptSrc,
  initializeMetaPixel,
  META_PIXEL_ID,
  trackPageView,
} from "@/lib/meta-pixel";

const MetaPixel = () => {
  const router = useRouter();
  const isEnabled = Boolean(META_PIXEL_ID);

  useEffect(() => {
    if (!isEnabled) {
      return undefined;
    }

    const handleRouteChange = (url) => {
      trackPageView(url);
    };

    initializeMetaPixel();
    handleRouteChange(
      `${window.location.pathname}${window.location.search}`
    );

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [isEnabled, router.events]);

  if (!isEnabled) {
    return null;
  }

  return (
    <>
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
        onReady={() => {
          initializeMetaPixel();
          flushMetaPixelQueue();
        }}
      >{`
        !(function(f,b,e,v,n,t,s){
          if(f.fbq)return;
          n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;
          n.push=n;
          n.loaded=!0;
          n.version='2.0';
          n.queue=[];
          t=b.createElement(e);
          t.async=!0;
          t.src=v;
          s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s);
        })(window, document, 'script', '${getMetaPixelScriptSrc()}');
      `}</Script>
    </>
  );
};

export default MetaPixel;
