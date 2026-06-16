import { BlogPostClient } from "./client-page"

export const dynamicParams = false

export async function generateStaticParams() {
  return [{ slug: 'dummy-post' }]
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <BlogPostClient slug={slug} />
}
