"use client"

import * as React from "react"
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion"

import { StrokedText } from "@/components/ui/stroked-text"

export const Hero = () => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const textRef = React.useRef<HTMLHeadingElement>(null)
  
  const [containerWidth, setContainerWidth] = React.useState(0)
  const [textWidth, setTextWidth] = React.useState(0)

  const mouseX = useMotionValue(0)
  
  // Smooth spring for the scrolling movement
  const springX = useSpring(mouseX, { damping: 40, stiffness: 120, mass: 1 })

  // Logic: 
  // Mouse at 0 (left) -> x = 10% of viewport (padding at start)
  // Mouse at containerWidth (right) -> x = -(textWidth - containerWidth + 10% of viewport)
  const startPadding = containerWidth * 0.1
  const x = useTransform(
    springX, 
    [0, containerWidth || 1], 
    [startPadding, -(textWidth - containerWidth + startPadding)]
  )

  React.useEffect(() => {
    const handleResize = () => {
      setContainerWidth(window.innerWidth)
      if (textRef.current) setTextWidth(textRef.current.scrollWidth)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    // Small delay to ensure textWidth is captured after fonts load
    const timer = setTimeout(handleResize, 500)
    
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timer)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX)
  }

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden bg-void"
    >
      {/* Fixed Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-accent/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[-5%] w-[60%] h-[60%] bg-accent-dim/15 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[20%] w-[80%] h-[60%] bg-accent/20 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] bg-repeat" />
      </div>

      <div className="w-full relative z-10 flex flex-col items-start overflow-visible py-20 md:py-32">
        <div className="w-full flex justify-center mt-32 md:mt-48 mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-text-secondary font-sans font-medium text-base md:text-xl lg:text-2xl tracking-tight"
          >
            Hello there, we&apos;re a
          </motion.div>
        </div>
        
        <div 
          ref={containerRef}
          className="w-full flex justify-center md:justify-start items-center overflow-visible px-6 md:px-0"
        >
          <motion.h1
            ref={textRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-black text-[#ffffff] whitespace-normal md:whitespace-nowrap flex flex-col md:flex-row items-center gap-2 md:gap-[0.2em] w-full md:w-max text-center md:text-left"
            style={{ 
              fontSize: 'clamp(3rem, 10vw, 12rem)',
              fontFamily: 'var(--font-dm-sans)',
              letterSpacing: '0.01em',
              x: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : x
            }}
          >
            <span className="md:[webkit-text-stroke:0.5px_#ffffff]">Creative</span>
            <div className="flex items-center -mt-2 md:-mt-[1.5vw]">
               <StrokedText 
                 text="Digital" 
                 viewBox="0 0 350 120" 
                 height="clamp(4rem, 12vw, 14rem)"
                 strokeWidth={1.5}
                 letterSpacing="0.01em"
               />
            </div>
            <span className="md:[webkit-text-stroke:0.5px_#ffffff]">Agency</span>
          </motion.h1>
        </div>
      </div>
    </section>
  )
}
