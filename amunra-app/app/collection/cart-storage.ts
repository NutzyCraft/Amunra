export type CartCategory = "men" | "women" | "kids";

export type CartItem = {
	id: string;
	name: string;
	price: string;
	type: string;
	category: CartCategory;
	size: string;
	quantity: number;
	addedAt: number;
};

export const CART_STORAGE_KEY = "yumie-cart-items";
export const CART_UPDATED_EVENT = "yumie-cart-updated";

export function readCartItems(): CartItem[] {
	if (typeof window === "undefined") {
		return [];
	}

	const raw = window.localStorage.getItem(CART_STORAGE_KEY);
	if (!raw) {
		return [];
	}

	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
	} catch {
		return [];
	}
}

export function writeCartItems(items: CartItem[]): void {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
	window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function getCartCount(items: CartItem[] = readCartItems()): number {
	return items.reduce((total, item) => total + item.quantity, 0);
}

export function addItemToCart(input: {
	name: string;
	price: string;
	type: string;
	category: CartCategory;
	size: string;
	quantity: number;
}): void {
	const items = readCartItems();
	const existingIndex = items.findIndex(
		(item) =>
			item.name === input.name &&
			item.category === input.category &&
			item.type === input.type &&
			item.size === input.size
	);

	if (existingIndex >= 0) {
		items[existingIndex] = {
			...items[existingIndex],
			quantity: items[existingIndex].quantity + input.quantity,
		};
	} else {
		items.push({
			id: `${input.category}-${input.name}-${input.size}`,
			name: input.name,
			price: input.price,
			type: input.type,
			category: input.category,
			size: input.size,
			quantity: input.quantity,
			addedAt: Date.now(),
		});
	}

	writeCartItems(items);
}
