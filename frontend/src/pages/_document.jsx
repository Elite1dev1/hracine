import { GTM_ID } from "@/lib/gtm";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Charm:wght@400;700&family=Jost:wght@300;400;500;600;700&family=Oregano&family=Playfair+Display:wght@400;500;600;700;800;900&family=Roboto:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/logo/favicon.png" />
        <link rel="shortcut icon" href="/assets/img/logo/favicon.png" />
        <link rel="apple-touch-icon" href="/assets/img/logo/favicon.png" />
      </Head>
      <body>
        {GTM_ID ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="gtm"
            />
          </noscript>
        ) : null}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
