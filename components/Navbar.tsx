"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect, ReactNode } from "react";
import {  FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import AnimatedDotsToX from "./ui/AnimatedDotsToX";
import AnimatedHamburger from "./ui/Harmburger";

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
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    boxShadow: scrollPosition > 100 ? `0 4px 30px rgba(0, 0, 0, 0.1)` : "none",
    transition: "all 0.3s ease-in-out",
  };

  return (
    <header className="sticky w-full top-0 z-50">
      <nav
        className="px-4 py-3 md:px-8 md:py-4 flex items-center justify-between"
        style={navbarStyle}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex items-center"
        >
          <Link href="/">
            <div className="flex items-center">
              <Image
                src="/logo.jpg"
                width={50}
                height={50}
                alt="Xena Gaming Store Logo"
                className="rounded-full"
              />
              <h1 className="ml-3 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-50 font-bold text-xl md:text-3xl">
                Xena Store
              </h1>
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex items-center space-x-4">
            {/* Primary Nav Links */}
            {primaryNavLinks.map((link) => (
              <li key={link.path} className="relative sm:text-xs">
                {link.hasDropdown ? (
                  <div className="category-dropdown">
                    <button
                      onClick={toggleCategoryDropdown}
                      className={`text-sm font-medium transition-colors flex items-center ${
                        pathname && pathname.startsWith(link.path)
                          ? "text-white"
                          : "text-neutral-300 hover:text-white"
                      }`}
                    >
                      {link.name}
                      <svg
                        className={`ml-1 w-4 h-4 transition-transform duration-500 ${
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
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-10 mt-2 w-56 rounded-lg shadow-lg"
                          style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <div className="py-2 px-1">
                            {categoryLinks.map((category) => (
                              <Link href={category.path} key={category.path}>
                                <div
                                  className={`block px-4 py-2 text-sm rounded-lg  my-1 ${
                                    pathname === category.path
                                      ? "bg-neutral-600 text-white"
                                      : "text-gray-200 hover:bg-neutral-600/20"
                                  }`}
                                  onClick={() =>
                                    setIsCategoryDropdownOpen(false)
                                  }
                                >
                                  {category.name}
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
                      className={`text-sm font-medium transition-colors ${
                        pathname === link.path
                          ? "text-white"
                          : "text-neutral-300 hover:text-white"
                      }`}
                    >
                      {link.name}
                      {pathname === link.path && (
                        <motion.span
                          layoutId="navIndicator"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-neutral-700 to-neutral-200"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.2 }}
                        ></motion.span>
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
                color="rgb(209, 213, 219)" // text-neutral-300
              />

              <AnimatePresence>
                {isMoreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 right-0 mt-2 w-56 rounded-lg shadow-lg"
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <div className="py-2 px-1">
                      {/* Secondary Nav Links */}
                      {secondaryNavLinks.map((link) => (
                        <Link href={link.path} key={link.path}>
                          <div
                            className={`block px-4 py-2 text-sm rounded-lg my-1 ${
                              pathname === link.path
                                ? "bg-neutral-600 text-white"
                                : "text-gray-200 hover:bg-neutral-600/20"
                            }`}
                            onClick={() => setIsMoreMenuOpen(false)}
                          >
                            {link.name}
                          </div>
                        </Link>
                      ))}

                      {/* Add a divider */}
                      <div className="border-t border-white/10 my-2"></div>

                      {/* Additional Links */}
                      {additionalLinks.map((link) => (
                        <Link href={link.path} key={link.path}>
                          <div
                            className={`flex items-center px-4 py-2 text-sm rounded-lg my-1 ${
                              pathname === link.path
                                ? "bg-neutral-600 text-white"
                                : "text-gray-200 hover:bg-neutral-600/20"
                            }`}
                            onClick={() => setIsMoreMenuOpen(false)}
                          >
                            <span className="mr-2">{link.icon}</span>
                            {link.name}
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
              <div className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
                <FaShoppingCart className="text-blue-400" size={18} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </div>
            </Link>

            <Link href="/account">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="backdrop-blur-xl cursor-pointer text-white border border-neutral-500 px-4 py-2 text-sm rounded-full transition-opacity"
              >
                Sign In
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <AnimatedHamburger className="md:hidden scrollbar-hidden"
                onClick={toggleMenu}
                isOpen={isMenuOpen}
                color="rgb(209, 213, 219)" // text-neutral-300
              />

      </nav>

      {/*{/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="px-4 py-2 overflow-y-scroll no-scrollbar">
              <ul className="space-y-1">
                {/* Primary Nav Links in Mobile */}
                {primaryNavLinks.map((link) => (
                  <li key={link.path}>
                    {link.hasDropdown ? (
                      <div>
                        <button
                          onClick={toggleCategoryDropdown}
                          className={`w-full text-left cursor-pointer flex justify-between items-center py-3 px-3 rounded-lg ${
                            pathname && pathname.startsWith(link.path)
                              ? "bg-neutral-900/20 text-white"
                              : "text-gray-200"
                          }`}
                        >
                          {link.name}
                          <svg
                            className={`ml-1 w-4 h-4 transition-transform ${
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
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.2 }}
                              className="pl-4 mt-1 space-y-1"
                            >
                              {categoryLinks.map((category) => (
                                <div
                                  key={category.path}
                                  className={`block py-2 px-3 text-sm rounded-md ${
                                    pathname === category.path
                                      ? "bg-neutral-600 text-white"
                                      : "text-gray-300 hover:bg-neutral-800/20"
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
                        className={`block py-3 px-3 rounded-lg ${
                          pathname === link.path
                            ? "bg-neutral-600/20 text-white"
                            : "text-gray-200 hover:bg-neutral-900/10"
                        }`}
                        onClick={() => handleMobileNavigation(link.path)}
                      >
                        {link.name}
                      </div>
                    )}
                  </li>
                ))}

                {/* Secondary Nav Links in Mobile */}
                <li>
                  <div className="border-t border-white/10 my-2 pt-1">
                    <p className="text-xs text-gray-400 px-3 py-1">More</p>
                  </div>
                </li>
                {secondaryNavLinks.map((link) => (
                  <li key={link.path}>
                    <div
                      className={`block py-3 px-3 rounded-lg ${
                        pathname === link.path
                          ? "bg-neutral-600/20 text-white"
                          : "text-gray-200 hover:bg-neutral-800/10"
                      }`}
                      onClick={() => handleMobileNavigation(link.path)}
                    >
                      {link.name}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/10 mt-2 pt-2">
                <p className="text-xs text-gray-400 px-3 py-1">
                  Additional Links
                </p>
                <ul className="space-y-1 mt-1">
                  {additionalLinks.map((link) => (
                    <li key={link.path}>
                      <div
                        className={`flex items-center py-2 px-3 rounded-lg ${
                          pathname === link.path
                            ? "bg-neutral-800/20 text-white"
                            : "text-gray-300 hover:bg-black/10"
                        }`}
                        onClick={() => handleMobileNavigation(link.path)}
                      >
                        <span className="mr-2">{link.icon}</span>
                        {link.name}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div
                  className="py-2 px-3 rounded-lg bg-neutral-800/20 text-white flex items-center"
                  onClick={() => handleMobileNavigation("/cart")}
                >
                  <FaShoppingCart className="mr-2" />
                  Cart
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    0
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="backdrop-blur-xl text-white border border-neutral-600 px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                  onClick={() => handleMobileNavigation("/account")}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
