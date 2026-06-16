"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check } from "phosphor-react"
import { Button } from "@/components/ui/button"
import { apiRequest } from "@/lib/api"

interface Plan {
  id: number
  name: string
  price: number
  interval: string
  features: string
}

// Keep UI metadata separate from DB data
const planMetadata: Record<string, { desc: string, cta: string, popular: boolean, priceRange: string }> = {
  "Starter": {
    desc: "Fast, premium entry point to identify your biggest growth bottlenecks.",
    cta: "Request Growth Audit",
    popular: false,
    priceRange: "₦250k – ₦500k",
  },
  "Growth": {
    desc: "Complete brand and marketing blueprint with a tailored demo of your future system.",
    cta: "Book Strategy Call",
    popular: true,
    priceRange: "₦750k – ₦1.5m",
  },
  "Transformation": {
    desc: "Full-scale implementation of strategy, automation, and lead management systems.",
    cta: "Start Transformation",
    popular: false,
    priceRange: "₦2m – ₦5m+",
  },
  "Retainer": {
    desc: "Ongoing optimization and strategic advisory to ensure predictable growth.",
    cta: "Secure Retainer",
    popular: false,
    priceRange: "₦400k – ₦1.5m",
  }
}

export const Pricing = () => {
  const [plans, setPlans] = React.useState<Plan[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await apiRequest('/subscriptions/plans')
        if (res.ok) {
          const data = await res.json()
          // Sort plans to match visual hierarchy roughly based on ID
          const sortedData = data.sort((a: Plan, b: Plan) => a.id - b.id)
          setPlans(sortedData)
        }
      } catch (err) {
        console.error("Failed to fetch plans", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  if (loading) {
    return (
      <section id="pricing" className="py-24 md:py-32 lg:py-48 flex justify-center">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </section>
    )
  }

  return (
    <section id="pricing" className="py-24 md:py-32 lg:py-48">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="eyebrow block mb-4">THE PRICING LADDER</span>
          <h2 className="text-h2 font-black text-text-primary">Ready to scale? Pick your starting point.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan, index) => {
            const meta = planMetadata[plan.name] || { 
              desc: "Custom structured plan for enterprise growth.", 
              cta: "Contact Us", 
              popular: false,
              priceRange: "Custom"
            }
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative p-8 rounded-[32px] border transition-all duration-300 flex flex-col ${
                  meta.popular
                    ? "bg-gradient-card border-accent scale-105 z-10 shadow-[0_0_64px_rgba(0,212,170,0.1)]"
                    : "bg-surface border-border hover:border-border-glow"
                }`}
              >
                {meta.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-[#ffffff] text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-h3 font-bold text-text-primary mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-2xl lg:text-3xl font-bold text-text-primary">
                      {meta.priceRange}
                    </span>
                    {plan.interval !== 'one-off' && <span className="text-text-muted">/{plan.interval === 'monthly' ? 'mo' : plan.interval}</span>}
                  </div>
                </div>

                <p className="text-text-secondary text-body-sm mb-8 leading-relaxed flex-grow">
                  {meta.desc}
                </p>

                <ul className="space-y-4 mb-10">
                  {plan.features.split(', ').map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-body-md text-text-primary">
                      <div className={`p-1 mt-0.5 rounded-full ${meta.popular ? "bg-accent/20 text-accent" : "bg-white/5 text-text-muted"}`}>
                        <Check size={12} weight="bold" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={meta.popular ? "primary" : "ghost"}
                  className="w-full"
                  size="md"
                >
                  {meta.cta}
                </Button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
