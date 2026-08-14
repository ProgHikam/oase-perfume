import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton.jsx";

const STEPS = [
  {
    number: "01",
    title: "Pilih Produk",
    desc: "Jelajahi Katalog Produk kami dan temukan aroma yang cocok dengan karaktermu. Cek Fragrance Notes dan deskripsi karakter di setiap produk.",
  },
  {
    number: "02",
    title: "Hubungi via WhatsApp / Beli di Shopee",
    desc: 'Klik tombol "Pesan via WhatsApp" atau "Beli di Shopee" di halaman produk untuk langsung terhubung dengan admin kami.',
  },
  {
    number: "03",
    title: "Konfirmasi Pesanan",
    desc: "Admin akan mengonfirmasi produk, ukuran, jumlah, dan alamat pengirimanmu, lalu memberikan total pembayaran.",
  },
  {
    number: "04",
    title: "Pembayaran",
    desc: "Lakukan pembayaran melalui transfer bank, e-wallet, atau QRIS sesuai instruksi dari admin.",
  },
  {
    number: "05",
    title: "Pengiriman",
    desc: "Setelah pembayaran dikonfirmasi, pesanan akan diproses dan dikirim. Kamu akan mendapat nomor resi untuk melacak paket.",
  },
];

function CaraPemesanan() {
  return (
    <>
      <Header />
      <main>
        <section className="mb-8 bg-sand py-8 sm:py-12">
          <div className="container">
            <p className="mb-2 text-[13px] uppercase tracking-widest text-primary">
              Cara Pemesanan
            </p>
            <h1 className="text-2xl text-ink sm:text-[32px]">Mudah, Cuma 5 Langkah</h1>
          </div>
        </section>

        <section className="container max-w-[720px] pb-16">
          <div className="mb-10 flex flex-col gap-7">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-5">
                <span className="w-[50px] flex-shrink-0 font-heading text-[28px] text-primary">
                  {step.number}
                </span>
                <div>
                  <h2 className="mb-1.5 text-lg text-ink">{step.title}</h2>
                  <p className="text-sm leading-[1.7] text-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start gap-4 rounded-xl bg-sand p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[15px] text-ink">Sudah tahu mau pesan apa?</p>
            <Link to="/katalog" className="btn btn-primary">
              Mulai Belanja
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}

export default CaraPemesanan;
