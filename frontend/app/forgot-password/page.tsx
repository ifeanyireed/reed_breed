"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/layout/footer"
import { EnvelopeSimple, ArrowLeft } from "phosphor-react"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = React.useState(false)
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordValues) => {
    // Placeholder for backend logic
    console.log("Reset requested for:", data.email)
    setSubmitted(true)
  }

  return (
    <>
      <main className="min-h-screen pt-20 pb-20 relative overflow-hidden flex items-center justify-center">
        {/* Fixed Background Elements - Matching Hero */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-accent/20 blur-[120px] rounded-full" />
          <div className="absolute top-[20%] right-[-5%] w-[60%] h-[60%] bg-accent-dim/15 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[20%] w-[80%] h-[60%] bg-accent/20 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] bg-repeat" />
        </div>

        <div className="container mx-auto px-6 relative z-10 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md"
          >
            <div className="glass-card p-8 md:p-10 rounded-3xl border-white/5 shadow-2xl">
              <div className="mb-10 text-center">
                <Link href="/" className="inline-block mb-8 hover:scale-105 transition-transform">
                  <Image
                    src="/logo.png"
                    alt="Reed Breed Logo"
                    width={60}
                    height={60}
                    className="mx-auto"
                    priority={true}
                  />
                </Link>
                <h1 className="text-h3 font-black text-white tracking-tighter">Reset Password</h1>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <p className="text-sm text-text-secondary text-center mb-6">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                  </p>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-text-secondary uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <input 
                        {...register("email")} 
                        className="w-full bg-surface/30 border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-accent focus:bg-surface/50 transition-all outline-none text-sm" 
                        placeholder="admin@reedbreed.cc" 
                      />
                      <EnvelopeSimple className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    </div>
                    {errors.email && <p className="text-error text-[10px] ml-1">{errors.email.message}</p>}
                  </div>

                  <Button 
                    className="w-full h-14 text-base font-bold tracking-tight group" 
                    size="lg" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </span>
                  </Button>
                  </form>
                  ) : (
                  <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                    <EnvelopeSimple size={32} weight="fill" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Check your email</h2>
                  <p className="text-text-secondary text-sm">
                    We&apos;ve sent a password reset link to your email address.
                  </p>
                  <Button 
                    variant="secondary"
                    className="w-full h-14 text-base font-bold tracking-tight" 
                    size="lg"
                    onClick={() => setSubmitted(false)}
                  >
                    Resend Link
                  </Button>
                  </div>
                  )}

              <div className="mt-8 text-center">
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent font-bold transition-colors">
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
