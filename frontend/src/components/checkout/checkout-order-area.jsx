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
    paymentError,
    allPreOrder,
  } = checkoutData;
  const { cart_products } = useSelector((state) => state.cart);
  const { total } = useCartInfo();
  const { data: settingsData, isLoading: isLoadingSettings } = useGetSettingsQuery();
  const freeShippingThreshold = settingsData?.data?.freeShippingThreshold || 200;
  const preOrderFreeShippingThreshold = settingsData?.data?.preOrderFreeShippingThreshold || 25000;
  const todayDeliveryPrice = settingsData?.data?.todayDeliveryPrice || 60;
  const sevenDayDeliveryPrice = settingsData?.data?.sevenDayDeliveryPrice || 20;
  const qualifiesForFreeShipping = total >= freeShippingThreshold;
  const qualifiesForPreOrderFreeShipping = allPreOrder && total >= preOrderFreeShippingThreshold;
  const isFreeShipping = qualifiesForFreeShipping || qualifiesForPreOrderFreeShipping;

  const launchDate = allPreOrder ? cart_products[0]?.launchDate : null;

  return (
    <div className="tp-checkout-place white-bg">
      <h3 className="tp-checkout-place-title">{allPreOrder ? 'Your Pre-order' : 'Your Order'}</h3>

      <div className="tp-order-info-list">
        <ul>
          {/* pre-order notice */}
          {allPreOrder && (
            <li className="tp-order-info-list-header" style={{ display: 'block', backgroundColor: '#fff4f0', padding: '15px', borderLeft: '4px solid #ff5501', marginBottom: '15px' }}>
              <p style={{ color: '#ff5501', fontWeight: 'bold', margin: 0 }}>This is a pre-order item</p>
              <p style={{ color: '#555', fontSize: '14px', margin: '5px 0 0 0' }}>
                Delivery begins on {new Date(launchDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} (Launch Day)
              </p>
            </li>
          )}
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
          {!isFreeShipping && !isLoadingSettings && !allPreOrder && (
            <li className="tp-order-info-list-shipping">
              <span className="tp-order-info-list-shipping-title">Shipping</span>
              <div className="tp-order-info-list-shipping-item d-flex flex-column align-items-end">
                <div className="tp-order-info-list-shipping-option">
                  <input
                    {...register(`shippingOption`, {
                      required: !isFreeShipping ? `Shipping Option is required!` : false,
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
                      required: !isFreeShipping ? `Shipping Option is required!` : false,
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
          
          {/* Free shipping message when qualified or pre-order free shipping */}
          {isFreeShipping && !isLoadingSettings && (
            <li className="tp-order-info-list-shipping">
              <span className="tp-order-info-list-shipping-title">Shipping</span>
              <div className="tp-order-info-list-shipping-item d-flex flex-column align-items-end">
                <span className="tp-order-info-list-shipping-free">
                  Free Shipping
                  {qualifiesForPreOrderFreeShipping && (
                    <div style={{ fontSize: '10px', color: '#ff5501' }}>Pre-order qualifying free delivery</div>
                  )}
                </span>
                <input
                  {...register(`shippingOption`)}
                  type="hidden"
                  value="free_shipping"
                />
              </div>
            </li>
          )}

          {/* If pre-order but NOT qualifying for free shipping, show only launch day delivery */}
          {allPreOrder && !isFreeShipping && !isLoadingSettings && (
             <li className="tp-order-info-list-shipping">
             <span className="tp-order-info-list-shipping-title">Shipping</span>
             <div className="tp-order-info-list-shipping-item d-flex flex-column align-items-end">
                <div className="tp-order-info-list-shipping-option">
                  <input
                    {...register(`shippingOption`, {
                      required: `Shipping Option is required!`,
                    })}
                    id="preorder_delivery"
                    type="radio"
                    name="shippingOption"
                    value="flat_rate"
                    defaultChecked={true}
                    onChange={() => handleShippingCost(sevenDayDeliveryPrice)}
                  />
                  <label htmlFor="preorder_delivery">
                    Delivery begins on {new Date(launchDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                    <span className="tp-order-info-list-shipping-price">{formatCurrency(sevenDayDeliveryPrice)}</span>
                  </label>
                </div>
             </div>
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
            defaultChecked={true}
          />
          <label htmlFor="card_payment">
            Pay with Paystack (Card/Bank Transfer)
          </label>
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
          {isCheckoutSubmit ? "Processing..." : allPreOrder ? "Place Pre-order" : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutOrderArea;
