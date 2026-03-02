import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { toast } from 'react-toastify';
import { getApiBaseUrl } from '@/utils/apiConfig';
import styles from './newsletter-modal.module.css';

const NewsletterModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Check if modal has been shown before
    const hasSeenModal = localStorage.getItem('newsletterModalShown');
    
    if (!hasSeenModal) {
      // Show modal after 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('newsletterModalShown', 'true');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'modal' }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast.success(data.message);
        
        // Close modal after 2 seconds
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      } else {
        toast.error(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      position: 'relative',
      inset: 'auto',
      border: 'none',
      background: 'transparent',
      padding: 0,
      maxWidth: '500px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'visible',
    },
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={customStyles}
      contentLabel="Newsletter Subscription"
      ariaHideApp={false}
      className={styles.modal}
    >
      <div className={styles.modalContent}>
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {!isSuccess ? (
          <>
            
            <h2 className={styles.headline}>Hey Queen, Let&apos;s Connect</h2>
            <p className={styles.bodyText}>
              Be part of the Root Tribe and get early access to exclusive discounts, new drops, healthy hair tips, and special community perks.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Join the Root Tribe"
                className={styles.emailInput}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className={styles.subscribeButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>

            <p className={styles.disclaimer}>
              No spam. Just healthy hair energy. Unsubscribe anytime.
            </p>
          </>
        ) : (
          <div className={styles.successContent}>
            <div className={styles.successEmoji}>💚</div>
            <h2 className={styles.successHeadline}>
              You&apos;re officially part of the Root Tribe 💚
            </h2>
            <p className={styles.successText}>
              Check your inbox for exclusive updates and special offers!
            </p>
          </div>
        )}
      </div>
    </ReactModal>
  );
};

export default NewsletterModal;
