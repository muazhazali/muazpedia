import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Flashcard } from '@/components/Flashcard'
import { allFlashcards } from '@/data/lessons'
import {
  loadCardRatings,
  type CardRatings,
} from '@/lib/progress'
import { cn } from '@/lib/utils'

type Filter = 'all' | 'to-review' | 'known'

export function ReviewPage() {
  const [ratings, setRatings] = useState<CardRatings>({})
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    setRatings(loadCardRatings())
  }, [])

  const groups = useMemo(() => allFlashcards(), [])

  const allCards = useMemo(() => groups.flatMap((g) => g.cards), [groups])
  const knownCount = allCards.filter((c) => ratings[c.id]?.rating === 'known').length
  const unseen = allCards.filter((c) => !ratings[c.id]).length

  const visibleCounts: Record<Filter, number> = {
    all: allCards.length,
    'to-review': allCards.filter((c) => (ratings[c.id]?.rating ?? 'again') !== 'known').length,
    known: knownCount,
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pt-8 pb-24 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Review</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          Active recall beats re-reading. Flip each card, answer honestly, and rate yourself —
          ratings are kept on this device.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge variant="accent">{allCards.length} cards</Badge>
          <Badge variant="outline">{knownCount} known</Badge>
          <Badge variant="muted">{unseen} unseen</Badge>
        </div>
      </header>

      {/* filter chips */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Filter flashcards">
          {(
            [
              ['all', 'All'],
              ['to-review', 'To review'],
              ['known', 'Known'],
            ] as [Filter, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={filter === key}
              onClick={() => setFilter(key)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                filter === key
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              {label} ({visibleCounts[key]})
            </button>
          ))}
        </div>
        {knownCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.confirm('Reset all card ratings and lesson progress?')) {
                try {
                  localStorage.removeItem('muazpedia:flashcards:v1')
                  localStorage.removeItem('muazpedia:progress:v1')
                } catch {
                  // ignore
                }
                setRatings({})
              }
            }}
          >
            <RotateCcw /> Reset review
          </Button>
        )}
      </div>

      {/* flashcards */}
      <div className="mt-6 space-y-10">
        {groups.map(({ lesson, cards }) => {
          const cardsForFilter = cards.filter((c) => {
            const r = ratings[c.id]?.rating
            if (filter === 'all') return true
            if (filter === 'known') return r === 'known'
            return r !== 'known'
          })
          if (cardsForFilter.length === 0) return null
          return (
            <section key={lesson.slug} aria-label={`${lesson.title} flashcards`}>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold">{lesson.title}</h2>
                <Link
                  to={`/lesson/${lesson.slug}`}
                  className="text-primary inline-flex items-center gap-1 text-xs font-medium hover:underline"
                >
                  open lesson <ArrowRight className="size-3" />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cardsForFilter.map((card) => (
                  <Flashcard
                    key={card.id}
                    cardId={card.id}
                    front={card.front}
                    back={card.back}
                    rating={ratings[card.id]}
                    onRated={setRatings}
                    compact
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* practice */}
      <section className="mt-14" aria-labelledby="practice-heading">
        <h2 id="practice-heading" className="mb-3 text-xl font-semibold tracking-tight">
          Practice questions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {groups.map(({ lesson }) => (
            <Card key={lesson.slug} className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-sm font-medium">{lesson.title}</p>
                <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
                  {lesson.quizCount} questions · instant feedback
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to={`/lesson/${lesson.slug}`}>Take quiz</Link>
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}