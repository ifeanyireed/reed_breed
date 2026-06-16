"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { StrokedText } from "@/components/ui/stroked-text"
import { apiRequest, getStorageUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"

interface Post {
  id: number
  slug: string
  category: { id: number, name: string }
  title: string
  image: string
}

export const BlogSection = ({ 
  isFullPage = false, 
  excludeSlug,
  title = "Blog"
}: { 
  isFullPage?: boolean,
  excludeSlug?: string,
  title?: string
}) => {
  const [hoveredId, setHoveredId] = React.useState<number | null>(null)
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 })
  const [posts, setPosts] = React.useState<Post[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchPosts = React.useCallback(async () => {
    try {
      const res = await apiRequest('/blog/posts')
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (err) {
      console.error("Failed to fetch posts", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleMouseMove = (e: React.MouseEvent, id: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const filteredPosts = excludeSlug 
    ? posts.filter(post => post.slug !== excludeSlug)
    : posts

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header - Only on Homepage or if specifically titled */}
        {!isFullPage && (
          <div className="w-full flex flex-col items-center mb-12 md:mb-24 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center items-center w-full"
            >
              <div className="flex items-center">
                <StrokedText 
                  text={title === "Blog" ? "Blog" : title} 
                  viewBox="0 0 500 120"
                  height="clamp(4rem, 12vw, 10rem)"
                  strokeWidth={2}
                  letterSpacing="-0.05em"
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 lg:gap-16 max-w-7xl mx-auto mb-16 md:mb-20">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col gap-6 md:gap-8 animate-pulse">
                <div className="aspect-[4/3] bg-white/5 rounded-sm" />
                <div className="space-y-4">
                  <div className="h-4 bg-white/5 w-1/4 rounded" />
                  <div className="h-12 bg-white/5 w-full rounded" />
                  <div className="h-10 bg-white/5 w-1/3 rounded-full" />
                </div>
              </div>
            ))
          ) : filteredPosts.length === 0 ? (
            <div className="md:col-span-3 text-center py-20 text-text-muted font-bold uppercase tracking-widest">No articles found.</div>
          ) : filteredPosts.slice(0, 3).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
              onMouseMove={(e) => handleMouseMove(e, post.id)}
              className="flex flex-col group cursor-none md:cursor-none"
            >
              <div className="relative aspect-[4/3] mb-6 md:mb-8 overflow-hidden rounded-sm bg-surface shadow-xl">
                {post.image ? (
                  <Image 
                    src={getStorageUrl(post.image) || ""}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-text-muted">No Image</div>
                )}
                
                {/* Custom Cursor Badge - Hidden on mobile */}
                <motion.div
                  className="hidden md:flex pointer-events-none absolute z-50 items-center justify-center"
                  animate={{
                    x: mousePos.x - 40,
                    y: mousePos.y - 40,
                    scale: hoveredId === post.id ? 1 : 0,
                    opacity: hoveredId === post.id ? 1 : 0,
                  }}
                  transition={{ type: "spring", damping: 30, stiffness: 250, mass: 0.5 }}
                >
                  <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-2xl">
                     <div className="absolute inset-0 flex items-center justify-center animate-[spin_8s_linear_infinite]">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <path id={`blogCirclePath-${post.id}`} d="M 50, 50 m -28, 0 a 28,28 0 1,1 56,0 a 28,28 0 1,1 -56,0" fill="none" />
                          <text className="text-[10px] font-black uppercase tracking-[0.1em] fill-void">
                            <textPath xlinkHref={`#blogCirclePath-${post.id}`}>READ MORE READ MORE</textPath>
                          </text>
                        </svg>
                     </div>
                     <div className="relative z-10 w-2 h-2 bg-void rounded-full" />
                  </div>
                </motion.div>
              </div>
              
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <span className="text-white font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  {post.category?.name}
                </span>
              </div>

              <div className="text-[9vw] md:text-[4vw] lg:text-[2.8vw] xl:text-[2.2vw] font-extrabold text-white mb-6 md:mb-8 leading-[1.1] tracking-tighter group-hover:text-accent transition-colors">
                {post.title}
              </div>
              
              <Link href={`/blog/${post.slug}`}>
                <Button 
                  className="w-full md:w-auto px-8 py-4 h-auto rounded-full font-bold text-base transition-all duration-300"
                >
                  Read More
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {!isFullPage && (
          <div className="flex justify-center">
            <Link href="/blog">
              <Button 
                className="px-12 py-6 h-auto text-xl font-sans font-bold tracking-tight whitespace-nowrap rounded-full transition-all duration-500"
              >
                View All
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
