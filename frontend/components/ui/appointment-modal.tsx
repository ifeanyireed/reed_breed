"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar as CalendarIcon, Clock, VideoCamera } from "phosphor-react"
import { Button } from "@/components/ui/button"
import { apiRequest } from "@/lib/api"
import { useAuth } from "@/context/auth-context"

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const AppointmentModal = ({ isOpen, onClose, onSuccess }: AppointmentModalProps) => {
  const { user, getToken } = useAuth()
  const [step, setStep] = React.useState(1)
  const [selectedDate, setSelectedDate] = React.useState<number | null>(null)
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null)
  
  // Step 2 state
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [note, setNote] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  // Slots state
  const [bookedSlots, setBookedSlots] = React.useState<string[]>([])
  const [isFetchingSlots, setIsFetchingSlots] = React.useState(false)

  // Pre-fill user data
  React.useEffect(() => {
    if (user && isOpen) {
      setName(user.name || "")
      setEmail(user.email || "")
    }
  }, [user, isOpen])

  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const monthName = today.toLocaleString('default', { month: 'long' })

  const timeSlots = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"]

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()

  // Fetch booked slots when date changes
  React.useEffect(() => {
    if (selectedDate) {
      const fetchSlots = async () => {
        setIsFetchingSlots(true)
        setSelectedTime(null) // Reset time when date changes
        const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
        try {
          // Public endpoint, no token needed but we can pass it if we want
          const res = await apiRequest(`/appointments/booked-slots?date=${formattedDate}`)
          if (res.ok) {
            const data = await res.json()
            setBookedSlots(data)
          } else {
            setBookedSlots([])
          }
        } catch (err) {
          console.error(err)
          setBookedSlots([])
        } finally {
          setIsFetchingSlots(false)
        }
      }
      fetchSlots()
    }
  }, [selectedDate, currentMonth, currentYear])

  // Reset state when closed
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1)
        setSelectedDate(null)
        setSelectedTime(null)
        setName("")
        setEmail("")
        setNote("")
        setError(null)
      }, 300)
    }
  }, [isOpen])

  const handleBooking = async () => {
    if (!name || !email) {
      setError("Please fill in your name and email.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`

    try {
      const res = await apiRequest('/appointments/book', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          date: formattedDate,
          time: selectedTime,
          type: 'Discovery Call',
          notes: note
        })
      }, getToken())

      if (res.ok) {
        setStep(3)
        onSuccess?.()
      } else {
        const data = await res.json()
        setError(data.message || "Failed to book appointment.")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-white">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-void/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-surface border border-white/10 rounded-[32px] overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 shrink-0">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tighter">Book a Discovery Call</h3>
                <p className="text-sm text-text-muted mt-1">Select a time that works for you.</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-white transition-colors"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {/* Content Body - Scrollable */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
              {step === 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Calendar Side */}
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                        <CalendarIcon size={18} /> Select Date
                      </h4>
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <div className="flex items-center justify-between mb-4 px-2 text-white font-bold">
                          <span>{monthName} {currentYear}</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <span key={i} className="text-[10px] text-text-muted font-bold">{d}</span>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                          ))}
                          {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1
                            const isPast = day < today.getDate()
                            const isSelected = selectedDate === day
                            return (
                              <button
                                key={day}
                                disabled={isPast}
                                onClick={() => setSelectedDate(day)}
                                className={`aspect-square rounded-lg text-sm font-bold flex items-center justify-center transition-all ${
                                  isPast ? 'text-white/20 cursor-not-allowed' :
                                  isSelected ? 'bg-accent text-white shadow-lg shadow-accent/20' :
                                  'text-white hover:bg-white/10'
                                }`}
                              >
                                {day}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Time Slots Side */}
                    <div className="flex flex-col h-full">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                        <Clock size={18} /> Available Times
                      </h4>
                      <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/5">
                        {!selectedDate ? (
                          <div className="h-full flex flex-col items-center justify-center text-center text-text-muted p-4">
                             <CalendarIcon size={32} className="mb-2 opacity-50" />
                             <p className="text-sm">Please select a date to view available times.</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {isFetchingSlots ? (
                              <div className="h-full flex flex-col items-center justify-center text-center text-text-muted p-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-accent mb-2"></div>
                                <p className="text-xs">Checking availability...</p>
                              </div>
                            ) : (
                              timeSlots.map(time => {
                                const isBooked = bookedSlots.includes(time)
                                return (
                                  <button
                                    key={time}
                                    disabled={isBooked}
                                    onClick={() => setSelectedTime(time)}
                                    className={`w-full p-3 rounded-xl border text-sm font-bold transition-all flex justify-center ${
                                      isBooked 
                                        ? 'border-white/5 text-white/20 bg-white/5 cursor-not-allowed line-through'
                                        : selectedTime === time 
                                          ? 'bg-accent/10 border-accent text-accent' 
                                          : 'border-white/10 text-white hover:border-white/30 hover:bg-white/5'
                                    }`}
                                  >
                                    {isBooked ? `${time} (Booked)` : time}
                                  </button>
                                )
                              })
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={() => setStep(2)}
                      disabled={!selectedDate || !selectedTime}
                      className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                        selectedDate && selectedTime 
                          ? 'bg-accent text-white hover:bg-accent/90 shadow-accent/20' 
                          : 'bg-white/10 text-white/50 cursor-not-allowed'
                      }`}
                    >
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-accent/10 border border-accent/20 p-4 rounded-2xl flex items-start sm:items-center gap-4 text-accent">
                    <VideoCamera size={24} weight="duotone" className="shrink-0 mt-1 sm:mt-0" />
                    <div>
                      <p className="font-bold text-sm">30 Minute Video Call</p>
                      <p className="text-xs opacity-80">{monthName} {selectedDate}, {currentYear} at {selectedTime}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {error && <p className="text-error text-xs font-bold">{error}</p>}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name" 
                        className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent placeholder:text-text-muted/50" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">Email</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com" 
                        className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent placeholder:text-text-muted/50" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">Anything we should know? (Optional)</label>
                      <textarea 
                        rows={3} 
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Briefly describe what you'd like to discuss..." 
                        className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent resize-none placeholder:text-text-muted/50"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button 
                      onClick={() => setStep(1)}
                      className="text-sm font-bold text-text-muted hover:text-white transition-colors"
                    >
                      Back
                    </button>
                    <Button 
                      onClick={handleBooking}
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent-dim transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
                    >
                      {isSubmitting ? "Confirming..." : "Confirm Booking"}
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12 space-y-6"
                >
                  <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center text-success mb-4">
                     <CalendarIcon size={40} weight="duotone" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter mb-2">Booking Confirmed!</h3>
                    <p className="text-text-muted">A calendar invitation has been sent to your email.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl w-full max-w-sm">
                    <p className="text-accent font-bold text-lg mb-1">{monthName} {selectedDate}, {currentYear}</p>
                    <p className="text-white font-bold">{selectedTime}</p>
                  </div>
                  <Button 
                    onClick={onClose}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all mt-4"
                  >
                    Close
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
