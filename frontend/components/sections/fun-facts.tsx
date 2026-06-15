"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Image from "next/image"

const facts = [
  { value: "7", label: "Members," },
  { value: "340+", label: "Project Done," },
  { value: "99%", label: "Top Feedback," },
  { value: "4", label: "Global Offices." },
]

import { StrokedText } from "@/components/ui/stroked-text"

export const FunFacts = () => {
  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex flex-col md:flex-row overflow-hidden pr-0 md:pr-12 lg:pr-24">
      {/* Left Content */}
      <div className="w-full md:w-[65%] flex flex-col justify-center py-20 md:py-32 px-6 md:px-12 lg:px-24 order-2 md:order-1">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-white/60 text-base md:text-xl font-bold mb-6 md:mb-8 uppercase tracking-widest"
          style={{ WebkitTextStroke: '0.2px rgba(255,255,255,0.4)' }}
        >
          Some Fun Facts...
        </motion.p>
        
        <div className="space-y-4 md:space-y-6">
          {facts.map((fact, index) => (
            <motion.div 
              key={fact.label}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 md:gap-4"
            >
              <span 
                className="text-[12vw] md:text-[5vw] font-black text-white leading-none tracking-tighter"
                style={{ WebkitTextStroke: '0.5px #ffffff' }}
              >
                {fact.value}
              </span>
              <div className="flex items-center -mt-[0.5vw]">
                <StrokedText 
                  text={fact.label} 
                  viewBox={`0 0 ${fact.label.length * 55} 120`}
                  height="clamp(3rem, 7vw, 6.5rem)"
                  strokeWidth={2}
                  letterSpacing="-0.05em"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Image */}
      <div className="w-full md:w-[35%] relative min-h-[300px] md:min-h-full my-0 md:my-12 rounded-none md:rounded-2xl overflow-hidden order-1 md:order-2">
        <Image 
          src="/office2.jpeg"
          alt="Our Team"
          fill
          className="object-cover transition-all duration-1000"
        />
        
        {/* Gradient for mobile blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent md:hidden" />
      </div>
    </section>
  )
}
