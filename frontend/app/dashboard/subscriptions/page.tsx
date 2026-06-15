"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Crown, CheckCircle } from "phosphor-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { StrokedText } from "@/components/ui/stroked-text"

export default function ClientSubscriptions() {
  const { getToken } = useAuth()
  const [subscription, setSubscription] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken()
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
        const res = await fetch(`${apiUrl}/client/subscription`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })
        if (res.ok) {
          const data = await res.json()
          setSubscription(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [getToken])

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-start gap-4">
          <span className="text-accent font-black tracking-widest text-xs uppercase">Subscription Management</span>
          <div className="flex items-center gap-4">
            <h2 className="text-[5.5rem] font-black text-white tracking-tighter leading-[0.8]" style={{ WebkitTextStroke: '0.5px #ffffff' }}>
              Your
            </h2>
            <div className="flex items-center -mt-2">
              <StrokedText 
                text="Plan" 
                viewBox="0 0 300 120"
                height="4.5rem"
                strokeWidth={2}
                letterSpacing="-0.05em"
                opacity={1}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[40px] border-white/5 overflow-hidden bg-white/[0.01]">
        {loading ? (
          <div className="p-20 text-center text-text-muted font-bold uppercase tracking-widest text-xs">Loading subscription data...</div>
        ) : subscription ? (
          <div className="p-12 flex flex-col md:flex-row gap-12 items-center">
             <div className="w-full md:w-1/3 glass-card rounded-3xl p-8 border-accent/20 bg-accent/5 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center text-accent mb-6">
                   <Crown size={40} weight="duotone" />
                </div>
                <h3 className="text-3xl font-black text-white mb-2">{subscription.plan.name}</h3>
                <p className="text-4xl font-black text-white mb-6 tracking-tighter">${subscription.plan.price}<span className="text-lg text-text-muted font-medium tracking-normal">/{subscription.plan.interval}</span></p>
                <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full font-bold text-xs uppercase tracking-widest">
                   <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                   {subscription.status}
                </div>
             </div>

             <div className="w-full md:w-2/3 space-y-8">
                <div>
                   <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Included Features</h4>
                   <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {subscription.plan.features?.split(',').map((f: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-white font-bold">
                           <CheckCircle size={20} className="text-accent" weight="fill" />
                           {f.trim()}
                        </li>
                      ))}
                   </ul>
                </div>

                <div className="pt-8 border-t border-white/5">
                   <div className="flex flex-wrap gap-4">
                      <Button>Upgrade Plan</Button>
                      <Button variant="ghost">Cancel Subscription</Button>
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="p-20 text-center">
             <Crown size={48} className="mx-auto text-text-muted mb-6" />
             <p className="text-white font-bold text-xl mb-2">No Active Subscription</p>
             <p className="text-text-secondary mb-8">You do not have an active service plan.</p>
             <Button>View Available Plans</Button>
          </div>
        )}
      </div>
    </div>
  )
}
