import Cookies from "js-cookie";

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "1261077339018724";

const DEFAULT_CURRENCY = "NGN";
const FBQ_SCRIPT_SRC = "https://connect.facebook.net/en_US/fbevents.js";
const META_PIXEL_STATE_KEY = "__metaPixelState__";

const isBrowser = () => typeof window !== "undefined";

const isDevelopment = process.env.NODE_ENV === "development";

const getState = () => {
  if (!isBrowser()) {
    return null;
  }

  if (!window[META_PIXEL_STATE_KEY]) {
    window[META_PIXEL_STATE_KEY] = {
      initialized: false,
      queue: [],
      trackedKeys: new Set(),
      lastPageViewPath: null,
      purchaseKeys: new Set(),
    };
  }

  return window[META_PIXEL_STATE_KEY];
};

const logDebug = (action, payload) => {
  if (isDevelopment && isBrowser()) {
    console.info(`[meta-pixel] ${action}`, payload || "");
  }
};

const getStoredUserInfo = () => {
  if (!isBrowser()) {
    return null;
  }

  try {
    const cookieValue = Cookies.get("userInfo");

    if (!cookieValue) {
      return null;
    }

    return JSON.parse(cookieValue);
  } catch (error) {
    logDebug("failed to parse userInfo cookie", error);
    return null;
  }
};

const getAdvancedMatchingData = () => {
  const userInfo = getStoredUserInfo();
  const user = userInfo?.user;

  if (!user) {
    return {};
  }

  const names = String(user.name || "").trim().split(/\s+/);
  const firstName = names[0];
  const lastName = names.length > 1 ? names.slice(1).join(" ") : undefined;

  return {
    em: user.email || undefined,
    ph: user.phone || user.contact || undefined,
    fn: firstName || undefined,
    ln: lastName || undefined,
    external_id: user._id || user.id || undefined,
  };
};

const getFbq = () => {
  if (!isBrowser()) {
    return null;
  }

  return typeof window.fbq === "function" ? window.fbq : null;
};

const runOrQueue = (callback, debugLabel, payload) => {
  const state = getState();

  if (!state) {
    return false;
  }

  if (!state.initialized || !getFbq()) {
    state.queue.push(callback);
    logDebug(`queued ${debugLabel}`, payload);
    return false;
  }

  callback();
  return true;
};

export const flushMetaPixelQueue = () => {
  const state = getState();

  if (!state || !state.initialized || !getFbq()) {
    return;
  }

  while (state.queue.length > 0) {
    const queuedEvent = state.queue.shift();

    if (queuedEvent) {
      queuedEvent();
    }
  }
};

export const initializeMetaPixel = () => {
  const state = getState();
  const fbq = getFbq();

  if (!state || !fbq || state.initialized || !META_PIXEL_ID) {
    return false;
  }

  const advancedMatching = getAdvancedMatchingData();
  const hasAdvancedMatching = Object.values(advancedMatching).some(Boolean);

  if (hasAdvancedMatching) {
    fbq("init", META_PIXEL_ID, advancedMatching);
  } else {
    fbq("init", META_PIXEL_ID);
  }

  state.initialized = true;
  flushMetaPixelQueue();
  logDebug("initialized", {
    pixelId: META_PIXEL_ID,
    advancedMatching: hasAdvancedMatching,
  });

  return true;
};

const sanitizeParams = (params = {}) =>
  Object.entries(params).reduce((accumulator, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      accumulator[key] = value;
    }

    return accumulator;
  }, {});

