"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  Trash,
  UserCircle,
  CaretRight,
  ListPlus
} from "phosphor-react"
import { StrokedText } from "@/components/ui/stroked-text"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"

interface Deliverable {
  id: number
  title: string
  status: string
}

interface Project {
  id: number
  name: string
  status: string
  client: { id: number, name: string, email: string }
  deliverables: Deliverable[]
  created_at: string
}

export default function AdminProjects() {
  const [projects, setProjects] = React.useState<Project[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const { getToken } = useAuth()

  const fetchProjects = React.useCallback(async () => {
    try {
      const token = getToken()
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
      const res = await fetch(`${apiUrl}/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (err) {
      console.error("Failed to fetch projects", err)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  React.useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = getToken()
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
      const res = await fetch(`${apiUrl}/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status })
      })
      if (res.ok) fetchProjects()
    } catch (err) {
      console.error(err)
    }
  }

  const addDeliverable = async (projectId: number) => {
    const title = prompt("Deliverable Title:")
    if (!title) return
    try {
      const token = getToken()
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
      const res = await fetch(`${apiUrl}/projects/${projectId}/deliverables`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ title, status: 'Pending' })
      })
      if (res.ok) fetchProjects()
    } catch (err) {
      console.error(err)
    }
  }

  const updateDeliverable = async (id: number, status: string) => {
    try {
      const token = getToken()
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
      const res = await fetch(`${apiUrl}/deliverables/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status })
      })
      if (res.ok) fetchProjects()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-start gap-4">
          <span className="text-accent font-black tracking-widest text-xs uppercase">Project Management</span>
          <div className="flex items-center gap-4">
            <h2 className="text-[5.5rem] font-black text-white tracking-tighter leading-[0.8]" style={{ WebkitTextStroke: '0.5px #ffffff' }}>
              Execution
            </h2>
            <div className="flex items-center -mt-2">
              <StrokedText 
                text="Tracker" 
                viewBox="0 0 450 120"
                height="4.5rem"
                strokeWidth={2}
                letterSpacing="-0.05em"
                opacity={1}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {loading ? (
          <div className="p-20 text-center glass-card rounded-[40px] border-white/5">Initializing tracker...</div>
        ) : projects.length === 0 ? (
          <div className="p-20 text-center glass-card rounded-[40px] border-white/5">
            <p className="text-text-muted font-bold mb-6">No active project executions found.</p>
            <Button onClick={() => alert("Creation modal would open here")}>New Execution</Button>
          </div>
        ) : projects.map((project, i) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-[40px] border-white/5 overflow-hidden"
          >
            <div className="p-10 border-b border-white/5 bg-white/[0.02] flex flex-col xl:flex-row xl:items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                   <Briefcase size={32} weight="duotone" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-white tracking-tighter mb-2">{project.name}</h3>
                   <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-text-muted">
                      <span className="flex items-center gap-2"><UserCircle size={16} /> {project.client.name}</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span className="flex items-center gap-2 text-accent"><Clock size={16} /> {project.status}</span>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <select 
                   value={project.status}
                   onChange={(e) => updateStatus(project.id, e.target.value)}
                   className="bg-white/5 border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-white px-4 py-2"
                 >
                    <option value="Active" className="bg-void">Active</option>
                    <option value="Paused" className="bg-void">Paused</option>
                    <option value="Completed" className="bg-void">Completed</option>
                 </select>
                 <Button variant="ghost" onClick={() => addDeliverable(project.id)} className="h-10 text-[10px] uppercase font-black tracking-widest gap-2">
                   <ListPlus size={16} />
                   Add Milestone
                 </Button>
              </div>
            </div>

            <div className="p-10">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.deliverables.map((del) => (
                    <div key={del.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 group hover:border-accent/50 transition-all">
                       <div className="flex items-start justify-between mb-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${del.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-white/5 text-text-muted'}`}>
                             <CheckCircle size={24} weight={del.status === 'Completed' ? 'fill' : 'regular'} />
                          </div>
                          <select 
                            value={del.status}
                            onChange={(e) => updateDeliverable(del.id, e.target.value)}
                            className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-text-muted focus:ring-0 cursor-pointer"
                          >
                             <option value="Pending" className="bg-void">Pending</option>
                             <option value="In Progress" className="bg-void">In Progress</option>
                             <option value="Completed" className="bg-void">Completed</option>
                          </select>
                       </div>
                       <p className="font-bold text-white tracking-tight leading-tight">{del.title}</p>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
