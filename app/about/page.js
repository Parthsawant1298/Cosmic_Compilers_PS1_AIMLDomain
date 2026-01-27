import Aboutus from "@/components/Aboutus";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <Aboutus backgroundImage="/background.jpg" />
      <Footer />
    </>
  );
}
