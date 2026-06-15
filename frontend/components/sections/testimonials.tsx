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
              height="clamp(5rem, 12vw, 10rem)"
              strokeWidth={2}
              letterSpacing="-0.05em"
              className="-mt-[1.5vw]"
            />
          </motion.div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden">
            <motion.div 
              className="flex gap-12 lg:gap-20"
              animate={{ 
                x: `calc(-${currentIndex * (100 / 3)}% - ${currentIndex * (80 / 3)}px)` 
              }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
            >
              {/* Using original design, just added the slider logic */}
              {reviews.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex flex-col items-start w-[calc(33.333%-40px)] lg:w-[calc(33.333%-54px)] shrink-0"
                >
                  <div className="relative w-24 h-24 mb-10 overflow-hidden rounded-full">
                    <Image 
                      src={item.avatar}
                      alt={item.name}
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl font-bold text-white mb-8 leading-snug tracking-tight">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  
                  <div className="flex flex-col">
                    <span className="text-white/60 text-lg font-medium">— {item.name}, {item.company}</span>
                  </div>
                </div>
              ))}
              
              {/* Loop support: show first few items again if needed */}
              {reviews.length > 3 && reviews.slice(0, 3).map((item, index) => (
                <div
                  key={`loop-${item.name}-${index}`}
                  className="flex flex-col items-start w-[calc(33.333%-40px)] lg:w-[calc(33.333%-54px)] shrink-0 opacity-50"
                >
                  <div className="relative w-24 h-24 mb-10 overflow-hidden rounded-full">
                    <Image 
                      src={item.avatar}
                      alt={item.name}
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  <blockquote className="text-xl md:text-2xl font-bold text-white mb-8 leading-snug tracking-tight">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <div className="flex flex-col">
                    <span className="text-white/60 text-lg font-medium">— {item.name}, {item.company}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
