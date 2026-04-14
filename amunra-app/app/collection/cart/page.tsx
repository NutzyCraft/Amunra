"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
	CART_UPDATED_EVENT,
	getCartCount,
	readCartItems,
	writeCartItems,
	type CartItem,
} from "../cart-storage";

function parsePrice(price: string): number {
	const numeric = Number.parseFloat(price.replace(/[^0-9.]/g, ""));
	return Number.isFinite(numeric) ? numeric : 0;
}

function formatCurrency(value: number): string {
	return `$${value.toFixed(2)}`;
}

export default function CartPage() {
	const [items, setItems] = useState<CartItem[]>([]);

	useEffect(() => {
		const syncItems = () => {
			setItems(readCartItems());
		};

		syncItems();
		window.addEventListener(CART_UPDATED_EVENT, syncItems);
		window.addEventListener("storage", syncItems);

		return () => {
			window.removeEventListener(CART_UPDATED_EVENT, syncItems);
			window.removeEventListener("storage", syncItems);
		};
	}, []);

	const itemCount = useMemo(() => getCartCount(items), [items]);
	const subtotal = useMemo(
		() => items.reduce((total, item) => total + parsePrice(item.price) * item.quantity, 0),
		[items]
	);

	const removeItem = (id: string) => {
		const nextItems = items.filter((item) => item.id !== id);
		writeCartItems(nextItems);
		setItems(nextItems);
	};

	const clearCart = () => {
		writeCartItems([]);
		setItems([]);
	};

	return (
		<main className="min-h-screen bg-white px-6 py-10 text-black md:px-10 md:py-14">
			<div className="mx-auto w-full max-w-7xl">
				<div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
					<div>
						<p className="mb-2 text-[10px] uppercase tracking-[0.4em] text-black/40">Cart</p>
						<h1 className="text-4xl font-light tracking-tight md:text-5xl">Your Cart</h1>
						<p className="mt-3 text-sm text-black/60">{itemCount} item(s) currently in cart</p>
					</div>
					<div className="flex gap-3">
						<Link
							href="/collection"
							className="border border-black px-4 py-3 text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-black hover:text-white"
						>
							Continue Shopping
						</Link>
						<button
							type="button"
							onClick={clearCart}
							disabled={items.length === 0}
							className="border border-black/20 px-4 py-3 text-[10px] uppercase tracking-[0.3em] transition-all hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
						>
							Clear Cart
						</button>
					</div>
				</div>

				{items.length === 0 ? (
					<div className="border border-black/10 bg-[#fafafa] p-10 text-center">
						<p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-black/40">Nothing here yet</p>
						<p className="mb-6 text-sm text-black/60">Add pieces from any product page to see them here.</p>
						<Link
							href="/collection"
							className="inline-flex border border-black px-5 py-3 text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-black hover:text-white"
						>
							Browse Collection
						</Link>
					</div>
				) : (
					<div className="grid gap-6 lg:grid-cols-[1fr_320px]">
						<div className="grid gap-4">
							{items.map((item) => (
								<article key={`${item.id}-${item.addedAt}`} className="border border-black/10 p-5">
									<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
										<div>
											<p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-black/40">{item.category} / {item.type}</p>
											<h2 className="text-2xl font-light tracking-tight">{item.name}</h2>
											<p className="mt-2 text-xs uppercase tracking-[0.25em] text-black/55">Size {item.size} · Qty {item.quantity}</p>
										</div>

										<div className="flex items-center gap-6">
											<p className="text-lg">{formatCurrency(parsePrice(item.price) * item.quantity)}</p>
											<button
												type="button"
												onClick={() => removeItem(item.id)}
												className="border border-black/20 px-3 py-2 text-[10px] uppercase tracking-[0.2em] transition-all hover:border-black hover:bg-black hover:text-white"
											>
												Remove
											</button>
										</div>
									</div>
								</article>
							))}
						</div>

						<aside className="h-fit border border-black/10 bg-[#fafafa] p-6">
							<p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-black/40">Summary</p>
							<div className="mb-3 flex items-center justify-between text-sm text-black/60">
								<span>Items</span>
								<span>{itemCount}</span>
							</div>
							<div className="mb-6 flex items-center justify-between border-b border-black/10 pb-4 text-sm text-black/60">
								<span>Shipping</span>
								<span>Calculated at checkout</span>
							</div>
							<div className="mb-6 flex items-center justify-between text-lg">
								<span>Subtotal</span>
								<span>{formatCurrency(subtotal)}</span>
							</div>
							<button
								type="button"
								className="w-full border border-black bg-black px-4 py-3 text-[10px] uppercase tracking-[0.3em] text-white transition-all hover:bg-white hover:text-black"
							>
								Checkout
							</button>
						</aside>
					</div>
				)}
			</div>
		</main>
	);
}
