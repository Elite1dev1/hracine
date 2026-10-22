import { useEffect } from "react";
import { useRouter } from "next/router";

const MetaPixel = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window.fbq === "function") {
        window.fbq("track", "PageView");
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return null;
};

export default MetaPixel;
