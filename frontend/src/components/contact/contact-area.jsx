import React from "react";
// internal
import ContactForm from "../forms/contact-form";

const ContactArea = () => {
  return (
    <>
      <section className="tp-contact-area pb-100 pt-100">
        <div className="container">
          <div className="tp-contact-inner">
            <div className="row justify-content-center">
              <div className="col-xl-8 col-lg-10">
                <div className="tp-contact-wrapper text-center mb-50">
                  <h2 className="tp-contact-title" style={{ fontSize: '42px', marginBottom: '20px' }}>
                    Let's Talk Roots
                  </h2>
                  <p style={{ fontSize: '18px', color: '#55585B', maxWidth: '600px', margin: '0 auto 40px' }}>
                    Have questions about our products or need help with your hair care journey? We're here to help.
                  </p>
                </div>
                <div className="tp-contact-form-wrapper">
                  <ContactForm />
                </div>
                <div className="tp-contact-info-simple text-center mt-50">
                  <p style={{ fontSize: '16px', color: '#55585B', marginBottom: '20px' }}>
                    <strong>Support Email:</strong>{" "}
                    <a href="mailto:support@rootsandrituals.com" style={{ color: '#C47070', textDecoration: 'none' }}>
                      support@rootsandrituals.com
                    </a>
                  </p>
                  <div className="tp-contact-social-icon" style={{ marginTop: '30px' }}>
                    <a href="#" style={{ margin: '0 10px', fontSize: '24px', color: '#55585B' }}>
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                    <a href="#" style={{ margin: '0 10px', fontSize: '24px', color: '#55585B' }}>
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                    <a href="#" style={{ margin: '0 10px', fontSize: '24px', color: '#55585B' }}>
                      <i className="fa-brands fa-twitter"></i>
                    </a>
                    <a href="#" style={{ margin: '0 10px', fontSize: '24px', color: '#55585B' }}>
                      <i className="fa-brands fa-pinterest"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactArea;
