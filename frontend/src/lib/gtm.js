export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-MVVQTLNK";

const DEFAULT_CURRENCY = "NGN";
const GTM_STATE_KEY = "__gtmTrackingState__";
const PURCHASE_STORAGE_PREFIX = "gtm-purchase:";
const isDevelopment = process.env.NODE_ENV === "development";

const isBrowser = () => typeof window !== "undefined";

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
  if (!isBrowser() || !payload?.event) {
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
  if (!isBrowser()) {
    return false;
  }

  const state = getState();
  const resolvedPath =
    url || `${window.location.pathname}${window.location.search}`;

  if (state?.lastPageViewPath === resolvedPath) {
    logDebug("skipped duplicate page_view", { resolvedPath });
    return false;
  }

  if (state) {
    state.lastPageViewPath = resolvedPath;
  }

  return pushToDataLayer({
    event: "page_view",
    page_path: resolvedPath,
    page_location: window.location.href,
    page_title: document.title,
    page_referrer: document.referrer || undefined,
  });
};

export const trackViewContent = ({
  id,
  title,
  category,
  price,
  currency = DEFAULT_CURRENCY,
  contentType = "product",
  ...rest
} = {}) =>
  pushToDataLayer(
    {
      event: "view_content",
      content_ids: id ? [id] : undefined,
      content_name: title,
      content_category: category,
      content_type: contentType,
      value: price ? Number(price) : undefined,
      currency,
      items: id
        ? [
            {
              item_id: id,
              item_name: title,
              item_category: category,
              price: price ? Number(price) : undefined,
              quantity: 1,
            },
          ]
        : undefined,
      ...rest,
    },
    {
      dedupeKey: id ? `view_content:${id}` : undefined,
    }
  );

export const trackAddToCart = ({
  id,
  title,
  category,
  quantity = 1,
  price,
  currency = DEFAULT_CURRENCY,
  contentType = "product",
  ...rest
} = {}) =>
  pushToDataLayer({
    event: "add_to_cart",
    content_ids: id ? [id] : undefined,
    content_name: title,
    content_category: category,
    content_type: contentType,
    value: price ? Number(price) * Number(quantity) : undefined,
    currency,
    num_items: Number(quantity),
    items: id
      ? [
          {
            item_id: id,
            item_name: title,
            item_category: category,
            price: price ? Number(price) : undefined,
            quantity: Number(quantity),
          },
        ]
      : undefined,
    ...rest,
  });

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
      value: value ? Number(value) : undefined,
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
  }

  return didTrack;
};

export const trackLead = (params = {}) =>
  pushToDataLayer({
    event: "lead",
    ...params,
  });
