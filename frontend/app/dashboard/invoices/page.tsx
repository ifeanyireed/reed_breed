"use client"

import * as React from "react"
import { Receipt, DownloadSimple, Info } from "phosphor-react"
import { StrokedText } from "@/components/ui/stroked-text"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { apiRequest } from "@/lib/api"
import { useAuth } from "@/context/auth-context"

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
  pdf_url: string | null
  created_at: string
  plan: Plan | null
}

export default function ClientInvoices() {
  const router = useRouter()
  const [invoices, setInvoices] = React.useState<Invoice[]>([])
  const [loading, setLoading] = React.useState(true)
  const { getToken } = useAuth()

  React.useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await apiRequest('/invoices', {}, getToken())
        if (res.ok) {
          setInvoices(await res.json())
        }
      } catch (err) {
        console.error("Failed to fetch invoices", err)
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [getToken])

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-start gap-4">
          <span className="text-accent font-black tracking-widest text-xs uppercase">Financials</span>
          <div className="flex items-center gap-4">
            <h2 className="text-[5.5rem] font-black text-white tracking-tighter leading-[0.8]" style={{ WebkitTextStroke: '0.5px #ffffff' }}>
              Invoices
            </h2>
            <div className="flex items-center -mt-2">
              <StrokedText 
                text="& Receipts" 
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
                  <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Invoice ID</th>
                  <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Plan / Service</th>
                  <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Due Date</th>
                  <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white shrink-0">
                          <Receipt size={20} />
                        </div>
                        <span className="font-bold text-white tracking-tight">INV-{inv.id.toString().padStart(4, '0')}</span>
                      </div>
                    </td>
                    <td className="px-8 py-8 text-text-secondary font-medium">
                      {inv.plan ? inv.plan.name : <span className="italic text-text-muted">Custom Service</span>}
                    </td>
                    <td className="px-8 py-8 text-white font-medium">
                      {new Date(inv.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-8 text-white font-black">
                      ₦{(inv.amount).toLocaleString()}
                    </td>
                    <td className="px-8 py-8">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        inv.status === 'Paid' ? 'bg-success/10 text-success' : 
                        inv.status === 'Pending' ? 'bg-warning/10 text-warning' : 
                        'bg-error/10 text-error'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-8 py-8 text-right">
                       {inv.pdf_url ? (
                         <Button variant="ghost" className="h-10 text-[10px] uppercase font-black tracking-widest gap-2 px-4" onClick={() => inv.pdf_url && window.open(inv.pdf_url, '_blank')}>
                           <DownloadSimple size={16} />
                           Download PDF
                         </Button>
                       ) : (
                         inv.status !== 'Paid' ? (
                           <Button 
                             variant="primary" 
                             className="h-10 text-[10px] uppercase font-black tracking-widest px-6" 
                             onClick={() => router.push(`/payment/${inv.id}`)}
                           >
                             Pay Now
                           </Button>
                         ) : (

                           <span className="flex items-center justify-end gap-2 text-[10px] uppercase font-bold text-text-muted">
                             <Info size={16} /> No PDF Available
                           </span>
                         )
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
