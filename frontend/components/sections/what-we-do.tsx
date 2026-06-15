"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const services = [
  {
    title: "Strategy",
    desc: "We map your market, decode your competition, and design a growth blueprint that turns business goals into a clear digital roadmap.",
  },
  {
    title: "Development",
    desc: "From high-converting websites to custom web apps, we build fast, scalable, and beautifully engineered digital products.",
  },
  {
    title: "Design",
    desc: "Brand identities, UI systems, and pitch decks that don't just look good — they communicate value and command attention.",
  },
];

import { StrokedText } from "@/components/ui/stroked-text"

export const WhatWeDo = () => {
  return (
    <section className="relative py-20 md:py-32 lg:py-48 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-start mb-16 md:mb-24 md:ml-[5%] lg:ml-[10%]">
          <div className="relative select-none">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-[15vw] md:text-[8vw] leading-[0.8] font-black text-white tracking-tighter font-sans"
            >
              We do
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="flex items-center mt-[-0.1px]"
            >
              <StrokedText 
                text="Strategy," 
                viewBox="0 0 500 120"
                height="clamp(4rem, 11vw, 9rem)"
                strokeWidth={2}
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex items-center mt-[-0.1px]"
            >
              <StrokedText 
                text="Development" 
                viewBox="0 0 700 120"
                height="clamp(4rem, 11vw, 9rem)"
                strokeWidth={2}
              />
            </motion.div>
            <div className="flex items-end gap-4 mt-[-0.1px]">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="text-[15vw] md:text-[8vw] leading-[0.8] font-black text-white tracking-tighter font-sans"
              >
                and
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="flex items-center"
              >
                <StrokedText 
                  text="Design" 
                  viewBox="0 0 350 120"
                  height="clamp(4rem, 11vw, 9rem)"
                  strokeWidth={2}
                />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-0.5 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-accent p-8 md:p-12 flex flex-col items-start rounded-xl md:rounded-sm shadow-xl"
            >
              <h3 
                className="font-black text-white mb-4 md:mb-6 tracking-tighter leading-none"
                style={{ fontSize: 'clamp(1.5rem, 3.3vw, 2.5rem)', textTransform: 'none' }}
              >
                {service.title}
              </h3>
              <p className="text-white/80 text-lg md:text-xl font-medium leading-tight mb-8 md:mb-10 max-w-sm">
                {service.desc}
              </p>
              <Button 
                size="md" 
                className="w-full md:w-auto bg-[#146ef5] text-white border-2 border-white hover:bg-[#146ef5]/90 rounded-full px-8 py-3 h-fit text-base font-bold transition-all duration-300"
              >
                Learn More
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
