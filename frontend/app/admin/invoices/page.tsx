"use client"

import * as React from "react"
import { Receipt, Plus } from "phosphor-react"
import { StrokedText } from "@/components/ui/stroked-text"
import { Button } from "@/components/ui/button"

export default function AdminInvoices() {
  const invoices = [
    { id: 'INV-2026-001', client: 'John Doe', amount: 2500, date: '2026-06-01', status: 'Paid' },
    { id: 'INV-2026-002', client: 'Jane Smith', amount: 5000, date: '2026-07-01', status: 'Pending' },
  ]

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
        <Button className="gap-2 px-8">
          <Plus size={20} weight="bold" />
          Generate Invoice
        </Button>
      </div>

      <div className="glass-card rounded-[40px] border-white/5 overflow-hidden bg-white/[0.01]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Invoice ID</th>
              <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Client</th>
              <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Date</th>
              <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Amount</th>
              <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-white/[0.03] transition-colors group cursor-pointer">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                      <Receipt size={20} />
                    </div>
                    <span className="font-bold text-white tracking-tight">{inv.id}</span>
                  </div>
                </td>
                <td className="px-10 py-8 text-white font-bold">{inv.client}</td>
                <td className="px-10 py-8 text-text-muted font-medium">{inv.date}</td>
                <td className="px-10 py-8 text-white font-black">${inv.amount}</td>
                <td className="px-10 py-8">
                   <select 
                     className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer"
                     value={inv.status}
                     onChange={() => {}}
                   >
                     <option value="Paid" className="bg-void">Paid</option>
                     <option value="Pending" className="bg-void">Pending</option>
                     <option value="Overdue" className="bg-void">Overdue</option>
                   </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
