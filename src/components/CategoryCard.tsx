import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { IconByName } from '@/components/icons'
import type { IconName } from '@/data/lessons'
import { cn } from '@/lib/utils'

export interface CategoryCardProps {
  id: string
  name: string
  blurb: string
  icon: IconName
  conceptCount: number
  hasLesson: boolean
}

export function CategoryCard({ id, name, blurb, icon, conceptCount, hasLesson }: CategoryCardProps) {
  return (
    <Link
      to={`/topic/${id}`}
      aria-label={`Explore topic: ${name}`}
      className="group block h-full"
    >
      <Card className={cn(
        'flex h-full flex-col gap-2 p-5 transition-all group-hover:border-primary/40 group-hover:shadow-sm',
        !hasLesson && 'group-hover:border-primary/30',
      )}>
        <div className="flex items-center justify-between">
          <span className="bg-accent text-accent-foreground group-hover:bg-primary/15 group-hover:text-primary flex size-9 items-center justify-center rounded-lg transition-colors">
            <IconByName name={icon} className="size-4.5" />
          </span>
          <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
            {conceptCount} {conceptCount === 1 ? 'concept' : 'concepts'}
          </span>
        </div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{blurb}</p>
      </Card>
    </Link>
  )
}