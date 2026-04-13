"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

type CategoryKey = "men" | "women" | "kids";

type CollectionItem = {
	name: string;
	category: string;
	price: string;
	accent: string;
	tone: string;
};

type CategoryConfig = {
	key: CategoryKey;
	label: string;
	headline: string;
	description: string;
	note: string;
	productCount: string;
	spotlight: CollectionItem;
	items: CollectionItem[];
};

const categories: CategoryConfig[] = [
	{
		key: "men",
		label: "Men",
		headline: "Tailored edges, relaxed volume.",
		description:
			"Sharp outerwear, wide-leg silhouettes, and quiet essentials designed for an understated wardrobe.",
		note: "Refined essentials",
		productCount: "24 pieces",
		spotlight: {
			name: "Noir Structured Coat",
			category: "Outerwear",
			price: "$320",
			accent: "from-black to-zinc-950",
			tone: "ring-black/10",
		},
		items: [
			{ name: "Noir Structured Coat", category: "Outerwear", price: "$320", accent: "from-black to-zinc-950", tone: "ring-black/10" },
			{ name: "Cropped Utility Trouser", category: "Bottoms", price: "$180", accent: "from-zinc-900 to-zinc-800", tone: "ring-black/10" },
			{ name: "Oversized Poplin Shirt", category: "Tops", price: "$145", accent: "from-zinc-800 to-zinc-700", tone: "ring-black/10" },
		],
	},
	{
		key: "women",
		label: "Women",
		headline: "Soft structure, clean contrast.",
		description:
			"Layered tailoring, fluid drape, and elevated staples balanced between precision and ease.",
		note: "Modern classics",
		productCount: "28 pieces",
		spotlight: {
			name: "Ivory Column Dress",
			category: "Dresses",
			price: "$260",
			accent: "from-stone-100 to-zinc-200",
			tone: "ring-black/5",
		},
		items: [
			{ name: "Ivory Column Dress", category: "Dresses", price: "$260", accent: "from-stone-100 to-zinc-200", tone: "ring-black/5" },
			{ name: "Contour Wool Blazer", category: "Outerwear", price: "$340", accent: "from-zinc-900 to-zinc-700", tone: "ring-black/10" },
			{ name: "Bias Cut Midi Skirt", category: "Bottoms", price: "$155", accent: "from-zinc-800 to-zinc-600", tone: "ring-black/10" },
		],
	},
	{
		key: "kids",
		label: "Kids",
		headline: "Playful proportions, easy movement.",
		description:
			"Comfort-first staples with durable fabrics, relaxed fits, and a calm monochrome palette.",
		note: "Everyday essentials",
		productCount: "16 pieces",
		spotlight: {
			name: "Mini Canvas Set",
			category: "Sets",
			price: "$92",
			accent: "from-zinc-700 to-zinc-500",
			tone: "ring-black/10",
		},
		items: [
			{ name: "Mini Canvas Set", category: "Sets", price: "$92", accent: "from-zinc-700 to-zinc-500", tone: "ring-black/10" },
			{ name: "Soft Jersey Hoodie", category: "Tops", price: "$58", accent: "from-zinc-800 to-zinc-600", tone: "ring-black/10" },
			{ name: "Straight Pull-On Pant", category: "Bottoms", price: "$64", accent: "from-zinc-900 to-zinc-700", tone: "ring-black/10" },
		],
	},
];

