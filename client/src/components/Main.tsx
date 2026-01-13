import { HeroSection } from "../sections/HeroSection";
import { LookingForSection } from "../sections/LookingForSection";
import { WhatWeBringSection } from "../sections/WhatWeBringSection";
// import ProgramFeaturesSection from "../sections/ProgramFeaturesSection";
import SEO from "./SEO";
import { PartnersSection } from "../sections/PartnerSection";
import { Footer } from "../sections/Footer";

export const Main = () => {
  return (
    <main className="caret-transparent contents">
      <SEO
        title="Powering Student Dreams"
        description="India's leading education crowdfunding platform for student startups, college projects, and innovation."
        keywords="student crowdfunding platform, education funding India, student startup funding, fund student projects"
      />
      <SEO
        title="AI-Powered Fundraising"
        description="Smart fundraising tools for students. Use our AI campaign generator to launch your project in minutes."
        keywords="AI crowdfunding platform, AI powered fundraising, smart fundraising tools"
      />
      <HeroSection />
      <LookingForSection />
      <WhatWeBringSection />
      {/* <ProgramFeaturesSection /> */}
      <PartnersSection />
      <Footer />
    </main>
  );
};
