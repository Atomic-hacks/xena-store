"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect, ReactNode } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import AnimatedDotsToX from "../ui/AnimatedDotsToX";
import AnimatedHamburger from "../ui/Harmburger";
import { Zap } from "lucide-react";

// Interface for navigation links
interface NavLink {
  name: string;
  path: string;
  hasDropdown?: boolean;
}

// Interface for category links
interface CategoryLink {
  name: string;
  path: string;
}

// Interface for additional links with icons
interface AdditionalLink {
  name: string;
  path: string;
  icon: string;
}

// Props for the Navbar component
interface NavbarProps {
  children?: ReactNode;
}

const Navbar: React.FC<NavbarProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] =
    useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const router: AppRouterInstance = useRouter();
  const pathname = usePathname();

  // Primary navigation links (always visible on desktop)
  const primaryNavLinks: NavLink[] = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Categories", path: "/categories", hasDropdown: true },
    { name: "Deals", path: "/deals" },
  ];

  // Secondary navigation links (visible in "more" menu)
  const secondaryNavLinks: NavLink[] = [
    { name: "New Arrivals", path: "/new-arrivals" },
    { name: "Brands", path: "/brands" },
    { name: "Reviews", path: "/reviews" },
    { name: "Blog", path: "/blog" },
    { name: "Support", path: "/support" },
  ];

  const categoryLinks: CategoryLink[] = [
    { name: "PC Gear", path: "/categories/pc-gear" },
    { name: "Consoles & Accessories", path: "/categories/consoles" },
    { name: "Streaming Setup", path: "/categories/streaming" },
    { name: "Gaming Desks & Chairs", path: "/categories/furniture" },
    { name: "VR & Sim Racing Gear", path: "/categories/vr-sim" },
  ];

  const additionalLinks: AdditionalLink[] = [
    { name: "Gift Cards", path: "/gift-cards", icon: "🎁" },
    { name: "Community", path: "/community", icon: "👾" },
    { name: "Leaderboard", path: "/leaderboard", icon: "📜" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        isCategoryDropdownOpen &&
        !(target as Element).closest(".category-dropdown")
      ) {
        setIsCategoryDropdownOpen(false);
      }

      if (
        isMoreMenuOpen &&
        !(target as Element).closest(".more-menu-dropdown")
      ) {
        setIsMoreMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCategoryDropdownOpen, isMoreMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isCategoryDropdownOpen) setIsCategoryDropdownOpen(false);
    if (isMoreMenuOpen) setIsMoreMenuOpen(false);
  };

  const toggleCategoryDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    if (isMoreMenuOpen) setIsMoreMenuOpen(false);
  };

  const toggleMoreMenu = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
    if (isCategoryDropdownOpen) setIsCategoryDropdownOpen(false);
  };

  const handleMobileNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
    setIsCategoryDropdownOpen(false);
    setIsMoreMenuOpen(false);
  };

  const navbarStyle: React.CSSProperties = {
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    boxShadow: scrollPosition > 100 ? `0 4px 30px rgba(0, 0, 0, 0.3)` : "none",
    transition: "all 0.3s ease-in-out",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  };

  return (
    <header className="sticky w-full top-0 z-50 overflow-visible">
      {/* Background with glass morphism effect */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01]" />

      {/* Fuchsia Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 via-transparent to-fuchsia-500/10" />

      <nav
        className="relative z-10 px-4 py-3 md:px-8 md:py-4 flex items-center justify-between"
        style={navbarStyle}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex items-center"
        >
          <Link href="/" className="group flex items-center">
            <div className="w-12 h-12 relative mr-3 overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/10" />
              <Image
                src="/logo.jpg"
                fill
                alt="Xena Gaming Store Logo"
                className="object-cover group-hover:scale-105 transition-transform duration-300 relative z-10"
              />
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 bg-fuchsia-500/20 rounded-2xl opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90 font-bold text-xl md:text-2xl group-hover:from-fuchsia-300 group-hover:to-white transition-all duration-300">
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
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex items-center space-x-4">
            {/* Primary Nav Links */}
            {primaryNavLinks.map((link) => (
              <li key={link.path} className="relative">
                {link.hasDropdown ? (
                  <div className="category-dropdown">
                    <button
                      onClick={toggleCategoryDropdown}
                      className={`text-sm font-medium transition-all duration-300 flex items-center px-3 py-2 rounded-xl relative group ${
                        pathname && pathname.startsWith(link.path)
                          ? "text-white bg-black/40 backdrop-blur-xl border border-fuchsia-500/40"
                          : "text-white/70 hover:text-fuchsia-300 hover:bg-black/20 backdrop-blur-xl"
                      }`}
                    >
                      {link.name}
                      <svg
                        className={`ml-1 w-4 h-4 transition-transform duration-300 ${
                          isCategoryDropdownOpen ? "rotate-180" : ""
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
                      {/* Hover glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-fuchsia-500/10 rounded-xl opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </button>

                    <AnimatePresence>
                      {isCategoryDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-64 rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-[9999]"
                          style={{
                            backgroundColor: "rgba(0, 0, 0, 0.9)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                          }}
                        >
                          <div className="py-2 px-1">
                            {categoryLinks.map((category) => (
                              <Link href={category.path} key={category.path}>
                                <div
                                  className={`block px-4 py-3 text-sm rounded-xl my-1 transition-all duration-300 group relative ${
                                    pathname === category.path
                                      ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                                      : "text-white/70 hover:bg-black/40 hover:text-fuchsia-300"
                                  }`}
                                  onClick={() =>
                                    setIsCategoryDropdownOpen(false)
                                  }
                                >
                                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                                    {category.name}
                                  </span>
                                  <motion.div
                                    className="absolute left-1 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-fuchsia-400 rounded-full opacity-0 group-hover:opacity-100"
                                    initial={{ scale: 0 }}
                                    whileHover={{ scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                  />
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link href={link.path}>
                    <div
                      className={`text-sm font-medium transition-all duration-300 px-3 py-2 rounded-xl relative group ${
                        pathname === link.path
                          ? "text-white bg-black/40 backdrop-blur-xl border border-fuchsia-500/40"
                          : "text-white/70 hover:text-fuchsia-300 hover:bg-black/20"
                      }`}
                    >
                      {link.name}
                      {/* Hover glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-fuchsia-500/10 rounded-xl opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      {pathname === link.path && (
                        <motion.div
                          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-fuchsia-400 rounded-full"
                          layoutId="navIndicator"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </div>
                  </Link>
                )}
              </li>
            ))}

            {/* More Menu Dropdown */}
            <li className="relative more-menu-dropdown">
              <AnimatedDotsToX
                onClick={toggleMoreMenu}
                isOpen={isMoreMenuOpen}
                color="rgb(209, 213, 219)"
              />

              <AnimatePresence>
                {isMoreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-64 rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-[9999]"
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.9)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                    }}
                  >
                    <div className="py-2 px-1">
                      {/* Secondary Nav Links */}
                      {secondaryNavLinks.map((link) => (
                        <Link href={link.path} key={link.path}>
                          <div
                            className={`block px-4 py-3 text-sm rounded-xl my-1 transition-all duration-300 group relative ${
                              pathname === link.path
                                ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                                : "text-white/70 hover:bg-black/40 hover:text-fuchsia-300"
                            }`}
                            onClick={() => setIsMoreMenuOpen(false)}
                          >
                            <span className="group-hover:translate-x-1 transition-transform duration-300">
                              {link.name}
                            </span>
                            <motion.div
                              className="absolute left-1 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-fuchsia-400 rounded-full opacity-0 group-hover:opacity-100"
                              initial={{ scale: 0 }}
                              whileHover={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          </div>
                        </Link>
                      ))}

                      {/* Add a divider */}
                      <div className="border-t border-white/10 my-2"></div>

                      {/* Additional Links */}
                      {additionalLinks.map((link) => (
                        <Link href={link.path} key={link.path}>
                          <div
                            className={`flex items-center px-4 py-3 text-sm rounded-xl my-1 transition-all duration-300 group relative ${
                              pathname === link.path
                                ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                                : "text-white/70 hover:bg-black/40 hover:text-fuchsia-300"
                            }`}
                            onClick={() => setIsMoreMenuOpen(false)}
                          >
                            <span className="mr-2">{link.icon}</span>
                            <span className="group-hover:translate-x-1 transition-transform duration-300">
                              {link.name}
                            </span>
                            <motion.div
                              className="absolute left-1 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-fuchsia-400 rounded-full opacity-0 group-hover:opacity-100"
                              initial={{ scale: 0 }}
                              whileHover={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>

          {/* Additional Items */}
          <div className="flex items-center space-x-3">
            <Link href="/cart">
              <motion.div
                className="relative p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 hover:border-fuchsia-500/40 transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaShoppingCart
                  className="text-fuchsia-400 group-hover:text-fuchsia-300"
                  size={18}
                />
                <span className="absolute -top-1 -right-1 bg-fuchsia-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-black/50">
                  0
                </span>
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-fuchsia-500/20 rounded-2xl opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </Link>

            <Link href="/account">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative bg-black/40 backdrop-blur-xl border border-white/20 hover:border-fuchsia-500/40 text-white hover:text-fuchsia-300 px-6 py-3 text-sm rounded-2xl transition-all duration-300 overflow-hidden group"
              >
                <span className="relative z-10">Sign In</span>
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 bg-fuchsia-500/20 rounded-2xl opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <AnimatedHamburger
          className="md:hidden"
          onClick={toggleMenu}
          isOpen={isMenuOpen}
          color="rgb(209, 213, 219)"
        />
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={toggleMenu}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 right-0 z-50 md:hidden max-h-screen overflow-hidden"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Header with logo and close button */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <Link href="/" className="flex items-center group">
                  <div className="w-10 h-10 relative mr-3 overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/10" />
                    <Image
                      src="/logo.jpg"
                      fill
                      alt="Xena Store Logo"
                      className="object-cover relative z-10"
                    />
                  </div>
                  <h1 className="text-white font-bold text-lg">Xena Store</h1>
                </Link>

                <AnimatedHamburger
                  onClick={toggleMenu}
                  isOpen={isMenuOpen}
                  color="rgb(209, 213, 219)"
                />
              </div>

              {/* Scrollable content */}
              <div
                className="overflow-y-auto overscroll-contain"
                style={{ maxHeight: "calc(100vh - 80px)" }}
              >
                <div className="px-4 py-4">
                  <ul className="space-y-2">
                    {/* Primary Nav Links in Mobile */}
                    {primaryNavLinks.map((link) => (
                      <li key={link.path}>
                        {link.hasDropdown ? (
                          <div>
                            <button
                              onClick={toggleCategoryDropdown}
                              className={`w-full text-left flex justify-between items-center py-4 px-4 rounded-2xl transition-all duration-300 ${
                                pathname && pathname.startsWith(link.path)
                                  ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                                  : "text-white/70 hover:bg-black/40 hover:text-fuchsia-300"
                              }`}
                            >
                              <span className="font-medium">{link.name}</span>
                              <svg
                                className={`w-5 h-5 transition-transform duration-300 ${
                                  isCategoryDropdownOpen ? "rotate-180" : ""
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
                              {isCategoryDropdownOpen && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="pl-4 mt-2 space-y-2 overflow-hidden"
                                >
                                  {categoryLinks.map((category) => (
                                    <div
                                      key={category.path}
                                      className={`block py-3 px-4 text-sm rounded-xl transition-all duration-300 cursor-pointer ${
                                        pathname === category.path
                                          ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                                          : "text-white/60 hover:bg-black/30 hover:text-fuchsia-300"
                                      }`}
                                      onClick={() =>
                                        handleMobileNavigation(category.path)
                                      }
                                    >
                                      {category.name}
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <div
                            className={`block py-4 px-4 rounded-2xl font-medium transition-all duration-300 cursor-pointer ${
                              pathname === link.path
                                ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                                : "text-white/70 hover:bg-black/40 hover:text-fuchsia-300"
                            }`}
                            onClick={() => handleMobileNavigation(link.path)}
                          >
                            {link.name}
                          </div>
                        )}
                      </li>
                    ))}

                    {/* Divider */}
                    <li>
                      <div className="border-t border-white/10 my-4 pt-4">
                        <p className="text-xs text-white/40 px-4 py-2 font-medium">
                          More
                        </p>
                      </div>
                    </li>

                    {/* Secondary Nav Links in Mobile */}
                    {secondaryNavLinks.map((link) => (
                      <li key={link.path}>
                        <div
                          className={`block py-4 px-4 rounded-2xl font-medium transition-all duration-300 cursor-pointer ${
                            pathname === link.path
                              ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                              : "text-white/70 hover:bg-black/40 hover:text-fuchsia-300"
                          }`}
                          onClick={() => handleMobileNavigation(link.path)}
                        >
                          {link.name}
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Additional Links Section */}
                  <div className="border-t border-white/10 mt-6 pt-4">
                    <p className="text-xs text-white/40 px-4 py-2 font-medium">
                      Additional Links
                    </p>
                    <ul className="space-y-2 mt-2">
                      {additionalLinks.map((link) => (
                        <li key={link.path}>
                          <div
                            className={`flex items-center py-3 px-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                              pathname === link.path
                                ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                                : "text-white/60 hover:bg-black/30 hover:text-fuchsia-300"
                            }`}
                            onClick={() => handleMobileNavigation(link.path)}
                          >
                            <span className="mr-3 text-lg">{link.icon}</span>
                            <span className="font-medium">{link.name}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Actions */}
                  <div className="mt-6 pt-4 border-t border-white/10 space-y-3 pb-6">
                    <div
                      className="flex items-center justify-between py-4 px-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 cursor-pointer hover:border-fuchsia-500/40 transition-all duration-300"
                      onClick={() => handleMobileNavigation("/cart")}
                    >
                      <div className="flex items-center">
                        <FaShoppingCart
                          className="mr-3 text-fuchsia-400"
                          size={18}
                        />
                        <span className="text-white font-medium">Cart</span>
                      </div>
                      <span className="bg-fuchsia-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        0
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full bg-black/40 backdrop-blur-xl text-white border border-white/20 hover:border-fuchsia-500/40  hover:text-fuchsia-300 py-4 rounded-2xl transition-all duration-300"
                      onClick={() => handleMobileNavigation("/account")}
                    >
                      Sign In
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
