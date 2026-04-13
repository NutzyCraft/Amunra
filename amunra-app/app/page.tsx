"use client";

import { motion, useScroll, useTransform, useInView, AnimatePresence, animate } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

// ─── Animation Variants ────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: EASE },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const letterVariant = {
  hidden: { opacity: 0, y: 80, rotateX: -40 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

function BrandLogo({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/Yumie.png"
      alt="yumie logo"
      width={220}
      height={110}
      priority
      className={className}
    />
  );
}

// ─── Loader ────────────────────────────────────────────────────────────────────

function Loader({ onComplete }: { onComplete: () => void }) {
  const letters = "yumie".split("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 2.5,
      ease: "linear",
      onUpdate: (val) => setProgress(val),
      onComplete: () => {
        // Brief pause when the bar completes before sliding up
        setTimeout(onComplete, 400);
      },
    });

    return () => controls.stop();
  }, [onComplete]);

  return (
    <motion.div
      key="loader"
      initial={{ y: 0 }}
      // Sweeps the loading screen upwards smoothly like in the video
      exit={{ y: "-100vh", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center"
    >
      <div className="relative inline-flex flex-col items-center">
        <BrandLogo className="h-20 w-auto mb-5" />
        {/* Letters container */}
        <div className="flex text-white text-3xl md:text-5xl font-bold tracking-[0.3em] uppercase mb-4 pl-[0.3em]">
          {letters.map((char, index) => {
            // Calculate at which progress percentage this letter should appear
            const step = 100 / letters.length;
            const threshold = index * step;
            return (
              <span
                key={index}
                className={`transition-opacity duration-150 ${
                  progress > threshold ? "opacity-100" : "opacity-0"
                }`}
              >
                {char}
              </span>
            );
          })}
        </div>
        
        {/* Progress Bar Container */}
        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
          {/* The active progress fill */}
          <motion.div
            className="h-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { label: "Collection", href: "#collection" },
    { label: "New Arrivals", href: "#new-arrivals" },
    { label: "About", href: "#about" },
    { label: "Login", href: "/auth/login" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.5 }} // Added slight delay to wait for loader
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 transition-all duration-500 ${
          scrolled ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10" : ""
        }`}
      >
        {/* Logo */}
        <a href="#" className="text-white">
          <BrandLogo className="h-11 w-auto" />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              whileHover={{ opacity: 0.5 }}
              className="text-white/70 text-xs tracking-[0.2em] uppercase transition-all"
            >
              {item.label}
            </motion.a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="hidden md:block text-white/70 text-xs tracking-[0.2em] uppercase border border-white/20 px-5 py-2 hover:bg-white hover:text-black transition-all duration-300"
          >
            Cart (0)
          </motion.button>
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-1"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="block w-6 h-px bg-white"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-px bg-white"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="block w-6 h-px bg-white"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col items-center justify-center gap-10"
          >
            {navItems.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                onClick={() => setMenuOpen(false)}
                className="text-white text-4xl font-light tracking-[0.3em] uppercase hover:opacity-40 transition-opacity"
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const letters = "yumie".split("");

  return (
    <section ref={ref} className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Subtle grid bg */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Parallax content */}
      <motion.div style={{ y, opacity }} className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Brand name letters */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex overflow-hidden"
          style={{ perspective: "1000px" }}
        >
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              variants={letterVariant}
              className="text-white font-bold uppercase leading-none select-none"
              style={{
                fontSize: "clamp(5rem, 18vw, 18rem)",
                letterSpacing: "-0.02em",
                fontFamily: "var(--font-geist-sans)",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={7}
          className="text-white/40 text-xs md:text-sm tracking-[0.5em] uppercase mt-6"
        >
          Distinctly Yours
        </motion.p>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={9}
          className="mt-12 flex flex-col sm:flex-row gap-4 items-center"
        >
          <motion.a
            href="#collection"
            whileHover={{ backgroundColor: "#fff", color: "#0a0a0a" }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-4 border border-white text-white text-xs tracking-[0.3em] uppercase transition-all duration-300"
          >
            Explore Collection
          </motion.a>
          <motion.a
            href="#about"
            whileHover={{ opacity: 0.5 }}
            className="text-white/40 text-xs tracking-[0.25em] uppercase transition-all"
          >
            Our Story →
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-white/30 text-[10px] tracking-[0.4em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ─── Marquee ───────────────────────────────────────────────────────────────────

function Marquee() {
  const text = "NEW COLLECTION · SS25 · LIMITED DROPS · YUMIE · DISTINCTLY YOURS · ";
  const repeated = text.repeat(6);

  return (
    <div className="bg-white overflow-hidden py-4 border-y border-white/10">
      <div className="flex whitespace-nowrap marquee-track">
        <span className="text-black text-xs tracking-[0.3em] uppercase font-medium pr-0">
          {repeated}
        </span>
        <span className="text-black text-xs tracking-[0.3em] uppercase font-medium pr-0">
          {repeated}
        </span>
      </div>
    </div>
  );
}

// ─── Collection ────────────────────────────────────────────────────────────────

const products = [
  {
    id: 1,
    name: "Void Oversized Tee",
    category: "Essentials",
    price: "$89",
    tag: "NEW",
    shade: "#1a1a1a",
    accent: "#2a2a2a",
  },
  {
    id: 2,
    name: "Eclipse Cargo Pant",
    category: "Bottoms",
    price: "$195",
    tag: "BESTSELLER",
    shade: "#111",
    accent: "#222",
  },
  {
    id: 3,
    name: "Obsidian Coach Jacket",
    category: "Outerwear",
    price: "$340",
    tag: "LIMITED",
    shade: "#161616",
    accent: "#262626",
  },
  {
    id: 4,
    name: "Shadow Ribbed Knit",
    category: "Tops",
    price: "$135",
    tag: "NEW",
    shade: "#131313",
    accent: "#232323",
  },
];

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={index * 1.5}
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image placeholder */}
      <div
        className="relative overflow-hidden aspect-[3/4] mb-4"
        style={{ background: product.shade }}
      >
        {/* Accent lines to simulate clothing texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `repeating-linear-gradient(
              135deg,
              transparent,
              transparent 40px,
              ${product.accent} 40px,
              ${product.accent} 41px
            )`,
          }}
        />
        {/* Center logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-white/5 font-bold tracking-widest uppercase select-none"
            style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}
          >
            yumie
          </span>
        </div>
        {/* Tag */}
        <div className="absolute top-4 left-4">
          <span className="text-black bg-white text-[9px] tracking-[0.2em] uppercase px-2 py-1">
            {product.tag}
          </span>
        </div>
        {/* Hover overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/50 flex items-end justify-center pb-8"
        >
          <span className="text-white text-xs tracking-[0.3em] uppercase border border-white px-6 py-3">
            Quick View
          </span>
        </motion.div>
      </div>

      {/* Info */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-1">{product.category}</p>
          <h3 className="text-white text-sm tracking-wide">{product.name}</h3>
        </div>
        <span className="text-white text-sm font-light">{product.price}</span>
      </div>

      {/* Add to cart */}
      <motion.button
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
        transition={{ duration: 0.25 }}
        className="mt-3 w-full py-2.5 border border-white/20 text-white/70 text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-300"
      >
        Add to Cart
      </motion.button>
    </motion.div>
  );
}

function Collection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="collection" className="bg-[#0a0a0a] py-28 px-6 md:px-16">
      <div ref={ref} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={0}
              className="text-white/30 text-[10px] tracking-[0.4em] uppercase mb-3"
            >
              SS 2025
            </motion.p>
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={1}
              className="text-white text-4xl md:text-5xl font-light tracking-tight"
            >
              Featured Pieces
            </motion.h2>
          </div>
          <motion.a
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={2}
            href="#"
            whileHover={{ opacity: 0.5 }}
            className="text-white/50 text-xs tracking-[0.3em] uppercase border-b border-white/20 pb-1 self-start md:self-auto"
          >
            View All →
          </motion.a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Brand Statement ───────────────────────────────────────────────────────────

function BrandStatement() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const words = "We dress the ones who move in silence.".split(" ");

  return (
    <section
      id="about"
      className="relative bg-white py-36 px-6 md:px-16 overflow-hidden"
    >
      {/* Decorative large text bg */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="text-black/[0.03] font-bold uppercase tracking-tight"
          style={{ fontSize: "clamp(6rem, 22vw, 22rem)" }}
        >
          yumie
        </span>
      </div>

      <div ref={ref} className="max-w-5xl mx-auto relative z-10">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
          className="text-black/40 text-[10px] tracking-[0.5em] uppercase mb-12"
        >
          The Manifesto
        </motion.p>

        <div className="overflow-hidden">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-wrap gap-x-4 gap-y-1"
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                variants={fadeUp}
                custom={i * 0.5}
                className="text-black text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-tight"
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={6}
          className="text-black/50 text-sm tracking-wide leading-relaxed mt-12 max-w-xl"
        >
          yumie was born from the void between excess and restraint. Every garment
          is a statement of precision — cut for those who understand that true power
          needs no colour.
        </motion.p>

        <motion.a
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={7}
          href="#"
          whileHover={{ paddingLeft: "2.5rem" }}
          className="inline-flex items-center gap-4 mt-12 text-black text-xs tracking-[0.3em] uppercase transition-all duration-300"
        >
          <span className="w-12 h-px bg-black inline-block" />
          Read Our Story
        </motion.a>
      </div>
    </section>
  );
}

// ─── New Arrivals ──────────────────────────────────────────────────────────────

const newArrivals = [
  { id: 1, label: "Drop 01", name: "Noir Panel Tee", tag: "NEW", shade: "#111", tone: "#1c1c1c" },
  { id: 2, label: "Drop 02", name: "Mono Utility Vest", tag: "LIMITED", shade: "#0d0d0d", tone: "#1a1a1a" },
  { id: 3, label: "Drop 03", name: "Shadow Pleat Trouser", tag: "NEW", shade: "#141414", tone: "#202020" },
  { id: 4, label: "Drop 04", name: "Distort Knit Zip", tag: "RESTOCK", shade: "#0f0f0f", tone: "#1d1d1d" },
];

function NewArrivals() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="new-arrivals" className="bg-[#0a0a0a] py-24 px-6 md:px-16">
      <div ref={ref} className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={0}
              className="text-white/30 text-[10px] tracking-[0.4em] uppercase mb-3"
            >
              Just Landed
            </motion.p>
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={1}
              className="text-white text-4xl md:text-5xl font-light tracking-tight"
            >
              New Arrivals
            </motion.h2>
          </div>
          <motion.a
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={2}
            href="#"
            whileHover={{ opacity: 0.5 }}
            className="text-white/50 text-xs tracking-[0.3em] uppercase border-b border-white/20 pb-1 self-start md:self-auto"
          >
            Shop Drops →
          </motion.a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {newArrivals.map((item, i) => (
            <motion.article
              key={item.id}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i * 1.3}
              className="group"
            >
              <div
                className="relative overflow-hidden aspect-[4/5] mb-4"
                style={{ background: item.shade }}
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `radial-gradient(ellipse at 30% 40%, ${item.tone}, transparent 70%)`,
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className="text-black bg-white text-[9px] tracking-[0.2em] uppercase px-2 py-1">
                    {item.tag}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="text-white/45 text-[10px] tracking-[0.3em] uppercase">{item.label}</span>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center"
                >
                  <span className="text-white text-[10px] tracking-[0.3em] uppercase border border-white px-5 py-2">
                    Quick View
                  </span>
                </motion.div>
              </div>
              <h3 className="text-white text-sm tracking-wide">{item.name}</h3>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats ─────────────────────────────────────────────────────────────────────

function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { value: "2019", label: "Founded" },
    { value: "42+", label: "Countries Shipped" },
    { value: "100%", label: "Ethically Made" },
    { value: "SS25", label: "Active Season" },
  ];

  return (
    <section className="bg-[#0f0f0f] border-t border-white/5 py-24 px-6 md:px-16">
      <div ref={ref} className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={i * 1.5}
            className="text-center"
          >
            <p className="text-white text-4xl md:text-5xl font-light tracking-tight mb-2">{stat.value}</p>
            <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Newsletter ────────────────────────────────────────────────────────────────

function Newsletter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section id="contact" className="bg-white py-28 px-6 md:px-16">
      <div ref={ref} className="max-w-2xl mx-auto text-center">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
          className="text-black/40 text-[10px] tracking-[0.5em] uppercase mb-6"
        >
          Inner Circle
        </motion.p>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={1}
          className="text-black text-4xl md:text-5xl font-light tracking-tight mb-4"
        >
          Enter the Void
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={2}
          className="text-black/40 text-sm tracking-wide mb-12"
        >
          Early access to drops. No noise. Just yumie.
        </motion.p>

        <motion.form
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={3}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-0 border border-black"
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="YOUR EMAIL ADDRESS"
                  className="flex-1 bg-transparent px-6 py-4 text-black text-xs tracking-[0.2em] uppercase placeholder:text-black/30 outline-none"
                  required
                />
                <motion.button
                  type="submit"
                  whileHover={{ backgroundColor: "#0a0a0a", color: "#fff" }}
                  transition={{ duration: 0.25 }}
                  className="bg-black text-white text-xs tracking-[0.3em] uppercase px-8 py-4 border-t sm:border-t-0 sm:border-l border-black transition-all duration-300"
                >
                  Join
                </motion.button>
              </>
            ) : (
              <motion.p
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 px-6 py-4 text-black/60 text-xs tracking-[0.3em] uppercase text-center"
              >
                You&apos;re in. Welcome to the void.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  const links = {
    Shop: ["New Arrivals", "Tops", "Bottoms", "Outerwear", "Accessories"],
    Info: ["About Us", "Sustainability", "Collaborations", "Press"],
    Support: ["Sizing Guide", "Returns", "Shipping", "Contact Us"],
  };

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 pt-20 pb-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <BrandLogo className="h-12 w-auto" />
            </div>
            <p className="text-white/30 text-xs leading-relaxed tracking-wide max-w-48">
              Avant-garde clothing for those who move in monochrome.
            </p>
            <div className="flex gap-4 mt-6">
              {["IG", "TK", "X"].map((s) => (
                <motion.a
                  key={s}
                  href="#"
                  whileHover={{ opacity: 0.5 }}
                  className="text-white/40 text-[10px] tracking-[0.2em] uppercase border border-white/10 px-3 py-2"
                >
                  {s}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <p className="text-white/30 text-[9px] tracking-[0.4em] uppercase mb-5">{section}</p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <motion.a
                      href="#"
                      whileHover={{ opacity: 0.5, x: 4 }}
                      className="text-white/60 text-xs tracking-wide transition-all inline-block"
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-[10px] tracking-[0.3em] uppercase">
            © 2026 yumie. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <motion.a
                key={item}
                href="#"
                whileHover={{ opacity: 0.5 }}
                className="text-white/20 text-[10px] tracking-[0.2em] uppercase"
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Lock scrolling while the loader is active
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoading]);

  return (
    <>
      <AnimatePresence>
        {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <main className="bg-[#0a0a0a] min-h-screen">
        <Navbar />
        <Hero />
        <Marquee />
        <Collection />
        <BrandStatement />
        <NewArrivals />
        <Stats />
        <Newsletter />
        <Footer />
      </main>
    </>
  );
}