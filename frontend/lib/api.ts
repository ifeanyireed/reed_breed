const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

export const apiRequest = async (
  path: string,
  options: RequestInit = {},
  token?: string | null
) => {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  return res
}

export const getStorageUrl = (path: string | null) => {
  if (!path) return null
  if (path.startsWith('http') || path.startsWith('data:')) return path
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000'
  return `${baseUrl}/storage/${path}`
}
