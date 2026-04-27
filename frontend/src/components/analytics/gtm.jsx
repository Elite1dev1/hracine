import { useEffect } from "react";
import { useRouter } from "next/router";
import { ensureDataLayer, trackPageView } from "@/lib/gtm";

const GTM = () => {
  const router = useRouter();

  useEffect(() => {
    ensureDataLayer();
    trackPageView();

    const handleRouteChange = (url) => {
      trackPageView(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return null;
};

export default GTM;
