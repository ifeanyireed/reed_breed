"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { StrokedText } from "@/components/ui/stroked-text"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Calendar } from "phosphor-react"
import { AppointmentModal } from "@/components/ui/appointment-modal"
import { apiRequest } from "@/lib/api"

export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  
  // Form State
  const [name, setName] = React.useState("")
  const [company, setCompany] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [website, setWebsite] = React.useState("")
  const [message, setMessage] = React.useState("")
  
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) {
      setError("Name and Email are required.")
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify({
          contact: name,
          company: company,
          email: email,
          phone: phone,
          website: website,
          details: message
        })
      })

      if (res.ok) {
        setSuccess(true)
        setName("")
        setCompany("")
        setEmail("")
        setPhone("")
        setWebsite("")
        setMessage("")
      } else {
        const data = await res.json()
        setError(data.message || "Something went wrong. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Navbar />
      <main className="relative bg-void overflow-hidden">
        {/* Fixed Background Elements (Homepage Style) */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-accent/20 blur-[120px] rounded-full" />
          <div className="absolute top-[20%] right-[-5%] w-[60%] h-[60%] bg-accent-dim/15 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[20%] w-[80%] h-[60%] bg-accent/20 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] bg-repeat" />
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-6 relative z-10 min-h-screen py-24 md:py-48 flex flex-col items-center text-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-center mb-8 md:mb-12"
          >
            <div className="flex justify-center items-center gap-3 md:gap-6 mb-6 md:mb-8">
              <span
                className="text-[15vw] md:text-[8vw] font-black text-white leading-[0.8] tracking-tighter"
                style={{ WebkitTextStroke: '0.5px #ffffff' }}
              >
                Contact
              </span>
              <div className="flex items-center -mt-[1.5vw]">
                <StrokedText
                  text="Us"
                  viewBox="0 0 200 120"
                  height="clamp(3.5rem, 10vw, 8rem)"
                  strokeWidth={2}
                  letterSpacing="-0.05em"
                />
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white text-lg md:text-2xl lg:text-3xl font-medium max-w-2xl leading-tight tracking-tight mb-16 md:mb-20"
          >
            We&apos;re looking for each other. Fill in your company details or give use a phone or video call.
          </motion.p>
        </div>

        {/* Contact Form Section */}
        <section className="relative z-10 py-16 md:py-48">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
              {/* Form Side */}
              <div className="flex flex-col items-start order-2 lg:order-1">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-10 md:mb-12 tracking-tighter">Write us</h2>
                
                <div className="w-full space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:gap-6">
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name*" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-sm px-6 py-4 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted font-medium"
                    />
                    <input 
                      type="text" 
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company Name" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-sm px-6 py-4 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted font-medium"
                    />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email*" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-sm px-6 py-4 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted font-medium"
                    />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-sm px-6 py-4 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted font-medium"
                    />
                    <input 
                      type="url" 
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="Website URL" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-sm px-6 py-4 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted font-medium"
                    />
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Project Details*" 
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-sm px-6 py-4 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted font-medium resize-none"
                    ></textarea>
                  </div>
                  
                  {error && <p className="text-error text-sm font-bold">{error}</p>}
                  {success && <p className="text-success text-sm font-bold">Your proposal has been submitted! We&apos;ll be in touch soon.</p>}

                  <div className="flex flex-col items-start mt-8 md:mt-10">
                    <Button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 h-auto text-lg font-bold"
                    >
                      {isSubmitting ? "Sending..." : "Send Proposal"}
                    </Button>
                    
                    <div className="mt-12 md:mt-16 w-full">
                      <Button 
                        type="button"
                        variant="ghost"
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto px-8 py-5 h-auto font-bold text-base flex items-center justify-center gap-3"
                      >
                        <Calendar size={20} />
                        Book a Call
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Side */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl lg:mt-24 order-1 lg:order-2"
              >
                <Image 
                  src="/office2.jpeg" 
                  alt="Let's Talk" 
                  fill 
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
