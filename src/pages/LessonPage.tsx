import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LessonLayout } from '@/components/LessonLayout'
import { Formula } from '@/components/Formula'
import { Quiz } from '@/components/Quiz'
import { Flashcard } from '@/components/Flashcard'
import { lessonBySlug } from '@/data/lessons'
import {
  loadProgress,
  recordVisit,
  PROGRESS_EVENT,
  type ProgressMap,
} from '@/lib/progress'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function LessonPage() {
  const { slug } = useParams<{ slug: string }>()
  const lesson = useMemo(() => lessonBySlug(slug), [slug])
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress())

  useEffect(() => {
    if (!lesson) return
    recordVisit(lesson.slug)
    const refresh = () => setProgress(loadProgress())
    refresh()
    window.addEventListener(PROGRESS_EVENT, refresh)
    return () => window.removeEventListener(PROGRESS_EVENT, refresh)
  }, [lesson])

  if (!lesson) return <NotFoundPage />

  const mdxComponents = {
    Formula,
    Quiz,
    Flashcard,
  }

  const Content = lesson.component

  return (
    <LessonLayout lesson={lesson} progress={progress[lesson.slug]}>
      <Content components={mdxComponents} />
    </LessonLayout>
  )
}