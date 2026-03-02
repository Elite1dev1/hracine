import { useSelector } from "react-redux";
// internal
import useCartInfo from "@/hooks/use-cart-info";
import ErrorMsg from "../common/error-msg";
import { formatCurrency } from "@/utils/currency";
import { useGetSettingsQuery } from "@/redux/features/admin/adminApi";

const CheckoutOrderArea = ({ checkoutData }) => {
  const {
    handleShippingCost,
    cartTotal = 0,
    isCheckoutSubmit,
    register,
    errors,
    shippingCost,
    discountAmount,
    paymentError
  } = checkoutData;
  const { cart_products } = useSelector((state) => state.cart);
  const { total } = useCartInfo();
  const { data: settingsData, isLoading: isLoadingSettings } = useGetSettingsQuery();
  const freeShippingThreshold = settingsData?.data?.freeShippingThreshold || 200;
  const todayDeliveryPrice = settingsData?.data?.todayDeliveryPrice || 60;
  const sevenDayDeliveryPrice = settingsData?.data?.sevenDayDeliveryPrice || 20;
  const qualifiesForFreeShipping = total >= freeShippingThreshold;
  return (
    <div className="tp-checkout-place white-bg">
      <h3 className="tp-checkout-place-title">Your Order</h3>

      <div className="tp-order-info-list">
        <ul>
          {/*  header */}
          <li className="tp-order-info-list-header">
            <h4>Product</h4>
            <h4>Total</h4>
          </li>

          {/*  item list */}
          {cart_products.map((item) => (
            <li key={item._id} className="tp-order-info-list-desc">
              <p>
                {item.title} <span> x {item.orderQuantity}</span>
              </p>
              <span>{formatCurrency(item.price)}</span>
            </li>
          ))}

          {/*  shipping - only show if not qualified for free shipping */}
          {!qualifiesForFreeShipping && !isLoadingSettings && (
            <li className="tp-order-info-list-shipping">
              <span className="tp-order-info-list-shipping-title">Shipping</span>
              <div className="tp-order-info-list-shipping-item d-flex flex-column align-items-end">
                <div className="tp-order-info-list-shipping-option">
                  <input
                    {...register(`shippingOption`, {
                      required: !qualifiesForFreeShipping ? `Shipping Option is required!` : false,
                    })}
                    id="flat_shipping"
                    type="radio"
                    name="shippingOption"
                    value="flat_shipping"
                    onChange={() => handleShippingCost(todayDeliveryPrice)}
                  />
                  <label
                    htmlFor="flat_shipping"
                  >
                    Delivery: Today{" "}
                    <span className="tp-order-info-list-shipping-price">{formatCurrency(todayDeliveryPrice)}</span>
                  </label>
                </div>
                <div className="tp-order-info-list-shipping-option">
                  <input
                    {...register(`shippingOption`, {
                      required: !qualifiesForFreeShipping ? `Shipping Option is required!` : false,
                    })}
                    id="flat_rate"
                    type="radio"
                    name="shippingOption"
                    value="flat_rate"
                    onChange={() => handleShippingCost(sevenDayDeliveryPrice)}
                  />
                  <label
                    htmlFor="flat_rate"
                  >
                    Delivery: 7 Days{" "}
                    <span className="tp-order-info-list-shipping-price">{formatCurrency(sevenDayDeliveryPrice)}</span>
                  </label>
                </div>
                <ErrorMsg msg={errors?.shippingOption?.message} />
              </div>
            </li>
          )}
          
          {/* Free shipping message when qualified */}
          {qualifiesForFreeShipping && !isLoadingSettings && (
            <li className="tp-order-info-list-shipping">
              <span className="tp-order-info-list-shipping-title">Shipping</span>
              <div className="tp-order-info-list-shipping-item d-flex flex-column align-items-end">
                <span className="tp-order-info-list-shipping-free">
                  Free Shipping
                </span>
              </div>
              {/* Hidden input for form validation */}
              <input
                {...register(`shippingOption`)}
                type="hidden"
                value="free_shipping"
              />
            </li>
          )}

           {/*  subtotal */}
           <li className="tp-order-info-list-subtotal">
            <span>Subtotal</span>
            <span>{formatCurrency(total)}</span>
          </li>

           {/*  shipping cost - only show if not qualified for free shipping */}
           {!qualifiesForFreeShipping && !isLoadingSettings && (
            <li className="tp-order-info-list-subtotal">
              <span>Shipping Cost</span>
              <span>{formatCurrency(shippingCost)}</span>
            </li>
          )}
          
          {/* Free shipping cost display when qualified */}
          {qualifiesForFreeShipping && !isLoadingSettings && (
            <li className="tp-order-info-list-subtotal">
              <span>Shipping Cost</span>
              <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>
                {formatCurrency(0)}
              </span>
            </li>
          )}

           {/* discount */}
           <li className="tp-order-info-list-subtotal">
            <span>Discount</span>
            <span>{formatCurrency(discountAmount)}</span>
          </li>

          {/* total */}
          <li className="tp-order-info-list-total">
            <span>Total</span>
            <span>{formatCurrency(parseFloat(cartTotal))}</span>
          </li>
        </ul>
      </div>
      <div className="tp-checkout-payment">
        <div className="tp-checkout-payment-item">
          <input
            {...register(`payment`, {
              required: `Payment Option is required!`,
            })}
            type="radio"
            id="card_payment"
            name="payment"
            value="Card"
          />
          <label htmlFor="card_payment">
            Pay with Paystack (Card/Bank Transfer)
          </label>
          <ErrorMsg msg={errors?.payment?.message} />
        </div>
        <div className="tp-checkout-payment-item">
          <input
            {...register(`payment`, {
              required: `Payment Option is required!`,
            })}
            type="radio"
            id="cod"
            name="payment"
            value="COD"
          />
          <label htmlFor="cod">Cash on Delivery</label>
          <ErrorMsg msg={errors?.payment?.message} />
        </div>
        {paymentError && (
          <div style={{ color: '#e74c3c', marginTop: '10px', fontSize: '14px' }}>
            {paymentError}
          </div>
        )}
      </div>

      <div className="tp-checkout-btn-wrapper">
        <button
          type="submit"
          disabled={isCheckoutSubmit}
          className="tp-checkout-btn w-100"
        >
          {isCheckoutSubmit ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutOrderArea;
