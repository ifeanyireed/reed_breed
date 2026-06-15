"use client"

import * as React from "react"
import { useParams, notFound } from "next/navigation"
import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { BlogSection } from "@/components/sections/blog-section"
import Image from "next/image"
import { apiRequest, getStorageUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"

interface Post {
  id: number
  slug: string
  category: { id: number, name: string }
  title: string
  date: string
  created_at: string
  image: string
  content: string
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = React.useState<Post | null>(null)
  const [loading, setLoading] = React.useState(true)
  
  // Comment Form State
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [commentBody, setCommentBody] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [commentSuccess, setCommentSuccess] = React.useState(false)
  const [commentError, setCommentError] = React.useState<string | null>(null)

  const fetchPost = React.useCallback(async () => {
    try {
      const res = await apiRequest(`/blog/posts/${slug}`)
      if (res.ok) {
        const data = await res.json()
        setPost(data)
      } else {
        notFound()
      }
    } catch (err) {
      console.error(err)
      notFound()
    } finally {
      setLoading(false)
    }
  }, [slug])

  React.useEffect(() => {
    fetchPost()
  }, [fetchPost])

  const handleCommentSubmit = async (e: React.MouseEvent) => {
    if (!name || !email || !commentBody) {
      setCommentError("Please fill in all fields.")
      return
    }

    setIsSubmitting(true)
    setCommentError(null)

    try {
      const res = await apiRequest('/blog/comments', {
        method: 'POST',
        body: JSON.stringify({
          post_slug: slug,
          name,
          email,
          body: commentBody
        })
      })

      if (res.ok) {
        setCommentSuccess(true)
        setName("")
        setEmail("")
        setCommentBody("")
      } else {
        const data = await res.json()
        setCommentError(data.message || "Failed to submit comment.")
      }
    } catch (err) {
      setCommentError("An error occurred.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (!post) return null

  return (
    <>
      <Navbar />
      <main className="relative bg-void overflow-hidden min-h-screen">
        {/* Fixed Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-accent/20 blur-[120px] rounded-full" />
          <div className="absolute top-[20%] right-[-5%] w-[60%] h-[60%] bg-accent-dim/15 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[20%] w-[80%] h-[60%] bg-accent/20 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] bg-repeat" />
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-6 relative z-10 pt-48 pb-24 md:pt-64 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            {/* The Dot */}
            <div className="w-3 h-3 bg-white rounded-full mb-12" />
            
            <div className="text-[10vw] md:text-[6vw] font-black text-white leading-[1.0] tracking-tighter mb-8 max-w-5xl">
              {post.title}
            </div>
            
            <p className="text-white font-bold text-lg md:text-xl uppercase tracking-widest mb-16">
              {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
        </div>

        {/* Post Content */}
        <div className="container mx-auto px-6 relative z-10 pb-32">
          <div className="max-w-4xl mx-auto">
             {/* Feature Image */}
             {post.image && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1 }}
                 className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-24 shadow-2xl"
               >
                 <Image 
                   src={getStorageUrl(post.image) || ""}
                   alt={post.title}
                   fill
                   className="object-cover"
                 />
               </motion.div>
             )}

             <div className="prose prose-invert prose-lg max-w-none mb-24">
                <div 
                  className="text-text-secondary text-xl md:text-2xl font-medium leading-relaxed space-y-8"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
             </div>

             {/* Author & Share Section */}
             <div className="flex flex-col md:flex-row items-center justify-between py-12 border-t border-b border-white/5 mb-24 gap-8">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-full overflow-hidden bg-surface relative">
                      <Image 
                        src="/director.jpg" 
                        alt="Author" 
                        fill 
                        className="object-cover"
                      />
                   </div>
                   <div className="text-left">
                      <p className="text-white font-bold text-lg">Ifeanyi Reed</p>
                      <p className="text-text-muted text-sm uppercase tracking-widest">Founder & Director</p>
                   </div>
                </div>
                
                <div className="flex items-center gap-4">
                   <span className="text-text-muted font-bold uppercase tracking-widest text-xs mr-4">Share this:</span>
                   {['Twitter', 'LinkedIn', 'Facebook'].map(platform => (
                      <button key={platform} className="px-6 py-2 rounded-full border border-white/10 text-white font-bold text-sm hover:bg-white hover:text-void transition-all">
                        {platform}
                      </button>
                   ))}
                </div>
             </div>

             {/* Comment Section */}
             <div className="max-w-2xl mx-auto pt-16">
                <h3 className="text-h3 font-black text-white mb-12 tracking-tighter">Leave a Comment</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Email</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your Email"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Comment</label>
                    <textarea 
                      rows={6}
                      value={commentBody}
                      onChange={(e) => setCommentBody(e.target.value)}
                      placeholder="What's on your mind?"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-colors resize-none"
                    ></textarea>
                  </div>
                  
                  {commentError && <p className="text-error text-xs font-bold">{commentError}</p>}
                  {commentSuccess && <p className="text-success text-xs font-bold">Comment submitted for approval!</p>}

                  <Button 
                    onClick={handleCommentSubmit}
                    disabled={isSubmitting}
                    className="w-full py-6 h-auto text-lg font-bold rounded-2xl"
                  >
                    {isSubmitting ? "Submitting..." : "Post Comment"}
                  </Button>
                </div>
             </div>
          </div>
        </div>

        {/* Related Posts */}
        <div className="border-t border-white/5 pt-20">
          <BlogSection title="Related Posts" excludeSlug={post.slug} />
        </div>
      </main>
      <Footer />
    </>
  )
}
