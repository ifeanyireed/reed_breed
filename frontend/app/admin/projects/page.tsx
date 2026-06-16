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
  X,
  ListChecks,
  WarningCircle
} from "phosphor-react"
import { StrokedText } from "@/components/ui/stroked-text"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { apiRequest } from "@/lib/api"

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

interface Client {
  id: number
  name: string
  email: string
}

interface Plan {
  id: number
  name: string
  price: number
  interval: string
  features: string
}

const COLUMNS = ["Pending", "In Progress", "Review", "Completed"]

export default function AdminProjects() {
  const [projects, setProjects] = React.useState<Project[]>([])
  const [clients, setClients] = React.useState<Client[]>([])
  const [plans, setPlans] = React.useState<Plan[]>([])
  const [loading, setLoading] = React.useState(true)
  const { getToken } = useAuth()

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null)

  // Create Form States
  const [newProjectName, setNewProjectName] = React.useState("")
  const [newProjectClient, setNewProjectClient] = React.useState("")
  const [selectedTier, setSelectedTier] = React.useState<string>("")
  const [newDeliverables, setNewDeliverables] = React.useState<string[]>([])

  const fetchProjects = React.useCallback(async () => {
    try {
      const token = getToken()
      const [projRes, clientRes, plansRes] = await Promise.all([
        apiRequest('/projects', {}, token),
        apiRequest('/admin/clients', {}, token),
        apiRequest('/subscriptions/plans')
      ])

      if (projRes.ok) setProjects(await projRes.json())
      if (clientRes.ok) setClients(await clientRes.json())
      if (plansRes.ok) setPlans(await plansRes.json())
    } catch (err) {
      console.error("Failed to fetch data", err)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  React.useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleTierSelect = (plan: Plan) => {
    setSelectedTier(plan.name)
    setNewDeliverables(plan.features.split(', '))
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectName || !newProjectClient) return

    try {
      const token = getToken()
      // 1. Create Project
      const res = await apiRequest('/projects', {
        method: 'POST',
        body: JSON.stringify({
          name: newProjectName,
          client_id: newProjectClient,
          status: 'Pending',
          start_date: new Date().toISOString().split('T')[0]
        })
      }, token)

      if (res.ok) {
        const project = await res.json()
        
        // 2. Create Deliverables
        for (const title of newDeliverables) {
          await apiRequest(`/projects/${project.id}/deliverables`, {
            method: 'POST',
            body: JSON.stringify({ title, status: 'Pending' })
          }, token)
        }

        setIsCreateModalOpen(false)
        setNewProjectName("")
        setNewProjectClient("")
        setSelectedTier("")
        setNewDeliverables([])
        fetchProjects()
      }
    } catch (err) {
      console.error("Failed to create project", err)
    }
  }

  const updateProjectStatus = async (id: number, status: string) => {
    try {
      const res = await apiRequest(`/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }, getToken())
      if (res.ok) fetchProjects()
    } catch (err) {
      console.error(err)
    }
  }

  const updateDeliverableStatus = async (id: number, status: string) => {
    try {
      const res = await apiRequest(`/deliverables/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }, getToken())
      
      if (res.ok) {
        // Update local state for immediate feedback
        setSelectedProject(prev => {
          if (!prev) return prev
          return {
            ...prev,
            deliverables: prev.deliverables.map(d => d.id === id ? { ...d, status } : d)
          }
        })
        fetchProjects() // Background refresh
      }
    } catch (err) {
      console.error(err)
    }
  }

  const deleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return
    try {
      const res = await apiRequest(`/projects/${id}`, { method: 'DELETE' }, getToken())
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id))
        setSelectedProject(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getProgress = (deliverables: Deliverable[]) => {
    if (!deliverables || deliverables.length === 0) return 0
    const completed = deliverables.filter(d => d.status === 'Completed').length
    return Math.round((completed / deliverables.length) * 100)
  }

  return (
    <div className="space-y-8 flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex justify-between items-end flex-shrink-0">
        <div className="flex flex-col items-start gap-4">
          <span className="text-accent font-black tracking-widest text-xs uppercase">Progress Tracker</span>
          <div className="flex items-center gap-4">
            <h2 className="text-[4.5rem] font-black text-white tracking-tighter leading-[0.8]" style={{ WebkitTextStroke: '0.5px #ffffff' }}>
              Execution
            </h2>
            <div className="flex items-center -mt-2">
              <StrokedText 
                text="Funnel" 
                viewBox="0 0 350 120"
                height="3.5rem"
                strokeWidth={2}
                letterSpacing="-0.05em"
                opacity={1}
              />
            </div>
          </div>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus size={18} weight="bold" />
          Create Job
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {loading ? (
          <div className="w-full flex items-center justify-center text-text-muted">Loading tracker...</div>
        ) : (
          COLUMNS.map(column => {
            // Map "Active" to "In Progress" for legacy data support
            const columnProjects = projects.filter(p => {
              if (column === "In Progress" && p.status === "Active") return true
              return p.status === column
            })

            return (
              <div key={column} className="flex-shrink-0 w-80 flex flex-col bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden h-full">
                <div className="p-5 border-b border-white/5 flex items-center justify-between bg-void/50">
                  <h3 className="font-black text-white tracking-widest uppercase text-xs">{column}</h3>
                  <span className="w-6 h-6 rounded-full bg-white/5 text-[10px] font-bold flex items-center justify-center text-text-muted">
                    {columnProjects.length}
                  </span>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {columnProjects.map(project => {
                    const progress = getProgress(project.deliverables)
                    return (
                      <motion.div
                        layoutId={`project-${project.id}`}
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="bg-surface border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-accent/50 hover:bg-white/[0.04] transition-all group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-white leading-tight">{project.name}</h4>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4">
                          <UserCircle size={14} />
                          {project.client.name}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold text-text-secondary">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-accent transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Quick Action to Move Column */}
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <select 
                             value={project.status === 'Active' ? 'In Progress' : project.status}
                             onChange={(e) => {
                               e.stopPropagation()
                               updateProjectStatus(project.id, e.target.value)
                             }}
                             className="text-[9px] font-black uppercase tracking-widest bg-void border border-white/10 rounded-lg px-2 py-1 text-text-muted"
                           >
                              {COLUMNS.map(col => <option key={col} value={col}>{col}</option>)}
                           </select>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* --- MODALS --- */}

      {/* Create Project Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-void/80 backdrop-blur-sm"
              onClick={() => setIsCreateModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-surface border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted transition-colors"
              >
                <X size={20} weight="bold" />
              </button>

              <h2 className="text-3xl font-black text-white tracking-tighter mb-8">Create New Job</h2>

              <form onSubmit={handleCreateProject} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Project Name</label>
                    <input 
                      type="text" 
                      required
                      value={newProjectName}
                      onChange={e => setNewProjectName(e.target.value)}
                      placeholder="e.g. Brand Overhaul"
                      className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Client</label>
                    <select 
                      required
                      value={newProjectClient}
                      onChange={e => setNewProjectClient(e.target.value)}
                      className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
                    >
                      <option value="">Select a client...</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4 block">Select Pricing Service Tier</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {plans.map(plan => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => handleTierSelect(plan)}
                        className={`p-4 rounded-2xl border text-left transition-all ${selectedTier === plan.name ? 'border-accent bg-accent/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                      >
                        <h4 className={`font-bold ${selectedTier === plan.name ? 'text-accent' : 'text-white'}`}>{plan.name}</h4>
                        <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest">{plan.interval}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {newDeliverables.length > 0 && (
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                      <ListChecks size={16} className="text-accent" />
                      Auto-Populated Deliverables
                    </h4>
                    <ul className="space-y-2">
                      {newDeliverables.map((del, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                          <CheckCircle size={16} className="text-text-muted" />
                          {del}
                        </li>
                      ))}
                    </ul>
                    <p className="text-[10px] text-text-muted italic pt-2">These will be added as pending tasks.</p>
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full mt-8">Create Project & Deliverables</Button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Project Details / Deliverables Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-void/80 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            />
            <motion.div 
              layoutId={`project-${selectedProject.id}`}
              className="relative w-full max-w-3xl bg-surface border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted transition-colors"
              >
                <X size={20} weight="bold" />
              </button>

              <div className="mb-10">
                <span className="text-accent font-black tracking-widest text-[10px] uppercase mb-2 block">{selectedProject.client.name}</span>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4">{selectedProject.name}</h2>
                <div className="flex gap-4">
                  <select 
                    value={selectedProject.status === 'Active' ? 'In Progress' : selectedProject.status}
                    onChange={(e) => {
                      updateProjectStatus(selectedProject.id, e.target.value)
                      setSelectedProject({...selectedProject, status: e.target.value})
                    }}
                    className="bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white px-4 py-2 focus:border-accent outline-none"
                  >
                    {COLUMNS.map(col => <option key={col} value={col} className="bg-void">{col}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                  <ListChecks size={24} className="text-accent" />
                  Service Deliverables
                </h3>
                
                {selectedProject.deliverables.length === 0 ? (
                  <div className="p-8 text-center bg-white/5 rounded-3xl border border-white/10 text-text-muted flex flex-col items-center gap-2">
                    <WarningCircle size={32} />
                    <p className="font-bold text-sm">No deliverables attached to this project.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {selectedProject.deliverables.map(del => (
                      <div key={del.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                        <span className={`font-medium ${del.status === 'Completed' ? 'text-text-muted line-through' : 'text-white'}`}>
                          {del.title}
                        </span>
                        
                        <div className="flex items-center gap-3">
                           <select
                             value={del.status}
                             onChange={(e) => updateDeliverableStatus(del.id, e.target.value)}
                             className={`bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer ${
                               del.status === 'Completed' ? 'text-success' : 
                               del.status === 'In Progress' ? 'text-warning' : 'text-text-muted'
                             }`}
                           >
                             <option value="Pending" className="bg-void text-white">Pending</option>
                             <option value="In Progress" className="bg-void text-white">In Progress</option>
                             <option value="Completed" className="bg-void text-white">Completed</option>
                           </select>
                           
                           {del.status === 'Completed' ? (
                             <CheckCircle size={24} weight="fill" className="text-success" />
                           ) : (
                             <div className="w-6 h-6 rounded-full border-2 border-white/10" />
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 flex justify-end">
                 <Button 
                   variant="ghost" 
                   className="text-error hover:bg-error/10 hover:text-error gap-2"
                   onClick={() => deleteProject(selectedProject.id)}
                 >
                   <Trash size={18} />
                   Delete Project
                 </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
