import Link from "next/link";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const products = [
	{ name: "Noir Structured Coat", category: "Outerwear", price: "$320" },
	{ name: "Cropped Utility Trouser", category: "Bottoms", price: "$180" },
	{ name: "Oversized Poplin Shirt", category: "Tops", price: "$145" },
	{ name: "Monochrome Knit Vest", category: "Tops", price: "$128" },
	{ name: "Box Pleat Relaxed Pant", category: "Bottoms", price: "$172" },
	{ name: "Textured Coach Jacket", category: "Outerwear", price: "$290" },
];

export default function MenCollectionPage() {
	return (
		<main className="min-h-screen bg-white text-black px-6 md:px-10 py-10 md:py-14">
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
					<div>
						<p className="text-black/40 text-[10px] tracking-[0.4em] uppercase mb-3">Collection</p>
						<h1 className={`${playfair.className} text-5xl md:text-7xl leading-none`}>Men</h1>
						<p className="text-black/60 text-sm md:text-base mt-5 max-w-2xl leading-relaxed">
							Tailored edges, easy volume, and understated monochrome essentials designed for everyday precision.
						</p>
					</div>

					<div className="flex gap-3">
						<Link href="/collection" className="border border-black px-4 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all">
							All Collections
						</Link>
						<Link href="/" className="border border-black/20 px-4 py-3 text-[10px] tracking-[0.3em] uppercase hover:border-black transition-all">
							Home
						</Link>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{products.map((product) => (
						<article key={product.name} className="border border-black/10 bg-white p-4 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all">
							<div className="aspect-[4/5] mb-4 bg-gradient-to-br from-zinc-900 to-zinc-700 relative overflow-hidden">
								<div className="absolute top-4 left-4 bg-white text-black text-[9px] tracking-[0.2em] uppercase px-2 py-1">{product.category}</div>
								<div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
									<span className="text-[10px] tracking-[0.3em] uppercase">yumie</span>
									<span className="text-sm">{product.price}</span>
								</div>
							</div>

							<p className="text-black/40 text-[10px] tracking-[0.3em] uppercase mb-1">{product.category}</p>
							<h2 className={`${playfair.className} text-2xl mb-3`}>{product.name}</h2>
							<button className="w-full border border-black px-4 py-3 text-xs tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all">
								View Item
							</button>
						</article>
					))}
				</div>
			</div>
		</main>
	);
}
