import React from "react";
import { FaFacebook, FaPhone, FaEnvelope } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Logo from "../assets/images/mmc-inflatable-logo.png";

export default function Footer() {
  return (
    <div className="bg-secondary py-5 sm:py-8 px-4 min-h-[300px] w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 justify-items-center text-white text-center sm:text-left">
        {/* Contact Information */}
        <div className="space-y-4 justify-items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20">
            <img
              src={Logo}
              alt="logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start space-x-2">
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
        <div className="w-full max-w-md min-h-[250px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3469.7813168183466!2d-98.25211382533901!3d29.580965475160205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x865c93a7252650db%3A0xc95b6987917fd742!2s106%20Carmel%20Dr%2C%20Cibolo%2C%20TX%2078108!5e0!3m2!1sen!2sus!4v1740625264348!5m2!1sen!2sus"
            width="100%"
            height="250"
            className="rounded-lg shadow-lg"
            loading="lazy"
          ></iframe>
        </div>

        {console.log("Footer is rendering!")}

        {/* Inquiry Button */}
        <div className="flex flex-col items-center sm:items-start justify-center">
          <button className="button-default">Inquiries</button>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="py-4 bg-secondary w-full  text-center">
        <div className="container text-neutral font-bold mx-auto px-6 text-center text-sm">
          <p>
            © {new Date().getFullYear()} MMC Inflatables. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
