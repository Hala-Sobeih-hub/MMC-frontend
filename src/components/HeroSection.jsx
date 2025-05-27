import React from "react";
import "./HeroSection.css";
import heroImage from "../assets/heroImage-1.webp";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <div
      className="hero-wrapper relative w-full h-[92dvh] bg-center bg-cover flex flex-col justify-center items-center"
      style={{
        background: `url(${heroImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {/* Text Overlay */}
      <h1 className="mb-40  text-lg sm:text-2xl md:text-3xl lg:text-5xl font-bold text-primary text-center leading-tight z-10">
        Jersey Shore Inflatable Rentals You Can Trust
      </h1>

      <div className="space-y-10">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold text-white text-center leading-tight ">
          Make your next party even better with safe, affordable inflatable
          rentals from locals who love the Jersey Shore as much as you do.
        </h2>
        {/* <button className="btn btn-primary sm:text-xl md:text-2xl lg:text-4xl mx-auto">
          Book Now for Your Summer of Fun!
        </button> */}
        <button
          className="text-neutral bg-primary rounded-xl font-bold 
        sm:text-xl md:text-2xl lg:text-4xl px-6 py-3 mx-auto hover:text-teal-600"
          onClick={() => {
            navigate("/products");
          }}
        >
          Book Now for Your Summer of Fun!
        </button>
      </div>
    </div>
  );
}
