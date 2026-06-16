"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { StrokedText } from "@/components/ui/stroked-text"
import { 
  CheckCircle, 
  Calendar, 
  RocketLaunch, 
  Briefcase, 
  FileText,
  TrendUp,
  Headset,
  Clock,
  VideoCamera
} from "phosphor-react"
import { AppointmentModal } from "@/components/ui/appointment-modal"

import { useRouter } from "next/navigation"

export default function ClientDashboardOverview() {
  const { user, getToken } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = React.useState([])
  const [subscription, setSubscription] = React.useState<any>(null)
  const [appointments, setAppointments] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = React.useState(false)

  const fetchData = React.useCallback(async () => {
    try {
      const token = getToken()
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
      
      // Fetch Projects
      const projRes = await fetch(`${apiUrl}/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      if (projRes.ok) {
        const data = await projRes.json()
        setProjects(data)
      }

      // Fetch Subscription
      const subRes = await fetch(`${apiUrl}/client/subscription`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      if (subRes.ok) {
        const subData = await subRes.json()
        setSubscription(subData)
      }

      // Fetch Appointments
      const apptRes = await fetch(`${apiUrl}/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      if (apptRes.ok) {
        const apptData = await apptRes.json()
        setAppointments(apptData.filter((a: any) => a.status === 'Upcoming'))
      }

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSupportClick = () => {
    router.push('/dashboard/support')
  }

  return (
    <div className="space-y-12">
      <AppointmentModal 
        isOpen={isAppointmentModalOpen} 
        onClose={() => setIsAppointmentModalOpen(false)} 
        onSuccess={fetchData}
      />
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col items-start gap-4">
            <span className="text-accent font-black tracking-widest text-xs uppercase">Operations Hub</span>
            <div className="flex items-center gap-4">
              <h2 className="text-[5.5rem] font-black text-white tracking-tighter leading-[0.8]" style={{ WebkitTextStroke: '0.5px #ffffff' }}>
                Welcome
              </h2>
              <div className="flex items-center -mt-2">
                <StrokedText 
                  text={user?.name?.split(' ')[0] || "Overview"} 
                  viewBox="0 0 500 120"
                  height="4.5rem"
                  strokeWidth={2}
                  letterSpacing="-0.05em"
                  opacity={1}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass-card px-6 py-4 rounded-2xl border-white/5 flex items-center gap-4 bg-white/[0.02]">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent">
                <TrendUp weight="bold" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1">Account Tier</p>
                <p className="text-white font-bold tracking-tight">
                  {loading ? 'Synchronizing...' : (subscription?.plan?.name || 'No Active Plan')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Briefcase className="text-accent" />
              Active Executions
            </h2>
          </div>

          {loading ? (
            <div className="p-20 text-center glass-card rounded-[40px] border-white/5 bg-white/[0.01] flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent mb-6"></div>
              <p className="text-text-muted font-bold uppercase tracking-widest text-xs">Syncing with operations...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-20 text-center glass-card rounded-[40px] border-white/5 bg-white/[0.01]">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-text-muted">
                <FileText size={32} />
              </div>
              <p className="text-white font-bold text-xl mb-2">No active projects found</p>
              <p className="text-text-secondary mb-8">Ready to start something new?</p>
              <Button onClick={() => setIsAppointmentModalOpen(true)}>Initiate New Project</Button>
            </div>
          ) : projects.map((project: any, pIdx: number) => (
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
                        Commenced: {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8 md:p-10">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-8">Project Milestones</h4>
                <div className="relative space-y-0">
                  {/* Timeline connecting line */}
                  <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-white/5" />
                  
                  {project.deliverables?.map((del: any, dIdx: number) => (
                    <div key={del.id} className="relative flex items-start gap-8 pb-10 last:pb-0 group">
                      <div className={`mt-1 h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all duration-500 ${
                        del.status.toUpperCase() === "COMPLETED" 
                          ? "bg-accent border-accent text-white shadow-[0_0_15px_rgba(20,110,245,0.4)]" 
                          : "bg-void border-white/10 text-transparent"
                      }`}>
                        <CheckCircle size={16} weight="bold" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <p className={`text-lg font-bold transition-colors ${
                            del.status.toUpperCase() === "COMPLETED" ? "text-text-muted/60" : "text-white"
                          }`}>
                            {del.title}
                          </p>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                            del.status.toUpperCase() === "COMPLETED" ? "bg-white/5 text-text-muted" : "bg-accent/10 text-accent"
                          }`}>
                            {del.status}
                          </span>
                        </div>
                        {del.description && <p className="text-text-secondary text-sm mt-2 max-w-lg">{del.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar / Quick Actions */}
        <div className="space-y-10">
          {/* Upcoming Meetings Card */}
          {appointments.length > 0 && (
            <div className="glass-card p-8 rounded-[40px] border-white/5 bg-white/[0.01]">
              <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Calendar size={14} className="text-accent" />
                Next Engagement
              </h4>
              <div className="space-y-6">
                {appointments.slice(0, 2).map((appt) => (
                  <div key={appt.id} className="group">
                    <p className="text-white font-bold text-lg leading-tight mb-2 group-hover:text-accent transition-colors">
                      {appt.type}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] text-text-secondary font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {appt.time}
                      </span>
                    </div>
                    {appt.meeting_url ? (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="mt-4 w-full justify-center h-10 text-[10px] bg-accent/10 text-accent hover:bg-accent hover:text-white"
                        onClick={() => window.open(appt.meeting_url, '_blank')}
                      >
                        Join Call <VideoCamera className="ml-2" />
                      </Button>
                    ) : (
                      <p className="mt-4 text-[9px] text-white/20 font-black uppercase tracking-widest text-center border border-white/5 py-2 rounded-lg">
                        Meeting Link Pending
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass-card p-10 rounded-[40px] border-accent/20 bg-accent/5 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/10 blur-3xl rounded-full group-hover:bg-accent/20 transition-all duration-700" />
            
            <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-6">Strategic Access</h4>
            <p className="text-3xl font-black text-white mb-4 tracking-tighter">Support & Execution</p>
            <p className="text-text-secondary text-sm leading-relaxed mb-10">
              Direct access to your dedicated strategist and technical lead for current sprint updates.
            </p>
            
            <div className="space-y-4">
              <Button 
                className="w-full justify-between group/btn py-6 px-8 rounded-2xl h-auto"
                onClick={() => setIsAppointmentModalOpen(true)}
              >
                Book Strategy Session
                <RocketLaunch size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </Button>
              <Button 
                variant="ghost" 
                className="w-full py-6 px-8 rounded-2xl h-auto border-white/10 text-white gap-3 justify-start"
                onClick={handleSupportClick}
              >
                <Headset size={20} />
                Submit Support Ticket
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
