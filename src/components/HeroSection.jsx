import React from "react";

import heroImage from "../assets/heroImage-1.webp";

export default function HeroSection() {
  return (
    <div className="relative w-full">
      <img
        src={heroImage}
        alt="Hero Image"
        className="w-full h-auto object-cover rounded-lg shadow-2xl"
      />
      <div className="overlay flex flex-col justify-center items-center gap-5">
        {/* Text Overlay */}
        <h1 className=" text-lg sm:text-2xl md:text-3xl lg:text-5xl font-bold text-primary text-center leading-tight z-10">
          Jersey Shore Inflatable Rentals You Can Trust
        </h1>
        <h2 className="mt-40  text-lg sm:text-lg md:text-xl lg:text-2xl font-bold text-white text-center leading-tight">
          Make your next party even better with safe, affordable inflatable
          rentals from locals who love the Jersey Shore as much as you do.
        </h2>
        <button className="btn btn-primary mx-auto  ">
          Book Now for Your Summer of Fun!
        </button>
      </div>
    </div>
  );
}
