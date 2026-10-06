import { SiteNav } from '@/components/layout/site-nav'

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      {children}
    </>
  )
}
