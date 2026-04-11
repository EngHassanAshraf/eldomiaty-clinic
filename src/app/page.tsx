import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import VideoSection from "@/components/VideoSection";
import Branches from "@/components/Branches";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import MobileCTA from "@/components/MobileCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pb-20 md:pb-0">
        <Hero />
        <About />
        <Stats />
        <Services />
        <VideoSection />
        <Branches />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      {/* Desktop floating WhatsApp */}
      <WhatsAppFAB />
      {/* Mobile sticky bottom bar */}
      <MobileCTA />
    </>
  );
}
