"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  CloudArrowUp, 
  Eye, 
  Trash,
  Image as ImageIcon,
  FileText
} from "phosphor-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { apiRequest, getStorageUrl } from "@/lib/api"
import { useAuth } from "@/context/auth-context"

// TipTap Editor (Standard WYSIWYG for Next.js)
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null

  const addImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0]
        
        // Compress before upload
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new Image()
          img.onload = async () => {
            const canvas = document.createElement('canvas')
            let width = img.width
            let height = img.height
            const MAX_WIDTH = 1920
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            ctx?.drawImage(img, 0, 0, width, height)
            
            canvas.toBlob(async (blob) => {
              if (blob) {
                const formData = new FormData()
                formData.append('image', blob, file.name)

                try {
                  const token = localStorage.getItem('rb_token')
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
                  const res = await fetch(`${apiUrl}/admin/blog/upload-image`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`
                    },
                    body: formData
                  })

                  if (res.ok) {
                    const { url } = await res.json()
                    editor.chain().focus().setImage({ src: url }).run()
                  }
                } catch (err) {
                  console.error("Image upload failed", err)
                }
              }
            }, 'image/jpeg', 0.8)
          }
          img.src = e.target?.result as string
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  return (
    <div className="flex flex-wrap gap-2 p-4 border-b border-white/10 bg-white/[0.02]">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${editor.isActive('bold') ? 'bg-accent text-white' : 'bg-white/5 text-text-secondary hover:text-white'}`}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${editor.isActive('italic') ? 'bg-accent text-white' : 'bg-white/5 text-text-secondary hover:text-white'}`}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${editor.isActive('heading', { level: 2 }) ? 'bg-accent text-white' : 'bg-white/5 text-text-secondary hover:text-white'}`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${editor.isActive('heading', { level: 3 }) ? 'bg-accent text-white' : 'bg-white/5 text-text-secondary hover:text-white'}`}
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${editor.isActive('bulletList') ? 'bg-accent text-white' : 'bg-white/5 text-text-secondary hover:text-white'}`}
      >
        Bullet List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${editor.isActive('orderedList') ? 'bg-accent text-white' : 'bg-white/5 text-text-secondary hover:text-white'}`}
      >
        Ordered List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${editor.isActive('blockquote') ? 'bg-accent text-white' : 'bg-white/5 text-text-secondary hover:text-white'}`}
      >
        Quote
      </button>
      <button
        type="button"
        onClick={addImage}
        className="px-3 py-1.5 rounded-lg text-sm font-bold bg-white/5 text-text-secondary hover:text-accent hover:bg-accent/10 transition-all flex items-center gap-2"
      >
        <ImageIcon size={16} />
        Add Image
      </button>
    </div>
  )
}

export default function NewBlogPost() {
  const [title, setTitle] = React.useState("")
  const [categoryId, setCategoryId] = React.useState("")
  const [excerpt, setExcerpt] = React.useState("")
  const [image, setImage] = React.useState<string | null>(null)
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [categories, setCategories] = React.useState<{id: number, name: string}[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const router = useRouter()
  const { getToken } = useAuth()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      LinkExtension.configure({
        openOnClick: false,
      }),
      ImageExtension.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-2xl border border-white/10 my-8 max-w-full',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your masterpiece...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[500px] p-8 md:p-12',
      },
    },
  })

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiRequest('/blog/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
          if (data.length > 0) setCategoryId(data[0].id.toString())
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchCategories()
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Compress image before storing
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          
          // Max width 1920px
          const MAX_WIDTH = 1920
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
          
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              setImageFile(compressedFile)
              setImage(canvas.toDataURL('image/jpeg', 0.8))
            }
          }, 'image/jpeg', 0.8)
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (status: 'Published' | 'Draft') => {
    if (!title || !editor) {
      setError("Title and content are required.")
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('category_id', categoryId)
    formData.append('content', editor.getHTML())
    formData.append('excerpt', excerpt)
    formData.append('status', status)
    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      const token = getToken()
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
      const res = await fetch(`${apiUrl}/admin/blog/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (res.ok) {
        router.push('/admin/blog')
      } else {
        const text = await res.text()
        console.error("Raw error response:", text)
        try {
          const data = JSON.parse(text)
          setError(data.message || "Failed to save post.")
        } catch (e) {
          setError("Server returned an invalid response. Check console for details.")
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDiscard = () => {
    if (window.confirm('Discard this draft?')) {
      router.push('/admin/blog')
    }
  }

  return (
    <div className="space-y-12 pb-20 text-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Link href="/admin/blog" className="flex items-center gap-3 text-text-muted hover:text-white transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm uppercase tracking-widest">Back to CMS</span>
        </Link>

        <div className="flex gap-4">
          <button 
            onClick={() => handleSubmit('Draft')}
            disabled={loading}
            className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all text-white disabled:opacity-50"
          >
            <FileText size={20} />
            <span className="text-sm uppercase tracking-widest">{loading ? 'Saving...' : 'Save Draft'}</span>
          </button>
          <button 
            onClick={() => handleSubmit('Published')}
            disabled={loading}
            className="flex items-center gap-3 px-8 py-3 bg-accent text-white rounded-2xl font-bold hover:bg-accent-dim transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
          >
            <CloudArrowUp size={20} weight="bold" />
            <span className="text-sm uppercase tracking-widest">{loading ? 'Publishing...' : 'Publish Post'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-sm font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Main Editor */}
        <div className="xl:col-span-2 space-y-8">
          <div className="space-y-4">
             <input 
              type="text" 
              placeholder="Post Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-5xl md:text-6xl font-black text-white placeholder:text-white/10 focus:outline-none tracking-tighter"
             />
          </div>

          <div className="glass-card rounded-[32px] border-white/5 overflow-hidden bg-white/[0.01]">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
           <div className="glass-card p-8 rounded-[32px] border-white/5 bg-white/[0.02] space-y-8">
              <div>
                 <label className="text-[10px] font-black uppercase tracking-widest text-text-muted block mb-4">Category</label>
                 <select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
                 >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                 </select>
              </div>

              <div>
                 <label className="text-[10px] font-black uppercase tracking-widest text-text-muted block mb-4">Featured Image</label>
                 <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                 />
                 <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-video rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:border-accent/40 hover:bg-accent/[0.02] transition-all cursor-pointer group overflow-hidden"
                 >
                    {image ? (
                      <img src={getStorageUrl(image) || ""} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImageIcon size={32} className="text-text-muted group-hover:text-accent transition-colors" />
                        <span className="text-xs font-bold uppercase tracking-widest text-text-muted group-hover:text-white transition-colors">Upload Image</span>
                      </>
                    )}
                 </div>
              </div>

              <div>
                 <label className="text-[10px] font-black uppercase tracking-widest text-text-muted block mb-4">SEO Excerpt</label>
                 <textarea 
                  rows={4}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent resize-none placeholder:text-text-muted"
                  placeholder="Short description for search results..."
                 ></textarea>
              </div>

              <div className="pt-4">
                 <button 
                  onClick={handleDiscard}
                  className="w-full py-4 rounded-2xl bg-error/10 text-error font-bold uppercase tracking-widest text-xs hover:bg-error hover:text-white transition-all flex items-center justify-center gap-3"
                 >
                    <Trash size={18} />
                    Discard Draft
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
