"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Check,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setEmail("");
  };

  const sections = [
    {
      id: "shop",
      title: "Shop",
      links: [
        { name: "Gaming", path: "/products/gaming" },
        { name: "Audio", path: "/products/audio" },
        { name: "Smart Home", path: "/products/smart-home" },
        { name: "Wearables", path: "/products/wearables" },
        { name: "Deals", path: "/deals" },
      ],
    },
    {
      id: "support",
      title: "Support",
      links: [
        { name: "Contact Us", path: "/contact" },
        { name: "Help Center", path: "/support" },
        { name: "FAQ", path: "/faq" },
        { name: "Shipping", path: "/shipping" },
        { name: "Returns", path: "/returns" },
      ],
    },
    {
      id: "company",
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Gift Cards", path: "/gift-cards" },
        { name: "Community", path: "/community" },
      ],
    },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: <Instagram size={20} />,
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      icon: <Twitter size={20} />,
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
      icon: <Youtube size={20} />,
    },
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: <Facebook size={20} />,
    },
  ];

  return (
    <footer className="relative mt-32 overflow-hidden">
      {/* Background with glass morphism effect */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01]" />

      {/* Interactive Border */}
      <div className="absolute inset-[1px] bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl" />

      {/* Fuchsia Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 via-transparent to-fuchsia-500/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main content */}
        <div className="py-16 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Brand & Newsletter Section */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Logo */}
                <Link href="/" className="inline-flex items-center mb-8 group">
                  <div className="w-12 h-12 relative mr-4 overflow-hidden rounded-2xl">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/10" />
                    <Image
                      src="/logo.jpg"
                      fill
                      alt="Xena Store Logo"
                      className="object-cover group-hover:scale-105 transition-transform duration-300 relative z-10"
                    />
                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-fuchsia-500/20 rounded-2xl opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <h1 className="text-white font-bold text-2xl group-hover:text-fuchsia-300 transition-colors duration-300">
                    Xena Store
                  </h1>
                  <motion.div
                    className="ml-2 opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Zap size={16} className="text-fuchsia-400" />
                  </motion.div>
                </Link>

                {/* Newsletter */}
                <div className="max-w-md">
                  <h3 className="text-white font-semibold text-lg mb-3">
                    Stay Updated
                  </h3>
                  <p className="text-white/70 mb-6 leading-relaxed">
                    Get the latest products and exclusive deals delivered to
                    your inbox.
                  </p>

                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-4 bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/40 transition-all duration-200 text-white placeholder-white/50"
                        required
                      />
                      <motion.button
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 px-6 bg-fuchsia-500/20 backdrop-blur-xl border border-fuchsia-500/40 text-fuchsia-300 rounded-xl flex items-center justify-center hover:bg-fuchsia-500/30 hover:border-fuchsia-400/60 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ArrowRight size={18} />
                      </motion.button>
                    </div>

                    <AnimatePresence>
                      {subscribed && (
                        <motion.div
                          className="flex items-center gap-2 text-fuchsia-400 font-medium bg-black/40 backdrop-blur-xl border border-fuchsia-500/30 rounded-2xl px-4 py-3"
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="w-6 h-6 bg-fuchsia-500/20 rounded-full flex items-center justify-center">
                            <Check size={12} />
                          </div>
                          Thank you for subscribing!
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </div>
              </motion.div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-7">
              <div className="grid sm:grid-cols-3 gap-8 lg:gap-12">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Section background */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10 p-4">
                      <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                        {section.title}
                        <div className="w-1 h-1 bg-fuchsia-400 rounded-full" />
                      </h3>
                      <ul className="space-y-4">
                        {section.links.map((link) => (
                          <li key={link.path}>
                            <Link
                              href={link.path}
                              className="text-white/70 hover:text-fuchsia-300 transition-all duration-300 group flex items-center relative"
                            >
                              <span className="group-hover:translate-x-2 transition-transform duration-300">
                                {link.name}
                              </span>
                              <motion.div
                                className="absolute -left-2 w-1 h-1 bg-fuchsia-400 rounded-full opacity-0 group-hover:opacity-100"
                                initial={{ scale: 0 }}
                                whileHover={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-white/60"
            >
              © {new Date().getFullYear()} Xena Store. All rights reserved.
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-3"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/20 hover:border-fuchsia-500/40 text-white/70 hover:text-fuchsia-300 rounded-2xl flex items-center justify-center transition-all duration-300 group overflow-hidden"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  aria-label={social.name}
                >
                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-fuchsia-500/20 rounded-2xl opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="group-hover:scale-110 transition-transform duration-300 relative z-10">
                    {social.icon}
                  </div>

                  {/* Ripple effect */}
                  <motion.div
                    className="absolute inset-0 bg-fuchsia-400/30 rounded-2xl opacity-0"
                    whileTap={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </motion.div>

            {/* Legal Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-6 text-white/60"
            >
              {[
                { name: "Privacy", path: "/privacy" },
                { name: "Terms", path: "/terms" },
                { name: "Shipping", path: "/shipping" },
              ].map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="hover:text-fuchsia-300 transition-colors duration-300 relative group"
                >
                  {link.name}
                  <motion.div className="absolute bottom-0 left-0 w-0 h-0.5 bg-fuchsia-400 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Subtle ambient glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-fuchsia-500/10 blur-3xl opacity-30" />
    </footer>
  );
};

export default Footer;
