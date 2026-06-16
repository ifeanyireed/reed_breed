import EditBlogPost from "./client-page"

export const dynamicParams = false

export async function generateStaticParams() {
  // Returning at least one dummy param to ensure Next.js detects the function correctly.
  return [{ slug: 'dummy' }]
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // We must await params in Next.js 16/React 19
  await params
  return <EditBlogPost />
}
