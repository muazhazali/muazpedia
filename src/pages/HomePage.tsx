import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { SearchBox } from '@/components/SearchBox'
import { CategoryCard } from '@/components/CategoryCard'
import { ConceptCard } from '@/components/ConceptCard'
import {
  TOPICS,
  conceptsForTopic,
  availableConceptCount,
  lessonBySlug,
} from '@/data/lessons'
import { loadProgress, type ProgressMap } from '@/lib/progress'

export function HomePage() {
  const [progress, setProgress] = useState<ProgressMap>({})

  useEffect(() => {
    setProgress(loadProgress())
  }, [])

  const attention = lessonBySlug('attention')
  const attentionProgress = attention ? progress[attention.slug] : undefined

  return (
    <main className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-6">
      {/* hero */}
      <section className="max-w-2xl">
        <p className="text-primary text-[11px] font-medium tracking-widest uppercase">
          Muazpedia
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Your learning library
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-relaxed sm:text-lg">
          Explore, interact, and understand. Short notes, animated diagrams, interactive
          experiments and quick tests — for ideas that are hard to absorb from text alone.
        </p>
        <div className="mt-5">
          <SearchBox />
        </div>
      </section>

      {/* continue learning */}
      {attention && (
        <section className="mt-10" aria-labelledby="continue-heading">
          <h2 id="continue-heading" className="text-primary mb-3 text-[11px] font-medium tracking-widest uppercase">
            Continue learning
          </h2>
          <Link to={`/lesson/${attention.slug}`} className="block" aria-label={`Open lesson: ${attention.title}`}>
            <Card className="border-primary/30 flex flex-col gap-3 p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[15px] font-semibold">{attention.title}</p>
                <p className="text-muted-foreground text-sm">{attention.subtitle}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="accent">{lessonProgressLabel(attentionProgress)}</Badge>
                  <Badge variant="outline">{attention.difficulty}</Badge>
                </div>
              </div>
              <span className="text-primary inline-flex items-center gap-1.5 text-sm font-medium">
                {attentionProgress?.visitedAt ? 'Revisit lesson' : 'Open lesson'}
                <ArrowRight className="size-4" />
              </span>
            </Card>
          </Link>
        </section>
      )}

      {/* categories */}
      <section className="mt-12" aria-labelledby="topics-heading">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="topics-heading" className="text-xl font-semibold tracking-tight">
            Topics
          </h2>
          <span className="text-muted-foreground text-xs">choose a topic to see its concepts</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOPICS.map((t) => (
            <CategoryCard
              key={t.id}
              id={t.id}
              name={t.name}
              blurb={t.blurb}
              icon={t.icon}
              conceptCount={conceptsForTopic(t.id).length}
              hasLesson={availableConceptCount(t.id) > 0}
            />
          ))}
        </div>
      </section>

      {/* explore concepts */}
      <section className="mt-12" aria-labelledby="explore-heading">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="explore-heading" className="text-xl font-semibold tracking-tight">
            Explore concepts
          </h2>
          <span className="text-muted-foreground text-xs tabular-nums">
            {TOPICS.reduce((n, t) => n + conceptsForTopic(t.id).length, 0)} planned in total
          </span>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          {TOPICS.map((t) => {
            const concepts = conceptsForTopic(t.id)
            return (
              <section key={t.id} aria-label={`${t.name} concepts`}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{t.name}</h3>
                  <span className="text-muted-foreground text-[11px] tabular-nums">
                    {concepts.length} concepts
                  </span>
                </div>
                <div className="space-y-2">
                  {concepts.map((c) => {
                    const p = c.lesson ? progress[c.lesson.slug] : undefined
                    const started = Boolean(p?.visitedAt || p?.completed)
                    return (
                      <ConceptCard
                        key={c.title}
                        title={c.title}
                        href={c.lesson ? `/lesson/${c.lesson.slug}` : null}
                        completed={Boolean(p?.completed)}
                        started={started && !p?.completed}
                        showDifficulty={false}
                      />
                    )
                  })}
                </div>
                <Link
                  to={`/topic/${t.id}`}
                  className="text-primary mt-2.5 inline-flex items-center gap-1 text-xs font-medium hover:underline"
                >
                  Open {t.name} →
                </Link>
              </section>
            )
          })}
        </div>
      </section>

      {/* how it works */}
      <section className="mt-14" aria-labelledby="method-heading">
        <h2 id="method-heading" className="sr-only">How every lesson works</h2>
        <Card className="bg-muted/40 p-6 sm:p-8">
          <p className="text-primary text-[11px] font-medium tracking-widest uppercase">
            The learning loop
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LOOP_STEPS.map(([step, text]) => (
              <div key={step} className="flex items-start gap-3">
                <span className="text-primary bg-accent text-xs font-semibold">{step}</span>
                <p className="text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </main>
  )
}

function lessonProgressLabel(p?: { visitedAt?: number; quiz?: unknown }): string {
  if (p?.quiz) return 'Reviewed'
  if (p?.visitedAt) return 'In progress'
  return 'New'
}

const LOOP_STEPS: [string, string][] = [
  ['1', 'Overview — a 2–3 sentence idea of what the concept is and why it exists.'],
  ['2', 'Visualize — an interactive diagram you control, with the numbers shown.'],
  ['3', 'Step by step — a guided player: previous, next, replay — never passive.'],
  ['4', 'Experiment — sliders and editable inputs to build real intuition.'],
  ['5', 'Check yourself — a few questions with immediate feedback.'],
  ['6', 'Summary — short takeaways plus a flashcard for spaced recall.'],
]