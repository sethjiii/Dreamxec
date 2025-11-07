import { FeatureCard } from "./components/FeatureCard";

export const ProgramFeaturesSection = () => {
  return (
    <section className="relative w-full bg-transparent py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col gap-8 md:gap-12">
        <FeatureCard
          title="3-Month Immersion Program"
          description="An in-depth program with founders that defines strategic direction, from a go-to-market plan and product validation to compelling storytelling—all to build ventures that are impossible to ignore"
          iconUrl="https://c.animaapp.com/mhd6hm18SGcCN3/assets/icon-24.svg"
        />
        <FeatureCard
          title="Sherpa-Led Model"
          description="Each company is closely guided by the WTFund team through a highly hands-on, integrated approach that ensures active support at every stage"
          iconUrl="https://c.animaapp.com/mhd6hm18SGcCN3/assets/icon-25.svg"
        />
        <FeatureCard
          title="INR 20 Lakh in Non-Dilutive Capital"
          description="Fuel your growth with no-strings attached, non-dilutive capital."
          iconUrl="https://c.animaapp.com/mhd6hm18SGcCN3/assets/icon-26.svg"
        />
        <FeatureCard
          title="Operator-Led Mentorship"
          description="Learn from experts through sessions, mentorship, and office hours designed to drive execution, build founder resilience, and connect you with world-class operators and investors"
          iconUrl="https://c.animaapp.com/mhd6hm18SGcCN3/assets/icon-27.svg"
        />
        <FeatureCard
          title="Access to First Users"
          description="Leverage the dynamic WTF ecosystem for user connections and access a strategic GTM Studio"
          iconUrl="https://c.animaapp.com/mhd6hm18SGcCN3/assets/icon-28.svg"
        />
        <FeatureCard
          title="Product Refinement"
          description="Leverage the community for beta testing, real feedback, and fine-tuning to take your product to the next level"
          iconUrl="https://c.animaapp.com/mhd6hm18SGcCN3/assets/icon-29.svg"
        />
        <FeatureCard
          title="Operational support"
          description="We support you with all essential services including legal, financial and access to cloud service credits"
          iconUrl="https://c.animaapp.com/mhd6hm18SGcCN3/assets/icon-30.svg"
        />
        <FeatureCard
          title="Investor Exposure"
          description="Showcase your venture at high-profile demo days with leading investors and syndicates"
          iconUrl="https://c.animaapp.com/mhd6hm18SGcCN3/assets/icon-31.svg"
        />
        </div>
      </div>
    </section>
  );
};