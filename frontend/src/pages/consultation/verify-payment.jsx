import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';
import Wrapper from '@/layout/wrapper';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import SEO from '@/components/seo';
import { useVerifyRootCheckPaymentMutation } from '@/redux/features/consultationApi';
import { notifyError, notifySuccess } from '@/utils/toast';
import { trackLead } from '@/lib/gtm';

const RootCheckPaymentVerification = () => {
  const router = useRouter();
  const hasStarted = useRef(false);
  const [status, setStatus] = useState('verifying');
  const [booking, setBooking] = useState(null);
  const [verifyPayment] = useVerifyRootCheckPaymentMutation();

  const verify = useCallback(async (reference) => {
    try {
      const result = await verifyPayment(reference).unwrap();
      if (!result.success) throw new Error('Payment verification failed');

      setBooking(result.data);
      setStatus('success');
      trackLead({
        lead_type: 'root_check_booking',
        content_name: 'The Hracine Root Check',
        content_category: 'consultation',
        status: 'paid',
      });
      notifySuccess('Payment successful. Your Root Check is booked.');
    } catch (error) {
      setStatus('error');
      notifyError(error?.data?.message || 'We could not verify your payment. Please contact support if you were charged.');
    }
  }, [verifyPayment]);

  useEffect(() => {
    if (!router.isReady || hasStarted.current) return;

    const reference = router.query.trxref || router.query.reference;
    if (!reference) {
      setStatus('error');
      return;
    }

    hasStarted.current = true;
    verify(reference);
  }, [router.isReady, router.query.reference, router.query.trxref, verify]);

  return (
    <Wrapper>
      <SEO
        title="Root Check Payment | Hracine"
        description="Confirming your Hracine Root Check payment."
        noindex
      />
      <HeaderTwo style_2={true} />
      <main className="verification-page">
        <div className="container">
          <div className="verification-card">
            {status === 'verifying' && (
              <>
                <ClipLoader size={48} color="#9a633a" />
                <h1>Confirming your payment</h1>
                <p>Please wait while we confirm your Root Check booking.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="status-icon success" aria-hidden="true">✓</div>
                <h1>Your Root Check is booked</h1>
                <p>
                  Your payment was successful. We’ll contact you to confirm your appointment
                  {booking?.preferredDate ? ' details' : ''}.
                </p>
                {booking?.paymentReference && (
                  <p className="reference">Payment reference: <strong>{booking.paymentReference}</strong></p>
                )}
                <Link href="/" className="tp-btn tp-btn-2 verification-button">Return Home</Link>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="status-icon error" aria-hidden="true">!</div>
                <h1>Payment verification failed</h1>
                <p>If you were charged, please contact Hracine support with your Paystack payment reference. Otherwise, you can try booking again.</p>
                <Link href="/consultation#booking-form" className="tp-btn tp-btn-2 verification-button">Try Again</Link>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer primary_style={true} />

      <style jsx>{`
        .verification-page {
          align-items: center;
          background: #f3eee7;
          display: flex;
          min-height: 72vh;
          padding: 180px 0 100px;
        }
        .verification-card {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 20px 55px rgba(34, 22, 14, .12);
          margin: 0 auto;
          max-width: 650px;
          padding: 58px 42px;
          text-align: center;
        }
        h1 { color: #22160e; font-size: clamp(28px, 4vw, 42px); margin: 22px 0 14px; }
        p { color: #655b54; font-size: 17px; line-height: 1.7; }
        .status-icon {
          align-items: center;
          border-radius: 50%;
          display: flex;
          font-size: 38px;
          font-weight: 700;
          height: 76px;
          justify-content: center;
          margin: 0 auto;
          width: 76px;
        }
        .status-icon.success { background: #e7f4e9; color: #287a36; }
        .status-icon.error { background: #fbe8e6; color: #b43b32; }
        .reference { font-size: 13px; overflow-wrap: anywhere; }
        :global(.verification-button) { border-radius: 999px; margin-top: 14px; padding: 14px 28px; }
        @media (max-width: 767px) {
          .verification-page { padding: 120px 16px 64px; }
          .verification-card { padding: 42px 22px; }
        }
      `}</style>
    </Wrapper>
  );
};

export default RootCheckPaymentVerification;