function CategoryCard({
	category,
	active,
	onSelect,
}: {
	category: CategoryConfig;
	active: boolean;
	onSelect: () => void;
}) {
	return (
		<motion.button
			type="button"
			onClick={onSelect}
			whileHover={{ y: -4 }}
			whileTap={{ scale: 0.99 }}
			className={`group text-left border transition-all duration-300 p-5 md:p-6 ${
				active
					? "border-black bg-black text-white"
					: "border-black/10 bg-white text-black hover:border-black/30"
			}`}
		>
			<div className="flex items-center justify-between gap-4 mb-6">
				<div>
					<p className={`text-[10px] tracking-[0.4em] uppercase mb-2 ${active ? "text-white/60" : "text-black/40"}`}>
						{category.note}
					</p>
					<h2 className={`text-3xl md:text-4xl ${playfair.className}`}>{category.label}</h2>
				</div>
				<span className={`text-[10px] tracking-[0.3em] uppercase ${active ? "text-white/60" : "text-black/40"}`}>
					{category.productCount}
				</span>
			</div>

			<div className={`h-px w-full mb-5 ${active ? "bg-white/20" : "bg-black/10"}`} />

			<p className={`text-sm leading-relaxed max-w-md ${active ? "text-white/70" : "text-black/55"}`}>
				{category.description}
			</p>

			<div className="mt-6 flex items-center justify-between">
				<span className={`text-[10px] tracking-[0.3em] uppercase ${active ? "text-white/50" : "text-black/40"}`}>
					Explore {category.label}
				</span>
				<Link
					href={`/collection/${category.key}`}
					onClick={(e) => e.stopPropagation()}
					className={`text-[10px] tracking-[0.3em] uppercase border px-3 py-2 transition-all ${
						active
							? "text-white border-white/30 hover:bg-white hover:text-black"
							: "text-black border-black/30 hover:bg-black hover:text-white"
					}`}
				>
					Open Page
				</Link>
			</div>
		</motion.button>
	);
}

function ProductPreview({ item, categoryKey }: { item: CollectionItem; categoryKey: CategoryKey }) {
	return (
		<motion.div
			key={item.name}
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -16 }}
			transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
			className="grid gap-5"
		>
			<div className="relative overflow-hidden border border-black/10 bg-white">
				<div className={`absolute inset-0 bg-gradient-to-br ${item.accent}`} />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_45%)]" />
				<div className="relative aspect-[4/5] flex flex-col justify-between p-6 md:p-8 text-white">
					<div className="flex items-start justify-between gap-4">
						<span className="text-[10px] tracking-[0.35em] uppercase bg-black/70 px-3 py-2">
							Spotlight
						</span>
						<span className="text-[10px] tracking-[0.35em] uppercase text-white/80">
							yumie
						</span>
					</div>

					<div>
						<p className="text-white/70 text-[10px] tracking-[0.3em] uppercase mb-2">
							{item.category}
						</p>
						<h3 className={`${playfair.className} text-4xl md:text-5xl leading-tight max-w-xs`}>
							{item.name}
						</h3>
						<div className="mt-5 flex items-center gap-4">
							<span className="text-xs tracking-[0.3em] uppercase">{item.price}</span>
							<span className="h-px w-10 bg-white/40" />
							<span className="text-[10px] tracking-[0.3em] uppercase text-white/70">
								Limited selection
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
				<div>
					<p className="text-black/40 text-[10px] tracking-[0.4em] uppercase mb-2">Featured Edit</p>
					<h4 className="text-black text-xl md:text-2xl font-light tracking-tight">{item.name}</h4>
				</div>
				<Link
					href={`/collection/${categoryKey}`}
					className="inline-flex items-center justify-center border border-black px-5 py-3 text-xs tracking-[0.3em] uppercase transition-all duration-300 hover:bg-black hover:text-white"
				>
					Shop Now
				</Link>
			</div>
		</motion.div>
	);
}

