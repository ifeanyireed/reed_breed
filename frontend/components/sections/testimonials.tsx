"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { StrokedText } from "@/components/ui/stroked-text"

interface Review {
  id: number
  text: string
  rating: number
  user?: {
    name: string
    company?: string
  }
}

const defaultTestimonials = [
  {
    quote:
      "Reed Breed didn't just build us a website — they built us a system. Our booking inquiries tripled within the first month of launch.",
    name: "Adaeze Okonkwo",
    company: "Queening Bridals",
    avatar: "/avatar1.jpg",
  },
  {
    quote:
      "The pitch deck they created for our school was the most professional thing we've ever presented to investors. We closed funding within two weeks.",
    name: "Emeka Nwosu",
    company: "Loral International Schools",
    avatar: "/avatar2.jpg",
  },
  {
    quote:
      "Working with Reed Breed feels like having a full in-house creative team. They understand the African market and they deliver at a world-class level.",
    name: "Tolu Adeyemi",
    company: "Rise Ventures",
    avatar: "/avatar3.jpg",
  },
];

export const Testimonials = () => {
  const [reviews, setReviews] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    const fetchReviews = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
        const res = await fetch(`${apiUrl}/reviews/public`)
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setReviews(data.map((r: Review) => ({
              quote: r.text,
              name: r.user?.name || "Client",
              company: "Verified Partner",
              avatar: `/avatar${(r.id % 3) + 1}.jpg`
            })))
          } else {
            setReviews(defaultTestimonials)
          }
        } else {
          setReviews(defaultTestimonials)
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err)
        setReviews(defaultTestimonials)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  React.useEffect(() => {
    if (reviews.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [reviews.length])

  return (
    <section className="relative py-24 md:py-32 lg:py-48 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex justify-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center"
          >
            <StrokedText 
              text="Testimonials" 
              viewBox="0 0 700 120"
              height="clamp(4rem, 12vw, 10rem)"
              strokeWidth={2}
              letterSpacing="-0.05em"
              className="-mt-[1.5vw]"
            />
          </motion.div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 md:px-0">
          <div className="overflow-hidden">
            <motion.div 
              className="flex gap-8 md:gap-12 lg:gap-20"
              animate={{ 
                // Dynamically handle mobile (1 item), tablet (2 items), desktop (3 items)
                x: typeof window !== 'undefined' && window.innerWidth < 768 
                  ? `calc(-${currentIndex * 100}% - ${currentIndex * 32}px)`
                  : typeof window !== 'undefined' && window.innerWidth < 1024
                    ? `calc(-${currentIndex * 50}% - ${currentIndex * 48}px)`
                    : `calc(-${currentIndex * (100 / 3)}% - ${currentIndex * (80 / 3)}px)`
              }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
            >
              {reviews.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex flex-col items-start w-full md:w-[calc(50%-24px)] lg:w-[calc(33.333%-54px)] shrink-0"
                >
                  <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mb-6 md:mb-8 lg:mb-10 overflow-hidden rounded-full">
                    <Image 
                      src={item.avatar}
                      alt={item.name}
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  
                  <blockquote className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-6 md:mb-8 leading-snug tracking-tight">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  
                  <div className="flex flex-col mt-auto">
                    <span className="text-white/60 text-base md:text-lg font-medium">— {item.name}</span>
                    <span className="text-accent/60 text-xs md:text-sm font-bold uppercase tracking-widest">{item.company}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Mobile Pagination Dots */}
          <div className="flex justify-center gap-2 mt-12 md:hidden">
             {reviews.map((_, i) => (
               <button 
                 key={i}
                 onClick={() => setCurrentIndex(i)}
                 className={`w-2 h-2 rounded-full transition-all ${currentIndex === i ? 'w-8 bg-accent' : 'bg-white/20'}`}
               />
             ))}
          </div>
        </div>
      </div>
    </section>
  )
}
