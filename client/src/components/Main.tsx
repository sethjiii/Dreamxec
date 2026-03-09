import { HeroSection } from "../sections/HeroSection";
import { LookingForSection } from "../sections/LookingForSection";
import { WhatWeBringSection } from "../sections/WhatWeBringSection";
import { VerticalStickyCTA } from './VerticalStickyCTA';
import { ResearchFlipClock } from "./ResearchFlipClock";
// import ProgramFeaturesSection from "../sections/ProgramFeaturesSection";

import { PartnersSection } from "../sections/PartnerSection";
import { Footer } from "../sections/Footer";

export const Main = () => {
  return (
    <main className="caret-transparent flex flex-col items-center">
      {/* <div className="flex justify-center w-full pt-6">
  <ResearchFlipClock />
</div> */}
      <VerticalStickyCTA side="right" topOffset="40%" />
      <HeroSection />
      <LookingForSection />
      <WhatWeBringSection />
      {/* <ProgramFeaturesSection /> */}
      <PartnersSection />
      <Footer />
    </main>
  );
};
