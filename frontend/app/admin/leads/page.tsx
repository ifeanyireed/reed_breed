"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  MagnifyingGlass, 
  Funnel, 
  DotsThreeVertical,
  Export,
  ArrowUpRight,
  UserCircle
} from "phosphor-react"
import { StrokedText } from "@/components/ui/stroked-text"
import { useAuth } from "@/context/auth-context"

interface Lead {
  id: number
  company: string | null
  contact: string
  email: string
  phone: string | null
  website: string | null
  details: string | null
  status: string
  industry: string | null
  created_at: string
}

export default function LeadsFunnel() {
  const [leads, setLeads] = React.useState<Lead[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const { getToken } = useAuth()

  const fetchLeads = React.useCallback(async () => {
    try {
      const token = getToken()
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
      const res = await fetch(`${apiUrl}/leads`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      if (res.ok) {
        const data = await res.json()
        setLeads(data)
      }
    } catch (err) {
      console.error("Failed to fetch leads", err)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  React.useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const updateLeadStatus = async (id: number, newStatus: string) => {
    try {
      const token = getToken()
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
      const res = await fetch(`${apiUrl}/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l))
      }
    } catch (err) {
      console.error("Failed to update lead", err)
    }
  }

  const filteredLeads = leads.filter(lead => 
    lead.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-start gap-4">
          <span className="text-accent font-black tracking-widest text-xs uppercase">Lead Management</span>
          <div className="flex items-center gap-4">
            <h2 className="text-[5.5rem] font-black text-white tracking-tighter leading-[0.8]" style={{ WebkitTextStroke: '0.5px #ffffff' }}>
              Leads
            </h2>
            <div className="flex items-center -mt-2">
              <StrokedText 
                text="Funnel" 
                viewBox="0 0 450 120"
                height="4.5rem"
                strokeWidth={2}
                letterSpacing="-0.05em"
                opacity={1}
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 mb-2">
          <button className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all">
            <Export size={20} />
            <span className="text-sm uppercase tracking-widest text-white">Export</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 relative max-w-2xl">
        <MagnifyingGlass className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search leads, companies or contacts..." 
          className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-white focus:outline-none focus:border-accent transition-all font-medium placeholder:text-text-muted"
        />
      </div>

      {/* Table */}
      <div className="glass-card rounded-[40px] border-white/5 overflow-hidden bg-white/[0.01]">
        {loading ? (
          <div className="p-20 text-center text-text-muted font-bold tracking-widest uppercase">Initializing Funnel Data...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Company / Name</th>
                <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Contact Info</th>
                <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Website</th>
                <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest w-1/4">Project Details</th>
                <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.map((lead, i) => (
                <motion.tr 
                  key={lead.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                >
                  <td className="px-10 py-8 text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                        <UserCircle size={28} weight="duotone" />
                      </div>
                      <div>
                        <p className="font-black text-white text-lg tracking-tight group-hover:text-accent transition-colors">{lead.company || 'Private Client'}</p>
                        <p className="text-xs text-text-muted uppercase font-bold tracking-widest">{lead.contact}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <p className="font-bold text-white">{lead.email}</p>
                    <p className="text-sm text-text-muted">{lead.phone || 'N/A'}</p>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-sm font-bold text-white opacity-60 truncate max-w-[150px]">{lead.website || 'N/A'}</p>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-sm text-text-secondary line-clamp-2">{lead.details || 'No additional details provided.'}</p>
                  </td>
                  <td className="px-10 py-8">
                    <select 
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      className={`bg-transparent border-none text-[10px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer ${
                        lead.status === 'Qualified' ? 'text-success' : 
                        lead.status === 'New' ? 'text-accent' : 'text-warning'
                      }`}
                    >
                      <option value="New" className="bg-void">New</option>
                      <option value="In Progress" className="bg-void">In Progress</option>
                      <option value="Qualified" className="bg-void">Qualified</option>
                      <option value="Lost" className="bg-void">Lost</option>
                      <option value="Won" className="bg-void">Won</option>
                    </select>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-text-muted hover:text-white transition-all">
                        <ArrowUpRight size={20} />
                      </button>
                      <button className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-text-muted hover:text-white transition-all">
                        <DotsThreeVertical size={24} weight="bold" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
