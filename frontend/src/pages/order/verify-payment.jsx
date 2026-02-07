import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useVerifyPaymentMutation, useSaveOrderMutation } from '@/redux/features/order/orderApi';
import { notifyError, notifySuccess } from '@/utils/toast';
import Wrapper from '@/layout/wrapper';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import { ClipLoader } from 'react-spinners';

const VerifyPayment = () => {
  const router = useRouter();
  const { reference, trxref } = router.query;
  const [verifyPayment, { isLoading: isVerifying }] = useVerifyPaymentMutation();
  const [saveOrder, { isLoading: isSaving }] = useSaveOrderMutation();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    // Paystack sends both 'reference' and 'trxref' - use trxref if available, otherwise reference
    const paymentReference = trxref || reference;
    if (paymentReference) {
      handlePaymentVerification(paymentReference);
    }
  }, [reference, trxref]);

  const handlePaymentVerification = async (paymentReference) => {
    try {
      console.log('Verifying payment with reference:', paymentReference);
      const result = await verifyPayment({ reference: paymentReference }).unwrap();
      console.log('Verification result:', result);
      
      if (result.success && result.data.status === 'success') {
        // Payment successful, now save the order
        // Get order info from localStorage or parse from metadata
        const storedOrderInfo = localStorage.getItem('pendingOrderInfo');
        let orderInfo = {};
        
        if (storedOrderInfo) {
          try {
            orderInfo = JSON.parse(storedOrderInfo);
          } catch (parseError) {
            console.error('Error parsing stored order info:', parseError);
          }
        }
        
        // Also try to get from Paystack metadata
        if ((!orderInfo || !orderInfo.user) && result.data.metadata) {
          if (result.data.metadata.orderInfo) {
            try {
              orderInfo = JSON.parse(result.data.metadata.orderInfo);
            } catch (parseError) {
              console.error('Error parsing metadata order info:', parseError);
            }
          }
        }
        
        if (!orderInfo || !orderInfo.user) {
          console.error('Order info is missing or incomplete:', orderInfo);
          setStatus('error');
          notifyError('Order information not found. Please contact support with your payment reference: ' + paymentReference);
          return;
        }
        
        try {
          const orderResult = await saveOrder({
            ...orderInfo,
            paymentReference: paymentReference,
            paymentStatus: 'success',
          }).unwrap();

          if (orderResult.success) {
            setStatus('success');
            notifySuccess('Payment successful! Your order has been confirmed.');
            // Clear cart and redirect
            localStorage.removeItem('cart_products');
            localStorage.removeItem('couponInfo');
            localStorage.removeItem('shipping_info');
            localStorage.removeItem('pendingOrderInfo');
            
            setTimeout(() => {
              router.push(`/order/${orderResult.order._id}`);
            }, 2000);
          } else {
            setStatus('error');
            notifyError('Payment verified but failed to save order. Please contact support.');
          }
        } catch (saveError) {
          console.error('Error saving order:', saveError);
          setStatus('error');
          notifyError('Payment verified but failed to save order. Please contact support.');
        }
      } else {
        setStatus('error');
        notifyError('Payment verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      console.error('Error details:', {
        status: error?.status,
        data: error?.data,
        message: error?.data?.message,
      });
      setStatus('error');
      const errorMessage = error?.data?.message || error?.data?.errorMessages?.[0]?.message || 'Payment verification failed. Please try again.';
      notifyError(errorMessage);
    }
  };

  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <section className="tp-checkout-area pb-120" style={{ backgroundColor: '#EFF1F5', minHeight: '60vh' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="text-center pt-50 pb-50">
                {status === 'verifying' && (
                  <>
                    <ClipLoader size={50} color="#3498db" />
                    <h3 className="mt-4">Verifying Payment...</h3>
                    <p>Please wait while we verify your payment.</p>
                  </>
                )}
                {status === 'success' && (
                  <>
                    <div style={{ fontSize: '64px', color: '#27ae60', marginBottom: '20px' }}>✓</div>
                    <h3 className="text-success">Payment Successful!</h3>
                    <p>Your order has been confirmed. Redirecting to order details...</p>
                  </>
                )}
                {status === 'error' && (
                  <>
                    <div style={{ fontSize: '64px', color: '#e74c3c', marginBottom: '20px' }}>✗</div>
                    <h3 className="text-danger">Payment Verification Failed</h3>
                    <p>There was an issue verifying your payment. Please contact support or try again.</p>
                    <button
                      onClick={() => router.push('/checkout')}
                      className="tp-checkout-btn mt-3"
                    >
                      Return to Checkout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer style_2={true} />
    </Wrapper>
  );
};

export default VerifyPayment;
