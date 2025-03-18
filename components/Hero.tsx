"use client";
import { motion } from "motion/react";
import React from "react";
import { ImagesSlider } from "./ui/ImageSlider";
import { Highlight } from "./ui/Highlight";

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
    <div className="relative h-[100vh]">
<ImagesSlider className="" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <Highlight className="font-bold text-xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-tl from-neutral-500 to-neutral-100 py-4">
        Power Up Your Setup <br /> No Grinding Needed!
        </Highlight>
        <button className="px-4 py-2 backdrop-blur-xl border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
          <span>Join now →</span>
          <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
        </button>
      </motion.div>
    </ImagesSlider>
    </div>
    
  );
}
