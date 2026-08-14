import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton.jsx";

// Alamat toko yang akan dipakai untuk embed Google Maps
const STORE_ADDRESS =
  "Jl. Ciganitri Tengah No.11b, Cipagalo, Kec. Bojongsoang, Kabupaten Bandung, Jawa Barat 40287";

function Kontak() {
  return (
    <>
      <Header />
      <main>
        <section className="mb-8 bg-sand py-8 sm:py-12">
          <div className="container">
            <p className="mb-2 text-[13px] uppercase tracking-widest text-primary">Kontak</p>
            <h1 className="text-2xl text-ink sm:text-[32px]">Ada Pertanyaan? Hubungi Kami</h1>
          </div>
        </section>

        <section className="container grid grid-cols-1 gap-8 pb-16 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col gap-[18px]">
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-muted">WhatsApp</p>
              <a
                href="https://wa.me/628995311081"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] text-ink"
              >
                +62 899-5311-081
              </a>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-muted">Instagram</p>
              <a
                href="https://www.instagram.com/oase_parfume?utm_source=qr&igsh=dmcybW1ocXN6Ymhq"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] text-ink"
              >
                @oase_parfume
              </a>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-muted">Email</p>
              <a href="mailto:oaseparfum24@gmail.com" className="text-[15px] text-ink">
                oaseparfum24@gmail.com
              </a>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-muted">Jam Operasional</p>
              <p className="text-[15px] text-ink">Senin, 08.30 - 21.00 WIB</p>
              <p className="text-[15px] text-ink">Selasa - Minggu, 08.00 - 21.00 WIB</p>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-muted">Alamat Toko</p>
              <p className="text-[15px] text-ink">{STORE_ADDRESS}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <iframe
              className="min-h-[320px] w-full rounded-xl border border-line"
              title="Lokasi Toko Oase Perfume"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.5!2d107.6378!3d-6.9717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTgnMTguMSJTIDEwN8KwMzgnMTYuMSJF!5e0!3m2!1sid!2sid!4v1690000000000!5m2!1sid!2sid"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
            />
            <a
              href="https://maps.app.goo.gl/7qeoPw8fJbEzRMPb8"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline self-start"
            >
              Buka di Google Maps
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}

export default Kontak;
