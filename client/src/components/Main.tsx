import { HeroSection } from "../sections/HeroSection";
import { LookingForSection } from "../sections/LookingForSection";
import { WhatWeBringSection } from "../sections/WhatWeBringSection";
// import ProgramFeaturesSection from "../sections/ProgramFeaturesSection";

import { PartnersSection } from "../sections/PartnerSection";
import { Footer } from "../sections/Footer";

export const Main = () => {
  return (
    <main className="caret-transparent contents">
      <HeroSection />
      <LookingForSection />
      <WhatWeBringSection />
      {/* <ProgramFeaturesSection /> */}
      <PartnersSection />
      <Footer />
    </main>
  );
};
