function WhatsAppFloatButton() {
  const waMessage = encodeURIComponent(
    "Halo Oase Perfume, saya ingin bertanya-tanya tentang produk kalian."
  );

  return (
    <a
      href={`https://wa.me/628995311081?text=${waMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center bg-whatsapp px-4 py-3.5 text-sm font-medium text-white sm:hidden"
    >
      Pesan via WhatsApp
    </a>
  );
}

export default WhatsAppFloatButton;
