"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Briefcase, 
  Receipt,
  ChatCircleDots,
  Users,
  TrendUp,
  ArrowRight
} from "phosphor-react"
import { StrokedText } from "@/components/ui/stroked-text"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { apiRequest } from "@/lib/api"

export default function AdminOverview() {
  const { getToken } = useAuth()
  const [stats, setStats] = React.useState({
    projects: 0,
    invoices: 0,
    tickets: 0,
    leads: 0,
    revenue: 0
  })
  const [loading, setLoading] = React.useState(true)

  const fetchStats = React.useCallback(async () => {
    try {
      const token = getToken()
      
      const [projRes, invRes, tickRes, leadsRes] = await Promise.all([
        apiRequest('/projects', {}, token),
        apiRequest('/invoices', {}, token),
        apiRequest('/support/tickets', {}, token),
        apiRequest('/leads', {}, token)
      ])

      let projects = 0, invoices = 0, tickets = 0, leads = 0, revenue = 0;

      if (projRes.ok) {
        const data = await projRes.json()
        projects = data.filter((p: any) => p.status !== 'Completed').length
      }
      
      if (invRes.ok) {
        const data = await invRes.json()
        invoices = data.filter((i: any) => i.status === 'Pending').length
        revenue = data.reduce((acc: number, curr: any) => acc + (curr.status === 'Paid' ? Number(curr.amount) : 0), 0)
      }

      if (tickRes.ok) {
        const data = await tickRes.json()
        tickets = data.filter((t: any) => t.status === 'Open' || t.status === 'In Progress').length
      }

      if (leadsRes.ok) {
        const data = await leadsRes.json()
        leads = data.filter((l: any) => l.status === 'New').length
      }

      setStats({ projects, invoices, tickets, leads, revenue })

    } catch (err) {
      console.error("Failed to fetch admin stats", err)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  React.useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const statCards = [
    { label: "Active Projects", value: stats.projects, icon: Briefcase, color: "text-accent", link: "/admin/projects" },
    { label: "Pending Invoices", value: stats.invoices, icon: Receipt, color: "text-warning", link: "/admin/invoices" },
    { label: "Open Tickets", value: stats.tickets, icon: ChatCircleDots, color: "text-error", link: "/admin/support" },
    { label: "New Leads", value: stats.leads, icon: Users, color: "text-success", link: "/admin/leads" },
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-start gap-4">
          <span className="text-accent font-black tracking-widest text-xs uppercase">Command Center</span>
          <div className="flex items-center gap-4">
            <h2 className="text-[5.5rem] font-black text-white tracking-tighter leading-[0.8]" style={{ WebkitTextStroke: '0.5px #ffffff' }}>
              Admin
            </h2>
            <div className="flex items-center -mt-2">
              <StrokedText 
                text="Overview" 
                viewBox="0 0 450 120"
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
        <div className="p-20 text-center text-text-muted font-bold tracking-widest uppercase">Aggregating System Data...</div>
      ) : (
        <>
          {/* Top KPI row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-3xl border-white/5 bg-white/[0.01] flex flex-col justify-between group"
              >
                 <div className="flex items-center justify-between mb-8">
                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                       <stat.icon size={24} weight="duotone" />
                    </div>
                    <Link href={stat.link} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-accent transition-colors">
                       <ArrowRight size={16} weight="bold" className="-rotate-45 group-hover:rotate-0 transition-transform" />
                    </Link>
                 </div>
                 <div>
                    <h3 className="text-5xl font-black text-white tracking-tighter mb-2">{stat.value}</h3>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
                 </div>
              </motion.div>
            ))}
          </div>

          {/* Revenue & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             <div className="lg:col-span-2 glass-card p-10 rounded-[40px] border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-success/10 blur-[100px] rounded-full pointer-events-none" />
                <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                  <TrendUp size={16} className="text-success" /> Lifetime Collected Revenue
                </h4>
                <p className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">
                  <span className="text-3xl md:text-5xl text-success mr-2">₦</span>
                  {(stats.revenue).toLocaleString()}
                </p>
                <p className="text-sm text-text-secondary max-w-md">Total revenue aggregated from all invoices marked as "Paid" across the system.</p>
             </div>

             <div className="glass-card p-10 rounded-[40px] border-accent/20 bg-accent/5 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/10 blur-3xl rounded-full" />
                <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-6">Quick Actions</h4>
                <div className="space-y-4">
                   <Link href="/admin/invoices" className="flex items-center justify-between p-4 bg-void border border-white/5 rounded-2xl hover:border-accent/50 transition-colors group">
                      <span className="text-sm font-bold text-white">Create New Invoice</span>
                      <ArrowRight size={16} className="text-text-muted group-hover:text-accent transition-colors" />
                   </Link>
                   <Link href="/admin/projects" className="flex items-center justify-between p-4 bg-void border border-white/5 rounded-2xl hover:border-accent/50 transition-colors group">
                      <span className="text-sm font-bold text-white">Manage Projects</span>
                      <ArrowRight size={16} className="text-text-muted group-hover:text-accent transition-colors" />
                   </Link>
                   <Link href="/admin/calendar" className="flex items-center justify-between p-4 bg-void border border-white/5 rounded-2xl hover:border-accent/50 transition-colors group">
                      <span className="text-sm font-bold text-white">View Calendar</span>
                      <ArrowRight size={16} className="text-text-muted group-hover:text-accent transition-colors" />
                   </Link>
                </div>
             </div>
          </div>
        </>
      )}
    </div>
  )
}
