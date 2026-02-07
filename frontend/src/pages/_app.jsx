import store from "@/redux/store";
import { Provider } from "react-redux";
import ReactModal from "react-modal";
import '../styles/index.scss';
import { GoogleOAuthProvider } from "@react-oauth/google";
if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

if (typeof window !== "undefined") {
  ReactModal.setAppElement("body");
}

const NEXT_PUBLIC_GOOGLE_CLIENT_ID = '872872451077-h90g0g0762aoi4vfk0iv6oug1pg4h2u0.apps.googleusercontent.com'
export default function App({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <div id="root">
          <Component {...pageProps} />
        </div>
      </Provider>
    </GoogleOAuthProvider>
  )
}
