"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChatCircleDots, Plus, PaperPlaneRight, CaretLeft, Clock, Info } from "phosphor-react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { StrokedText } from "@/components/ui/stroked-text"
import { apiRequest } from "@/lib/api"

interface Ticket {
  id: number
  subject: string
  category: string
  status: string
  priority: string
  created_at: string
  messages?: Message[]
}

interface Message {
  id: number
  user_id: number
  message: string
  created_at: string
  user: { name: string }
}

export default function ClientSupport() {
  const { user, getToken } = useAuth()
  const [tickets, setTickets] = React.useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)

  // Create Ticket State
  const [subject, setSubject] = React.useState("")
  const [category, setCategory] = React.useState("General")
  const [priority, setPriority] = React.useState("Medium")
  const [message, setMessage] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Reply State
  const [reply, setReply] = React.useState("")
  const [isReplying, setIsReplying] = React.useState(false)

  const fetchTickets = React.useCallback(async () => {
    try {
      const res = await apiRequest('/support/tickets', {}, getToken())
      if (res.ok) {
        setTickets(await res.json())
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  React.useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const fetchTicketDetails = async (id: number) => {
    try {
      const res = await apiRequest(`/support/tickets/${id}`, {}, getToken())
      if (res.ok) {
        setSelectedTicket(await res.json())
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await apiRequest('/support/tickets', {
        method: 'POST',
        body: JSON.stringify({ subject, category, priority, message })
      }, getToken())
      if (res.ok) {
        await fetchTickets()
        setIsCreateModalOpen(false)
        setSubject("")
        setMessage("")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicket || !reply.trim()) return
    setIsReplying(true)
    try {
      const res = await apiRequest(`/support/tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ message: reply })
      }, getToken())
      if (res.ok) {
        const newMessage = await res.json()
        setSelectedTicket(prev => prev ? {
          ...prev,
          messages: [...(prev.messages || []), newMessage]
        } : null)
        setReply("")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsReplying(false)
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col items-start gap-4">
          <span className="text-accent font-black tracking-widest text-xs uppercase">Help & Assistance</span>
          <div className="flex items-center gap-4">
            <h2 className="text-[5.5rem] font-black text-white tracking-tighter leading-[0.8]" style={{ WebkitTextStroke: '0.5px #ffffff' }}>
              Support
            </h2>
            <div className="flex items-center -mt-2">
              <StrokedText 
                text="Center" 
                viewBox="0 0 250 120"
                height="4.5rem"
                strokeWidth={2}
                letterSpacing="-0.05em"
                opacity={1}
              />
            </div>
          </div>
        </div>
        {!selectedTicket && (
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus weight="bold" />
            New Ticket
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-10">
        {selectedTicket ? (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-[40px] border-white/5 overflow-hidden bg-white/[0.01]"
          >
            <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedTicket(null)} className="p-2 rounded-full hover:bg-white/5 text-text-muted hover:text-white transition-colors">
                   <CaretLeft size={24} weight="bold" />
                </button>
                <div>
                   <h3 className="text-xl font-bold text-white">{selectedTicket.subject}</h3>
                   <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">Ticket #{selectedTicket.id} • {selectedTicket.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                   selectedTicket.status === 'Open' ? 'bg-accent/10 text-accent' :
                   selectedTicket.status === 'In Progress' ? 'bg-warning/10 text-warning' :
                   'bg-success/10 text-success'
                 }`}>
                   {selectedTicket.status}
                 </span>
              </div>
            </div>

            <div className="p-8 h-[500px] overflow-y-auto custom-scrollbar space-y-6">
               {selectedTicket.messages?.map((msg) => (
                 <div key={msg.id} className={`flex ${msg.user_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.user_id === user?.id 
                        ? 'bg-accent/10 border border-accent/20 text-white rounded-tr-none' 
                        : 'bg-white/5 border border-white/10 text-text-secondary rounded-tl-none'
                    }`}>
                       <p className="text-sm leading-relaxed">{msg.message}</p>
                       <div className="flex items-center justify-between mt-3 gap-8">
                          <span className="text-[10px] font-bold text-white/40">{msg.user.name}</span>
                          <span className="text-[10px] text-white/20">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            <div className="p-8 border-t border-white/5 bg-white/[0.02]">
               <form onSubmit={handleReply} className="relative">
                  <textarea 
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full bg-void border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-accent resize-none min-h-[100px]"
                  />
                  <button 
                    disabled={isReplying || !reply.trim()}
                    className="absolute bottom-4 right-4 p-3 bg-accent text-white rounded-xl hover:bg-accent-dim transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
                  >
                    <PaperPlaneRight size={20} weight="bold" />
                  </button>
               </form>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {loading ? (
              <div className="p-20 text-center text-text-muted font-bold uppercase tracking-widest text-xs">Syncing communications...</div>
            ) : tickets.length === 0 ? (
              <div className="p-20 text-center glass-card rounded-[40px] border-white/5 bg-white/[0.01]">
                 <ChatCircleDots size={48} className="mx-auto text-text-muted mb-6 opacity-20" />
                 <p className="text-white font-bold text-xl mb-2">No active tickets</p>
                 <p className="text-text-secondary mb-8 text-sm">Need help with your project or billing? We're here to assist.</p>
                 <Button onClick={() => setIsCreateModalOpen(true)}>Create First Ticket</Button>
              </div>
            ) : (
              tickets.map((ticket, idx) => (
                <motion.div 
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => fetchTicketDetails(ticket.id)}
                  className="glass-card p-8 rounded-[32px] border-white/5 hover:border-accent/30 bg-white/[0.01] hover:bg-white/[0.02] transition-all cursor-pointer group"
                >
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                           ticket.status === 'Open' ? 'bg-accent/10 text-accent' : 
                           ticket.status === 'In Progress' ? 'bg-warning/10 text-warning' :
                           'bg-success/10 text-success'
                         }`}>
                            <ChatCircleDots size={24} weight="duotone" />
                         </div>
                         <div>
                            <h4 className="font-bold text-white text-lg group-hover:text-accent transition-colors">{ticket.subject}</h4>
                            <div className="flex items-center gap-4 mt-1">
                               <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{ticket.category}</span>
                               <span className="text-[10px] font-black uppercase tracking-widest text-white/20">•</span>
                               <span className={`text-[10px] font-black uppercase tracking-widest ${
                                 ticket.priority === 'High' || ticket.priority === 'Urgent' ? 'text-error' : 'text-text-muted'
                               }`}>{ticket.priority} Priority</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-8">
                         <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Last Update</p>
                            <div className="flex items-center gap-2 text-white font-bold text-xs justify-end">
                               <Clock size={14} className="text-accent" />
                               {new Date(ticket.created_at).toLocaleDateString()}
                            </div>
                         </div>
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                           ticket.status === 'Open' ? 'bg-accent/10 text-accent' :
                           ticket.status === 'In Progress' ? 'bg-warning/10 text-warning' :
                           ticket.status === 'Resolved' ? 'bg-success/10 text-success' :
                           'bg-white/5 text-white/40'
                         }`}>
                           {ticket.status}
                         </span>
                      </div>
                   </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 text-white">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateModalOpen(false)} className="absolute inset-0 bg-void/90 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-surface border border-white/10 rounded-[32px] overflow-hidden shadow-2xl z-10 p-8">
               <h3 className="text-2xl font-black tracking-tighter mb-2">Create Support Ticket</h3>
               <p className="text-sm text-text-muted mb-8">Describe your issue and our team will get back to you.</p>

               <form onSubmit={handleCreateTicket} className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">Subject</label>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="e.g., Question about my project scope" className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent [color-scheme:dark]">
                           <option>General</option>
                           <option>Technical</option>
                           <option>Billing</option>
                           <option>Project</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">Priority</label>
                        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent [color-scheme:dark]">
                           <option>Low</option>
                           <option>Medium</option>
                           <option>High</option>
                           <option>Urgent</option>
                        </select>
                     </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">Message</label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} placeholder="Detailed explanation..." className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent resize-none" />
                  </div>

                  <div className="flex gap-4 pt-4">
                     <Button variant="ghost" type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1">Cancel</Button>
                     <Button disabled={isSubmitting} className="flex-1">
                       {isSubmitting ? "Creating..." : "Submit Ticket"}
                     </Button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
