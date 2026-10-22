import store from "@/redux/store";
import { Provider } from "react-redux";
import ReactModal from "react-modal";
import "../styles/index.scss";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GTM from "@/components/analytics/gtm";
import Script from "next/script";
import { GTM_ID } from "@/lib/gtm";
import MetaPixel from "@/components/analytics/meta-pixel";

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

if (typeof window !== "undefined") {
  ReactModal.setAppElement("body");
}

const NEXT_PUBLIC_GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
export default function App({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      {GTM_ID ? (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];if(w.google_tag_manager&&w.google_tag_manager[i])return;w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      ) : null}
      <Provider store={store}>
        <GTM />
        <MetaPixel />
        <div id="root">
          <Component {...pageProps} />
        </div>
      </Provider>
    </GoogleOAuthProvider>
  );
}
