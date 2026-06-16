"use client"

import * as React from "react"
import { Star, PaperPlaneRight, Spinner, CheckCircle } from "phosphor-react"
import { StrokedText } from "@/components/ui/stroked-text"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { apiRequest } from "@/lib/api"

export default function ClientReviews() {
  const [rating, setRating] = React.useState(5)
  const [text, setText] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const { getToken } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setIsSubmitting(true)
    try {
      const res = await apiRequest('/reviews', {
        method: 'POST',
        body: JSON.stringify({ rating, text })
      }, getToken())

      if (res.ok) {
        setSubmitted(true)
        setText("")
      } else {
        const data = await res.json()
        alert(data.message || "Failed to submit review.")
      }
    } catch (err) {
      console.error("Review submission error", err)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center text-success mb-4">
          <CheckCircle size={48} weight="fill" />
        </div>
        <h2 className="text-4xl font-black text-white tracking-tighter">Review Submitted!</h2>
        <p className="text-text-secondary max-w-md mx-auto">
          Thank you for your feedback. Your review has been sent to our team for approval and will appear on our site shortly.
        </p>
        <Button variant="ghost" onClick={() => setSubmitted(false)} className="mt-8 border-white/10">
          Submit Another Review
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-start gap-4">
          <span className="text-accent font-black tracking-widest text-xs uppercase">Feedback & Testimonials</span>
          <div className="flex items-center gap-4">
            <h2 className="text-[5.5rem] font-black text-white tracking-tighter leading-[0.8]" style={{ WebkitTextStroke: '0.5px #ffffff' }}>
              Submit
            </h2>
            <div className="flex items-center -mt-2">
              <StrokedText 
                text="Review" 
                viewBox="0 0 350 120"
                height="4.5rem"
                strokeWidth={2}
                letterSpacing="-0.05em"
                opacity={1}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[40px] border-white/5 overflow-hidden bg-white/[0.01] p-12 max-w-3xl">
        <p className="text-text-secondary text-lg mb-8">
          Your feedback drives our growth. Share your experience working with Reed Breed, and let us know how we can improve.
        </p>

        <form className="space-y-8" onSubmit={handleSubmit}>
           <div>
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-4 block">Rate your experience</label>
              <div className="flex gap-2">
                 {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setRating(star)}
                      className="text-accent hover:scale-110 transition-transform outline-none"
                    >
                       <Star size={32} weight={star <= rating ? "fill" : "regular"} />
                    </button>
                 ))}
              </div>
           </div>

           <div>
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-4 block">Your Testimonial</label>
              <textarea 
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tell us about the impact of our execution..."
                className="w-full bg-surface/30 border border-white/10 rounded-2xl p-6 text-white focus:border-accent focus:bg-surface/50 transition-all outline-none text-base resize-none"
                required
              ></textarea>
           </div>

           <Button type="submit" size="lg" className="w-full sm:w-auto px-12 gap-3" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  Submitting...
                  <Spinner size={20} className="animate-spin" />
                </>
              ) : (
                <>
                  Submit Review
                  <PaperPlaneRight size={20} />
                </>
              )}
           </Button>
        </form>
      </div>
    </div>
  )
}
