import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ConceptCard } from '@/components/ConceptCard'
import { IconByName } from '@/components/icons'
import { conceptsForTopic, topicById } from '@/data/lessons'
import { loadProgress, type ProgressMap } from '@/lib/progress'
import { useEffect, useState } from 'react'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const topic = topicById(topicId)
  const [progress, setProgress] = useState<ProgressMap>({})

  useEffect(() => {
    setProgress(loadProgress())
  }, [topicId])

  if (!topic) return <NotFoundPage />

  const concepts = conceptsForTopic(topic.id)
  const hasLesson = concepts.some((c) => c.lesson)

  return (
    <main className="mx-auto max-w-4xl px-4 pt-8 pb-24 sm:px-6">
      <Link to="/" className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 text-sm transition-colors">
        <ArrowLeft className="size-4" /> All topics
      </Link>

      <header className="mt-5 flex items-start gap-4">
        <span className="bg-accent text-accent-foreground flex size-11 shrink-0 items-center justify-center rounded-xl">
          <IconByName name={topic.icon} className="size-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{topic.name}</h1>
          <p className="text-muted-foreground mt-1 max-w-xl">{topic.blurb}</p>
          <div className="mt-2.5 flex gap-1.5">
            <Badge variant="outline">{concepts.length} concepts</Badge>
            {hasLesson && <Badge variant="accent">1 lesson ready</Badge>}
          </div>
        </div>
      </header>

      <section className="mt-8" aria-label={`${topic.name} concept list`}>
        <div className="grid gap-2">
          {concepts.map((c) => {
            const p = c.lesson ? progress[c.lesson.slug] : undefined
            return (
              <ConceptCard
                key={c.title}
                title={c.title}
                href={c.lesson ? `/lesson/${c.lesson.slug}` : null}
                completed={Boolean(p?.completed)}
                started={Boolean(p?.visitedAt) && !p?.completed}
                showDifficulty={false}
              />
            )
          })}
        </div>
        <p className="text-muted-foreground mt-4 text-sm">
          Remaining concepts of this topic unlock as interactive lessons — each built on the same
          visualize → experiment → test loop.
        </p>
      </section>
    </main>
  )
}