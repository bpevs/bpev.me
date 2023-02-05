import { ErrorPageProps } from '$fresh/server.ts'
import Page from '@/components/page.tsx'

export default function Error500Page({ error }: ErrorPageProps) {
  return <Page>500 internal error</Page>
}
