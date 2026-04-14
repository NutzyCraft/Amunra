"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function getUserName(payload: unknown, fallbackEmail: string) {
	if (!payload || typeof payload !== "object") {
		return fallbackEmail.split("@")[0] || "Member";
	}

	const source = payload as Record<string, unknown>;
	const userCandidate =
		(source.user as Record<string, unknown> | undefined) ||
		(source.account as Record<string, unknown> | undefined) ||
		(source.profile as Record<string, unknown> | undefined) ||
		((source.session as Record<string, unknown> | undefined)?.user as Record<string, unknown> | undefined);

	const possibleNames = [
		userCandidate?.name,
		userCandidate?.fullName,
		userCandidate?.full_name,
		source.name,
		source.fullName,
		source.full_name,
	];

	for (const value of possibleNames) {
		if (typeof value === "string" && value.trim()) {
			return value.trim();
		}
	}

	return fallbackEmail.split("@")[0] || "Member";
}

function getUserEmail(payload: unknown, fallbackEmail: string) {
	if (!payload || typeof payload !== "object") {
		return fallbackEmail;
	}

	const source = payload as Record<string, unknown>;
	const userCandidate =
		(source.user as Record<string, unknown> | undefined) ||
		(source.account as Record<string, unknown> | undefined) ||
		((source.session as Record<string, unknown> | undefined)?.user as Record<string, unknown> | undefined);

	const possibleEmails = [userCandidate?.email, source.email];

	for (const value of possibleEmails) {
		if (typeof value === "string" && value.trim()) {
			return value.trim().toLowerCase();
		}
	}

	return fallbackEmail;
}

function getUserId(payload: unknown) {
	if (!payload || typeof payload !== "object") {
		return "";
	}

	const source = payload as Record<string, unknown>;
	const userCandidate =
		(source.user as Record<string, unknown> | undefined) ||
		(source.account as Record<string, unknown> | undefined) ||
		((source.session as Record<string, unknown> | undefined)?.user as Record<string, unknown> | undefined);

	const possibleIds = [
		userCandidate?.id,
		userCandidate?.userId,
		userCandidate?.user_id,
		source.id,
		source.userId,
		source.user_id,
	];

	for (const value of possibleIds) {
		if (typeof value === "string" && value.trim()) {
			return value.trim();
		}
	}

	return "";
}

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const response = await fetch("/api/auth", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data?.message || "Login failed. Please check your credentials.");
				return;
			}

			const payload = data?.data;
			const normalizedEmail = getUserEmail(payload, email.trim().toLowerCase());
			const name = getUserName(payload, normalizedEmail);
			const id = getUserId(payload);

			localStorage.setItem(
				"amunra_current_user",
				JSON.stringify({
					id,
					name,
					email: normalizedEmail,
				})
			);

			router.push("/auth/account");
		} catch {
			setError("An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className="min-h-[calc(100vh-89px)] px-6 md:px-10 py-12 md:py-20">
			<div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-stretch">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease: EASE }}
					className="border border-white/10 bg-white/[0.02] p-8 md:p-10"
				>
					<p className="text-white/35 text-[10px] tracking-[0.45em] uppercase mb-5">Welcome Back</p>
					<h1 className="text-white text-4xl md:text-5xl font-light tracking-tight mb-6">Log In</h1>
					<p className="text-white/50 text-sm leading-relaxed max-w-md">
						Access your yumie account to view orders, save favorites, and get early access to upcoming drops.
					</p>

					<div className="mt-12 space-y-5">
						<div className="border border-white/10 p-4">
							<p className="text-white/35 text-[10px] tracking-[0.3em] uppercase mb-2">Members Perk</p>
							<p className="text-white/70 text-sm">Priority access to limited releases and members-only edits.</p>
						</div>
						<div className="border border-white/10 p-4">
							<p className="text-white/35 text-[10px] tracking-[0.3em] uppercase mb-2">Fast Checkout</p>
							<p className="text-white/70 text-sm">Saved addresses and payment details for a seamless checkout.</p>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
					className="border border-white/10 bg-[#0f0f0f] p-8 md:p-10"
				>
					<form className="space-y-5" onSubmit={handleSubmit}>
						{error && (
							<div className="bg-red-500/10 border border-red-500/30 p-3 rounded text-red-400 text-xs">{error}</div>
						)}

						<div>
							<label className="block text-white/35 text-[10px] tracking-[0.35em] uppercase mb-3">Email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								required
								disabled={isLoading}
								className="w-full bg-transparent border border-white/15 px-4 py-3 text-white text-sm placeholder:text-white/25 outline-none focus:border-white/45 transition-colors disabled:opacity-50"
							/>
						</div>

						<div>
							<label className="block text-white/35 text-[10px] tracking-[0.35em] uppercase mb-3">Password</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								required
								disabled={isLoading}
								className="w-full bg-transparent border border-white/15 px-4 py-3 text-white text-sm placeholder:text-white/25 outline-none focus:border-white/45 transition-colors disabled:opacity-50"
							/>
						</div>

						<div className="flex items-center justify-between pt-1">
							<label className="inline-flex items-center gap-2 text-white/60 text-xs tracking-wide">
								<input type="checkbox" className="h-4 w-4 border-white/30 bg-transparent" />
								Remember me
							</label>
							<Link
								href="/auth/resetPassword"
								className="text-white/45 text-[11px] tracking-[0.2em] uppercase hover:text-white/80 transition-colors"
							>
								Forgot?
							</Link>
						</div>

						<motion.button
							type="submit"
							disabled={isLoading}
							whileHover={!isLoading ? { backgroundColor: "#fff", color: "#0a0a0a" } : {}}
							whileTap={!isLoading ? { scale: 0.99 } : {}}
							className="w-full mt-3 border border-white text-white py-3.5 text-xs tracking-[0.3em] uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? "Logging In..." : "Log In"}
						</motion.button>

						<p className="text-center text-white/45 text-xs tracking-wide pt-3">
							New here?{" "}
							<Link href="/auth/register" className="text-white hover:opacity-70 transition-opacity">
								Create an account
							</Link>
						</p>
					</form>
				</motion.div>
			</div>
		</section>
	);
}
