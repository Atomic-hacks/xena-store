"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const handleSubscribe = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setEmail("");
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
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
      icon: <Instagram size={18} />,
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      icon: <Twitter size={18} />,
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
      icon: <Youtube size={18} />,
    },
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: <Facebook size={18} />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-black py-16 mt-24 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main footer content */}
        <div className="flex flex-col max-w-md">
          {/* Logo and newsletter - takes up 2 columns on desktop */}
          <motion.div
            className="md:col-span-2 md:mb-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-8">
              <Link href="/">
                <div className="flex items-center">
                  <div className="w-10 h-10 relative">
                    <Image
                      src="/logo.jpg"
                      fill
                      alt="Xena Store Logo"
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h1 className="ml-3 text-white font-medium text-lg">
                    Xena Store
                  </h1>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-300 mb-4">
                Subscribe to our newsletter
              </h3>

              <form className="flex mb-4" onSubmit={handleSubscribe}>
                <div className="relative flex-grow">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full bg-neutral-900 px-4 py-3 rounded-l-md text-white border-l border-y border-neutral-700 focus:outline-none focus:border-white transition-colors text-sm pr-10"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Mail size={16} />
                  </div>
                </div>
                <motion.button
                  type="submit"
                  className="bg-white text-black font-medium py-3 px-4 rounded-r-md flex items-center justify-center transition-colors hover:bg-neutral-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowRight size={16} />
                </motion.button>
              </form>

              <AnimatePresence>
                {subscribed && (
                  <motion.div
                    className="text-emerald-400 text-sm flex items-center gap-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.3334 4L6.00002 11.3333L2.66669 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Thank you for subscribing!
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Social links for desktop */}
            <motion.div
              variants={itemVariants}
              className="mt-8 hidden md:block"
            >
              <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-300 mb-4">
                Follow us
              </h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors bg-neutral-900 w-10 h-10 rounded-full flex items-center justify-center"
                    whileHover={{ y: -2, backgroundColor: "#222" }}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

         
        </div>
         {/* Navigation sections - each takes up 1 column on desktop */}
        <motion.div
          className="max-w-xl md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-3"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {sections.map((section) => (
            <div key={section.id}>
              {/* Desktop version - always visible */}
              <motion.div variants={itemVariants} className="hidden md:block">
                <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-300 mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.path}>
                      <Link href={link.path}>
                        <div className="text-neutral-400 hover:text-white text-sm inline-block hover:translate-x-1 transition-transform">
                          {link.name}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Mobile accordion */}
              <div className="md:hidden border-b border-neutral-800">
                <button
                  onClick={() => toggleAccordion(section.id)}
                  className="w-full flex justify-between items-center py-4 text-left text-white"
                >
                  <span className="text-sm font-bold">{section.title}</span>
                  <svg
                        className={`ml-1 w-4 h-4 transition-transform duration-500 ${
                          activeAccordion === section.id ? "rotate-180" : ""
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                </button>

                <AnimatePresence>
                  {activeAccordion === section.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <ul className="pb-4 space-y-3">
                        {section.links.map((link) => (
                          <li key={link.path}>
                            <Link href={link.path}>
                              <div className="text-neutral-400 hover:text-white transition-colors text-sm pl-2 border-l-2 border-neutral-800">
                                {link.name}
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Social links for mobile */}
        <motion.div
          className="md:hidden pt-8 border-b border-neutral-800 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-300 mb-4">
            Follow us
          </h3>
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors bg-neutral-900 w-10 h-10 rounded-full flex items-center justify-center"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Bottom section */}
        <motion.div
          className="mt-12 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mb-4 md:mb-0">
            <p>© {new Date().getFullYear()} Xena Store. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link
              href="/shipping"
              className="hover:text-white transition-colors"
            >
              Shipping
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
