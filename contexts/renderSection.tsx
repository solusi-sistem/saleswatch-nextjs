import { JSX } from "react";
import { Section } from "@/types/page";

// Import semua komponen section
import HeroUtama from "@/components/Sections/Hero/HeroUtama";
import HeroUmum from "@/components/Sections/Hero/HeroUmum";
import SupportHeader from "@/components/Sections/Support/SupportHeader";
import WhyItWorks from "@/components/Sections/About/WhyItWorks";
import StoryVisionMission from "@/components/Sections/About/StoryVisionMission";
import Testimonial from "@/components/Sections/Testimonial/Testimonial";
import Blog from "@/components/Sections/Blog/Blog";
import RequestDemoSection from "@/components/Sections/Demo/RequestDemoSection";
import Features from "@/components/Sections/Features/Features";
import PricingSection from "@/components/Sections/Pricing/PricingSection";
import SupportSection from "@/components/Sections/Support/SupportSection";
import PrivacyPolicySection from "@/components/Sections/Legal/PrivacyPolicySection";
import TermsConditionsSection from "@/components/Sections/Legal/TermsConditionsSection";
import FaqSection from "@/components/Sections/Faq/FaqSection";
import BlogListSection from "@/components/Sections/Blog/BlogListSection";

import { isSectionPublished } from "@/lib/isPublished";
import About from "@/components/Sections/About/About";

// Komponen untuk render section
export function renderSection(
  section: Section,
  index: number,
): JSX.Element | null {
  if (!isSectionPublished(section)) {
    return null;
  }

  const sectionProps = { id: section._id, key: index };

  switch (section.type_section) {
    case "heroUtama":
      return <HeroUtama {...sectionProps} />;
    case "heroUmum":
      return <HeroUmum {...sectionProps} />;
    case "supportHeader":
      return <SupportHeader {...sectionProps} />;
    case "whyItWorks":
      return <WhyItWorks {...sectionProps} />;
    case "storyVisionMission":
      return <StoryVisionMission {...sectionProps} />;
    case "testimonial":
      return <Testimonial {...sectionProps} />;
    case "about":
      return <About {...sectionProps} />;
    case "blog":
      return <Blog {...sectionProps} />;
    case "requestDemo":
      return <RequestDemoSection {...sectionProps} />;
    case "features":
      return <Features {...sectionProps} />;
    case "pricing":
      return <PricingSection {...sectionProps} />;
    case "supportSection":
      return <SupportSection {...sectionProps} />;
    case "privacyPolicySection":
      return <PrivacyPolicySection {...sectionProps} />;
    case "termsAndConditionsSection":
      return <TermsConditionsSection {...sectionProps} />;
    case "faqSection":
      return <FaqSection {...sectionProps} />;
    case "blogListSection":
      return <BlogListSection {...sectionProps} />;
    default:
      console.warn(`Unknown section type: ${section.type_section}`);
      return null;
  }
}
