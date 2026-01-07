import Header from '@/components/layouts/Header';
import HeroSection from '../home/HeroSection';
import AboutSection from '../home/AboutSection';
import StoryVisionMission from '../home/StoryVisionMission';
import WhyItWorks from '../home/WhyItWorks';
import Faq from '../home/Faq';
import RequestDemoSection from '../home/RequestDemoSection';
import Blog from '../home/Blog';
import Footer from '@/components/layouts/Footer';

export const metadata = {
  title: 'Home | Sales Watch',
  description: 'Sales Watch - Your Ultimate One-Stop Solution for Sales Insights and Efficiency',
};

export default function EnglishHome() {
  return (
    <div lang="en">
      <Header />
      <HeroSection />
      <AboutSection />
      <WhyItWorks />
      <StoryVisionMission />
      <Faq />
      <RequestDemoSection />
      <Blog />
      <Footer />
    </div>
  );
}