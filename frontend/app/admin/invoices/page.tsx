"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Receipt, Plus, X, Trash } from "phosphor-react"
import { StrokedText } from "@/components/ui/stroked-text"
import { Button } from "@/components/ui/button"
import { apiRequest } from "@/lib/api"
import { useAuth } from "@/context/auth-context"

interface User {
  id: number
  name: string
  email: string
}

interface Plan {
  id: number
  name: string
  price_range: string
  interval: string
}

interface Invoice {
  id: number
  user_id: number
  plan_id: number | null
  amount: number
  status: string
  due_date: string
  created_at: string
  user: User
  plan: Plan | null
}

export default function AdminInvoices() {
  const [invoices, setInvoices] = React.useState<Invoice[]>([])
  const [clients, setClients] = React.useState<User[]>([])
  const [plans, setPlans] = React.useState<Plan[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  
  const { getToken } = useAuth()

  // Form State
  const [clientId, setClientId] = React.useState("")
  const [planId, setPlanId] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [dueDate, setDueDate] = React.useState("")

  const fetchData = React.useCallback(async () => {
    try {
      const token = getToken()
      const [invRes, clientsRes, plansRes] = await Promise.all([
        apiRequest('/invoices', {}, token),
        apiRequest('/admin/clients', {}, token),
        apiRequest('/subscriptions/plans')
      ])

      if (invRes.ok) setInvoices(await invRes.json())
      if (clientsRes.ok) setClients(await clientsRes.json())
      if (plansRes.ok) setPlans(await plansRes.json())
    } catch (err) {
      console.error("Failed to fetch data", err)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await apiRequest('/invoices', {
        method: 'POST',
        body: JSON.stringify({
          user_id: clientId,
          plan_id: planId || null,
          amount: Number(amount),
          status: 'Pending',
          due_date: dueDate
        })
      }, getToken())

      if (res.ok) {
        setIsModalOpen(false)
        setClientId("")
        setPlanId("")
        setAmount("")
        setDueDate("")
        fetchData()
      }
    } catch (err) {
      console.error("Failed to create invoice", err)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await apiRequest(`/invoices/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }, getToken())
      
      if (res.ok) {
        // Trigger a full fetch to ensure we see the latest data
        fetchData()
      }
    } catch (err) {
      console.error("Failed to update status", err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return
    try {
      const res = await apiRequest(`/invoices/${id}`, { method: 'DELETE' }, getToken())
      if (res.ok) {
        setInvoices(prev => prev.filter(inv => inv.id !== id))
      }
    } catch (err) {
      console.error("Failed to delete invoice", err)
    }
  }

  // Reset amount when plan changes to ensure explicit entry
  React.useEffect(() => {
    if (planId) {
      setAmount("")
    }
  }, [planId])

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-start gap-4">
          <span className="text-accent font-black tracking-widest text-xs uppercase">Financials</span>
          <div className="flex items-center gap-4">
            <h2 className="text-[5.5rem] font-black text-white tracking-tighter leading-[0.8]" style={{ WebkitTextStroke: '0.5px #ffffff' }}>
              Invoice
            </h2>
            <div className="flex items-center -mt-2">
              <StrokedText 
                text="Management" 
                viewBox="0 0 600 120"
                height="4.5rem"
                strokeWidth={2}
                letterSpacing="-0.05em"
                opacity={1}
              />
            </div>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 px-8">
          <Plus size={20} weight="bold" />
          Generate Invoice
        </Button>
      </div>

      {loading ? (
        <div className="p-20 text-center glass-card rounded-[40px] border-white/5 text-text-muted">Loading invoices...</div>
      ) : invoices.length === 0 ? (
        <div className="p-20 text-center glass-card rounded-[40px] border-white/5 text-text-muted">No invoices found.</div>
      ) : (
        <div className="glass-card rounded-[40px] border-white/5 overflow-hidden bg-white/[0.01]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Invoice</th>
                  <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Client</th>
                  <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Plan / Service</th>
                  <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Due Date</th>
                  <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white shrink-0">
                          <Receipt size={20} />
                        </div>
                        <span className="font-bold text-white tracking-tight">INV-{inv.id.toString().padStart(4, '0')}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-white font-bold">
                      {inv.user?.name}
                      <span className="block text-[10px] text-text-muted font-normal uppercase tracking-widest mt-1">{inv.user?.email}</span>
                    </td>
                    <td className="px-8 py-6 text-text-secondary font-medium">
                      {inv.plan ? inv.plan.name : <span className="italic text-text-muted">Custom</span>}
                    </td>
                    <td className="px-8 py-6 text-text-muted font-medium">
                      {new Date(inv.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-white font-black">
                      ₦{(inv.amount).toLocaleString()}
                    </td>
                    <td className="px-8 py-6">
                       <select 
                         className={`bg-transparent border-none text-[10px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer ${
                           inv.status === 'Paid' ? 'text-success' : inv.status === 'Pending' ? 'text-warning' : 'text-error'
                         }`}
                         value={inv.status}
                         onChange={(e) => updateStatus(inv.id, e.target.value)}
                       >
                         <option value="Paid" className="bg-void text-white">Paid</option>
                         <option value="Pending" className="bg-void text-white">Pending</option>
                         <option value="Overdue" className="bg-void text-white">Overdue</option>
                       </select>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button onClick={() => handleDelete(inv.id)} className="text-text-muted hover:text-error transition-colors p-2">
                         <Trash size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-void/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-surface border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted transition-colors"
              >
                <X size={20} weight="bold" />
              </button>

              <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Issue Invoice</h2>
              <p className="text-text-muted text-sm mb-8">Select a client and a subscription plan. Once paid, the subscription will activate automatically.</p>

              <form onSubmit={handleCreateInvoice} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Client</label>
                  <select 
                    required
                    value={clientId}
                    onChange={e => setClientId(e.target.value)}
                    className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
                  >
                    <option value="">Select a client...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Subscription Plan (Optional)</label>
                  <select 
                    value={planId}
                    onChange={e => setPlanId(e.target.value)}
                    className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
                  >
                    <option value="">Custom Service (No automatic plan activation)</option>
                    {plans.map(p => <option key={p.id} value={p.id}>{p.name} - {p.price_range} ({p.interval})</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">
                      Amount (₦) {planId && <span className="text-accent ml-2">({plans.find(p => p.id.toString() === planId)?.price_range})</span>}
                    </label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="e.g. 500000"
                      className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Due Date</label>
                    <input 
                      type="date" 
                      required
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                      className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent [color-scheme:dark]"
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full mt-8">Generate & Issue Invoice</Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
