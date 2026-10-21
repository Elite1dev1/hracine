import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
// internal
import { Minus, Plus } from "@/svg";
import { add_cart_product, quantityDecrement } from "@/redux/features/cartSlice";
import { formatCurrency } from "@/utils/currency";
import { formatDiscountPercentage, getProductPricing } from "@/utils/productPricing";

const CartItemMobile = ({ product }) => {
  const { _id, img, title, orderQuantity = 0 } = product || {};
  const dispatch = useDispatch();
  const { originalPrice, salePrice, hasDiscount, discountPercentage } = getProductPricing(product);

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
        {hasDiscount && (
          <span style={{ display: 'inline-block', marginBottom: '4px', padding: '2px 7px', borderRadius: '999px', backgroundColor: '#85312c', color: '#fff', fontSize: '10px', fontWeight: 700 }}>
            -{formatDiscountPercentage(discountPercentage)}% OFF
          </span>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px 7px', marginBottom: '8px' }}>
          <p className="tp-cart-mobile-price" style={{ margin: 0, color: hasDiscount ? '#85312c' : undefined }}>
            {formatCurrency(salePrice * orderQuantity)}
          </p>
          {hasDiscount && (
            <span style={{ color: '#8a8582', fontSize: '11px', textDecoration: 'line-through' }}>
              {formatCurrency(originalPrice * orderQuantity)}
            </span>
          )}
        </div>

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
