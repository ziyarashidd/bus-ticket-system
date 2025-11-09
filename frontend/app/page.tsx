"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  BusFront,
  ShieldCheck,
  Smartphone,
  Printer,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Lock,
  ClipboardList,
  WifiOff,
} from "lucide-react";

// --- INLINE COMPONENTS ---
const Card = ({ children, className = "" }) => (
  <div className={`rounded-3xl border border-indigo-200 bg-white/95 backdrop-blur-xl shadow-2xl shadow-indigo-100/50 transition-all ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ children, className = "" }) => <div className={`p-7 pb-3 flex items-start gap-4 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = "" }) => <h3 className={`text-xl font-extrabold text-indigo-800 ${className}`}>{children}</h3>;
const CardContent = ({ children, className = "" }) => <div className={`px-7 pb-7 text-gray-700 ${className}`}>{children}</div>;


// --- ANIMATION VARIANTS (Only for initial load/menu) ---

// General item stagger
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// Hero text/buttons reveal
const heroItemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 25 },
  },
};

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      q: "Who is this app primarily designed for?",
      a: "PrintYatri is built specifically for **Private Bus Operators**, their **Conductors**, and **Travel Agencies** to streamline on-the-go ticket generation and printing.",
    },
    {
      q: "What type of printer is supported?",
      a: "The app supports various **58mm Bluetooth Thermal Printers** (like MPT-II, Panda PRJ-58, Rongta RP58). Printing uses an external share intent for maximum compatibility.",
    },
    {
      q: "Is the conductor data secure?",
      a: "Yes, all logins are secured using **JWT (JSON Web Token)** authentication, ensuring that only authorized agencies and conductors can access the system.",
    },
    {
      q: "Can the app be used when the bus is out of network coverage?",
      a: "Yes, it features an **Offline-Friendly Lite App** design. Basic ticket generation works offline and data will automatically sync when connectivity is restored.",
    },
  ];

  const features = [
    {
      title: "Quick Ticket Generation",
      desc: "Instantly generate passenger tickets with one-tap, including Fare, Seat Number, Source, and Destination details.",
      icon: <Ticket className="h-7 w-7 text-indigo-500" />,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
    {
      title: "On-the-Go Printing",
      desc: "Connect seamlessly to any 58mm Bluetooth Thermal Printer to provide physical receipts instantly via external printing apps.",
      icon: <Printer className="h-7 w-7 text-cyan-500" />,
      color: "text-cyan-500",
      bg: "bg-cyan-50",
    },
    {
      title: "JWT Secured Login",
      desc: "Ensure data integrity and system security with robust JWT authentication for all Agency and Conductor accounts.",
      icon: <Lock className="h-7 w-7 text-red-500" />,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      title: "Offline Friendly",
      desc: "Continue generating tickets even without a network connection. Data is cached and uploaded automatically when online.",
      icon: <WifiOff className="h-7 w-7 text-yellow-600" />,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Live Ticket Preview",
      desc: "Before printing, conductors can view a live preview of the ticket (Text Layout or PDF style) for verification.",
      icon: <Smartphone className="h-7 w-7 text-blue-500" />,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Daily Report & History",
      desc: "Access full Ticket History and generate quick Daily Reports for simplified accounting and bus management.",
      icon: <ClipboardList className="h-7 w-7 text-purple-600" />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const metrics = [
    { value: '300+', label: "Bus Operators Trust Us", icon: BusFront },
    { value: '99.9%', label: "Guaranteed Uptime", icon: ShieldCheck },
    { value: '1M+', label: "Tickets Generated Monthly", icon: Ticket },
  ];

  // Helper component to ensure features load statically but with initial animation
  const StaticCard = ({ children, delay }) => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      className="h-full"
    >
      {children}
    </motion.div>
  );

  return (
    // FIX: Removed overflow-x-hidden to prevent layout conflicts and the extra  issue
    <div className="relative min-h-screen flex flex-col font-inter bg-gray-50 ">
      
      {/* 🌌 Enhanced Background Shapes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 -z-10"
      >
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
          // Simplified size and positioning to stay within viewport bounds
          className="absolute top-0 left-0 max-w-[30rem] max-h-[30rem] w-full h-full bg-cyan-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 80, 0] }}
          transition={{ repeat: Infinity, duration: 28, ease: "easeInOut" }}
          // Simplified size and positioning to stay within viewport bounds
          className="absolute bottom-0 right-0 max-w-[35rem] max-h-[35rem] w-full h-full bg-indigo-300/20 rounded-full blur-3xl"
        />
      </motion.div>

      {/* 🌐 Navbar (Stuck to top) */}
      <header className="w-full bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-indigo-800 flex items-center gap-2">
            <BusFront className="text-cyan-600 h-7 w-7"/> PrintYatri
          </h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 text-sm font-semibold text-gray-700">
            <a href="#features" className="hover:text-indigo-700 transition">Features</a>
            <a href="#solution" className="hover:text-indigo-700 transition">Solution</a>
            <a href="#trust" className="hover:text-indigo-700 transition">Trust & Scale</a>
            <a href="#faq" className="hover:text-indigo-700 transition">FAQ</a>
          </nav>

          {/* CTA Button (Desktop) */}
          <a
            href="/login"
            className="hidden md:block px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] hover:shadow-indigo-600/50"
          >
            Agency Login
          </a>

          {/* Hamburger Button */}
          <button
            className="md:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white/95 border-t border-gray-200 shadow-inner"
            >
              <div className="flex flex-col text-gray-700 font-medium p-4 space-y-3">
                <a onClick={() => setMenuOpen(false)} href="#features" className="hover:text-indigo-600">Features</a>
                <a onClick={() => setMenuOpen(false)} href="#solution" className="hover:text-indigo-600">Solution</a>
                <a onClick={() => setMenuOpen(false)} href="#trust" className="hover:text-indigo-600 transition">Trust & Scale</a>
                <a onClick={() => setMenuOpen(false)} href="#faq" className="hover:text-indigo-600">FAQ</a>
                <a onClick={() => setMenuOpen(false)} href="/login" className="px-4 py-2 text-center bg-indigo-50 text-indigo-700 font-bold rounded-xl mt-2">
                  Conductor Login
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 🎯 Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-40 bg-gradient-to-b from-gray-50 to-indigo-50/50"
      >
        <motion.p variants={heroItemVariants} className="text-md font-extrabold text-cyan-600 uppercase tracking-widest mb-4">
            The Digital Ticket Revolution 🚌🖨️
        </motion.p>
        <motion.h1
          variants={heroItemVariants}
          transition={{ ...heroItemVariants.visible.transition, delay: 0.3 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg max-w-5xl"
        >
          Smart Ticketing. Instant Printing. Total Control.
        </motion.h1>
        <motion.p
          variants={heroItemVariants}
          transition={{ ...heroItemVariants.visible.transition, delay: 0.5 }}
          className="text-xl text-gray-700 max-w-3xl mb-12"
        >
          PrintYatri is the reliable, mobile-first app powering **Private Bus Operators** to issue secure tickets and receipts instantly via portable **Bluetooth thermal printers.**
        </motion.p>
        <motion.div variants={heroItemVariants} transition={{ ...heroItemVariants.visible.transition, delay: 0.7 }} className="flex flex-wrap justify-center gap-6">
          <a
            href="/register/agency"
            className="px-8 py-4 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-2xl shadow-2xl transition-all transform hover:scale-[1.05] ring-4 ring-indigo-300/50"
          >
            Join as an Agency 🚀
          </a>
          <a
            href="/login"
            className="px-8 py-4 bg-white hover:bg-gray-50 text-indigo-700 font-bold rounded-2xl shadow-xl border border-indigo-300 transition-all transform hover:shadow-2xl"
          >
            Conductor Login
          </a>
        </motion.div>
        
        {/* Aesthetic Separator */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-b from-transparent to-white/90 [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_75%)]"></div>
      </motion.section>

      {/* --- */}

      {/* 🌟 Features Section */}
      <section id="features" className="relative -mt-16 py-20 bg-white/95">
        <div className="max-w-7xl mx-auto px-6">
          {/* Static Load Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-center mb-16 text-gray-900"
          >
            Why Choose PrintYatri?
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, i) => (
              <StaticCard key={i} delay={i * 0.08}> 
                <Card className="h-full hover:shadow-indigo-500/40 transform hover:-translate-y-1 transition-transform duration-300">
                  <CardHeader>
                    {/* Icon Circle with deeper shadow */}
                    <div className={`p-4 ${feature.bg} rounded-xl shadow-lg border border-gray-100`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-indigo-700">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </StaticCard>
            ))}
          </div>
        </div>
      </section>
      
      {/* --- */}

      {/* 🖨️ Solution & Mockup Section */}
      <section id="solution" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Solution Text (Initial animation only) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm font-bold text-indigo-600 uppercase">Seamless Operation</span>
            <h2 className="text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
              Simplified Ticketing for Every Route
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              From selecting the bus and route to generating the final receipt, PrintYatri streamlines the conductor's workflow. It's built for speed and reliability, ensuring accurate records for every trip.
            </p>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-100 rounded-full flex-shrink-0 shadow-md">
                  <ClipboardList className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Quick Passenger Entry</h3>
                  <p className="text-sm text-gray-600">Fast input for fare, seat number, and passenger count.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-full flex-shrink-0 shadow-md">
                  <BusFront className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Easy Route & Bus Selection</h3>
                  <p className="text-sm text-gray-600">Conductors select pre-configured routes with ease.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sample Ticket Mockup (Initial animation only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
            className="flex justify-center md:justify-start pt-12"
          >
            <div className="relative p-8 bg-indigo-50/70 rounded-3xl shadow-2xl ring-8 ring-indigo-500/10 transform rotate-1 transition-transform hover:rotate-0 duration-500 cursor-grab">
                <div className="bg-gray-900 text-white p-6 rounded-xl shadow-2xl max-w-xs w-full border-4 border-gray-700">
                    <p className="text-xs text-center text-cyan-400 mb-1 font-extrabold">--- THERMAL RECEIPT PREVIEW ---</p>
                    <pre className="text-xs font-mono whitespace-pre-wrap leading-snug bg-gray-800 p-3 rounded text-gray-200">
{`---------------------------------
      🚌 PrintYatri 🎟️
---------------------------------
Bus Name: Baba Mail
Route: Gorakhpur → Lucknow
Date: 25 June 2025
Conductor: Mohd Ali
---------------------------------
Passenger: 1
Fare: ₹300
Seat: 12
---------------------------------
Thank you for traveling with us!
---------------------------------`}
                    </pre>
                    <p className="text-xs text-center text-cyan-400 mt-1 font-extrabold">** COMPATIBLE WITH 58MM **</p>
                </div>
                <Printer className="absolute bottom-[-1.5rem] right-[-1.5rem] h-10 w-10 text-cyan-500 rotate-12 bg-white p-2 rounded-full shadow-xl border border-cyan-300"/>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- */}

      {/* 🛡️ Global Reach & Trust Section */}
      <section id="trust" className="py-24 bg-gradient-to-br from-gray-100 to-indigo-100/60">
        <div className="max-w-7xl mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <span className="text-sm font-bold text-indigo-700 uppercase tracking-widest">
                    TRUSTED & SECURE INFRASTRUCTURE
                </span>
                <h2 className="text-5xl font-extrabold text-gray-900 mt-3 max-w-4xl mx-auto leading-tight">
                    Enterprise-Grade Assurance and Unmatched Availability
                </h2>
            </motion.div>

            {/* Metric Cards (Initial animation only) */}
            <div className="grid md:grid-cols-3 gap-8">
                {metrics.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.15 }}
                        className="bg-white p-8 rounded-3xl shadow-2xl border-b-8 border-indigo-600/80 text-center flex flex-col items-center transform hover:scale-[1.03] transition-transform hover:shadow-indigo-500/30"
                    >
                        <item.icon className="h-10 w-10 text-indigo-600 mb-4" />
                        <h3 className="text-6xl font-black text-gray-900 mb-2 leading-none">
                            {item.value}
                        </h3>
                        <p className="text-xl font-semibold text-gray-600">{item.label}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* --- */}

      {/* 💬 FAQ Section */}
      <section id="faq" className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          {/* Initial animation only */}
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-extrabold mb-12 text-gray-900"
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-4 text-left">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                layout 
                className="bg-white border border-indigo-200 rounded-xl shadow-lg hover:shadow-indigo-400/40 transition-shadow overflow-hidden"
              >
                <button
                  className="w-full flex justify-between items-center px-6 py-4 text-left text-gray-800 font-bold focus:outline-none bg-indigo-50/50 hover:bg-indigo-100 transition-colors"
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                >
                  {faq.q}
                  <motion.div
                    animate={{ rotate: openFAQ === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-6 w-6 text-indigo-500"/>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openFAQ === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 py-4 text-gray-700 text-base border-t border-indigo-100"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- */}

      {/* ⚡ Footer */}
      <footer className="bg-gray-950 text-gray-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-extrabold mb-4 text-indigo-400 flex items-center gap-2">
              <BusFront className="h-6 w-6 text-cyan-400"/> PrintYatri
            </h3>
            <p className="text-gray-400 text-sm">
              The smart way to manage and print bus tickets, built for modern transport operations.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3 text-white">Platform Access</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/login" className="hover:text-cyan-400 transition">Conductor Login</a></li>
              <li><a href="/admin/login" className="hover:text-cyan-400 transition">Agency Admin</a></li>
              <li><a href="/register" className="hover:text-cyan-400 transition">Agency Registration</a></li>
              <li><a href="#trust" className="hover:text-cyan-400 transition">Trust & Scale</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3 text-white">Get in Touch</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2"><Mail size={16}/><a href="mailto:support@printyatri.com" className="hover:text-cyan-400 transition">support@printyatri.com</a></li>
              <li className="flex items-center gap-2"><Phone size={16}/><a href="tel:+919876543210" className="hover:text-cyan-400 transition">+91 98765 43210</a></li>
              <li className="flex items-center gap-2"><MapPin size={16}/> Delhi NCR, India</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3 text-white">Connect</h4>
            <div className="flex gap-4 text-gray-400">
              <Facebook className="hover:text-cyan-400 cursor-pointer transition transform hover:scale-110" />
              <Twitter className="hover:text-cyan-400 cursor-pointer transition transform hover:scale-110" />
              <Instagram className="hover:text-cyan-400 cursor-pointer transition transform hover:scale-110" />
            </div>
          </div>
        </div>
        <div className="text-center text-gray-600 text-xs mt-10 border-t border-gray-800 pt-6">
          © {new Date().getFullYear()} PrintYatri. All rights reserved. Platform built on a robust and modern foundation.
        </div>
      </footer>
    </div>
  );
}