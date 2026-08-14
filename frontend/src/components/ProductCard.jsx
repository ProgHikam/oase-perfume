import { Link } from "react-router-dom";
import { resolveImageUrl } from "../utils/resolveImageUrl.js";

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function ProductCard({ product }) {
  const waMessage = encodeURIComponent(
    `Halo Oase Perfume, saya tertarik dengan produk "${product.name}". Bisa dibantu info lebih lanjut?`
  );
  const waLink = `https://wa.me/628995311081?text=${waMessage}`;
  const photoUrl = resolveImageUrl(product.image);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-[#fffdf8]">
      <Link
        to={`/produk/${product.id}`}
        className="flex h-[200px] items-center justify-center overflow-hidden bg-sand text-[13px] text-muted"
      >
        {photoUrl ? (
          <img src={photoUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span>Foto produk</span>
        )}
      </Link>

      <div className="flex flex-col gap-1.5 p-4">
        <span className="self-start rounded-full bg-dark px-2.5 py-0.5 text-[11px] tracking-wide text-white">
          {product.category}
        </span>
        <Link to={`/produk/${product.id}`}>
          <h3 className="mt-1 text-[17px] text-ink">{product.name}</h3>
        </Link>
        <p className="min-h-[36px] text-[13px] text-muted">{product.character}</p>
        <p className="mb-2 mt-1 text-base font-semibold text-primary">
          {formatPrice(product.price)}
        </p>

        <div className="flex gap-2">
          <Link
            to={`/produk/${product.id}`}
            className="btn btn-outline flex-1 justify-center px-3 py-2.5 text-[13px]"
          >
            Lihat detail
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp flex-1 justify-center px-3 py-2.5 text-[13px]"
          >
            Pesan WA
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
