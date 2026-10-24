export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-MVVQTLNK";
export const GA4_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "G-T21ZESC34P";

export const sanitizePagePath = (value) => {
  if (typeof window === "undefined") return null;
  try {
    const url = new URL(value || window.location.href, window.location.origin);
    const safeParams = new URLSearchParams();
    for (const [key, item] of url.searchParams.entries()) {
      if (/^utm_(source|medium|campaign|term|content)$/i.test(key) || ["gclid", "fbclid"].includes(key.toLowerCase())) {
        safeParams.append(key, item);
      } else {
        return null;
      }
    }
    const search = safeParams.toString();
    return `${url.pathname}${search ? `?${search}` : ""}`;
  } catch (error) {
    return null;
  }
};

const DEFAULT_CURRENCY = "NGN";
const GTM_STATE_KEY = "__gtmTrackingState__";
const PURCHASE_STORAGE_PREFIX = "gtm-purchase:";
const isDevelopment = process.env.NODE_ENV === "development";

const isBrowser = () => typeof window !== "undefined";

const hasTrackingConsent = () =>
  isBrowser() &&
  window.localStorage.getItem("hracine-tracking-consent") === "granted" &&
  window.__hracineTrackingReady === true;

const sendMetaEvent = (eventName, payload, dedupeKey) => {
  if (!hasTrackingConsent() || typeof window.fbq !== "function") return;
  const state = getState();
  const key = dedupeKey ? `meta:${dedupeKey}` : null;
  if (key && state?.trackedKeys.has(key)) return;
  window.fbq("track", eventName, payload);
  if (key) state?.trackedKeys.add(key);
};

const getState = () => {
  if (!isBrowser()) {
    return null;
  }

  if (!window[GTM_STATE_KEY]) {
    window[GTM_STATE_KEY] = {
      lastPageViewPath: null,
      trackedKeys: new Set(),
      purchaseKeys: new Set(),
    };
  }

  return window[GTM_STATE_KEY];
};

const logDebug = (action, payload) => {
  if (isDevelopment && isBrowser()) {
    console.info(`[gtm] ${action}`, payload || "");
  }
};

export const ensureDataLayer = () => {
  if (!isBrowser()) {
    return [];
  }

  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
};

const sanitizePayload = (payload = {}) =>
  Object.entries(payload).reduce((accumulator, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      accumulator[key] = value;
    }

    return accumulator;
  }, {});

export const pushToDataLayer = (payload, options = {}) => {
  if (!hasTrackingConsent() || !payload?.event) {
    return false;
  }

  const state = getState();
  const dataLayer = ensureDataLayer();
  const dedupeKey = options.dedupeKey;
  const safePayload = sanitizePayload(payload);

  if (dedupeKey && state?.trackedKeys.has(dedupeKey)) {
    logDebug("skipped duplicate event", { dedupeKey, event: payload.event });
    return false;
  }

  dataLayer.push(safePayload);

  if (dedupeKey && state) {
    state.trackedKeys.add(dedupeKey);
  }

  logDebug("pushed", safePayload);
  return true;
};

export const trackPageView = (url) => {
  if (!hasTrackingConsent()) {
    return false;
  }

  const state = getState();
  const resolvedPath = sanitizePagePath(url || window.location.href);
  if (!resolvedPath) return false;

  if (state?.lastPageViewPath === resolvedPath) {
    logDebug("skipped duplicate page_view", { resolvedPath });
    return false;
  }

  if (state) {
    state.lastPageViewPath = resolvedPath;
  }

  const sent = pushToDataLayer({
    event: "page_view",
    page_path: resolvedPath,
    page_location: `${window.location.origin}${resolvedPath}`,
    page_title: document.title,
  });
  if (sent && typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_path: resolvedPath,
      page_location: `${window.location.origin}${resolvedPath}`,
      page_title: document.title,
    });
  }
  return sent;
};

export const trackViewContent = ({
  id,
  title,
  category,
  price,
  currency = DEFAULT_CURRENCY,
  contentType = "product",
  ...rest
} = {}) => {
  const sent = pushToDataLayer({
      event: "view_content",
      content_ids: id ? [id] : undefined,
      content_name: title,
      content_category: category,
      content_type: contentType,
      value: price !== undefined ? Number(price) : undefined,
      currency,
      items: id
        ? [
            {
              item_id: id,
              item_name: title,
              item_category: category,
              price: price !== undefined ? Number(price) : undefined,
              quantity: 1,
            },
          ]
        : undefined,
      ...rest,
    },
    {
      dedupeKey: id ? `view_content:${id}` : undefined,
    });
  sendMetaEvent("ViewContent", {
    content_ids: id ? [String(id)] : undefined,
    content_name: title,
    content_category: category,
    content_type: contentType,
    value: price !== undefined ? Number(price) : undefined,
    currency,
  }, id ? `view_content:${id}` : undefined);
  if (sent && typeof window.gtag === "function") {
    window.gtag("event", "view_item", {
      currency,
      value: price !== undefined ? Number(price) : undefined,
      items: id ? [{ item_id: id, item_name: title, item_category: category, price: Number(price || 0), quantity: 1 }] : undefined,
    });
  }
  return sent;
};

