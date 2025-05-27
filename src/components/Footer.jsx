import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaPhone, FaEnvelope } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Logo from "../assets/images/mmc-inflatable-logo.png";

import "./Footer.css";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer
      id="contact-jump"
      className="bg-secondary py-6 px-2 sm:py-8 sm:px-4 w-full"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 justify-items-center text-neutral text-center sm:text-left">
        {/* Contact Information */}
        {/* <div className="space-y-4 w-full flex flex-col items-center sm:items-start"> */}
        <div className="space-y-4 w-full flex flex-col items-center">
          {/* <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto sm:mx-0"> */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto">
            <img
              src={Logo}
              alt="logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start space-x-2 ">
              <FontAwesomeIcon icon={faLocationDot} className="text-xl" />
              <p>Manasquan, New Jersey</p>
            </div>
            <p className="ml-6">United States</p>
          </div>
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <FaPhone />
            <span>(732) 284-6499</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <FaEnvelope />
            <span>mmcinflatable@gmail.com</span>
          </div>
          <div className="flex justify-center sm:justify-start">
            <a href="https://www.facebook.com/">
              <FaFacebook className="text-blue-600 text-3xl hover:text-blue-400" />
            </a>
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full max-w-xs sm:max-w-md min-h-[200px] sm:min-h-[250px] mx-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24409.72852724175!2d-74.0551786287719!3d40.11518812529811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c22b767148f615%3A0x817541b9470d0119!2sManasquan%2C%20NJ!5e0!3m2!1sen!2sus!4v1748299949344!5m2!1sen!2sus"
            width="100%"
            height="200"
            className="rounded-lg shadow-lg"
            loading="lazy"
            style={{ border: 0 }}
            allowFullScreen=""
            referrerPolicy="no-referrer-when-downgrade"
            title="MMC Location"
          ></iframe>
        </div>

        {/* Inquiry Button */}
        <div className="flex flex-col items-center sm:items-start justify-center w-full">
          <button
            className="button-default w-full sm:w-auto mt-4 sm:mt-0"
            onClick={() => {
              navigate("/inquiry");
            }}
          >
            Inquiries
          </button>
        </div>
      </div>
      <div className="mt-6 pt-4 text-center text-xs sm:text-sm text-neutral font-bold">
        <p>
          © {new Date().getFullYear()} MMC Inflatables. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
