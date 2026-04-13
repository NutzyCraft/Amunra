import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
			<div
				className="absolute inset-0 opacity-[0.03] pointer-events-none"
				style={{
					backgroundImage:
						"linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
					backgroundSize: "80px 80px",
				}}
			/>

			<header className="relative z-10 px-6 md:px-10 py-6 border-b border-white/10">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					<Link href="/" className="inline-flex items-center">
						<Image
							src="/Yumie.png"
							alt="yumie logo"
							width={170}
							height={85}
							priority
							className="h-10 w-auto"
						/>
					</Link>
					<p className="text-white/40 text-[10px] tracking-[0.3em] uppercase">Member Portal</p>
				</div>
			</header>

			<main className="relative z-10">{children}</main>
		</div>
	);
}
