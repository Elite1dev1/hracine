import { add_cart_product } from "@/redux/features/cartSlice";
import { trackAddToCart } from "@/lib/meta-pixel";

const META_PIXEL_CURRENCY = "NGN";

const metaPixelMiddleware = (store) => (next) => (action) => {
  if (!add_cart_product.match(action)) {
    return next(action);
  }

  const previousState = store.getState();
  const previousCartItem = previousState.cart.cart_products.find(
    (item) => item._id === action.payload?._id
  );
  const previousQuantity = previousCartItem?.orderQuantity || 0;

  const result = next(action);

  if (typeof window === "undefined") {
    return result;
  }

  const nextState = store.getState();
  const nextCartItem = nextState.cart.cart_products.find(
    (item) => item._id === action.payload?._id
  );
  const nextQuantity = nextCartItem?.orderQuantity || 0;
  const quantityAdded = nextQuantity - previousQuantity;

  if (quantityAdded > 0 && nextCartItem) {
    trackAddToCart({
      id: nextCartItem._id,
      title: nextCartItem.title,
      category: nextCartItem.category?.name || nextCartItem.category,
      quantity: quantityAdded,
      price: nextCartItem.price,
      currency: META_PIXEL_CURRENCY,
      contentType: nextCartItem.isPreOrder ? "product_group" : "product",
    });
  }

  return result;
};

export default metaPixelMiddleware;