function ProductGrid({ items, categoryKey }: { items: CollectionItem[]; categoryKey: CategoryKey }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
			{items.map((item) => (
				<div key={item.name} className="group border border-black/10 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
					<div className={`relative overflow-hidden aspect-[4/5] bg-gradient-to-br ${item.accent} mb-4`}>
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.45),_transparent_40%)]" />
						<div className="absolute top-4 left-4 bg-white text-black text-[9px] tracking-[0.2em] uppercase px-2 py-1">
							{item.category}
						</div>
						<div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
							<span className="text-white/80 text-[10px] tracking-[0.3em] uppercase">yumie</span>
							<span className="text-white text-sm">{item.price}</span>
						</div>
					</div>
					<p className="text-black/40 text-[10px] tracking-[0.3em] uppercase mb-1">{item.category}</p>
					<h4 className={`${playfair.className} text-2xl text-black mb-3`}>{item.name}</h4>
					<Link
						href={`/collection/${categoryKey}`}
						className="block w-full text-center border border-black px-4 py-3 text-xs tracking-[0.3em] uppercase transition-all duration-300 hover:bg-black hover:text-white"
					>
						View Item
					</Link>
				</div>
			))}
		</div>
	);
}

export default function CollectionPage() {
	const [activeCategory, setActiveCategory] = useState<CategoryKey>("men");

	const selected = useMemo(
		() => categories.find((category) => category.key === activeCategory) ?? categories[0],
		[activeCategory]
	);

	return (
		<main className="min-h-screen bg-white text-black">
			<section className="border-b border-black/10 px-6 md:px-10 py-6">
				<div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
					<div>
						<p className="text-black/40 text-[10px] tracking-[0.4em] uppercase mb-2">Collections</p>
						<h1 className={`${playfair.className} text-3xl md:text-4xl`}>Choose your edit</h1>
					</div>
					<Link
						href="/"
						className="text-[10px] tracking-[0.3em] uppercase border border-black px-4 py-3 transition-all duration-300 hover:bg-black hover:text-white"
					>
						Back Home
					</Link>
				</div>
			</section>

			<section className="px-6 md:px-10 py-10 md:py-14">
				<div className="max-w-7xl mx-auto">
					<div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 md:gap-8 items-start">
						<div className="grid gap-4">
							<motion.div
								initial={{ opacity: 0, y: 14 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								className="border border-black/10 bg-black text-white p-6 md:p-8"
							>
								<p className="text-white/50 text-[10px] tracking-[0.4em] uppercase mb-4">Category Selector</p>
								<h2 className={`${playfair.className} text-4xl md:text-6xl leading-none max-w-xl`}>
									Men, Women, Kids.
								</h2>
								<p className="mt-5 max-w-xl text-white/70 text-sm md:text-base leading-relaxed">
									Move through the collection by category and preview the current selection in a clean editorial layout.
								</p>
							</motion.div>

							<div className="grid md:grid-cols-3 gap-4">
								{categories.map((category) => (
									<CategoryCard
										key={category.key}
										category={category}
										active={selected.key === category.key}
										onSelect={() => setActiveCategory(category.key)}
									/>
								))}
							</div>
						</div>

						<div className="grid gap-5">
							<div className="border border-black/10 p-6 md:p-8">
								<div className="flex items-start justify-between gap-4 mb-6">
									<div>
										<p className="text-black/40 text-[10px] tracking-[0.4em] uppercase mb-2">Selected Edit</p>
										<h3 className={`${playfair.className} text-3xl md:text-4xl`}>{selected.label}</h3>
									</div>
									<span className="text-[10px] tracking-[0.3em] uppercase border border-black px-3 py-2">
										{selected.productCount}
									</span>
								</div>

								<AnimatePresence mode="wait">
									<ProductPreview key={selected.key} item={selected.spotlight} categoryKey={selected.key} />
								</AnimatePresence>
							</div>

							<div className="border border-black/10 p-6 md:p-8 bg-[#fafafa]">
								<div className="flex items-center justify-between gap-4 mb-5">
									<div>
										<p className="text-black/40 text-[10px] tracking-[0.4em] uppercase mb-1">Featured Products</p>
										<h4 className="text-xl md:text-2xl font-light tracking-tight">{selected.label} selection</h4>
									</div>
									<span className="text-[10px] tracking-[0.3em] uppercase text-black/50">Updated weekly</span>
								</div>

								<ProductGrid items={selected.items} categoryKey={selected.key} />
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
