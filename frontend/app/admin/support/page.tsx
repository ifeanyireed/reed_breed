"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChatCircleDots, PaperPlaneRight, CaretLeft, Clock, User, CheckCircle, XCircle } from "phosphor-react"
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
  user: { name: string; email: string }
  messages?: Message[]
}

interface Message {
  id: number
  user_id: number
  message: string
  created_at: string
  user: { name: string }
}

export default function AdminSupport() {
  const { user, getToken } = useAuth()
  const [tickets, setTickets] = React.useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null)
  const [loading, setLoading] = React.useState(true)

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
          status: prev.status === 'Open' ? 'In Progress' : prev.status,
          messages: [...(prev.messages || []), newMessage]
        } : null)
        setReply("")
        fetchTickets() // Refresh list to show updated status
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsReplying(false)
    }
  }

  const updateStatus = async (status: string) => {
    if (!selectedTicket) return
    try {
      const res = await apiRequest(`/support/tickets/${selectedTicket.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }, getToken())
      if (res.ok) {
        setSelectedTicket(prev => prev ? { ...prev, status } : null)
        fetchTickets()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col items-start gap-4">
          <span className="text-accent font-black tracking-widest text-xs uppercase">Ticket Management</span>
          <div className="flex items-center gap-4">
            <h2 className="text-[4rem] md:text-[5.5rem] font-black text-white tracking-tighter leading-[0.8]" style={{ WebkitTextStroke: '0.5px #ffffff' }}>
              Support
            </h2>
            <div className="flex items-center -mt-2">
              <StrokedText 
                text="Inbox" 
                viewBox="0 0 200 120"
                height="clamp(3rem, 8vw, 4.5rem)"
                strokeWidth={2}
                letterSpacing="-0.05em"
                opacity={1}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {selectedTicket ? (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-[40px] border-white/5 overflow-hidden bg-white/[0.01]"
          >
            <div className="p-8 border-b border-white/5 bg-white/[0.02] flex flex-col xl:flex-row xl:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedTicket(null)} className="p-2 rounded-full hover:bg-white/5 text-text-muted hover:text-white transition-colors">
                   <CaretLeft size={24} weight="bold" />
                </button>
                <div>
                   <h3 className="text-xl font-bold text-white">{selectedTicket.subject}</h3>
                   <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-accent font-bold uppercase tracking-widest">{selectedTicket.user.name}</p>
                      <span className="text-white/10">•</span>
                      <p className="text-xs text-text-muted font-bold uppercase tracking-widest">{selectedTicket.category}</p>
                   </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                 <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                    {['Open', 'In Progress', 'Resolved', 'Closed'].map((s) => (
                       <button 
                         key={s}
                         onClick={() => updateStatus(s)}
                         className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                           selectedTicket.status === s 
                             ? 'bg-accent text-white shadow-lg' 
                             : 'text-text-muted hover:text-white'
                         }`}
                       >
                         {s}
                       </button>
                    ))}
                 </div>
              </div>
            </div>

            <div className="p-8 h-[500px] overflow-y-auto custom-scrollbar space-y-6 bg-void/30">
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
                    placeholder="Type your response to the client..."
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
          <div className="space-y-4">
            {loading ? (
              <div className="p-20 text-center text-text-muted font-bold uppercase tracking-widest text-xs">Loading all support tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="p-10 md:p-20 text-center glass-card rounded-[24px] md:rounded-[40px] border-white/5 bg-white/[0.01]">
                 <ChatCircleDots size={48} className="mx-auto text-text-muted mb-6 opacity-20" />
                 <p className="text-white font-bold text-xl">Inbox is empty</p>
                 <p className="text-text-secondary">No support tickets have been created yet.</p>
              </div>
            ) : (
              <div className="glass-card rounded-[24px] md:rounded-[40px] border-white/5 bg-white/[0.01]">
                 <div className="overflow-x-auto custom-scrollbar w-full">
                 <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                       <tr className="border-b border-white/5 bg-white/[0.02]">
                          <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Client</th>
                          <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Subject</th>
                          <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Priority</th>
                          <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                          <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Last Update</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {tickets.map((ticket) => (
                         <tr 
                           key={ticket.id} 
                           onClick={() => fetchTicketDetails(ticket.id)}
                           className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                         >
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text-muted">
                                     <User size={16} />
                                  </div>
                                  <div>
                                     <p className="text-sm font-bold text-white leading-none">{ticket.user.name}</p>
                                     <p className="text-[10px] text-text-muted mt-1">{ticket.user.email}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <p className="text-sm font-bold text-white group-hover:text-accent transition-colors">{ticket.subject}</p>
                               <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mt-1">{ticket.category}</p>
                            </td>
                            <td className="px-8 py-6">
                               <span className={`text-[10px] font-black uppercase tracking-widest ${
                                 ticket.priority === 'High' || ticket.priority === 'Urgent' ? 'text-error' : 'text-text-muted'
                               }`}>
                                 {ticket.priority}
                               </span>
                            </td>
                            <td className="px-8 py-6">
                               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                 ticket.status === 'Open' ? 'bg-accent/10 text-accent' :
                                 ticket.status === 'In Progress' ? 'bg-warning/10 text-warning' :
                                 ticket.status === 'Resolved' ? 'bg-success/10 text-success' :
                                 'bg-white/5 text-white/40'
                               }`}>
                                 {ticket.status}
                               </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <p className="text-xs font-bold text-white">{new Date(ticket.created_at).toLocaleDateString()}</p>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
                 </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
