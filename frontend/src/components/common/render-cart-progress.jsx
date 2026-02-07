import React from "react";
import useCartInfo from "@/hooks/use-cart-info";
import { formatCurrency } from "@/utils/currency";
import { useGetSettingsQuery } from "@/redux/features/admin/adminApi";

const RenderCartProgress = () => {
  const { total } = useCartInfo();
  const { data: settingsData, isLoading } = useGetSettingsQuery();
  const freeShippingThreshold = settingsData?.data?.freeShippingThreshold || 200;
  
  if (isLoading) {
    return null;
  }

  const progress = Math.min((total / freeShippingThreshold) * 100, 100);
  
  if (total < freeShippingThreshold) {
    const remainingAmount = freeShippingThreshold - total;
    return (
      <>
        <p>{`Add ${formatCurrency(remainingAmount)} more to qualify for free shipping`}</p>
        <div className="progress">
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            data-width={`${progress}%`}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </>
    );
  }
  return (
    <>
      <p> You are eligible for free shipping</p>
      <div className="progress">
        <div
          className="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          data-width={`${progress}%`}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </>
  );
};

export default RenderCartProgress;
