"use client"

import { StrokedText } from "@/components/ui/stroked-text"
import { motion } from "framer-motion"

export function WorkContent() {
  return (
    <div className="container mx-auto px-6 relative z-10 min-h-screen py-32 md:py-48 flex flex-col items-center text-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex justify-center items-center gap-4 md:gap-6 mb-12"
      >
        <span
          className="text-[12vw] md:text-[8vw] font-black text-white leading-[0.8] tracking-tighter"
          style={{ WebkitTextStroke: '0.5px #ffffff' }}
        >
          Our
        </span>
        <div className="flex items-center -mt-[1.5vw]">
          <StrokedText
            text="Work"
            viewBox="0 0 320 120"
            height="clamp(5rem, 12vw, 10rem)"
            strokeWidth={2}
            letterSpacing="-0.05em"
          />
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-white text-xl md:text-2xl lg:text-3xl font-medium max-w-4xl leading-tight tracking-tight mb-20"
      >
        A collection of our finest digital experiences and brand transformations.
      </motion.p>
    </div>
  )
}