const trackWithMethod = ({ method, eventName, params, options, dedupeKey }) => {
  const state = getState();

  if (!state || !eventName) {
    return false;
  }

  if (dedupeKey && state.trackedKeys.has(dedupeKey)) {
    logDebug("skipped duplicate", { eventName, dedupeKey });
    return false;
  }

  const safeParams = sanitizeParams(params);
  const safeOptions = sanitizeParams(options);
  const callback = () => {
    const fbq = getFbq();

    if (!fbq) {
      return;
    }

    if (method === "trackCustom") {
      fbq("trackCustom", eventName, safeParams);
    } else if (Object.keys(safeOptions).length > 0) {
      fbq("track", eventName, safeParams, safeOptions);
    } else if (Object.keys(safeParams).length > 0) {
      fbq("track", eventName, safeParams);
    } else {
      fbq("track", eventName);
    }

    if (dedupeKey) {
      state.trackedKeys.add(dedupeKey);
    }

    logDebug(`tracked ${eventName}`, {
      method,
      params: safeParams,
      options: safeOptions,
      dedupeKey,
    });
  };

  return runOrQueue(callback, eventName, {
    method,
    params: safeParams,
    options: safeOptions,
    dedupeKey,
  });
};

export const trackPageView = (url) => {
  const state = getState();

  if (!state || !isBrowser()) {
    return false;
  }

  const resolvedPath =
    url || `${window.location.pathname}${window.location.search}`;

  if (state.lastPageViewPath === resolvedPath) {
    logDebug("skipped duplicate pageview", { resolvedPath });
    return false;
  }

  state.lastPageViewPath = resolvedPath;

  return trackWithMethod({
    method: "track",
    eventName: "PageView",
    params: {
      page_path: resolvedPath,
      page_location: window.location.href,
    },
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
  trackWithMethod({
    method: "track",
    eventName: "ViewContent",
    dedupeKey: id ? `ViewContent:${id}` : undefined,
    params: {
      content_ids: id ? [id] : undefined,
      content_name: title,
      content_category: category,
      content_type: contentType,
      value: price ? Number(price) : undefined,
      currency,
      ...rest,
    },
  });

export const trackLead = (params = {}) =>
  trackWithMethod({
    method: "track",
    eventName: "Lead",
    params,
  });

export const trackCompleteRegistration = (params = {}) =>
  trackWithMethod({
    method: "track",
    eventName: "CompleteRegistration",
    params,
  });

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
  trackWithMethod({
    method: "track",
    eventName: "AddToCart",
    params: {
      content_ids: id ? [id] : undefined,
      content_name: title,
      content_category: category,
      content_type: contentType,
      value: price ? Number(price) * Number(quantity) : undefined,
      currency,
      num_items: Number(quantity),
      ...rest,
    },
  });

export const markPurchaseTracked = (orderId) => {
  const state = getState();

  if (!state || !orderId) {
    return false;
  }

  if (state.purchaseKeys.has(orderId)) {
    return true;
  }

  state.purchaseKeys.add(orderId);

  try {
    sessionStorage.setItem(`meta-pixel-purchase:${orderId}`, "1");
  } catch (error) {
    logDebug("failed to persist purchase key", error);
  }

  return false;
};

export const hasTrackedPurchase = (orderId) => {
  const state = getState();

  if (!state || !orderId) {
    return false;
  }

  if (state.purchaseKeys.has(orderId)) {
    return true;
  }

  try {
    const storedValue = sessionStorage.getItem(`meta-pixel-purchase:${orderId}`);

    if (storedValue === "1") {
      state.purchaseKeys.add(orderId);
      return true;
    }
  } catch (error) {
    logDebug("failed to read purchase key", error);
  }

  return false;
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

  const didTrack = trackWithMethod({
    method: "track",
    eventName: "Purchase",
    dedupeKey: orderId ? `Purchase:${orderId}` : undefined,
    params: {
      value: value ? Number(value) : undefined,
      currency,
      contents: items,
      num_items: numItems,
      order_id: orderId,
      ...rest,
    },
  });

  if (didTrack && orderId) {
    markPurchaseTracked(orderId);
  }

  return didTrack;
};

export const trackCustomEvent = (eventName, params = {}) =>
  trackWithMethod({
    method: "trackCustom",
    eventName,
    params,
  });

export const getMetaPixelScriptSrc = () => FBQ_SCRIPT_SRC;
