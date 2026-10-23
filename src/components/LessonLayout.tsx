import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import type { Lesson } from '@/data/lessons'
import { topicForLesson } from '@/data/lessons'
import type { LessonProgress } from '@/lib/progress'

export interface LessonLayoutProps {
  lesson: Lesson
  progress?: LessonProgress
  children: React.ReactNode
}

export function LessonLayout({ lesson, progress, children }: LessonLayoutProps) {
  const topic = topicForLesson(lesson)

  return (
    <article className="mx-auto w-full max-w-[56rem] px-4 pt-8 pb-24 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 font-mono text-[11px] tracking-wide uppercase">
        <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
          Library
        </Link>
        <ChevronRight className="size-3 opacity-50" />
        {topic && (
          <>
            <Link
              to={`/topic/${topic.id}`}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {topic.name}
            </Link>
            <ChevronRight className="size-3 opacity-50" />
          </>
        )}
        <span className="text-primary">{lesson.title}</span>
      </nav>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">{topic?.name ?? 'Concept'}</Badge>
          <Badge variant="outline">{lesson.difficulty}</Badge>
          {lesson.tags.slice(0, 2).map((tag) => (
            <Badge variant="muted" key={tag}>
              {tag}
            </Badge>
          ))}
          {progress?.completed && (
            <Badge variant="accent" className="gap-1">
              ✓ completed
            </Badge>
          )}
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{lesson.title}</h1>
        <p className="text-muted-foreground mt-2 text-base">{lesson.subtitle}</p>
      </header>

      <div className="lesson-content max-w-[48rem]">{children}</div>
    </article>
  )
}