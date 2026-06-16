"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { Footer } from "@/components/layout/footer"
import { EnvelopeSimple, LockSimple, SignIn } from "phosphor-react"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login, user, loading } = useAuth()
  const router = useRouter()
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  React.useEffect(() => {
    if (!loading && user) {
      router.push(user.role === 'admin' ? '/admin' : '/dashboard')
    }
  }, [user, loading, router])

  const onSubmit = async (data: LoginValues) => {
    try {
      await login(data)
    } catch (err: any) {
      alert(err.message || "Login failed. Please check your credentials.")
    }
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
                <h1 className="text-h3 font-black text-white tracking-tighter">Access Portal</h1>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">Password</label>
                    <Link href="/forgot-password" className="text-[10px] text-accent font-bold hover:underline uppercase tracking-wider">Forgot?</Link>
                  </div>
                  <div className="relative">
                    <input 
                      {...register("password")} 
                      type="password" 
                      className="w-full bg-surface/30 border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-accent focus:bg-surface/50 transition-all outline-none text-sm" 
                      placeholder="••••••••" 
                    />
                    <LockSimple className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                  </div>
                  {errors.password && <p className="text-error text-[10px] ml-1">{errors.password.message}</p>}
                </div>

                <Button 
                  className="w-full h-14 text-base font-bold tracking-tight group" 
                  size="lg" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isSubmitting ? "Authenticating..." : "Enter Dashboard"}
                    <SignIn size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-text-secondary">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-accent font-bold hover:underline underline-offset-4">
                    Create one now
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
