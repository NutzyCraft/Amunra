"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function RegisterPage() {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	return (
		<section className="min-h-[calc(100vh-89px)] px-6 md:px-10 py-12 md:py-20">
			<div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-stretch">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease: EASE }}
					className="border border-white/10 bg-white/[0.02] p-8 md:p-10"
				>
					<p className="text-white/35 text-[10px] tracking-[0.45em] uppercase mb-5">Join Yumie</p>
					<h1 className="text-white text-4xl md:text-5xl font-light tracking-tight mb-6">Create Account</h1>
					<p className="text-white/50 text-sm leading-relaxed max-w-md">
						Sign up to get insider access to new drops, save your favorites, and track every order in one place.
					</p>

					<div className="mt-12 space-y-5">
						<div className="border border-white/10 p-4">
							<p className="text-white/35 text-[10px] tracking-[0.3em] uppercase mb-2">Early Access</p>
							<p className="text-white/70 text-sm">Be first in line for limited releases and seasonal edits.</p>
						</div>
						<div className="border border-white/10 p-4">
							<p className="text-white/35 text-[10px] tracking-[0.3em] uppercase mb-2">Order Tracking</p>
							<p className="text-white/70 text-sm">See shipping status and full order history anytime.</p>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
					className="border border-white/10 bg-[#0f0f0f] p-8 md:p-10"
				>
					<form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
						<div>
							<label className="block text-white/35 text-[10px] tracking-[0.35em] uppercase mb-3">Full Name</label>
							<input
								type="text"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								placeholder="Your name"
								required
								className="w-full bg-transparent border border-white/15 px-4 py-3 text-white text-sm placeholder:text-white/25 outline-none focus:border-white/45 transition-colors"
							/>
						</div>

						<div>
							<label className="block text-white/35 text-[10px] tracking-[0.35em] uppercase mb-3">Email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								required
								className="w-full bg-transparent border border-white/15 px-4 py-3 text-white text-sm placeholder:text-white/25 outline-none focus:border-white/45 transition-colors"
							/>
						</div>

						<div>
							<label className="block text-white/35 text-[10px] tracking-[0.35em] uppercase mb-3">Password</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Create password"
								required
								className="w-full bg-transparent border border-white/15 px-4 py-3 text-white text-sm placeholder:text-white/25 outline-none focus:border-white/45 transition-colors"
							/>
						</div>

						<div>
							<label className="block text-white/35 text-[10px] tracking-[0.35em] uppercase mb-3">Confirm Password</label>
							<input
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="Confirm password"
								required
								className="w-full bg-transparent border border-white/15 px-4 py-3 text-white text-sm placeholder:text-white/25 outline-none focus:border-white/45 transition-colors"
							/>
						</div>

						<label className="inline-flex items-start gap-2 text-white/55 text-xs tracking-wide pt-1 leading-relaxed">
							<input type="checkbox" required className="mt-0.5 h-4 w-4 border-white/30 bg-transparent" />
							I agree to the Terms of Service and Privacy Policy.
						</label>

						<motion.button
							type="submit"
							whileHover={{ backgroundColor: "#fff", color: "#0a0a0a" }}
							whileTap={{ scale: 0.99 }}
							className="w-full mt-2 border border-white text-white py-3.5 text-xs tracking-[0.3em] uppercase transition-colors"
						>
							Create Account
						</motion.button>

						<p className="text-center text-white/45 text-xs tracking-wide pt-3">
							Already have an account?{" "}
							<Link href="/auth/login" className="text-white hover:opacity-70 transition-opacity">
								Log in
							</Link>
						</p>
					</form>
				</motion.div>
			</div>
		</section>
	);
}
