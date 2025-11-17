/**
 * Example integration showing how to use all the new India Innovation components
 * You can copy sections from this file into your existing pages
 */

import { HeroSection } from '../sections/HeroSection';
import { InnovationDashboard } from '../components/InnovationDashboard';
import { FundingMilestones } from '../components/FundingMilestones';
import { 
  LightBulbIcon, 
  HandshakeIcon, 
  LabFlaskIcon,
  StarDecoration,
  ArrowDecoration 
} from '../components/icons';

/**
 * EXAMPLE 1: Complete Landing Page
 * Full page layout with hero, dashboard, and milestones
 */
export const LandingPageExample = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Already redesigned */}
      <HeroSection />
      
      {/* Innovation Dashboard */}
      <InnovationDashboard />
      
      {/* Funding Milestones */}
      <FundingMilestones />
      
      {/* Additional CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card-pastel p-12 text-center card-pastel-tilt-right">
            <div className="bg-tricolor-horizontal h-3 -mt-12 -mx-12 mb-8"></div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-dreamxec-navy mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-dreamxec-navy mb-8 max-w-2xl mx-auto">
              Join thousands of innovators transforming India's future through 
              groundbreaking ideas and collaboration.
            </p>
            <button className="btn-pastel-primary px-10 py-5 rounded-lg text-xl font-bold">
              Apply Now →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

/**
 * EXAMPLE 2: Feature Cards Grid
 * Reusable card layout for features or benefits
 */
export const FeatureCardsExample = () => {
  const features = [
    {
      icon: <LightBulbIcon className="w-16 h-16" />,
      title: "Innovation Labs",
      description: "Access state-of-the-art facilities for research and prototyping.",
      color: "saffron" as const
    },
    {
      icon: <HandshakeIcon className="w-16 h-16" />,
      title: "Expert Mentorship",
      description: "Learn from industry leaders guiding your entrepreneurial journey.",
      color: "green" as const
    },
    {
      icon: <LabFlaskIcon className="w-16 h-16" />,
      title: "Research Support",
      description: "Get funding and resources for your research initiatives.",
      color: "navy" as const
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`card-pastel p-8 ${index % 2 === 0 ? 'card-pastel-tilt-right' : 'card-pastel-tilt-left'}`}
            >
              <div className="icon-pastel-container mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-display font-bold text-dreamxec-navy mb-4 flex items-center gap-2">
                {feature.title}
                <StarDecoration className="w-6 h-6" color="#FF9933" />
              </h3>
              <p className="text-dreamxec-navy leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * EXAMPLE 3: Stats Section
 * Display key metrics with oil pastel styling
 */
export const StatsExample = () => {
  const stats = [
    { value: "500+", label: "Active Projects", color: "saffron" },
    { value: "200+", label: "Expert Mentors", color: "green" },
    { value: "₹10Cr+", label: "Funding Deployed", color: "saffron" },
    { value: "50+", label: "Innovation Labs", color: "green" }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-tricolor-horizontal h-3 w-48 rounded-full"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-dreamxec-navy">
            Our Impact on <span className="text-dreamxec-saffron">India</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="card-pastel p-8 text-center"
            >
              <div className={`text-4xl md:text-5xl font-display font-extrabold mb-3 text-dreamxec-${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-dreamxec-navy font-bold text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * EXAMPLE 4: Process Steps
 * Show a multi-step process with arrows
 */
export const ProcessStepsExample = () => {
  const steps = [
    { number: "01", title: "Apply", description: "Submit your innovative idea" },
    { number: "02", title: "Match", description: "Get paired with a mentor" },
    { number: "03", title: "Build", description: "Develop your prototype" },
    { number: "04", title: "Launch", description: "Secure funding and scale" }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-dreamxec-navy mb-4">
            Your Journey in <span className="text-dreamxec-green">4 Steps</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="card-pastel p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-dreamxec-saffron text-white text-2xl font-display font-extrabold rounded-full border-5 border-dreamxec-navy mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-display font-bold text-dreamxec-navy mb-2">
                  {step.title}
                </h3>
                <p className="text-dreamxec-navy text-sm">
                  {step.description}
                </p>
              </div>
              
              {/* Arrow between steps (except last) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowDecoration className="w-8 h-6" color="#FF9933" direction="right" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * EXAMPLE 5: Testimonial Card
 * Student success story with oil pastel styling
 */
export const TestimonialExample = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="card-pastel p-10 card-pastel-tilt-left">
          <div className="bg-tricolor-horizontal h-3 -mt-10 -mx-10 mb-8"></div>
          
          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 bg-dreamxec-saffron rounded-full border-5 border-dreamxec-navy flex-shrink-0"></div>
            <div>
              <h3 className="text-2xl font-display font-bold text-dreamxec-navy mb-2">
                Priya Sharma
              </h3>
              <p className="text-dreamxec-navy opacity-70 font-semibold">
                Founder, GreenTech Solutions
              </p>
            </div>
            <div className="ml-auto">
              <StarDecoration className="w-12 h-12" color="#FF9933" />
            </div>
          </div>
          
          <blockquote className="text-lg text-dreamxec-navy leading-relaxed italic mb-6">
            "DreamXec helped me transform my sustainable energy idea into a 
            funded startup. The mentorship and lab facilities were invaluable 
            in bringing my vision to life."
          </blockquote>
          
          <div className="flex items-center gap-4">
            <div className="bg-dreamxec-green text-white px-4 py-2 rounded-lg border-3 border-dreamxec-navy font-bold">
              ✓ Funded
            </div>
            <div className="text-dreamxec-navy font-semibold">
              ₹50L Seed Funding Secured
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * EXAMPLE 6: Call-to-Action Banner
 * Eye-catching CTA with tricolor design
 */
export const CTABannerExample = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Tricolor background */}
          <div className="absolute inset-0 bg-tricolor-horizontal opacity-20"></div>
          
          <div className="relative card-pastel p-12 md:p-16 text-center">
            {/* Decorative stars */}
            <div className="absolute top-4 left-4">
              <StarDecoration className="w-10 h-10 opacity-40" color="#FF9933" />
            </div>
            <div className="absolute top-4 right-4">
              <StarDecoration className="w-10 h-10 opacity-40" color="#138808" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-dreamxec-navy mb-6">
              Join India's <span className="text-dreamxec-saffron">Innovation</span> Revolution
            </h2>
            
            <p className="text-xl text-dreamxec-navy mb-10 max-w-2xl mx-auto">
              Be part of the movement empowering students to create the future of India
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button className="btn-pastel-primary px-10 py-5 rounded-lg text-xl font-bold">
                Apply Now
              </button>
              <button className="btn-pastel-secondary px-10 py-5 rounded-lg text-xl font-bold">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * EXAMPLE 7: Full Page Integration
 * Shows how to combine all components
 */
export const FullPageIntegration = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroSection />
      
      {/* Stats */}
      <StatsExample />
      
      {/* Innovation Dashboard */}
      <InnovationDashboard />
      
      {/* Process Steps */}
      <ProcessStepsExample />
      
      {/* Feature Cards */}
      <FeatureCardsExample />
      
      {/* Testimonial */}
      <TestimonialExample />
      
      {/* Funding Milestones */}
      <FundingMilestones />
      
      {/* Final CTA */}
      <CTABannerExample />
    </div>
  );
};

// Export all examples
export default {
  LandingPageExample,
  FeatureCardsExample,
  StatsExample,
  ProcessStepsExample,
  TestimonialExample,
  CTABannerExample,
  FullPageIntegration
};
