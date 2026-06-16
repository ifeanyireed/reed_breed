"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  PencilSimple, 
  Trash,
  Eye,
  Calendar,
  Tag,
  ChatCircleText,
  CheckCircle,
  XCircle,
  FolderOpen,
  Article
} from "phosphor-react"
import { StrokedText } from "@/components/ui/stroked-text"
import Image from "next/image"
import Link from "next/link"
import { apiRequest, getStorageUrl } from "@/lib/api"
import { useAuth } from "@/context/auth-context"

interface BlogPost {
  id: number
  title: string
  slug: string
  category: { id: number, name: string }
  status: string
  image: string
  created_at: string
}

interface Category {
  id: number
  name: string
  slug: string
  posts_count?: number
}

interface Comment {
  id: number
  author: string
  email: string
  text: string
  status: string
  post: { id: number, title: string }
  created_at: string
}

export default function BlogCMS() {
  const [activeTab, setActiveTab] = React.useState('articles')
  const [posts, setPosts] = React.useState<BlogPost[]>([])
  const [categories, setCategories] = React.useState<Category[]>([])
  const [comments, setComments] = React.useState<Comment[]>([])
  const [loading, setLoading] = React.useState(true)
  
  // New Category State
  const [newCatName, setNewCatName] = React.useState('')
  const [newCatSlug, setNewCatSlug] = React.useState('')

  const { getToken } = useAuth()

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    const token = getToken()
    try {
      const [postsRes, catsRes, commentsRes] = await Promise.all([
        apiRequest('/admin/blog/posts', {}, token),
        apiRequest('/blog/categories'),
        apiRequest('/admin/blog/comments', {}, token)
      ])

      if (postsRes.ok) setPosts(await postsRes.json())
      if (catsRes.ok) setCategories(await catsRes.json())
      if (commentsRes.ok) setComments(await commentsRes.json())
    } catch (err) {
      console.error("Failed to fetch CMS data", err)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const deletePost = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return
    try {
      const res = await apiRequest(`/admin/blog/posts/${id}`, { method: 'DELETE' }, getToken())
      if (res.ok) setPosts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const deleteCategory = async (id: number) => {
    if (!window.confirm("Are you sure? This may affect posts in this category.")) return
    try {
      const res = await apiRequest(`/blog/categories/${id}`, { method: 'DELETE' }, getToken())
      if (res.ok) setCategories(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await apiRequest('/blog/categories', {
        method: 'POST',
        body: JSON.stringify({ name: newCatName, slug: newCatSlug })
      }, getToken())
      if (res.ok) {
        const newCat = await res.json()
        setCategories(prev => [...prev, newCat])
        setNewCatName('')
        setNewCatSlug('')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const updateCommentStatus = async (id: number, status: string) => {
    try {
      const res = await apiRequest(`/admin/blog/comments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }, getToken())
      if (res.ok) {
        setComments(prev => prev.map(c => c.id === id ? { ...c, status } : c))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const deleteComment = async (id: number) => {
    if (!window.confirm("Delete this comment?")) return
    try {
      const res = await apiRequest(`/admin/blog/comments/${id}`, { method: 'DELETE' }, getToken())
      if (res.ok) setComments(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div className="flex flex-col items-start gap-4">
          <span className="text-accent font-black tracking-widest text-xs uppercase">Content Management</span>
          <div className="flex items-center gap-4">
            <h2 className="text-[4rem] md:text-[5.5rem] font-black text-white tracking-tighter leading-[0.8]" style={{ WebkitTextStroke: '0.5px #ffffff' }}>
              Blog
            </h2>
            <div className="flex items-center -mt-2">
              <StrokedText 
                text="CMS" 
                viewBox="0 0 250 120"
                height="clamp(3rem, 8vw, 4.5rem)"
                strokeWidth={2}
                letterSpacing="-0.05em"
                opacity={1}
              />
            </div>
          </div>
        </div>
        
        {activeTab === 'articles' && (
          <Link href="/admin/blog/new" className="w-full md:w-auto">
            <button className="flex justify-center items-center gap-3 px-8 py-3 w-full md:w-auto bg-accent text-white rounded-2xl font-bold hover:bg-accent-dim transition-all shadow-lg shadow-accent/20">
              <Plus size={20} weight="bold" />
              <span className="text-sm uppercase tracking-widest">New Post</span>
            </button>
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-2 bg-white/[0.02] border border-white/5 rounded-2xl w-full md:w-fit overflow-x-auto custom-scrollbar">
        {[
          { id: 'articles', label: 'Articles', icon: Article },
          { id: 'categories', label: 'Categories & Tags', icon: Tag },
          { id: 'comments', label: 'Comments', icon: ChatCircleText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center shrink-0 gap-3 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${
              activeTab === tab.id ? 'text-white' : 'text-text-muted hover:text-white'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="blog-tab-indicator"
                className="absolute inset-0 bg-white/10 rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <tab.icon size={18} className="relative z-10" />
            <span className="relative z-10">{tab.label}</span>
            {tab.id === 'comments' && (
              <span className="relative z-10 ml-2 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[10px]">
                {comments.filter(c => c.status === 'Pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        <AnimatePresence mode="wait">
          {/* --- ARTICLES VIEW --- */}
          {activeTab === 'articles' && (
            <motion.div
              key="articles"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {posts.length === 0 ? (
                <div className="md:col-span-2 xl:col-span-3 text-center py-20 text-text-muted font-bold uppercase tracking-widest">No articles found. Create your first one!</div>
              ) : posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-[32px] border-white/5 overflow-hidden group bg-white/[0.01]"
                >
                  <div className="relative aspect-video overflow-hidden">
                     {post.image ? (
                       <Image 
                        src={getStorageUrl(post.image) || ""} 
                        alt={post.title} 
                        fill 
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                       />
                     ) : (
                       <div className="w-full h-full bg-white/5 flex items-center justify-center text-text-muted">
                         <Article size={48} weight="duotone" />
                       </div>
                     )}
                     <div className="absolute top-6 left-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          post.status === 'Published' ? 'bg-success text-[#ffffff]' : 'bg-warning text-void'
                        }`}>
                          {post.status}
                        </span>
                     </div>
                  </div>
                  
                  <div className="p-8 space-y-6">
                    <div className="flex items-center gap-3 text-text-muted text-[10px] font-black uppercase tracking-widest">
                      <span className="text-accent">{post.category?.name}</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 min-h-[3.5rem]">
                      {post.title}
                    </h3>
                    
                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/blog/edit/${post.id}`}>
                          <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-accent transition-all" title="Edit">
                            <PencilSimple size={18} />
                          </button>
                        </Link>
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-void transition-all" title="View">
                            <Eye size={18} />
                          </button>
                        </Link>
                      </div>
                      <button 
                        onClick={() => deletePost(post.id)}
                        className="w-10 h-10 rounded-xl bg-error/5 flex items-center justify-center text-error hover:bg-error hover:text-white transition-all" 
                        title="Delete"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <Link href="/admin/blog/new" className="rounded-[32px] border-2 border-dashed border-white/10 hover:border-accent/40 hover:bg-accent/[0.02] transition-all flex flex-col items-center justify-center gap-4 group min-h-[400px]">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-text-muted group-hover:bg-accent/10 group-hover:text-accent transition-all">
                   <Plus size={32} />
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-text-muted group-hover:text-white transition-colors">Create New Article</span>
              </Link>
            </motion.div>
          )}

          {/* --- CATEGORIES VIEW --- */}
          {activeTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Add New Category Form */}
              <div className="glass-card rounded-[40px] border-white/5 p-10 bg-white/[0.01] h-fit">
                 <h3 className="text-2xl font-black text-white tracking-tighter mb-8">Add Category</h3>
                 <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted block mb-3">Name</label>
                      <input 
                        type="text" 
                        value={newCatName}
                        onChange={(e) => {
                          setNewCatName(e.target.value)
                          setNewCatSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))
                        }}
                        placeholder="e.g. Artificial Intelligence" 
                        className="w-full bg-void border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted block mb-3">Slug</label>
                      <input 
                        type="text" 
                        value={newCatSlug}
                        onChange={(e) => setNewCatSlug(e.target.value)}
                        placeholder="e.g. artificial-intelligence" 
                        className="w-full bg-void border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <button 
                      onClick={addCategory}
                      className="w-full py-4 bg-accent text-white rounded-xl font-bold hover:bg-accent-dim transition-all mt-4"
                    >
                      Add Category
                    </button>
                 </div>
              </div>

              {/* Categories Table */}
              <div className="lg:col-span-2 glass-card rounded-[40px] border-white/5 overflow-hidden bg-white/[0.01]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Name</th>
                      <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Slug</th>
                      <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Posts</th>
                      <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {categories.length === 0 ? (
                      <tr><td colSpan={4} className="px-10 py-20 text-center text-text-muted font-bold uppercase tracking-widest">No categories found.</td></tr>
                    ) : categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted">
                              <FolderOpen size={20} weight="duotone" />
                            </div>
                            <span className="font-bold text-white group-hover:text-accent transition-colors">{cat.name}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-sm text-text-muted">{cat.slug}</td>
                        <td className="px-10 py-6">
                           <span className="px-3 py-1 rounded-md bg-white/5 text-white text-xs font-bold">{cat.posts_count ?? 0}</span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => deleteCategory(cat.id)}
                              className="w-10 h-10 rounded-xl hover:bg-error/10 flex items-center justify-center text-text-muted hover:text-error transition-all"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* --- COMMENTS VIEW --- */}
          {activeTab === 'comments' && (
            <motion.div
              key="comments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="glass-card rounded-[40px] border-white/5 overflow-hidden bg-white/[0.01]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest w-1/4">Author</th>
                      <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest w-2/5">Comment</th>
                      <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">In Response To</th>
                      <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {comments.length === 0 ? (
                      <tr><td colSpan={4} className="px-10 py-20 text-center text-text-muted font-bold uppercase tracking-widest">No comments yet.</td></tr>
                    ) : comments.map((comment) => (
                      <tr key={comment.id} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="px-10 py-8">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold mt-1">
                              {comment.author.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-white">{comment.author}</p>
                              <p className="text-xs text-text-muted">{comment.email}</p>
                              <p className="text-[10px] text-text-muted uppercase tracking-widest mt-2">{new Date(comment.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="mb-3 flex items-center gap-2">
                             <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                               comment.status === 'Approved' ? 'bg-success/10 text-success' :
                               comment.status === 'Spam' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                             }`}>
                               {comment.status}
                             </span>
                           </div>
                           <p className="text-sm text-text-secondary leading-relaxed">{comment.text}</p>
                        </td>
                        <td className="px-10 py-8">
                          <span className="text-sm text-white opacity-60 line-clamp-2">{comment.post?.title}</span>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {comment.status !== 'Approved' && (
                              <button 
                                onClick={() => updateCommentStatus(comment.id, 'Approved')}
                                className="w-10 h-10 rounded-xl hover:bg-success/10 flex items-center justify-center text-text-muted hover:text-success transition-all" 
                                title="Approve"
                              >
                                <CheckCircle size={20} />
                              </button>
                            )}
                            {comment.status !== 'Spam' && (
                              <button 
                                onClick={() => updateCommentStatus(comment.id, 'Spam')}
                                className="w-10 h-10 rounded-xl hover:bg-error/10 flex items-center justify-center text-text-muted hover:text-error transition-all" 
                                title="Mark as Spam"
                              >
                                <XCircle size={20} />
                              </button>
                            )}
                            <button 
                              onClick={() => deleteComment(comment.id)}
                              className="w-10 h-10 rounded-xl hover:bg-error/10 flex items-center justify-center text-text-muted hover:text-error transition-all" 
                              title="Delete"
                            >
                              <Trash size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