export const trackAddToCart = ({
  id,
  title,
  category,
  quantity = 1,
  price,
  currency = DEFAULT_CURRENCY,
  contentType = "product",
  ...rest
} = {}) => {
  const value = price !== undefined ? Number(price) * Number(quantity) : undefined;
  const sent = pushToDataLayer({
    event: "add_to_cart",
    content_ids: id ? [id] : undefined,
    content_name: title,
    content_category: category,
    content_type: contentType,
    value,
    currency,
    num_items: Number(quantity),
    items: id
      ? [
          {
            item_id: id,
            item_name: title,
            item_category: category,
            price: price !== undefined ? Number(price) : undefined,
            quantity: Number(quantity),
          },
        ]
      : undefined,
    ...rest,
  });
  if (sent && typeof window.gtag === "function") {
    window.gtag("event", "add_to_cart", {
      currency,
      value,
      items: id ? [{ item_id: id, item_name: title, item_category: category, price: Number(price || 0), quantity: Number(quantity) }] : undefined,
    });
  }
  sendMetaEvent("AddToCart", {
    content_ids: id ? [String(id)] : undefined,
    content_name: title,
    content_category: category,
    content_type: contentType,
    value,
    currency,
    num_items: Number(quantity),
  });
  return sent;
};

export const trackInitiateCheckout = ({ items = [], value, currency = DEFAULT_CURRENCY } = {}) => {
  const contents = items.map((item) => ({
    id: String(item.item_id || item._id || item.id),
    quantity: Number(item.quantity || item.orderQuantity || 1),
  }));
  const key = contents.map((item) => `${item.id}:${item.quantity}`).sort().join("|");
  const dedupeKey = `initiate_checkout:${key}`;
  const sent = pushToDataLayer({
    event: "begin_checkout",
    currency,
    value: Number(value),
    items: items.map((item) => ({
      item_id: item.item_id || item._id || item.id,
      item_name: item.item_name || item.title,
      price: Number(item.price || 0),
      quantity: Number(item.quantity || item.orderQuantity || 1),
    })),
  }, { dedupeKey });
  if (sent && typeof window.gtag === "function") {
    window.gtag("event", "begin_checkout", {
      currency,
      value: Number(value),
      items: items.map((item) => ({
        item_id: item.item_id || item._id || item.id,
        item_name: item.item_name || item.title,
        price: Number(item.price || 0),
        quantity: Number(item.quantity || item.orderQuantity || 1),
      })),
    });
  }
  sendMetaEvent("InitiateCheckout", {
    content_ids: contents.map((item) => item.id),
    contents,
    content_type: "product",
    num_items: contents.reduce((sum, item) => sum + item.quantity, 0),
    value: Number(value),
    currency,
  }, dedupeKey);
  return sent;
};

const hasTrackedPurchase = (orderId) => {
  const state = getState();

  if (!state || !orderId) {
    return false;
  }

  if (state.purchaseKeys.has(orderId)) {
    return true;
  }

  try {
    const storedValue = sessionStorage.getItem(
      `${PURCHASE_STORAGE_PREFIX}${orderId}`
    );

    if (storedValue === "1") {
      state.purchaseKeys.add(orderId);
      return true;
    }
  } catch (error) {
    logDebug("failed to read purchase key", error);
  }

  return false;
};

const markPurchaseTracked = (orderId) => {
  const state = getState();

  if (!state || !orderId) {
    return;
  }

  state.purchaseKeys.add(orderId);

  try {
    sessionStorage.setItem(`${PURCHASE_STORAGE_PREFIX}${orderId}`, "1");
  } catch (error) {
    logDebug("failed to persist purchase key", error);
  }
};

export const trackPurchase = ({
  orderId,
  value,
  currency = DEFAULT_CURRENCY,
  items,
  numItems,
  ...rest
} = {}) => {
  if (hasTrackedPurchase(orderId)) {
    logDebug("skipped duplicate purchase", { orderId });
    return false;
  }

  const didTrack = pushToDataLayer(
    {
      event: "purchase",
      transaction_id: orderId,
      value: value !== undefined ? Number(value) : undefined,
      currency,
      num_items: numItems,
      items,
      ...rest,
    },
    {
      dedupeKey: orderId ? `purchase:${orderId}` : undefined,
    }
  );

  if (didTrack && orderId) {
    markPurchaseTracked(orderId);
    if (typeof window.gtag === "function") {
      window.gtag("event", "purchase", {
        transaction_id: String(orderId),
        value: Number(value),
        currency,
        items,
        num_items: Number(numItems || 0),
      });
    }
    sendMetaEvent("Purchase", {
      content_ids: items?.map((item) => String(item.item_id || item._id || "")),
      contents: items?.map((item) => ({
        id: String(item.item_id || item._id || ""),
        quantity: Number(item.quantity || 1),
      })),
      content_type: "product",
      num_items: Number(numItems || 0),
      value: Number(value),
      currency,
    }, `purchase:${orderId}`);
  }

  return didTrack;
};

export const trackLead = (params = {}) =>
  pushToDataLayer({
    event: "lead",
    ...params,
  });
