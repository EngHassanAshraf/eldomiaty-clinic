import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
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
      <main id="main-content" className="pb-20 md:pb-0">
        <Hero />
        <About />
        <Stats />
        <VideoSection />
        <Services />
        <Branches />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFAB />
      {/* <MobileCTA /> */}
    </>
  );
}
