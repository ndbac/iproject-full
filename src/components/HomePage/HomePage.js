/* eslint-disable */
import React from "react";

import HeroSectionStart from "./sections/HeroSectionStart";
import FeaturesSectionStart from "./sections/FeaturesSectionStart";
import AboutSectionStart from "./sections/AboutSectionStart";
// import PricingSectionStart from "./sections/PricingSectionStart";
import FaqSectionStart from "./sections/FaqSectionStart";
// import TestimonialsSection from "./sections/TestimonialsSection";
import TeamSection from "./sections/TeamSection";
import ContactSection from "./sections/ContactSection";

function HomePage() {
  return (
    <>
      <HeroSectionStart />
      <FeaturesSectionStart />
      <AboutSectionStart />
      {/* <PricingSectionStart /> */}
      <FaqSectionStart />
      {/* <TestimonialsSection /> */}
      <TeamSection />
      <ContactSection />
    </>
  );
}

export default HomePage;
