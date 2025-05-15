import React from "react";

import heroImage from "../assets/heroImage-1.webp";

export default function HeroSection() {
  return (
    // <div>
    <div className="relative w-full">
      <img
        src={heroImage}
        alt="Hero Image"
        className="w-full h-auto object-cover rounded-lg shadow-2xl"
      />
      <div className="overlay ">
        {/* Text Overlay */}
        <h1
          className="absolute top-[10%] left-[5%] md:left-[20%] w-[90%] md:w-[60%] 
          text-lg sm:text-2xl md:text-3xl lg:text-5xl font-bold text-primary text-center leading-tight z-10"
        >
          Jersey Shore Inflatable Rentals You Can Trust
        </h1>
        <h2
          className="absolute top-[50%] left-[5%] md:left-[20%] w-[90%] md:w-[60%] 
          text-lg sm:text-lg md:text-xl lg:text-2xl font-bold text-white text-center leading-tight"
        >
          Make your next party even better with safe, affordable inflatable
          rentals from locals who love the Jersey Shore as much as you do.
        </h2>
        <button className="btn btn-primary absolute top-[60%] left-1/2 transform -translate-x-1/2 ">
          Book Now for Your Summer of Fun!
        </button>
      </div>
    </div>
    // </div>
  );
}
