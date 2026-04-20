import store from "@/redux/store";
import { Provider } from "react-redux";
import ReactModal from "react-modal";
import "../styles/index.scss";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GTM from "@/components/analytics/gtm";

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
      <Provider store={store}>
        <GTM />
        <div id="root">
          <Component {...pageProps} />
        </div>
      </Provider>
    </GoogleOAuthProvider>
  );
}
