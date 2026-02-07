import * as dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
//internal import
import useCartInfo from "./use-cart-info";
import { set_shipping } from "@/redux/features/order/orderSlice";
import { set_coupon } from "@/redux/features/coupon/couponSlice";
import { notifyError, notifySuccess } from "@/utils/toast";
import {useInitializePaymentMutation, useVerifyPaymentMutation, useSaveOrderMutation} from "@/redux/features/order/orderApi";
import { useGetOfferCouponsQuery } from "@/redux/features/coupon/couponApi";
import { useGetSettingsQuery } from "@/redux/features/admin/adminApi";

const useCheckoutSubmit = () => {
  // offerCoupons
  const { data: offerCoupons, isError, isLoading } = useGetOfferCouponsQuery();
  // settings for free shipping threshold
  const { data: settingsData } = useGetSettingsQuery();
  // addOrder
  const [saveOrder, {}] = useSaveOrderMutation();
  // initializePayment (Paystack)
  const [initializePayment, {}] = useInitializePaymentMutation();
  // verifyPayment (Paystack)
  const [verifyPayment, {}] = useVerifyPaymentMutation();
  // cart_products
  const { cart_products } = useSelector((state) => state.cart);
  // user
  const { user } = useSelector((state) => state.auth);
  // shipping_info
  const { shipping_info } = useSelector((state) => state.order);
  // total amount
  const { total, setTotal } = useCartInfo();
  // couponInfo
  const [couponInfo, setCouponInfo] = useState({});
  //cartTotal
  const [cartTotal, setCartTotal] = useState("");
  // minimumAmount
  const [minimumAmount, setMinimumAmount] = useState(0);
  // shippingCost
  const [shippingCost, setShippingCost] = useState(0);
  // discountAmount
  const [discountAmount, setDiscountAmount] = useState(0);
  // discountPercentage
  const [discountPercentage, setDiscountPercentage] = useState(0);
  // discountProductType
  const [discountProductType, setDiscountProductType] = useState("");
  // isCheckoutSubmit
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);
  // paymentError
  const [paymentError, setPaymentError] = useState("");
  // coupon apply message
  const [couponApplyMsg,setCouponApplyMsg] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const {register,handleSubmit,setValue,formState: { errors }} = useForm();

  let couponRef = useRef("");

  useEffect(() => {
    if (localStorage.getItem("couponInfo")) {
      const data = localStorage.getItem("couponInfo");
      const coupon = JSON.parse(data);
      setCouponInfo(coupon);
      setDiscountPercentage(coupon.discountPercentage);
      setMinimumAmount(coupon.minimumAmount);
      setDiscountProductType(coupon.productType);
    }
  }, []);

  useEffect(() => {
    if (minimumAmount - discountAmount > total || cart_products.length === 0) {
      setDiscountPercentage(0);
      localStorage.removeItem("couponInfo");
    }
  }, [minimumAmount, total, discountAmount, cart_products]);

  // Auto-apply free shipping when customer qualifies
  useEffect(() => {
    const freeShippingThreshold = settingsData?.data?.freeShippingThreshold || 200;
    if (total >= freeShippingThreshold) {
      setShippingCost(0);
      // Set shipping option to free shipping
      setValue("shippingOption", "free_shipping");
    }
  }, [total, settingsData, setValue]);

  //calculate total and discount value
  useEffect(() => {
    const result = cart_products?.filter(
      (p) => p.productType === discountProductType
    );
    const discountProductTotal = result?.reduce(
      (preValue, currentValue) =>
        preValue + currentValue.price * currentValue.orderQuantity,
      0
    );
    let totalValue = "";
    let subTotal = Number((total + shippingCost).toFixed(2));
    let discountTotal = Number(
      discountProductTotal * (discountPercentage / 100)
    );
    totalValue = Number(subTotal - discountTotal);
    setDiscountAmount(discountTotal);
    setCartTotal(totalValue);
  }, [
    total,
    shippingCost,
    discountPercentage,
    cart_products,
    discountProductType,
    discountAmount,
    cartTotal,
  ]);

  // Generate unique reference for Paystack
  const generateReference = () => {
    return `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // handleCouponCode
  const handleCouponCode = (e) => {
    e.preventDefault();

    if (!couponRef.current?.value) {
      notifyError("Please Input a Coupon Code!");
      return;
    }
    if (isLoading) {
      return <h3>Loading...</h3>;
    }
    if (isError) {
      return notifyError("Something went wrong");
    }
    const result = offerCoupons?.filter(
      (coupon) => coupon.couponCode === couponRef.current?.value
    );

    if (result.length < 1) {
      notifyError("Please Input a Valid Coupon!");
      return;
    }

    if (dayjs().isAfter(dayjs(result[0]?.endTime))) {
      notifyError("This coupon is not valid!");
      return;
    }

    if (total < result[0]?.minimumAmount) {
      notifyError(
        `Minimum ₦${result[0].minimumAmount} required for Apply this coupon!`
      );
      return;
    } else {
      // notifySuccess(
      //   `Your Coupon ${result[0].title} is Applied on ${result[0].productType}!`
      // );
      setCouponApplyMsg(`Your Coupon ${result[0].title} is Applied on ${result[0].productType} productType!`)
      setMinimumAmount(result[0]?.minimumAmount);
      setDiscountProductType(result[0].productType);
      setDiscountPercentage(result[0].discountPercentage);
      dispatch(set_coupon(result[0]));
      setTimeout(() => {
        couponRef.current.value = "";
        setCouponApplyMsg("")
      }, 5000);
    }
  };

  // handleShippingCost
  const handleShippingCost = (value) => {
    setShippingCost(value);
  };

  //set values
  useEffect(() => {
    setValue("firstName", shipping_info.firstName);
    setValue("lastName", shipping_info.lastName);
    setValue("country", shipping_info.country);
    setValue("address", shipping_info.address);
    setValue("city", shipping_info.city);
    setValue("zipCode", shipping_info.zipCode);
    setValue("contactNo", shipping_info.contactNo);
    setValue("email", shipping_info.email);
    setValue("orderNote", shipping_info.orderNote);
  }, [user, setValue, shipping_info, router]);

  // submitHandler
  const submitHandler = async (data) => {
    dispatch(set_shipping(data));
    setIsCheckoutSubmit(true);
    setPaymentError("");

    // Determine final shipping cost (0 if qualifies for free shipping)
    const freeShippingThreshold = settingsData?.data?.freeShippingThreshold || 200;
    const finalShippingCost = total >= freeShippingThreshold ? 0 : shippingCost;
    const finalShippingOption = total >= freeShippingThreshold ? "free_shipping" : data.shippingOption;

    let orderInfo = {
      name: `${data.firstName} ${data.lastName}`,
      address: data.address,
      contact: data.contactNo,
      email: data.email,
      city: data.city,
      country: data.country,
      zipCode: data.zipCode,
      shippingOption: finalShippingOption,
      status: "pending", // Order model expects lowercase
      cart: cart_products,
      paymentMethod: data.payment,
      subTotal: total,
      shippingCost: finalShippingCost,
      discount: discountAmount,
      totalAmount: cartTotal,
      orderNote:data.orderNote,
      user: `${user?._id}`,
    };

    if (data.payment === 'Card') {
      // Initialize Paystack payment
      const reference = generateReference();
      
      // Store order info in localStorage for payment verification
      localStorage.setItem('pendingOrderInfo', JSON.stringify(orderInfo));
      
      try {
        const paymentResponse = await initializePayment({
          email: data.email,
          amount: cartTotal,
          reference: reference,
          metadata: {
            orderInfo: JSON.stringify(orderInfo),
            userId: user?._id,
            cartItems: JSON.stringify(cart_products),
          },
        }).unwrap();

        if (paymentResponse.success && paymentResponse.data.authorization_url) {
          // Redirect to Paystack payment page
          window.location.href = paymentResponse.data.authorization_url;
        } else {
          setPaymentError(paymentResponse.message || "Failed to initialize payment");
          setIsCheckoutSubmit(false);
          notifyError(paymentResponse.message || "Failed to initialize payment");
        }
      } catch (error) {
        console.error("Payment initialization error:", error);
        setPaymentError(error?.data?.message || "Failed to initialize payment");
        setIsCheckoutSubmit(false);
        notifyError(error?.data?.message || "Failed to initialize payment");
      }
    } else if (data.payment === 'COD') {
      // Cash on Delivery
      saveOrder({
        ...orderInfo
      }).then(res => {
        if(res?.error){
          setIsCheckoutSubmit(false);
          notifyError("Failed to place order");
        }
        else {
          localStorage.removeItem("cart_products")
          localStorage.removeItem("couponInfo");
          setIsCheckoutSubmit(false)
          notifySuccess("Your Order Confirmed!");
          router.push(`/order/${res.data?.order?._id}`);
        }
      })
    }
  };

  return {
    handleCouponCode,
    couponRef,
    handleShippingCost,
    discountAmount,
    total,
    shippingCost,
    discountPercentage,
    discountProductType,
    isCheckoutSubmit,
    setTotal,
    register,
    errors,
    paymentError,
    submitHandler,
    handleSubmit,
    cartTotal,
    couponApplyMsg,
  };
};

export default useCheckoutSubmit;
