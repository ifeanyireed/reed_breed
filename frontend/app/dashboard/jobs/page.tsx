"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Briefcase, Calendar, CheckCircle } from "phosphor-react"
import { useAuth } from "@/context/auth-context"
import { StrokedText } from "@/components/ui/stroked-text"
import { Button } from "@/components/ui/button"

export default function ClientJobs() {
  const { getToken } = useAuth()
  const [projects, setProjects] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = getToken()
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
        const res = await fetch(`${apiUrl}/projects`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })
        if (res.ok) {
          const data = await res.json()
          setProjects(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [getToken])

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-start gap-4">
          <span className="text-accent font-black tracking-widest text-xs uppercase">Job Progress Tracking</span>
          <div className="flex items-center gap-4">
            <h2 className="text-[5.5rem] font-black text-white tracking-tighter leading-[0.8]" style={{ WebkitTextStroke: '0.5px #ffffff' }}>
              Your
            </h2>
            <div className="flex items-center -mt-2">
              <StrokedText 
                text="Projects" 
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
          <div className="p-20 text-center text-text-muted font-bold uppercase tracking-widest text-xs">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="p-20 text-center glass-card rounded-[40px] border-white/5 bg-white/[0.01]">
             <Briefcase size={48} className="mx-auto text-text-muted mb-6" />
             <p className="text-white font-bold text-xl mb-2">No active projects</p>
             <p className="text-text-secondary mb-8">Ready to start a new execution?</p>
             <Button>Request New Project</Button>
          </div>
        ) : (
          projects.map((project: any, pIdx: number) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: pIdx * 0.1, duration: 0.8 }}
              className="glass-card rounded-[40px] border-white/5 overflow-hidden shadow-2xl bg-white/[0.01]"
            >
              <div className="p-8 md:p-10 border-b border-white/5 bg-white/[0.02]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">{project.name}</h3>
                    <div className="flex flex-wrap items-center gap-6">
                      <span className="flex items-center gap-2 text-[11px] font-bold text-accent uppercase tracking-widest">
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                        {project.status}
                      </span>
                      <span className="flex items-center gap-2 text-[11px] font-bold text-text-muted uppercase tracking-widest">
                        <Calendar size={14} />
                        Commenced: {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost">View Details</Button>
                </div>
              </div>
              
              <div className="p-8 md:p-10">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-8">Deliverables & Milestones</h4>
                <div className="relative space-y-0">
                  <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-white/5" />
                  
                  {project.deliverables?.map((del: any) => (
                    <div key={del.id} className="relative flex items-start gap-8 pb-10 last:pb-0 group">
                      <div className={`mt-1 h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all duration-500 ${
                        del.status === "COMPLETED" 
                          ? "bg-accent border-accent text-white shadow-[0_0_15px_rgba(20,110,245,0.4)]" 
                          : "bg-void border-white/10 text-transparent"
                      }`}>
                        <CheckCircle size={16} weight="bold" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <p className={`text-lg font-bold transition-colors ${
                            del.status === "COMPLETED" ? "text-text-muted/60" : "text-white"
                          }`}>
                            {del.title}
                          </p>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                            del.status === "COMPLETED" ? "bg-white/5 text-text-muted" : "bg-accent/10 text-accent"
                          }`}>
                            {del.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
