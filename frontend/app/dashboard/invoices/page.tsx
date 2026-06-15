"use client"

import * as React from "react"
import { Receipt, DownloadSimple } from "phosphor-react"
import { StrokedText } from "@/components/ui/stroked-text"
import { Button } from "@/components/ui/button"

export default function ClientInvoices() {
  // Placeholder data for UI demonstration
  const invoices = [
    { id: 'INV-2026-001', amount: 2500, date: '2026-06-01', status: 'Paid' },
    { id: 'INV-2026-002', amount: 2500, date: '2026-07-01', status: 'Pending' },
  ]

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

      <div className="glass-card rounded-[40px] border-white/5 overflow-hidden bg-white/[0.01]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Invoice ID</th>
              <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Date</th>
              <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Amount</th>
              <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
              <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-white/[0.03] transition-colors group">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                      <Receipt size={20} />
                    </div>
                    <span className="font-bold text-white tracking-tight">{inv.id}</span>
                  </div>
                </td>
                <td className="px-10 py-8 text-white font-medium">{inv.date}</td>
                <td className="px-10 py-8 text-white font-black">${inv.amount}</td>
                <td className="px-10 py-8">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${inv.status === 'Paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-10 py-8 text-right">
                   <Button variant="ghost" className="h-10 text-[10px] uppercase font-black tracking-widest gap-2 px-4">
                     <DownloadSimple size={16} />
                     Download PDF
                   </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
