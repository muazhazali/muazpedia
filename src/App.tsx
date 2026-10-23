import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { SiteFooter, SiteHeader } from '@/components/SiteHeaderFooter'
import { HomePage } from '@/pages/HomePage'
import { TopicPage } from '@/pages/TopicPage'
import { LessonPage } from '@/pages/LessonPage'
import { ReviewPage } from '@/pages/ReviewPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/topic/:topicId" element={<TopicPage />} />
        <Route path="/lesson/:slug" element={<LessonPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SiteFooter />
    </div>
  )
}