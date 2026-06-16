"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  VideoCamera, 
  Plus,
  CheckCircle,
  XCircle,
  Trash,
  CaretLeft,
  CaretRight
} from "phosphor-react"
import { StrokedText } from "@/components/ui/stroked-text"
import { ManualEntryModal } from "@/components/ui/manual-entry-modal"
import { apiRequest } from "@/lib/api"
import { useAuth } from "@/context/auth-context"

interface Appointment {
  id: number
  name: string
  email: string
  date: string
  time: string
  type: string
  status: string
  notes: string | null
  meeting_url: string | null
}

export default function CalendarPage() {
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  
  // Calendar State
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear())

  const { getToken } = useAuth()

  const fetchAppointments = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiRequest('/appointments', {}, getToken())
      if (res.ok) {
        setAppointments(await res.json())
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  React.useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await apiRequest(`/appointments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }, getToken())
      if (res.ok) {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const updateMeetingUrl = async (id: number, url: string) => {
    try {
      const res = await apiRequest(`/appointments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ meeting_url: url })
      }, getToken())
      if (res.ok) {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, meeting_url: url } : a))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const deleteAppointment = async (id: number) => {
    if (!window.confirm("Delete this appointment?")) return
    try {
      const res = await apiRequest(`/appointments/${id}`, { method: 'DELETE' }, getToken())
      if (res.ok) {
        setAppointments(prev => prev.filter(a => a.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Calendar Logic
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay()

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const today = new Date()
  const isToday = (day: number) => 
    day === today.getDate() && 
    currentMonth === today.getMonth() && 
    currentYear === today.getFullYear()

  const hasAppointmentOnDay = (day: number) => {
    const formattedDay = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return appointments.some(a => a.date === formattedDay)
  }

  if (loading && appointments.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-12 text-white">
      <ManualEntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaved={fetchAppointments}
      />
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-start gap-4">
          <span className="text-accent font-black tracking-widest text-xs uppercase">Schedule Management</span>
          <div className="flex items-center gap-4">
            <h2 className="text-[5.5rem] font-black text-white tracking-tighter leading-[0.8]" style={{ WebkitTextStroke: '0.5px #ffffff' }}>
              Booked
            </h2>
            <div className="flex items-center -mt-2">
              <StrokedText 
                text="Calls" 
                viewBox="0 0 250 120"
                height="4.5rem"
                strokeWidth={2}
                letterSpacing="-0.05em"
                opacity={1}
              />
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 px-8 py-3 bg-accent text-white rounded-2xl font-bold hover:bg-accent-dim transition-all shadow-lg shadow-accent/20 mb-2"
        >
          <Plus size={20} weight="bold" />
          <span className="text-sm uppercase tracking-widest">Manual Entry</span>
        </button>
      </div>

      {/* Main Grid Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Calendar Widget */}
        <div className="glass-card rounded-[40px] border-white/5 p-10 bg-white/[0.01] h-fit">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white tracking-tighter">{monthNames[currentMonth]} {currentYear}</h3>
              <div className="flex gap-2">
                 <button onClick={prevMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
                    <CaretLeft size={18} />
                 </button>
                 <button onClick={nextMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
                    <CaretRight size={18} />
                 </button>
              </div>
           </div>
           
           <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-[10px] font-black text-text-muted uppercase tracking-widest">{day}</div>
              ))}
           </div>
           <div className="grid grid-cols-7 gap-2">
              {/* Padding for first day */}
              {Array.from({ length: firstDayOfMonth(currentMonth, currentYear) }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth(currentMonth, currentYear) }).map((_, i) => {
                const day = i + 1;
                const active = isToday(day);
                const hasAppt = hasAppointmentOnDay(day);
                return (
                  <div 
                    key={i} 
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      active ? 'bg-accent text-white shadow-lg shadow-accent/30' : 
                      hasAppt ? 'bg-white/10 text-white' : 'text-text-muted hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {day}
                    {hasAppt && !active && <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1" />}
                  </div>
                )
              })}
           </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2 glass-card rounded-[40px] border-white/5 overflow-hidden bg-white/[0.01]">
          <div className="p-10 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-2xl font-black text-white tracking-tighter">Appointments Overview</h3>
          </div>
          
          <div className="divide-y divide-white/5 min-h-[400px]">
            {appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-text-muted gap-4">
                <CalendarIcon size={48} weight="duotone" className="opacity-20" />
                <p className="font-bold uppercase tracking-widest text-sm">No scheduled calls found</p>
              </div>
            ) : appointments.map((appt, i) => (
              <motion.div 
                key={appt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-8 hover:bg-white/[0.03] transition-colors flex flex-col xl:flex-row xl:items-center justify-between gap-6 group"
              >
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                     <VideoCamera size={28} weight="duotone" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                       <h4 className="font-black text-white text-lg tracking-tight group-hover:text-accent transition-colors">{appt.name}</h4>
                       <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                         appt.status === 'Completed' ? 'bg-success/10 text-success' : 
                         appt.status === 'Cancelled' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                       }`}>
                         {appt.status}
                       </span>
                    </div>
                    <p className="text-sm text-text-muted">{appt.email} • {appt.type}</p>
                    
                    <div className="mt-4 flex flex-col gap-2">
                       <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            placeholder="Add meeting link (Zoom, Google Meet...)"
                            defaultValue={appt.meeting_url || ''}
                            onBlur={(e) => updateMeetingUrl(appt.id, e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-accent w-full max-w-sm"
                          />
                          {appt.meeting_url && (
                            <a 
                              href={appt.meeting_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-white transition-all"
                            >
                              <VideoCamera size={14} />
                            </a>
                          )}
                       </div>
                    </div>

                    {appt.notes && <p className="text-xs text-text-secondary mt-2 line-clamp-1 italic">"{appt.notes}"</p>}
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-start sm:items-end gap-2 bg-white/5 px-6 py-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <CalendarIcon size={16} className="text-accent" />
                      {new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary text-xs font-bold uppercase tracking-wider">
                      <Clock size={16} />
                      {appt.time}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {appt.status !== 'Completed' && (
                      <button 
                        onClick={() => updateStatus(appt.id, 'Completed')}
                        className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted hover:text-success hover:bg-success/10 transition-all" 
                        title="Complete"
                      >
                        <CheckCircle size={20} />
                      </button>
                    )}
                    {appt.status !== 'Cancelled' && (
                      <button 
                        onClick={() => updateStatus(appt.id, 'Cancelled')}
                        className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted hover:text-error hover:bg-error/10 transition-all" 
                        title="Cancel"
                      >
                        <XCircle size={20} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteAppointment(appt.id)}
                      className="w-10 h-10 rounded-xl bg-error/5 flex items-center justify-center text-error hover:bg-error hover:text-white transition-all" 
                      title="Delete"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
