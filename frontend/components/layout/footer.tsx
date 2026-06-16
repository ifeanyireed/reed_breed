"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useSpring, useMotionValue } from "framer-motion"
import {
  LinkedinLogo,
  TwitterLogo,
  InstagramLogo,
  FacebookLogo,
  DribbbleLogo,
  Envelope
} from "phosphor-react"

export const Footer = () => {
  const [isHovering, setIsHovering] = React.useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { damping: 40, stiffness: 400 })
  const springY = useSpring(mouseY, { damping: 40, stiffness: 400 })

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovering(true)
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <footer className="w-full flex flex-col">
      {/* Top Section - Let's Talk */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        className="relative h-[40vh] md:h-[50vh] flex items-center justify-center bg-accent overflow-hidden cursor-pointer md:cursor-none"
      >
        <Link
          href="/contact"
          className="relative z-10 w-full h-full flex items-center justify-center cursor-pointer md:cursor-none"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-black text-white leading-[0.8] tracking-tighter"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
          >
            Let&apos;s Talk
          </motion.div>
        </Link>

        {/* Custom Cursor Badge - Hidden on mobile */}
        <motion.div
          className="hidden md:flex pointer-events-none absolute top-0 left-0 z-50 items-center justify-center"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%"
          }}
          animate={{
            scale: isHovering ? 1 : 0,
            opacity: isHovering ? 1 : 0,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 250 }}
        >
          <div className="w-24 h-24 md:w-32 md:h-32 bg-void rounded-full flex items-center justify-center shadow-2xl border border-white/10">
            <Envelope size={32} weight="fill" className="text-white" />
          </div>
        </motion.div>
      </div>

      {/* Bottom Section - Brand & Info */}
      <div className="bg-void text-text-secondary pt-20 md:pt-24 pb-0 px-6 md:px-12 lg:px-24">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 lg:gap-24 mb-16 md:mb-20">
          {/* Left Side */}
          <div className="flex flex-col items-start md:col-span-1">
            <Link href="/" className="mb-6">
              <Image
                src="/logo.png"
                alt="Reed Breed Logo"
                width={70}
                height={70}
                className="object-contain"
              />
            </Link>
            <p className="text-lg md:text-xl font-medium text-text-secondary max-w-xs mb-8 leading-[1.1] tracking-tighter">
              Reed Breed is an AI-powered growth systems agency helping SMEs automate sales, marketing & engagement.
            </p>

            <div className="flex items-center gap-6 mt-4">
              <Link href="#" className="text-text-muted hover:text-white transition-colors">
                <LinkedinLogo size={28} />
              </Link>
              <Link href="#" className="text-text-muted hover:text-white transition-colors">
                <InstagramLogo size={28} />
              </Link>
              <Link href="#" className="text-text-muted hover:text-white transition-colors">
                <FacebookLogo size={28} />
              </Link>
              <Link href="#" className="text-text-muted hover:text-white transition-colors">
                <TwitterLogo size={28} />
              </Link>
              <Link href="#" className="text-text-muted hover:text-white transition-colors">
                <DribbbleLogo size={28} />
              </Link>
            </div>
          </div>

          {/* Quicklinks - Middle Section */}
          <div className="flex flex-col items-start md:col-span-1">
             <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8">Quicklinks</h4>
             <div className="flex flex-col gap-2">
                <Link href="/dashboard" className="text-lg md:text-xl font-medium text-text-muted hover:text-accent transition-colors tracking-tighter leading-[1.1]">
                   My Account
                </Link>
                <Link href="/pricing" className="text-lg md:text-xl font-medium text-text-muted hover:text-accent transition-colors tracking-tighter leading-[1.1]">
                   Pricing
                </Link>
                <Link href="/contact" className="text-lg md:text-xl font-medium text-text-muted hover:text-accent transition-colors tracking-tighter leading-[1.1]">
                   Book a Demo
                </Link>
                <Link href="/contact" className="text-lg md:text-xl font-medium text-text-muted hover:text-accent transition-colors tracking-tighter leading-[1.1]">
                   Request an Audit
                </Link>
                <Link href="/blog?category=promotions" className="text-lg md:text-xl font-medium text-text-muted hover:text-accent transition-colors tracking-tighter leading-[1.1]">
                   View Promotions
                </Link>
                <Link href="/contact" className="text-lg md:text-xl font-medium text-text-muted hover:text-accent transition-colors tracking-tighter leading-[1.1]">
                   Request a Visit
                </Link>
             </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col items-start md:ml-auto text-left w-full md:w-max md:col-span-1">
            <p
              className="text-lg md:text-xl font-medium text-white tracking-tighter leading-[1.1] max-w-[280px]"
              style={{ marginBottom: '40px' }}
            >
              22 Road, E Close, Opposite FHA, Festac, Amuwo-Odofin, Lagos Nigeria.
            </p>

            <div className="flex flex-col gap-6 items-start">
              <Link
                href="mailto:hello@reedbreed.cc"
                className="w-fit text-left text-lg md:text-xl font-medium text-white hover:text-accent transition-colors underline decoration-white/20 underline-offset-8 tracking-tighter leading-[1.1]"
              >
                hello@reedbreed.cc
              </Link>
              <Link
                href="tel:+2348067028859"
                className="w-fit text-left text-lg md:text-xl font-medium text-white hover:text-accent transition-colors underline decoration-white/20 underline-offset-8 tracking-tighter leading-[1.1]"
              >
                +234 806 702 8859
              </Link>
            </div>
          </div>
        </div>

        <div className="py-8 border-t border-white/5 flex justify-center items-center">
          <p className="text-text-muted font-medium tracking-tighter text-sm md:text-base">
            © 2026 Reed Breed Creative Consulting. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
