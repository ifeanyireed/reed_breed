"use client"

import * as React from "react"
import { Star, CheckCircle, Trash, Spinner, XCircle } from "phosphor-react"
import { StrokedText } from "@/components/ui/stroked-text"
import { useAuth } from "@/context/auth-context"
import { apiRequest } from "@/lib/api"

interface Review {
  id: number
  rating: number
  text: string
  status: string
  user?: {
    name: string
    email: string
  }
}

export default function AdminReviews() {
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [loading, setLoading] = React.useState(true)
  const { getToken } = useAuth()

  const fetchReviews = React.useCallback(async () => {
    try {
      const res = await apiRequest('/reviews', {}, getToken())
      if (res.ok) {
        const data = await res.json()
        setReviews(data)
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  React.useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await apiRequest(`/reviews/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }, getToken())
      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r))
      }
    } catch (err) {
      console.error("Failed to update review", err)
    }
  }

  const deleteReview = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return
    try {
      const res = await apiRequest(`/reviews/${id}`, {
        method: 'DELETE'
      }, getToken())
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== id))
      }
    } catch (err) {
      console.error("Failed to delete review", err)
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-start gap-4">
          <span className="text-accent font-black tracking-widest text-xs uppercase">Client Feedback</span>
          <div className="flex items-center gap-4">
            <h2 className="text-[5.5rem] font-black text-white tracking-tighter leading-[0.8]" style={{ WebkitTextStroke: '0.5px #ffffff' }}>
              Review
            </h2>
            <div className="flex items-center -mt-2">
              <StrokedText 
                text="Approval" 
                viewBox="0 0 500 120"
                height="4.5rem"
                strokeWidth={2}
                letterSpacing="-0.05em"
                opacity={1}
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center text-text-muted font-bold tracking-widest uppercase flex flex-col items-center gap-4">
           <Spinner size={32} className="animate-spin" />
           Initializing Review Pipeline...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map(review => (
              <div key={review.id} className="glass-card p-10 rounded-[40px] border-white/5 bg-white/[0.01] flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{review.user?.name || 'Anonymous Client'}</h3>
                      <p className="text-xs text-text-muted uppercase font-bold tracking-widest mb-3">{review.user?.email}</p>
                      <div className="flex gap-1 text-accent">
                          {[...Array(5)].map((_, i) => (
                             <Star key={i} size={16} weight={i < review.rating ? "fill" : "regular"} />
                          ))}
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      review.status === 'Approved' ? 'bg-success/10 text-success' : 
                      review.status === 'Pending' ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                    }`}>
                      {review.status}
                    </span>
                </div>
                
                <p className="text-text-secondary leading-relaxed mb-8 italic flex-1">"{review.text}"</p>
                
                <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-auto">
                    {review.status !== 'Approved' && (
                      <button 
                        onClick={() => updateStatus(review.id, 'Approved')}
                        className="flex-1 py-3 rounded-xl hover:bg-success/10 text-text-muted hover:text-success transition-all font-bold text-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={20} /> Approve
                      </button>
                    )}
                    <button 
                      onClick={() => deleteReview(review.id)}
                      className="flex-1 py-3 rounded-xl hover:bg-error/10 text-text-muted hover:text-error transition-all font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <Trash size={20} /> Delete
                    </button>
                </div>
              </div>
          ))}
          {reviews.length === 0 && (
             <div className="col-span-full p-20 text-center glass-card rounded-[40px] border-white/5">
                <p className="text-text-muted font-bold tracking-widest uppercase">No reviews pending approval.</p>
             </div>
          )}
        </div>
      )}
    </div>
  )
}
