import Header from '@/components/layouts/Header';
import HeroSection from './home/HeroSection';
import AboutSection from './home/AboutSection';
import StoryVisionMission from './home/StoryVisionMission';
import WhyItWorks from './home/WhyItWorks';
import Faq from './home/Faq';
import RequestDemoSection from './home/RequestDemoSection';
import Blog from './home/Blog';
import Footer from '@/components/layouts/Footer';

export default function Home() {
  return (
    <div>
      <Header></Header>
      <HeroSection></HeroSection>
      <AboutSection></AboutSection>
      <WhyItWorks></WhyItWorks>
      <StoryVisionMission></StoryVisionMission> 
      <Faq></Faq>
      <RequestDemoSection></RequestDemoSection>
      <Blog></Blog>
      <Footer></Footer>
    </div>
  );
}
