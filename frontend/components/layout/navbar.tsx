"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Button } from "@/components/ui/button"
import { List, X, CaretRight } from "phosphor-react"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "relative text-lg font-sans font-bold transition-colors hover:text-[#ffffff] tracking-tight",
        isActive ? "text-[#ffffff]" : "text-text-secondary"
      )}
    >
      {children}
    </Link>
  )
}

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500",
          isScrolled 
            ? "py-4 bg-void/70 backdrop-blur-md border-b border-white/5" 
            : "py-8 bg-transparent"
        )}
      >
        <div className="max-w-[1920px] mx-auto  flex items-center justify-between px-6 md:px-12">
          <div className="flex-1">
            <Link href="/" className="flex items-center w-fit">
              <Image
                src="/logo.png"
                alt="Reed Breed Logo"
                width={50}
                height={50}
                className="object-contain"
                priority={true}
              />
            </Link>
          </div>

          {/* Desktop Nav - Centered */}
          <div className="hidden items-center gap-8 lg:flex">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/work">Work</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>

          {/* Right Side CTA */}
          <div className="flex-1 hidden lg:flex justify-end">
            <Link href="/contact" className="cursor-pointer">
              <Button size="md" className="px-6 py-2.5 h-fit text-lg font-sans font-bold tracking-tight whitespace-nowrap rounded-full">
                Get in Touch
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="text-[#ffffff] lg:hidden relative z-[70] cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={32} /> : <List size={32} />}
          </button>
          </div>
          </nav>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
          <div
          className="fixed inset-0 z-[60] bg-void/80 backdrop-blur-md lg:hidden animate-in fade-in duration-700 cursor-pointer"
          onClick={() => setIsMobileMenuOpen(false)}
          >
          <div
            className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-void border-l border-white/5 p-8 pt-24 animate-in slide-in-from-right duration-700 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Inside Menu */}
            <button
              className="absolute top-6 right-6 text-[#ffffff] hover:text-accent transition-colors cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>

            <div className="flex flex-col items-start gap-8">
              <Link href="/" className="text-[15px] font-medium text-text-secondary hover:text-[#ffffff] transition-colors cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link href="/about" className="text-[15px] font-medium text-text-secondary hover:text-[#ffffff] transition-colors cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              <Link href="/work" className="text-[15px] font-medium text-text-secondary hover:text-[#ffffff] transition-colors cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>Work</Link>
              <Link href="/blog" className="text-[15px] font-medium text-text-secondary hover:text-[#ffffff] transition-colors cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
              <Link href="/contact" className="text-[15px] font-medium text-text-secondary hover:text-[#ffffff] transition-colors cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              <div className="w-full pt-8 border-t border-white/5">
                <Link href="/contact" className="w-full cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full gap-2 whitespace-nowrap" size="lg">
                    Book Call <CaretRight weight="bold" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
