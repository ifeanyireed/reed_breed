"use client"

import * as React from "react"
import { Crown, Plus } from "phosphor-react"
import { StrokedText } from "@/components/ui/stroked-text"
import { Button } from "@/components/ui/button"

export default function AdminSubscriptions() {
  const plans = [
    { id: 1, name: 'Growth Plan', price: 2500, interval: 'monthly', features: 'AI Automation, Sales CRM, Weekly Strategy Calls' },
    { id: 2, name: 'Scale Plan', price: 5000, interval: 'monthly', features: 'Full Team Access, Custom AI Agents, Bi-weekly Sprints' },
  ]

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-start gap-4">
          <span className="text-accent font-black tracking-widest text-xs uppercase">Service Tiers</span>
          <div className="flex items-center gap-4">
            <h2 className="text-[5.5rem] font-black text-white tracking-tighter leading-[0.8]" style={{ WebkitTextStroke: '0.5px #ffffff' }}>
              Subscriptions
            </h2>
            <div className="flex items-center -mt-2">
              <StrokedText 
                text="& Plans" 
                viewBox="0 0 500 120"
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
          Create Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {plans.map(plan => (
            <div key={plan.id} className="glass-card p-10 rounded-[40px] border-white/5 bg-white/[0.01]">
               <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center text-accent mb-6">
                 <Crown size={32} weight="duotone" />
               </div>
               <h3 className="text-2xl font-black text-white tracking-tight mb-2">{plan.name}</h3>
               <p className="text-3xl font-black text-white mb-6">${plan.price}<span className="text-base text-text-muted">/{plan.interval}</span></p>
               <p className="text-sm text-text-secondary leading-relaxed mb-8">{plan.features}</p>
               <div className="flex gap-4">
                  <Button variant="secondary" className="w-full">Edit</Button>
                  <Button variant="ghost" className="w-full text-error hover:text-error border-error/20 hover:border-error">Delete</Button>
               </div>
            </div>
         ))}
      </div>
    </div>
  )
}
