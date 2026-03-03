import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/router";
// internal
import { CloseEye, OpenEye } from "@/svg";
import ErrorMsg from "../common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";

// schema
const schema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  message: Yup.string().required().label("Message"),
});

const ContactForm = () => {

    // react hook form
    const {register,handleSubmit,formState: { errors },reset} = useForm({
      resolver: yupResolver(schema),
    });
    // on submit
    const onSubmit = (data) => {
      if(data){
        notifySuccess('Message sent successfully!');
      }

      reset();
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="contact-form">
      <style dangerouslySetInnerHTML={{ __html: `
        #contact-form .tp-contact-btn { background: none !important; padding: 0 !important; border-radius: 0 !important; }
        .tp-contact-submit-btn, .tp-contact-submit-btn:hover, .tp-contact-submit-btn:focus, .tp-contact-submit-btn:active { background-color: #6b2824 !important; border: none !important; box-shadow: none !important; }
        .tp-contact-submit-btn:hover { opacity: 0.95; }
        .tp-contact-submit-btn:focus { outline: none !important; }
      `}} />
      <div className="tp-contact-input-wrapper">
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("name", { required: `Name is required!` })} name="name" id="name" type="text" placeholder="Your Name" />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="name">Your Name</label>
          </div>
          <ErrorMsg msg={errors.name?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("email", { required: `Email is required!` })} name="email" id="email" type="email" placeholder="Your Email" />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="email">Your Email</label>
          </div>
          <ErrorMsg msg={errors.email?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <textarea {...register("message", { required: `Message is required!` })} id="message" name="message" placeholder="Your Message" rows="6"/>
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="message">Your Message</label>
          </div>
          <ErrorMsg msg={errors.message?.message} />
        </div>
      </div>
      <div className="tp-contact-btn">
        <button
          type="submit"
          className="tp-contact-submit-btn"
          style={{
            backgroundColor: '#6b2824',
            border: 'none',
            color: '#fff',
            width: '100%',
            padding: '14px 24px',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: 'none',
          }}
        >
          Send Message
        </button>
      </div>
    </form>
  );
};

export default ContactForm;