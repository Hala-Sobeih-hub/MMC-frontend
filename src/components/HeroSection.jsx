import React from "react";

import heroImage from "../assets/heroImage-1.webp";

export default function HeroSection() {
  return (
    <div>
      {/* <h1 class="text-neutral text-3xl font-bold underline">HeroSection!</h1> */}
      {/* <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center"> */}
      <div className="relative w-full">
        <img
          src={heroImage}
          alt="Hero Image"
          className="w-full h-auto object-cover rounded-lg shadow-2xl"
        />
        <div className="overlay "> </div>
        {/* <h1 className="text-5xl font-bold"> */}
        {/* Text Overlay */}
        <h1
          className="absolute top-[40%] left-[5%] md:left-[20%] w-[90%] md:w-[60%] 
          text-lg sm:text-2xl md:text-3xl lg:text-5xl font-bold text-color-neutral text-center leading-tight z-3"
        >
          Jersey Shore Inflatable Rentals You Can Trust
        </h1>
        <h2
          className="absolute top-[60%] left-[5%] md:left-[20%] w-[90%] md:w-[60%] 
          text-lg sm:text-lg md:text-xl lg:text-2xl font-bold text-white text-center leading-tight"
        >
          Make your next party even better with safe, affordable inflatable
          rentals from locals who love the Jersey Shore as much as you do.
        </h2>
        <button className="btn btn-primary absolute top-[90%] left-1/2 transform -translate-x-1/2">
          Book Now for Your Summer of Fun!
        </button>
      </div>
    </div>
    //   </div>
    // </div>
  );
}
