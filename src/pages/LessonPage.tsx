import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { LessonLayout } from '@/components/LessonLayout'
import { Formula } from '@/components/Formula'
import { Quiz } from '@/components/Quiz'
import { Flashcard } from '@/components/Flashcard'
import { lessonBySlug } from '@/data/lessons'
import { recordVisit } from '@/lib/progress'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function LessonPage() {
  const { slug } = useParams<{ slug: string }>()
  const lesson = useMemo(() => lessonBySlug(slug), [slug])

  useEffect(() => {
    if (lesson) recordVisit(lesson.slug)
  }, [lesson])

  if (!lesson) return <NotFoundPage />

  const mdxComponents = {
    Formula,
    Quiz,
    Flashcard,
  }

  const Content = lesson.component

  return (
    <LessonLayout lesson={lesson}>
      <Content components={mdxComponents} />
    </LessonLayout>
  )
}