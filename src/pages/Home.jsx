import React from "react";
import HeroSection from "../components/HeroSection.jsx";

import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import Testimonials from "../components/testimonialCarousel.jsx";

export default function Home() {
  return (
    <div>
      {/* <NavBar /> */}
      <HeroSection />
      <Testimonials />
      {/* <Footer /> */}
    </div>
  );
}
