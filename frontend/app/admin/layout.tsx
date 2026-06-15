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
  Star
} from "phosphor-react"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/context/auth-context"

const sidebarItems = [
  { label: "Leads Funnel", icon: Users, href: "/admin" },
  { label: "Client Projects", icon: Briefcase, href: "/admin/projects" },
  { label: "Subscriptions", icon: Crown, href: "/admin/subscriptions" },
  { label: "Invoices", icon: Receipt, href: "/admin/invoices" },
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

        {/* Sidebar */}
        <aside className="fixed left-0 top-0 bottom-0 w-72 z-50 p-6 flex flex-col border-r border-white/5 bg-void/50 backdrop-blur-xl">
          <div className="mb-12 px-4">
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

          <nav className="flex-1 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? "bg-accent text-white shadow-[0_0_20px_rgba(20,110,245,0.3)]" 
                      : "text-text-secondary hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon size={24} weight={isActive ? "fill" : "regular"} className={isActive ? "" : "group-hover:scale-110 transition-transform"} />
                  <span className="font-bold tracking-tight">{item.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="pt-8 mt-8 border-t border-white/5 space-y-2">
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-error/60 hover:text-error hover:bg-error/5 transition-all group"
            >
              <SignOut size={24} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold tracking-tight">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-72 relative z-10">
          <div className="p-12">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
