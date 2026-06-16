"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { CreditCard, ShieldCheck, Receipt } from "phosphor-react"
import dynamic from "next/dynamic"

const PaystackIntegration = dynamic(
  () => import("@/components/payment/paystack-integration"),
  { ssr: false }
)

export default function PaymentPage() {
  const { id } = useParams()
  const { user, loading, getToken } = useAuth()
  const router = useRouter()
  const [invoice, setInvoice] = React.useState<any>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
  const token = getToken()

  React.useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=/payment/${id}`)
      return
    }

    const fetchInvoice = async () => {
      try {
        const res = await fetch(`${API_URL}/invoices/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (res.ok) {
          const data = await res.json()
          setInvoice(data)
        } else {
          console.error("Failed to fetch invoice", await res.text())
        }
      } catch (err) {
        console.error(err)
      }
    }

    if (user && token) {
      fetchInvoice()
    }
  }, [id, user, loading, router, token, API_URL])

  if (loading || !invoice) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-white animate-pulse">Initializing Secure Checkout...</div>
      </div>
    )
  }

  return (
    <>
      <main className="min-h-screen pt-20 pb-20 bg-void flex items-center justify-center px-6">
        <div className="glass-card w-full max-w-xl p-8 lg:p-12 rounded-2xl border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Receipt size={160} weight="duotone" className="text-accent" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <CreditCard weight="duotone" />
              </div>
              <h1 className="text-h3 font-black text-white">Complete Your Subscription</h1>
            </div>

            <div className="space-y-6 mb-12">
              <div className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Selected Plan</p>
                  <p className="text-p-lg font-bold text-white uppercase">{invoice.plan?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Total Due</p>
                  <p className="text-h3 font-black text-accent">₦{(invoice.amount).toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-surface/30 rounded-xl p-6 space-y-4">
                <div className="flex justify-between text-[12px]">
                  <span className="text-text-secondary">Billed to</span>
                  <span className="text-white font-bold">{user?.name}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-text-secondary">Email</span>
                  <span className="text-white font-bold">{user?.email}</span>
                </div>
              </div>
            </div>

            <PaystackIntegration invoice={invoice} user={user} id={id} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
