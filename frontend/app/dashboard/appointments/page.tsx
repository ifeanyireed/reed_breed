"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, VideoCamera } from "phosphor-react"
import { useAuth } from "@/context/auth-context"
import { StrokedText } from "@/components/ui/stroked-text"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ClientAppointments() {
  const { getToken } = useAuth()
  const [appointments, setAppointments] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = getToken()
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
        const res = await fetch(`${apiUrl}/appointments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })
        if (res.ok) {
          const data = await res.json()
          setAppointments(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [getToken])

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-start gap-4">
          <span className="text-accent font-black tracking-widest text-xs uppercase">Strategy & Support</span>
          <div className="flex items-center gap-4">
            <h2 className="text-[5.5rem] font-black text-white tracking-tighter leading-[0.8]" style={{ WebkitTextStroke: '0.5px #ffffff' }}>
              Your
            </h2>
            <div className="flex items-center -mt-2">
              <StrokedText 
                text="Meetings" 
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

      <div className="grid grid-cols-1 gap-10">
        {loading ? (
          <div className="p-20 text-center text-text-muted font-bold uppercase tracking-widest text-xs">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="p-20 text-center glass-card rounded-[40px] border-white/5 bg-white/[0.01]">
             <Calendar size={48} className="mx-auto text-text-muted mb-6" />
             <p className="text-white font-bold text-xl mb-2">No upcoming meetings</p>
             <p className="text-text-secondary mb-8">Need to discuss your project?</p>
             <Link href="/contact">
               <Button>Book a Call</Button>
             </Link>
          </div>
        ) : (
          appointments.map((appt: any, pIdx: number) => (
            <motion.div 
              key={appt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: pIdx * 0.1, duration: 0.8 }}
              className="glass-card rounded-[40px] border-white/5 overflow-hidden shadow-2xl bg-white/[0.01] p-8 md:p-10"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                       <VideoCamera size={28} weight="duotone" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{appt.type}</h3>
                      <div className="flex flex-wrap items-center gap-6">
                        <span className="flex items-center gap-2 text-[11px] font-bold text-text-muted uppercase tracking-widest">
                          <Calendar size={14} />
                          {new Date(appt.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-2 text-[11px] font-bold text-text-muted uppercase tracking-widest">
                          <Clock size={14} />
                          {appt.time}
                        </span>
                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                         appt.status === 'Completed' ? 'bg-success/10 text-success' : 
                         appt.status === 'Cancelled' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                       }`}>
                         {appt.status}
                       </span>
                      </div>
                      {appt.notes && <p className="text-text-secondary text-sm mt-4 italic">"{appt.notes}"</p>}
                    </div>
                  </div>
                  {appt.meeting_url && appt.status !== 'Completed' && appt.status !== 'Cancelled' ? (
                     <a href={appt.meeting_url} target="_blank" rel="noreferrer">
                       <Button>Join Meeting</Button>
                     </a>
                  ) : (
                     <Button variant="ghost" disabled>
                       {appt.status === 'Completed' ? 'Completed' : appt.status === 'Cancelled' ? 'Cancelled' : 'Link Pending'}
                     </Button>
                  )}
                </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
