import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface ConceptCardProps {
  title: string
  href?: string | null
  completed?: boolean
  started?: boolean
  difficulty?: string
  showDifficulty?: boolean
}

/** Row-style card for a concept. Available concepts link to their lesson. */
export function ConceptCard({ title, href, completed, started, difficulty, showDifficulty }: ConceptCardProps) {
  const available = Boolean(href)
  const body = (
    <div className="group flex items-center justify-between gap-3 px-4 py-3.5">
      <div className="flex items-center gap-3">
        {completed ? (
          <CheckCircle2 className="text-success size-4 shrink-0" />
        ) : started ? (
          <Clock className="text-primary size-4 shrink-0" />
        ) : (
          <span
            className={cn(
              'bg-accent text-accent-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
              !available && 'bg-muted text-muted-foreground/60',
            )}
          >
            {title.charAt(0)}
          </span>
        )}
        <div className="min-w-0">
          <p className={cn('text-sm font-medium', !available && 'text-muted-foreground')}>{title}</p>
          {showDifficulty && difficulty && (
            <p className="text-muted-foreground text-xs">{difficulty}</p>
          )}
        </div>
      </div>
      {available ? (
        <ArrowRight className="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-colors" />
      ) : (
        <Badge variant="muted">Coming soon</Badge>
      )}
    </div>
  )

  const classes = cn(
    'bg-card border-border rounded-lg border transition-colors',
    available && 'hover:border-primary/40 hover:shadow-xs cursor-pointer',
    !available && 'opacity-75',
  )

  if (available && href) {
    return (
      <Link to={href} className={classes} aria-label={`Open lesson: ${title}`}>
        {body}
      </Link>
    )
  }
  return <div className={classes} aria-label={`${title} (coming soon)`}>{body}</div>
}