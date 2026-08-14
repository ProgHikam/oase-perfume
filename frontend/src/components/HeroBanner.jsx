import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BACKGROUNDS = [
  "/images/backgrounds/bg-shelf1.jpg",
  "/images/backgrounds/bg-shelf2.jpg",
  "/images/backgrounds/bg-tester.jpg",
];

function HeroBanner() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % BACKGROUNDS.length);
    }, 5000); // Ganti gambar setiap 5 detik

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-0 items-center overflow-hidden bg-dark py-12 md:min-h-[440px] md:py-16 lg:min-h-[480px] lg:py-20 xl:min-h-[520px] xl:py-24">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-[1]">
        {BACKGROUNDS.map((bg, index) => (
          <div
            key={bg}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ease-in-out ${
              index === currentBgIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}
        {/* Overlay semi-transparan untuk readability */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-br from-black/70 to-black/45" />
      </div>

      <div className="container relative z-[3] flex items-center">
        <div className="max-w-[640px]">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
            Oase Perfume
          </p>
          <h1 className="mb-5 text-[28px] leading-tight text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.6)] md:text-[32px] lg:text-[38px] xl:text-5xl">
            Temukan Aroma Karaktermu
          </h1>
          <p className="mb-8 max-w-[520px] text-base text-white/90 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)] xl:text-lg">
            Setiap orang punya cerita. Oase membantu kamu menemukan aroma yang
            benar-benar menggambarkan siapa dirimu.
          </p>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-4">
            <Link to="/katalog" className="btn btn-primary justify-center sm:justify-start">
              Jelajahi Katalog
            </Link>
            <Link
              to="/cara-pemesanan"
              className="btn btn-outline justify-center border-white text-white hover:bg-white/15 hover:text-white sm:justify-start"
            >
              Cara Pemesanan
            </Link>
          </div>
        </div>
      </div>

      {/* Titik Indikator Slideshow */}
      <div className="absolute bottom-7 left-1/2 z-[4] flex -translate-x-1/2 gap-3">
        {BACKGROUNDS.map((_, index) => (
          <button
            key={index}
            className={`h-2.5 w-2.5 rounded-full border-[1.5px] border-white/50 p-0 transition-all hover:border-white ${
              index === currentBgIndex ? "scale-125 bg-white border-white" : "bg-transparent"
            }`}
            onClick={() => setCurrentBgIndex(index)}
            aria-label={`Slide ke-${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroBanner;
