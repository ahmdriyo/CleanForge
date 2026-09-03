import { Navbar } from "./navbar";
import { HeroSection } from "./sections/hero-section";
import { ProblemSection } from "./sections/problem-section";
import { SolutionSection } from "./sections/solution-section";
import { FeaturesSection } from "./sections/features-section";
import { TemplatesPreviewSection } from "./sections/templates-preview-section";
import { HowItWorksSection } from "./sections/how-it-works-section";
import { TechStackSection } from "./sections/tech-stack-section";
import { CtaSection } from "./sections/cta-section";
import { Footer } from "./footer";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#fbfbff] scroll-smooth">
      <style>{`html{scroll-behavior:smooth}`}</style>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <TemplatesPreviewSection />
        <HowItWorksSection />
        <TechStackSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};
