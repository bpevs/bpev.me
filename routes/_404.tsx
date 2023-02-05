import { UnknownPageProps } from '$fresh/server.ts'
import Page from '@/components/page.tsx'

export default function NotFoundPage({ url }: UnknownPageProps) {
  return <Page>404 not found: {url.pathname}</Page>
}
