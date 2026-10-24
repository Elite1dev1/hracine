import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="facebook-domain-verification"
          content="rky7nyyigkx11ppm0qcxvhc1k29wop"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`,
          }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Charm:wght@400;700&family=Jost:wght@300;400;500;600;700&family=Oregano&family=Playfair+Display:wght@400;500;600;700;800;900&family=Roboto:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/logo/favicon.png" />
        <link rel="shortcut icon" href="/assets/img/logo/favicon.png" />
        <link rel="apple-touch-icon" href="/assets/img/logo/favicon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
