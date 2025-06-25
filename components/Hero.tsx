"use client";
import { motion } from "motion/react";
import React from "react";
import { ImagesSlider } from "./ui/ImageSlider";
import { Highlight } from "./ui/Highlight";
import FancyButton from "./ui/magic-button";

export function Hero() {
  const images = [
    "/setup.jpg",
    "/setup2.jpg",
    "/setup3.jpg",
    "/headset2.jpg",
    "/headset3.jpg",
    "/headset4.jpg",
    "/monitor.jpg",
    "/ipad.jpg",
    "/ipad2.jpg",
    "/ipad3.jpg",
    "/ipad4.jpg",
    "pc.jpg",
  ];

  return (
    <div className="relative h-screen">
      <ImagesSlider className="h-screen" images={images}>
        <div className="relative z-50 h-full flex items-center px-8 lg:px-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div>
                  <Highlight className="font-bold text-3xl lg:text-6xl leading-tight bg-clip-text text-transparent bg-gradient-to-tl from-neutral-300 to-white">
                    Power Up Your Setup
                  </Highlight>
                  <h1 className="font-bold text-3xl lg:text-6xl leading-tight text-white mt-2">
                    No Grinding Needed!
                  </h1>
                </div>

                <p className="text-lg lg:text-xl text-gray-200 leading-relaxed max-w-2xl">
                  Elevate your daily routine with our meticulously selected
                  premium goods and curated essentials.
                </p>

                <div className="flex flex-col sm:flex-row w-60 sm:w-auto gap-4 mt-8">
                  <FancyButton title="Get Started" />
                  <FancyButton title="Browse Categories" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </ImagesSlider>
    </div>
  );
}
