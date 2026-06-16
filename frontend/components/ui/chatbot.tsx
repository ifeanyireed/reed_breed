"use client"

import React, { useState, useRef, useEffect } from "react";
import { ChatCircleDots, X, PaperPlaneRight, CircleNotch, Brain, WhatsappLogo } from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";

import { apiRequest } from "@/lib/api";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am the Reed Breed AI Assistant. How can I help you accelerate your growth today?' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Handoff State
  const [isHandoffMode, setIsHandoffMode] = useState(false);
  const [handoffData, setHandoffData] = useState({ name: '', phone: '' });
  const [handoffSuccess, setHandoffSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isHandoffMode]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading || isHandoffMode) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await apiRequest('/chat', {
        method: 'POST',
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })) 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: `Sorry, I encountered an error. Please try again later or email hello@reedbreed.com.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const submitHandoff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handoffData.name.trim() || !handoffData.phone.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await apiRequest('/chat/handoff', {
        method: 'POST',
        body: JSON.stringify({ 
          messages: messages,
          userInfo: handoffData
        }),
      });

      if (!response.ok) throw new Error('Handoff failed');
      
      const data = await response.json();
      
      // Construct the wa.me link
      const myWhatsAppNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348035428870"; // The Director's number
      const textMessage = `Hi Ifeanyi, my name is ${handoffData.name} (Phone: ${handoffData.phone}).\n\nI was just chatting with your AI assistant, and here is a summary of what I need:\n\n*${data.summary}*\n\nLet's talk!`;
      
      const waUrl = `https://wa.me/${myWhatsAppNumber}?text=${encodeURIComponent(textMessage)}`;
      
      // Open WhatsApp in a new tab
      window.open(waUrl, '_blank');

      setHandoffSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong connecting to WhatsApp. Please email us directly.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[100] w-14 h-14 rounded-full bg-accent text-white shadow-[0_10px_40px_rgba(20,110,245,0.4)] flex items-center justify-center transition-all ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <ChatCircleDots size={32} weight="duotone" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[101] w-[calc(100vw-3rem)] md:w-[400px] h-[600px] max-h-[calc(100vh-8rem)] bg-surface border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-void border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                  <Brain size={20} weight="fill" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Reed Breed AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-accent text-white rounded-tr-sm' : 'bg-white/5 border border-white/10 text-text-secondary rounded-tl-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isLoading && !isHandoffMode && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-sm text-text-secondary flex items-center gap-2">
                    <CircleNotch size={16} className="animate-spin text-accent" />
                    <span className="text-xs">Thinking...</span>
                  </div>
                </div>
              )}

              {/* WhatsApp Handoff Flow */}
              {isHandoffMode && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-sm">
                  {handoffSuccess ? (
                    <div className="text-center py-2">
                       <WhatsappLogo size={40} weight="duotone" className="text-success mx-auto mb-2" />
                       <p className="font-bold text-white mb-1">Redirecting...</p>
                       <p className="text-xs text-text-secondary">WhatsApp is opening in a new tab with your message ready to send to Ifeanyi!</p>
                    </div>
                  ) : (
                    <form onSubmit={submitHandoff} className="flex flex-col gap-3">
                      <p className="text-white font-bold mb-1">Connect with Director</p>
                      <p className="text-xs text-text-secondary mb-2">Leave your details. I'll summarize our chat and send it directly to Ifeanyi's WhatsApp.</p>
                      <input type="text" required placeholder="Your Name" value={handoffData.name} onChange={e => setHandoffData({...handoffData, name: e.target.value})} className="bg-void border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-success/50" />
                      <input type="tel" required placeholder="WhatsApp Number" value={handoffData.phone} onChange={e => setHandoffData({...handoffData, phone: e.target.value})} className="bg-void border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-success/50" />
                      <button type="submit" disabled={isLoading} className="mt-2 w-full bg-success text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-success/80 transition-colors disabled:opacity-50">
                        {isLoading ? <CircleNotch className="animate-spin" /> : <><WhatsappLogo size={16} weight="fill" /> Send to WhatsApp</>}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/5 bg-void">
              {!isHandoffMode && messages.length > 2 && (
                 <button onClick={() => setIsHandoffMode(true)} className="w-full mb-3 py-2 rounded-lg border border-success/30 bg-success/10 text-success text-xs font-bold flex items-center justify-center gap-2 hover:bg-success/20 transition-colors">
                   <WhatsappLogo size={16} weight="fill" /> Connect via WhatsApp
                 </button>
              )}

              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isHandoffMode ? "Handoff in progress..." : "Ask me anything..."}
                  disabled={isLoading || isHandoffMode}
                  className="w-full bg-surface border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent/50 disabled:opacity-50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading || isHandoffMode}
                  className="absolute right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                >
                  <PaperPlaneRight size={16} weight="fill" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
