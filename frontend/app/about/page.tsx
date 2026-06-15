"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { WhoWeAre } from "@/components/sections/who-we-are"
import { TrustedBy } from "@/components/sections/trusted-by"
import { TeamSection } from "@/components/sections/team-section"
import { WhatWeDo } from "@/components/sections/what-we-do"
import { Testimonials } from "@/components/sections/testimonials"
import { StrokedText } from "@/components/ui/stroked-text"

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="relative bg-void overflow-hidden">
        {/* Fixed Background Elements (Homepage Style) */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-accent/20 blur-[120px] rounded-full" />
          <div className="absolute top-[20%] right-[-5%] w-[60%] h-[60%] bg-accent-dim/15 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[20%] w-[80%] h-[60%] bg-accent/20 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] bg-repeat" />
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-6 relative z-10 min-h-screen py-32 md:py-48 flex flex-col items-center text-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-center mb-12"
          >
            <span
              className="text-[12vw] md:text-[8vw] font-black text-white leading-none tracking-tighter"
              style={{ WebkitTextStroke: '0.5px #ffffff' }}
            >
              About
            </span>
            <div className="flex items-center -mt-[1vw] md:-mt-[2vw]">
              <StrokedText
                text="Reed Breed"
                viewBox="0 0 600 120"
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
            We are a team of great designers, problem solvers, and passionate collaborators.
          </motion.p>
        </div>

        <WhoWeAre />
        <TrustedBy />
        <TeamSection />
        <WhatWeDo />
        <Testimonials />
      </main>
      <Footer />
    </>
  )
}
