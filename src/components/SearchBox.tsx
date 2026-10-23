import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, BookOpen } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TOPICS, CONCEPTS, type Concept } from '@/data/lessons'

interface SearchResultRow {
  kind: 'category' | 'concept'
  label: string
  topicId: string
  lessonSlug?: string
}

function searchConcepts(query: string): Concept[] {
  const q = query.toLowerCase()
  return CONCEPTS.filter((c) => c.title.toLowerCase().includes(q))
}

function searchTopics(query: string) {
  const q = query.toLowerCase()
  return TOPICS.filter((t) => t.name.toLowerCase().includes(q))
}

export function SearchBox() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const rows: SearchResultRow[] = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const out: SearchResultRow[] = []
    searchConcepts(q).forEach((c) =>
      out.push({ kind: 'concept', label: c.title, topicId: c.category, lessonSlug: c.lesson?.slug }),
    )
    searchTopics(q).forEach((t) => out.push({ kind: 'category', label: t.name, topicId: t.id }))
    return out.slice(0, 8)
  }, [query])

  const open = query.trim().length > 0

  return (
    <div className="relative max-w-xl">
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search topics and concepts…"
        aria-label="Search topics and concepts"
        className="bg-card pl-9"
      />
      {query && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute top-1/2 right-2 -translate-y-1/2"
          onClick={() => setQuery('')}
          aria-label="Clear search"
        >
          <X />
        </Button>
      )}
      {open && (
        <div
          role="listbox"
          aria-label="Search results"
          className="border-border bg-popover absolute top-11 right-0 left-0 z-20 max-h-72 overflow-y-auto rounded-xl border p-2 shadow-md"
        >
          {rows.length === 0 ? (
            <p className="text-muted-foreground px-2 py-2 text-sm">
              No concept or topic matches the query yet.
            </p>
          ) : (
            <ul className="divide-border divide-y">
              {rows.map((row) => (
                <li key={`${row.kind}-${row.label}`}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-2 py-2.5 text-left text-sm transition-colors hover:bg-accent focus-visible:outline-none"
                    onClick={() => {
                      setQuery('')
                      navigate(
                        row.kind === 'concept' && row.lessonSlug
                          ? `/lesson/${row.lessonSlug}`
                          : `/topic/${row.topicId}`,
                      )
                    }}
                  >
                    <span>{row.label}</span>
                    {row.kind === 'concept' &&
                      (row.lessonSlug ? (
                        <BookOpen className="text-primary size-4 shrink-0" />
                      ) : (
                        <Badge variant="muted">Coming soon</Badge>
                      ))}
                    {row.kind === 'category' && <Badge variant="outline">Topic</Badge>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}