import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
// internal
import { Minus, Plus } from "@/svg";
import { add_cart_product, quantityDecrement } from "@/redux/features/cartSlice";
import { formatCurrency } from "@/utils/currency";

const CartItemMobile = ({ product }) => {
  const { _id, img, title, price, orderQuantity = 0 } = product || {};
  const dispatch = useDispatch();

  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };

  const handleDecrement = (prd) => {
    dispatch(quantityDecrement(prd));
  };

  return (
    <div className="tp-cart-mobile-item">
      <div className="tp-cart-mobile-thumb">
        <Link href={`/product-details/${_id}`}>
          <Image src={img} alt="product img" width={90} height={112} />
        </Link>
      </div>

      <div className="tp-cart-mobile-content">
        <h4 className="tp-cart-mobile-title">
          <Link href={`/product-details/${_id}`}>{title}</Link>
        </h4>
        <p className="tp-cart-mobile-price">{formatCurrency(price * orderQuantity)}</p>

        <div className="tp-cart-mobile-qty">
          <div className="tp-product-quantity">
            <span onClick={() => handleDecrement(product)} className="tp-cart-minus">
              <Minus />
            </span>
            <span className="tp-cart-mobile-count">{orderQuantity}</span>
            <span onClick={() => handleAddProduct(product)} className="tp-cart-plus">
              <Plus />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemMobile;
