import Header from "../components/Header.jsx";
import HeroBanner from "../components/HeroBanner.jsx";
import BestSellerSection from "../components/BestSellerSection.jsx";
import PromoStrip from "../components/PromoStrip.jsx";
import TestimonialSection from "../components/TestimonialSection.jsx";
import Footer from "../components/Footer.jsx";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton.jsx";

function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroBanner />
        <BestSellerSection />
        <PromoStrip />
        <TestimonialSection />
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}

export default Home;
