import Link from "next/link";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type CategoryKey = "men" | "women" | "kids";

const categoryTheme: Record<CategoryKey, { label: string; imageAccent: string; imageText: string }> = {
  men: {
    label: "Men",
    imageAccent: "from-zinc-950 to-zinc-700",
    imageText: "text-white",
  },
  women: {
    label: "Women",
    imageAccent: "from-stone-100 to-zinc-300",
    imageText: "text-black",
  },
  kids: {
    label: "Kids",
    imageAccent: "from-zinc-300 to-zinc-500",
    imageText: "text-black",
  },
};

const sizes = ["XS", "S", "M", "L", "XL"];

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{
    name?: string;
    price?: string;
    type?: string;
  }>;
};

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  const query = (await searchParams) ?? {};

  const normalizedCategory: CategoryKey =
    category === "women" || category === "kids" ? category : "men";

  const theme = categoryTheme[normalizedCategory];
  const productName = query.name ?? `${theme.label} Signature Piece`;
  const productType = query.type ?? "Apparel";
  const productPrice = query.price ?? "$199";

  return (
    <main className="min-h-screen bg-white text-black px-6 md:px-10 py-10 md:py-14">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-black/40 mb-8">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/collection" className="hover:text-black transition-colors">Collection</Link>
          <span>/</span>
          <Link href={`/collection/${normalizedCategory}`} className="hover:text-black transition-colors">{theme.label}</Link>
          <span>/</span>
          <span className="text-black">Product</span>
        </div>

        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 md:gap-10 items-start">
          <section className="border border-black/10 p-4 md:p-6 bg-white">
            <div className={`relative aspect-[4/5] bg-gradient-to-br ${theme.imageAccent} overflow-hidden`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.45),_transparent_40%)]" />
              <div className="absolute top-4 left-4 bg-black text-white text-[9px] tracking-[0.2em] uppercase px-2 py-1">
                {theme.label}
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className={`text-[10px] tracking-[0.35em] uppercase mb-3 ${theme.imageText} opacity-80`}>yumie</p>
                <h2 className={`${playfair.className} ${theme.imageText} text-3xl md:text-4xl leading-tight max-w-xs`}>
                  {productName}
                </h2>
              </div>
            </div>
          </section>

          <section className="border border-black/10 p-6 md:p-8 bg-white">
            <p className="text-black/40 text-[10px] tracking-[0.4em] uppercase mb-3">{theme.label} Collection</p>
            <h1 className={`${playfair.className} text-4xl md:text-5xl leading-tight mb-3`}>{productName}</h1>
            <p className="text-black/45 text-[11px] tracking-[0.3em] uppercase mb-6">{productType}</p>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-2xl md:text-3xl font-light">{productPrice}</span>
              <span className="h-px w-10 bg-black/20" />
              <span className="text-[10px] tracking-[0.35em] uppercase text-black/40">In Stock</span>
            </div>

            <div className="mb-8">
              <p className="text-black/40 text-[10px] tracking-[0.35em] uppercase mb-3">Size</p>
              <div className="grid grid-cols-5 gap-2 max-w-md">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className="border border-black/20 px-3 py-2 text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-black/40 text-[10px] tracking-[0.35em] uppercase mb-3">Quantity</p>
              <div className="inline-flex items-center border border-black/20">
                <button type="button" className="px-4 py-2 text-black/60 hover:bg-black hover:text-white transition-all">-</button>
                <span className="px-5 py-2 text-sm">1</span>
                <button type="button" className="px-4 py-2 text-black/60 hover:bg-black hover:text-white transition-all">+</button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                type="button"
                className="flex-1 border border-black bg-black text-white px-5 py-3 text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all"
              >
                Add to Cart
              </button>
              <button
                type="button"
                className="flex-1 border border-black px-5 py-3 text-xs tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all"
              >
                Buy Now
              </button>
            </div>

            <div className="border-t border-black/10 pt-6 space-y-4 text-sm text-black/65 leading-relaxed">
              <p>
                Crafted for daily wear with a premium finish. This piece pairs a modern silhouette with versatile styling for
                effortless layering.
              </p>
              <p>
                Composition: 100% cotton blend. Care: cold wash, low tumble dry, and hang immediately to keep structure.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
