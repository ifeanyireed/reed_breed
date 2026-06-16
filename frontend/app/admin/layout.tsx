"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Users, 
  Article, 
  Gear, 
  SignOut,
  House,
  Calendar,
  Briefcase,
  Crown,
  Receipt,
  Star,
  ChatCircleDots
} from "phosphor-react"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/context/auth-context"

const sidebarItems = [
  { label: "Overview", icon: House, href: "/admin" },
  { label: "Leads Funnel", icon: Users, href: "/admin/leads" },
  { label: "Client Projects", icon: Briefcase, href: "/admin/projects" },
  { label: "Invoices", icon: Receipt, href: "/admin/invoices" },
  { label: "Support Tickets", icon: ChatCircleDots, href: "/admin/support" },
  { label: "Reviews", icon: Star, href: "/admin/reviews" },
  { label: "Blog CMS", icon: Article, href: "/admin/blog" },
  { label: "Calendar", icon: Calendar, href: "/admin/calendar" },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-void text-white font-sans selection:bg-accent selection:text-white">
        {/* Background Atmosphere */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-accent/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent-dim/10 blur-[120px] rounded-full" />
        </div>

        {/* Sidebar / Bottom Nav */}
        <aside className="fixed lg:left-0 lg:top-0 bottom-0 left-0 right-0 lg:w-72 w-full z-50 lg:p-6 p-2 flex lg:flex-col flex-row border-t lg:border-t-0 lg:border-r border-white/5 bg-void/95 lg:bg-void/50 backdrop-blur-xl overflow-x-auto custom-scrollbar items-center lg:items-stretch">
          {/* Logo - Hidden on mobile */}
          <div className="mb-12 px-4 hidden lg:block">
            <Link href="/" className="block relative w-32 h-10 group">
              <Image 
                src="/logo.png" 
                alt="Reed Breed" 
                fill 
                className="object-contain object-left group-hover:opacity-80 transition-opacity" 
                priority={true}
              />
            </Link>
          </div>

          <nav className="flex lg:flex-1 lg:flex-col flex-row gap-1 lg:gap-0 lg:space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex lg:flex-row flex-col items-center justify-center gap-1 lg:gap-4 px-3 py-1.5 lg:px-4 lg:py-3.5 rounded-2xl transition-all duration-300 group shrink-0 min-w-[70px] lg:min-w-0 ${
                    isActive 
                      ? "bg-accent text-white shadow-[0_0_20px_rgba(20,110,245,0.3)]" 
                      : "text-text-secondary hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon size={22} weight={isActive ? "fill" : "regular"} className={isActive ? "" : "group-hover:scale-110 transition-transform"} />
                  <span className="text-[10px] lg:text-base font-bold tracking-tight whitespace-nowrap">{item.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="hidden lg:block ml-auto w-1.5 h-1.5 bg-white rounded-full"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="lg:pt-8 lg:mt-8 lg:border-t border-l lg:border-l-0 border-white/5 pl-2 ml-1 lg:pl-0 lg:ml-0 flex items-center shrink-0">
            <button
              onClick={() => logout()}
              className="flex lg:flex-row flex-col items-center justify-center gap-1 lg:gap-4 px-3 py-1.5 lg:px-4 lg:py-3.5 rounded-2xl text-error/60 hover:text-error hover:bg-error/5 transition-all group shrink-0 min-w-[70px] lg:min-w-0 lg:w-full"
            >
              <SignOut size={22} className="group-hover:-translate-x-1 lg:group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] lg:text-base font-bold tracking-tight whitespace-nowrap">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 relative z-10 mb-24 lg:mb-0 w-full overflow-x-hidden">
          <div className="p-6 md:p-12">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
