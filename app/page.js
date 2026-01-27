import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProblemStatement from '@/components/ProblemStatement';
import Services from '@/components/Services'; // Solution Overview
import Why from '@/components/Why'; // Key Features
import Stat from '@/components/Stat'; // Impact Metrics
import HowItWorks from '@/components/HowItWorks';
import TechStack from '@/components/TechStack';
import ProjectGallery from '@/components/Projectsgalary'; // Use Cases
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonial'; // Social Proof
import Client from '@/components/Client'; // Partner Logos
import About from '@/components/About';
import Faq from '@/components/Faq';
import Ctc from '@/components/Ctc'; // CTA Section
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ProblemStatement />
      <Services />
      <Why />
      <Stat />
      <HowItWorks />
      <TechStack />
      <ProjectGallery />
      <Pricing />
      <Testimonials />
      <Client />
      <About />
      <Faq />
      <Ctc />
      <Footer />
    </main>
  );
}