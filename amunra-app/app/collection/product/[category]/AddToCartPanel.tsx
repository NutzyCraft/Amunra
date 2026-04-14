"use client";

import { useState } from "react";
import { addItemToCart, type CartCategory } from "../../cart-storage";

const sizes = ["XS", "S", "M", "L", "XL"];

type AddToCartPanelProps = {
	productName: string;
	productPrice: string;
	productType: string;
	category: CartCategory;
};

export default function AddToCartPanel({
	productName,
	productPrice,
	productType,
	category,
}: AddToCartPanelProps) {
	const [selectedSize, setSelectedSize] = useState("M");
	const [quantity, setQuantity] = useState(1);
	const [feedback, setFeedback] = useState("");

	const decrementQuantity = () => {
		setQuantity((current) => Math.max(1, current - 1));
	};

	const incrementQuantity = () => {
		setQuantity((current) => current + 1);
	};

	const handleAddToCart = () => {
		addItemToCart({
			name: productName,
			price: productPrice,
			type: productType,
			category,
			size: selectedSize,
			quantity,
		});
		setFeedback(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart`);
	};

	return (
		<>
			<div className="mb-8">
				<p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-black/40">Size</p>
				<div className="grid max-w-md grid-cols-5 gap-2">
					{sizes.map((size) => {
						const isSelected = size === selectedSize;
						return (
							<button
								key={size}
								type="button"
								onClick={() => setSelectedSize(size)}
								className={`border px-3 py-2 text-xs uppercase tracking-[0.2em] transition-all ${
									isSelected
										? "border-black bg-black text-white"
										: "border-black/20 hover:bg-black hover:text-white"
								}`}
							>
								{size}
							</button>
						);
					})}
				</div>
			</div>

			<div className="mb-8">
				<p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-black/40">Quantity</p>
				<div className="inline-flex items-center border border-black/20">
					<button
						type="button"
						onClick={decrementQuantity}
						className="px-4 py-2 text-black/60 transition-all hover:bg-black hover:text-white"
					>
						-
					</button>
					<span className="px-5 py-2 text-sm">{quantity}</span>
					<button
						type="button"
						onClick={incrementQuantity}
						className="px-4 py-2 text-black/60 transition-all hover:bg-black hover:text-white"
					>
						+
					</button>
				</div>
			</div>

			<div className="mb-2 flex flex-col gap-3 sm:flex-row">
				<button
					type="button"
					onClick={handleAddToCart}
					className="flex-1 border border-black bg-black px-5 py-3 text-xs uppercase tracking-[0.3em] text-white transition-all hover:bg-white hover:text-black"
				>
					Add to Cart
				</button>
				<button
					type="button"
					onClick={handleAddToCart}
					className="flex-1 border border-black px-5 py-3 text-xs uppercase tracking-[0.3em] transition-all hover:bg-black hover:text-white"
				>
					Buy Now
				</button>
			</div>

			{feedback ? (
				<p className="mb-8 text-[10px] uppercase tracking-[0.25em] text-black/60">{feedback}</p>
			) : (
				<div className="mb-8" />
			)}
		</>
	);
}
