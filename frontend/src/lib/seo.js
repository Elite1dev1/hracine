const BRAND_NAME = "Hracine";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.hracine.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/img/about/about-1.jpeg`;
const DEFAULT_KEYWORDS = [
  "hair care",
  "scalp health",
  "natural hair products",
  "healthy scalp",
  "premium hair care",
];

const clampDescription = (description) => {
  if (!description) {
    return "";
  }

  const trimmed = description.replace(/\s+/g, " ").trim();
  if (trimmed.length <= 160) {
    return trimmed;
  }

  return `${trimmed.slice(0, 157).trimEnd()}...`;
};

const titleCaseFromSlug = (value = "") =>
  value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const absoluteUrl = (path = "/") => {
  if (!path) {
    return SITE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const createSeo = ({
  title,
  description,
  path = "/",
  image,
  keywords = DEFAULT_KEYWORDS,
  noindex = false,
  type = "website",
}) => {
  const canonical = absoluteUrl(path);
  const normalizedTitle = title
    ? title.includes(BRAND_NAME)
      ? title
      : `${title} | ${BRAND_NAME}`
    : null;
  const safeTitle = normalizedTitle || `${BRAND_NAME} | Premium Hair Care & Scalp Health`;
  const safeDescription = clampDescription(
    description ||
      "Discover premium hair care for scalp health, stronger roots, and beautiful hair with Hracine."
  );

  return {
    title: safeTitle,
    description: safeDescription,
    canonical,
    image: absoluteUrl(image || DEFAULT_OG_IMAGE),
    keywords,
    noindex,
    type,
  };
};

export const PAGE_SEO = {
  home: createSeo({
    title: "Hracine | Healthy Scalp, Beautiful Hair",
    description:
      "Shop premium hair care for scalp health, stronger roots, and beautiful hair with natural hair products from Hracine.",
    path: "/",
  }),
  about: createSeo({
    title: `About Hracine | ${BRAND_NAME}`,
    description:
      "Learn how Hracine creates premium hair care rooted in scalp health, clean ingredients, and natural hair product education.",
    path: "/about",
  }),
  shop: createSeo({
    title: `Hair Care Shop | ${BRAND_NAME}`,
    description:
      "Browse Hracine hair care essentials for scalp health, hydration, growth support, and natural hair care rituals.",
    path: "/shop",
  }),
  categories: createSeo({
    title: `Hair Care Categories | ${BRAND_NAME}`,
    description:
      "Explore Hracine hair care collections by concern, routine, and scalp health need to find your ideal natural hair products.",
    path: "/shop-category",
  }),
  blog: createSeo({
    title: `Hair Care Journal | ${BRAND_NAME}`,
    description:
      "Read Hracine insights on scalp health, natural hair products, and healthy hair routines designed for lasting results.",
    path: "/blog",
  }),
  blogGrid: createSeo({
    title: `Hair Care Articles | ${BRAND_NAME}`,
    description:
      "Explore scalp health education, ingredient tips, and natural hair care routines from the Hracine journal.",
    path: "/blog-grid",
  }),
  blogList: createSeo({
    title: `Hair Care Guides | ${BRAND_NAME}`,
    description:
      "Find practical hair care and scalp health guides from Hracine to help you build a better routine.",
    path: "/blog-list",
  }),
  contact: createSeo({
    title: `Contact Hracine | ${BRAND_NAME}`,
    description:
      "Contact Hracine for product guidance, scalp health questions, and support choosing the right natural hair products.",
    path: "/contact",
  }),
  community: createSeo({
    title: `Hracine Community | ${BRAND_NAME}`,
    description:
      "Join the Hracine community for hair care support, scalp health tips, product launches, and routine inspiration.",
    path: "/community",
  }),
  consultation: createSeo({
    title: `Scalp Consultation | ${BRAND_NAME}`,
    description:
      "Book a Hracine consultation for personalized scalp health advice and a premium hair care routine built for your needs.",
    path: "/consultation",
  }),
  wishlist: createSeo({
    title: `Wishlist | ${BRAND_NAME}`,
    description:
      "Save your favorite Hracine hair care products and return when you are ready to complete your scalp health routine.",
    path: "/wishlist",
    noindex: true,
  }),
  cart: createSeo({
    title: `Cart | ${BRAND_NAME}`,
    description:
      "Review your Hracine cart and complete your purchase of premium hair care and scalp health essentials.",
    path: "/cart",
    noindex: true,
  }),
  checkout: createSeo({
    title: `Checkout | ${BRAND_NAME}`,
    description:
      "Secure your Hracine order and complete checkout for premium hair care and scalp health essentials.",
    path: "/checkout",
    noindex: true,
  }),
  compare: createSeo({
    title: `Compare Products | ${BRAND_NAME}`,
    description:
      "Compare Hracine products by benefits, ingredients, and scalp health goals to choose the right routine.",
    path: "/compare",
    noindex: true,
  }),
  coupon: createSeo({
    title: `Offers & Coupons | ${BRAND_NAME}`,
    description:
      "View Hracine offers and apply coupons on premium hair care and scalp health products before checkout.",
    path: "/coupon",
    noindex: true,
  }),
  login: createSeo({
    title: `Login | ${BRAND_NAME}`,
    description:
      "Sign in to your Hracine account to manage orders, saved products, and your hair care routine.",
    path: "/login",
    noindex: true,
  }),
  register: createSeo({
    title: `Create Account | ${BRAND_NAME}`,
    description:
      "Create your Hracine account to track orders, save favorites, and shop premium hair care with ease.",
    path: "/register",
    noindex: true,
  }),
  forgot: createSeo({
    title: `Reset Password | ${BRAND_NAME}`,
    description:
      "Reset your Hracine account password and regain access to your orders and saved hair care products.",
    path: "/forgot",
    noindex: true,
  }),
  profile: createSeo({
    title: `My Account | ${BRAND_NAME}`,
    description:
      "Manage your Hracine profile, orders, and saved products in one place.",
    path: "/profile",
    noindex: true,
  }),
  notFound: createSeo({
    title: `Page Not Found | ${BRAND_NAME}`,
    description:
      "The page you requested could not be found. Continue shopping premium hair care and scalp health products at Hracine.",
    path: "/404",
    noindex: true,
  }),
};

export const getShopSeo = (query = {}) => {
  const categoryName = titleCaseFromSlug(query.subCategory || query.category || "");
  const pathParams = new URLSearchParams();

  if (query.status) {
    pathParams.set("status", query.status);
  }
  if (query.category) {
    pathParams.set("category", query.category);
  }
  if (query.subCategory) {
    pathParams.set("subCategory", query.subCategory);
  }

  if (categoryName) {
    return createSeo({
      title: `${categoryName} | ${BRAND_NAME}`,
      description: `Shop ${categoryName.toLowerCase()} from Hracine for premium hair care, scalp health support, and natural hair products that deliver results.`,
      path: `/shop${pathParams.toString() ? `?${pathParams.toString()}` : ""}`,
    });
  }

  if (query.status === "on-sale") {
    return createSeo({
      title: `Hair Care Offers | ${BRAND_NAME}`,
      description:
        "Shop Hracine offers on premium hair care and scalp health essentials before they sell out.",
      path: `/shop?${pathParams.toString()}`,
    });
  }

  if (query.status === "in-stock") {
    return createSeo({
      title: `In-Stock Hair Care | ${BRAND_NAME}`,
      description:
        "Browse in-stock Hracine hair care and scalp health products ready for fast checkout.",
      path: `/shop?${pathParams.toString()}`,
    });
  }

  return PAGE_SEO.shop;
};

export const getProductSeo = (product, productId) => {
  if (!product) {
    return createSeo({
      title: `Product Details | ${BRAND_NAME}`,
      description:
        "Browse premium hair care and scalp health products from Hracine.",
      path: productId ? `/product-details/${productId}` : "/product-details",
      noindex: !productId,
    });
  }

  const rawDescription =
    product.metaDescription ||
    product.description ||
    `Shop ${product.title} from Hracine for scalp health support, healthy hair growth, and premium natural hair care.`;

  const keywords = [
    product.category?.name,
    product.title,
    ...DEFAULT_KEYWORDS,
  ].filter(Boolean);

  return createSeo({
    title: `${product.title} | ${BRAND_NAME}`,
    description: rawDescription,
    path: `/product-details/${product._id || productId}`,
    image: product.img,
    keywords,
    type: "product",
  });
};
