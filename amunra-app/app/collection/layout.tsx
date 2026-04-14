"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { CART_UPDATED_EVENT, getCartCount, readCartItems } from "./cart-storage";

function CollectionTopBar() {
	const [cartCount, setCartCount] = useState(0);

	useEffect(() => {
		const syncCartCount = () => {
			setCartCount(getCartCount(readCartItems()));
		};

		syncCartCount();
		window.addEventListener(CART_UPDATED_EVENT, syncCartCount);
		window.addEventListener("storage", syncCartCount);

		return () => {
			window.removeEventListener(CART_UPDATED_EVENT, syncCartCount);
			window.removeEventListener("storage", syncCartCount);
		};
	}, []);

	return (
		<header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur">
			<div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
				<div className="flex items-center gap-3">
					<Link href="/" className="text-[10px] uppercase tracking-[0.3em] text-black/60 transition-all hover:text-black">
						Home
					</Link>
					<span className="h-4 w-px bg-black/20" />
					<Link href="/collection" className="text-[10px] uppercase tracking-[0.3em] text-black transition-all hover:opacity-70">
						Collection
					</Link>
				</div>

				<Link
					href="/collection/cart"
					className="inline-flex items-center gap-2 border border-black px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black transition-all hover:bg-black hover:text-white"
				>
					<span className="h-1.5 w-1.5 rounded-full bg-black" />
					<span>Cart ({cartCount})</span>
				</Link>
			</div>
		</header>
	);
}

function CollectionFooter() {
	const links = {
		Shop: ["New Arrivals", "Tops", "Bottoms", "Outerwear", "Accessories"],
		Info: ["About Us", "Sustainability", "Collaborations", "Press"],
		Support: ["Sizing Guide", "Returns", "Shipping", "Contact Us"],
	};

	return (
		<footer className="border-t border-white/10 bg-black px-6 pb-10 pt-20 md:px-16">
			<div className="mx-auto w-full max-w-7xl">
				<div className="mb-20 grid grid-cols-2 gap-12 md:grid-cols-4">
					<div className="col-span-2 md:col-span-1">
						<div className="mb-4 inline-flex items-center justify-center border border-white/10 bg-white p-1 shadow-sm">
							<Image
								src="/Yumie.png"
								alt="yumie logo"
								width={220}
								height={110}
								className="h-12 w-auto"
							/>
						</div>
						<p className="max-w-48 text-xs leading-relaxed tracking-wide text-white/30">
							Avant-garde clothing for those who move in monochrome.
						</p>
						<div className="mt-6 flex gap-4">
							{["IG", "TK", "X"].map((social) => (
								<Link
									key={social}
									href="#"
									className="border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white/40 transition-all hover:opacity-70"
								>
									{social}
								</Link>
							))}
						</div>
					</div>

					{Object.entries(links).map(([section, items]) => (
						<div key={section}>
							<p className="mb-5 text-[9px] uppercase tracking-[0.4em] text-white/30">{section}</p>
							<ul className="space-y-3">
								{items.map((item) => (
									<li key={item}>
										<Link href="#" className="inline-block text-xs tracking-wide text-white/60 transition-all hover:opacity-70">
											{item}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
					<p className="text-[10px] uppercase tracking-[0.3em] text-white/20">© 2026 yumie. All rights reserved.</p>
					<div className="flex gap-6">
						{["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
							<Link key={item} href="#" className="text-[10px] uppercase tracking-[0.2em] text-white/20 transition-all hover:opacity-70">
								{item}
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}

export default function CollectionLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<CollectionTopBar />
			{children}
			<CollectionFooter />
		</>
	);
}
