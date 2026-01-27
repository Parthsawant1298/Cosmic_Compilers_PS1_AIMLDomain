import Contact from '@/components/Contact';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <Contact backgroundImage="/background.jpg" />
      <Footer />
    </>
  );
}
