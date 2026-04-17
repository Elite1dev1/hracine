import Head from "next/head";
import { createSeo } from "@/lib/seo";


const SEO = ({
  title,
  description,
  path,
  canonical,
  type,
  keywords = [],
  image,
  noindex = false,
  pageTitle,
  metaTitle,
  metaDescription,
  url,
}) => {
  const seo = createSeo({
    title: title || metaTitle || pageTitle,
    description: description || metaDescription,
    path,
    image,
    keywords: Array.isArray(keywords) && keywords.length > 0 ? keywords : undefined,
    noindex,
    type,
  });

  const canonicalUrl = canonical || url || seo.canonical;
  const robots = noindex ? "noindex, nofollow" : "index, follow";
  const keywordsString = Array.isArray(seo.keywords) && seo.keywords.length > 0
    ? seo.keywords.join(", ")
    : undefined;

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="description" content={seo.description} />
        {keywordsString && <meta name="keywords" content={keywordsString} />}
        <meta name="robots" content={robots} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content={seo.type} />
        <meta property="og:site_name" content="Hracine" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={seo.image} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={seo.image} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export default SEO;
