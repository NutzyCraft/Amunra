"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

type OrderRow = {
	orderNo: string;
	date: string;
	paymentStatus: string;
	fulfillmentStatus: string;
	total: string;
};

type LoggedUser = {
	id?: string;
	name: string;
	email: string;
};

type AddressForm = {
	fullName: string;
	phone: string;
	line1: string;
	line2: string;
	city: string;
	postalCode: string;
};

const EMPTY_ADDRESS: AddressForm = {
	fullName: "",
	phone: "",
	line1: "",
	line2: "",
	city: "",
	postalCode: "",
};

const noopSubscribe = () => () => {};

function loadCurrentUser(): LoggedUser | null {
	if (typeof window === "undefined") {
		return null;
	}

	try {
		const raw = localStorage.getItem("amunra_current_user");
		if (!raw) return null;

		const parsed = JSON.parse(raw) as LoggedUser;
		if (!parsed?.email) return null;

		return {
			id: parsed.id,
			name: parsed.name || parsed.email.split("@")[0] || "Member",
			email: parsed.email.toLowerCase(),
		};
	} catch {
		return null;
	}
}

function loadOrders(user: LoggedUser | null): OrderRow[] {
	if (!user || typeof window === "undefined") {
		return [];
	}

	try {
		const raw = localStorage.getItem(`amunra_orders_${user.email}`);
		if (!raw) return [];

		const parsed = JSON.parse(raw) as OrderRow[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

const BENEFITS = [
	{
		title: "Shipping",
		description: "Standard shipping (Estimated 3-5 days)",
		icon: (
			<svg viewBox="0 0 48 48" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="2.8">
				<rect x="4" y="18" width="24" height="18" rx="2" />
				<path d="M28 22h8l8 8v6h-4" />
				<circle cx="14" cy="36" r="3.5" />
				<circle cx="36" cy="36" r="3.5" />
				<path d="M8 24h8" />
				<path d="M2 20h8" />
			</svg>
		),
	},
	{
		title: "Payments",
		description: "Payment is 100% secure",
		icon: (
			<svg viewBox="0 0 48 48" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="2.8">
				<path d="M24 4 10 9v12c0 10 6 16 14 19 8-3 14-9 14-19V9L24 4Z" />
				<circle cx="24" cy="20" r="4" />
				<path d="M16 32c2-4 5-6 8-6s6 2 8 6" />
			</svg>
		),
	},
	{
		title: "Easy Returns",
		description: "30 days to change your mind!",
		icon: (
			<svg viewBox="0 0 48 48" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="2.8">
				<path d="M20 14 8 24l12 10" />
				<path d="M10 24h26v14H14" />
			</svg>
		),
	},
	{
		title: "Made in Sri Lanka",
		description: "Sustainably Sourced",
		icon: (
			<svg viewBox="0 0 48 48" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="2.8">
				<path d="M24 40v-9" />
				<path d="M24 31c7 0 13-5 13-11a9 9 0 0 0-18-2 8 8 0 0 0-12 7c0 3 2 6 4 7 3 2 8 2 13 2Z" />
				<path d="m24 31-4-4" />
				<path d="m24 31 4-4" />
			</svg>
		),
	},
];

export default function AccountPage() {
	const router = useRouter();
	const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
	const user = isClient ? loadCurrentUser() : null;
	const orders = isClient ? loadOrders(user) : [];
	const userKey = user?.id || user?.email || "";
	const [addressDraft, setAddressDraft] = useState<AddressForm>(EMPTY_ADDRESS);
	const [addressRecordId, setAddressRecordId] = useState<number | null>(null);
	const [isAddressLoading, setIsAddressLoading] = useState(false);
	const [isEditingAddress, setIsEditingAddress] = useState(true);
	const [addressError, setAddressError] = useState("");
	const [addressSaved, setAddressSaved] = useState(false);
	const hasSavedAddress = addressRecordId !== null;

	useEffect(() => {
		if (isClient && !user) {
			router.push("/auth/login");
		}
	}, [isClient, router, user]);

	useEffect(() => {
		if (!isClient || !userKey) {
			return;
		}

		let active = true;

		const loadSavedAddress = async () => {
			setIsAddressLoading(true);
			setAddressError("");

			try {
				const params = new URLSearchParams();
				if (user?.id) {
					params.set("userId", user.id);
				}
				if (user?.email) {
					params.set("email", user.email);
				}

				const response = await fetch(`/api/address?${params.toString()}`);
				const data = await response.json();

				if (!active) {
					return;
				}

				if (!response.ok) {
					setAddressError(data?.message || "Unable to load address.");
					setAddressRecordId(null);
					setIsEditingAddress(true);
					return;
				}

				const saved = data?.data;
				if (!saved) {
					setAddressRecordId(null);
					setAddressDraft(EMPTY_ADDRESS);
					setIsEditingAddress(true);
					return;
				}

				setAddressRecordId(Number(saved.id));
				setAddressDraft({
					fullName: saved.name || "",
					phone: saved.phone || "",
					line1: saved.line1 || "",
					line2: saved.line2 || "",
					city: saved.city || "",
					postalCode: String(saved.postalCode || ""),
				});
				setIsEditingAddress(false);
			} catch {
				if (!active) {
					return;
				}

				setAddressError("Unable to load address.");
			} finally {
				if (active) {
					setIsAddressLoading(false);
				}
			}
		};

		loadSavedAddress();

		return () => {
			active = false;
		};
	}, [isClient, user?.email, user?.id, userKey]);

	const orderCount = orders.length;
	const hasOrders = orderCount > 0;

	const displayName = user?.name || "Member";

	const handleAddressChange = (field: keyof AddressForm, value: string) => {
		setAddressSaved(false);
		setAddressError("");
		setAddressDraft((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleAddressSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		setAddressSaved(false);
		setAddressError("");

		try {
			const response = await fetch("/api/address", {
				method: hasSavedAddress ? "PUT" : "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: user.id,
					email: user.email,
					name: addressDraft.fullName,
					phone: addressDraft.phone,
					line1: addressDraft.line1,
					line2: addressDraft.line2,
					city: addressDraft.city,
					postalCode: addressDraft.postalCode,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				setAddressError(data?.message || "Unable to save address.");
				return;
			}

			const saved = data?.data;
			if (saved) {
				setAddressRecordId(Number(saved.id));
				setAddressDraft({
					fullName: saved.name || "",
					phone: saved.phone || "",
					line1: saved.line1 || "",
					line2: saved.line2 || "",
					city: saved.city || "",
					postalCode: String(saved.postalCode || ""),
				});
			}

			setIsEditingAddress(false);
			setAddressSaved(true);
		} catch {
			setAddressError("Unable to save address.");
		}
	};

	if (!user) {
		return <section className="min-h-[calc(100vh-89px)] bg-[#efefef]" />;
	}

	return (
		<section className="min-h-[calc(100vh-89px)] bg-[#efefef] text-[#06080d] px-6 md:px-10 py-10 md:py-12">
			<div className="mx-auto w-full max-w-[1320px]">
				<header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
					<h1 className="text-[2.85rem] leading-none tracking-tight font-light">My account</h1>
					<div className="flex flex-wrap items-center gap-5 pt-2 text-lg">
						<p className="font-light">Welcome back, {displayName}!</p>
						<Link href="/auth/login" className="font-semibold underline underline-offset-4 hover:opacity-70 transition-opacity">
							Log out
						</Link>
					</div>
				</header>

				<div className="mt-14 flex items-center gap-5">
					<div className="rounded-[14px] bg-black text-white text-[2rem] leading-none tracking-tight px-6 py-3">My orders</div>
				</div>

				<section className="mt-14 border-y border-[#d6d6d6]">
					<div className="py-8">
						<h2 className="text-[2.2rem] tracking-tight font-light">My orders ({orderCount})</h2>
					</div>

					{hasOrders ? (
						<div className="w-full overflow-x-auto">
							<table className="w-full min-w-[860px] border-collapse">
								<thead>
									<tr className="border-t border-[#d6d6d6] border-b border-[#d6d6d6] text-left">
										<th className="py-8 px-5 text-[2.35rem] tracking-tight font-semibold">Order</th>
										<th className="py-8 px-5 text-[2.35rem] tracking-tight font-semibold">Date</th>
										<th className="py-8 px-5 text-[2.35rem] tracking-tight font-semibold">Payment status</th>
										<th className="py-8 px-5 text-[2.35rem] tracking-tight font-semibold">Fulfillment status</th>
										<th className="py-8 px-5 text-right text-[2.35rem] tracking-tight font-semibold">Total</th>
									</tr>
								</thead>
								<tbody>
									{orders.map((row) => (
										<tr key={row.orderNo} className="border-b border-[#d6d6d6]">
											<td className="px-5 py-10 text-[2rem]">
												<span className="inline-flex items-center rounded-full border border-[#d0d0d0] bg-[#f5f5f5] px-5 py-2.5 leading-none">
													{row.orderNo}
												</span>
											</td>
											<td className="px-5 py-10 text-[2rem] font-light">{row.date}</td>
											<td className="px-5 py-10 text-[2rem] font-light">{row.paymentStatus}</td>
											<td className="px-5 py-10 text-[2rem] font-light">{row.fulfillmentStatus}</td>
											<td className="px-5 py-10 text-right text-[2rem] font-light">{row.total}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className="border-t border-[#d6d6d6] py-14 px-5 text-[1.2rem] text-[#4f5b69]">
							No orders yet for this account.
						</div>
					)}
				</section>

				<section className="mt-12 border border-[#d6d6d6] bg-[#f5f5f5] p-6 md:p-8">
					<div className="mb-8">
						<h3 className="text-[2rem] tracking-tight font-light">Save your address</h3>
						<p className="mt-2 text-sm text-[#4f5b69]">Address data is now stored in your account.</p>
					</div>

					{isAddressLoading ? (
						<p className="text-sm text-[#4f5b69]">Loading saved address...</p>
					) : hasSavedAddress && !isEditingAddress ? (
						<div className="border border-[#d0d0d0] bg-white p-5">
							<p className="text-sm text-[#4f5b69]">{addressDraft.fullName}</p>
							<p className="text-sm text-[#4f5b69]">{addressDraft.phone}</p>
							<p className="mt-3 text-sm text-[#4f5b69]">{addressDraft.line1}</p>
							{addressDraft.line2 && <p className="text-sm text-[#4f5b69]">{addressDraft.line2}</p>}
							<p className="text-sm text-[#4f5b69]">
								{addressDraft.city} {addressDraft.postalCode}
							</p>

							<div className="mt-5 flex items-center gap-4">
								<button
									type="button"
									onClick={() => {
										setAddressSaved(false);
										setAddressError("");
										setIsEditingAddress(true);
									}}
									className="inline-flex items-center justify-center border border-black px-6 py-3 text-xs tracking-[0.25em] uppercase hover:bg-black hover:text-white transition-colors"
								>
									Edit Address
								</button>
								{addressSaved && <p className="text-sm text-[#2f6f4f]">Address saved successfully.</p>}
							</div>
						</div>
					) : (
						<form onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
							<input
								type="text"
								placeholder="Full name"
								value={addressDraft.fullName}
								onChange={(e) => handleAddressChange("fullName", e.target.value)}
								required
								className="w-full bg-white border border-[#d0d0d0] px-4 py-3 text-sm outline-none focus:border-[#7a7a7a] transition-colors"
							/>
							<input
								type="tel"
								placeholder="Phone number"
								value={addressDraft.phone}
								onChange={(e) => handleAddressChange("phone", e.target.value)}
								required
								className="w-full bg-white border border-[#d0d0d0] px-4 py-3 text-sm outline-none focus:border-[#7a7a7a] transition-colors"
							/>
							<input
								type="text"
								placeholder="Address line 1"
								value={addressDraft.line1}
								onChange={(e) => handleAddressChange("line1", e.target.value)}
								required
								className="md:col-span-2 w-full bg-white border border-[#d0d0d0] px-4 py-3 text-sm outline-none focus:border-[#7a7a7a] transition-colors"
							/>
							<input
								type="text"
								placeholder="Address line 2 (optional)"
								value={addressDraft.line2}
								onChange={(e) => handleAddressChange("line2", e.target.value)}
								className="md:col-span-2 w-full bg-white border border-[#d0d0d0] px-4 py-3 text-sm outline-none focus:border-[#7a7a7a] transition-colors"
							/>
							<input
								type="text"
								placeholder="City"
								value={addressDraft.city}
								onChange={(e) => handleAddressChange("city", e.target.value)}
								required
								className="w-full bg-white border border-[#d0d0d0] px-4 py-3 text-sm outline-none focus:border-[#7a7a7a] transition-colors"
							/>
							<input
								type="text"
								placeholder="Postal code"
								value={addressDraft.postalCode}
								onChange={(e) => handleAddressChange("postalCode", e.target.value)}
								required
								className="w-full bg-white border border-[#d0d0d0] px-4 py-3 text-sm outline-none focus:border-[#7a7a7a] transition-colors"
							/>

							<div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
								<button
									type="submit"
									className="inline-flex items-center justify-center border border-black bg-black text-white px-6 py-3 text-xs tracking-[0.25em] uppercase hover:bg-transparent hover:text-black transition-colors"
								>
									{hasSavedAddress ? "Update Address" : "Save Address"}
								</button>
								{hasSavedAddress && (
									<button
										type="button"
										onClick={() => setIsEditingAddress(false)}
										className="inline-flex items-center justify-center border border-black px-6 py-3 text-xs tracking-[0.25em] uppercase hover:bg-black hover:text-white transition-colors"
									>
										Cancel
									</button>
								)}
								{addressSaved && <p className="text-sm text-[#2f6f4f]">Address saved successfully.</p>}
								{addressError && <p className="text-sm text-red-600">{addressError}</p>}
							</div>
						</form>
					)}
				</section>

				<section className="mt-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-12 md:gap-10">
					{BENEFITS.map((benefit) => (
						<div key={benefit.title} className="text-center">
							<div className="inline-flex items-center justify-center text-black">{benefit.icon}</div>
							<h3 className="mt-7 text-[2.05rem] tracking-tight font-semibold">{benefit.title}</h3>
							<p className="mt-4 text-[2rem] tracking-tight font-light">{benefit.description}</p>
						</div>
					))}
				</section>
			</div>
		</section>
	);
}
