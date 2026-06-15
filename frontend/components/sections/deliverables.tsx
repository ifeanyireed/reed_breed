"use client"

import * as React from "react"
import { IdentificationCard, Strategy, Laptop, FlowArrow, Robot, PresentationChart } from "phosphor-react"
import { Card } from "@/components/ui/card"

const deliverables = [
  {
    title: "Brand Identity & Positioning",
    desc: "Messaging frameworks and visual identity that ensure you don't compete on price alone.",
    icon: IdentificationCard,
  },
  {
    title: "Marketing Strategy & Campaign Plan",
    desc: "A concrete channel plan and content roadmap designed for immediate ROI.",
    icon: Strategy,
  },
  {
    title: "Tailored Demo / Prototype",
    desc: "A custom-built prototype of your growth system before you commit to the full build.",
    icon: Laptop,
  },
  {
    title: "CRM & Lead Management",
    desc: "Complete sales pipeline setup to ensure no lead ever goes cold again.",
    icon: FlowArrow,
  },
  {
    title: "Automation & Internal Tools",
    desc: "Custom workflows and bots that handle inquiries, bookings, and support 24/7.",
    icon: Robot,
  },
  {
    title: "Reporting & Optimization",
    desc: "Real-time dashboards that show exactly where your growth is coming from.",
    icon: PresentationChart,
  },
]

export const Deliverables = () => {
  return (
    <section className="py-24 md:py-32 lg:py-48 bg-void relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-accent/10 blur-[140px] rounded-full opacity-50" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20">
          <span className="eyebrow block mb-4">WHAT WE DELIVER</span>
          <h2 className="text-h2 font-black text-text-primary">Concrete outcomes. Not generic services.</h2>
          <p className="text-p-lg text-text-primary mt-6 max-w-2xl">
            This is a deliverables menu. Each engagement ends with a clear strategy, demo, or system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliverables.map((item) => (
            <Card
              key={item.title}
              variant="service"
              className="group cursor-default h-full bg-surface/50 border-white/5 relative"
            >
              <div className="p-4 bg-accent/10 rounded-2xl text-accent w-fit mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <item.icon size={32} weight="duotone" />
              </div>
              <h3 className="text-h3 font-bold text-[#ffffff] mb-4 group-hover:text-accent transition-colors">
                {item.title}
              </h3>
              <p className="text-p-lg text-[#ffffff] leading-relaxed">
                {item.desc}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
