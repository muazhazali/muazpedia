import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ThumbsDown, ThumbsUp, Repeat2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { rateCard, type CardRatings, type FlashcardRating } from '@/lib/progress'
import { cn } from '@/lib/utils'

export interface FlashcardProps {
  cardId: string
  front: string
  back: string
  rating?: FlashcardRating
  onRated?: (ratings: CardRatings) => void
  compact?: boolean
}

/**
 * Active-recall flashcard. Click/tap or press Enter to flip.
 * After revealing, self-rate: "Again" or "Known" (stored locally).
 */
export function Flashcard({ cardId, front, back, rating, onRated, compact = false }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false)
  const reduced = useReducedMotion() ?? false

  const flip = () => setFlipped((f) => !f)

  const rate = (rating: 'again' | 'known') => {
    onRated?.(rateCard(cardId, rating))
    setFlipped(false)
  }

  return (
    <div className="[perspective:1200px]">
      <motion.div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label="Flashcard: press Enter to flip"
        onClick={flip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            flip()
          }
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: reduced ? 0 : 0.45, ease: [0.2, 0.7, 0.3, 1] }}
        className={cn(
          'border-border bg-card relative cursor-pointer rounded-xl border shadow-xs select-none',
          '[transform-style:preserve-3d]',
          compact ? 'h-44 p-4' : 'h-48 p-5 sm:p-6',
        )}
      >
        {/* front */}
        <div className="absolute inset-0 flex flex-col justify-between [backface-visibility:hidden]">
          <div>
            {rating && (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 font-mono text-[10px]',
                  rating.rating === 'known' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground',
                )}
              >
                {rating.rating === 'known' ? `known ×${rating.streak}` : 'to review'}
              </span>
            )}
          </div>
          <p className="text-foreground text-center text-sm leading-snug font-medium sm:text-[15px]">
            {front}
          </p>
          <p className="text-muted-foreground flex items-center justify-center gap-1 text-[11px]">
            <Repeat2 className="size-3" /> tap to reveal
          </p>
        </div>

        {/* back */}
        <div
          className="flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ position: 'absolute', inset: 0 }}
        >
          <p className="text-foreground/90 text-center text-sm">{back}</p>
          <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => rate('again')}
              tabIndex={flipped ? 0 : -1}
            >
              <ThumbsDown className="text-destructive" /> Again
            </Button>
            <Button size="sm" onClick={() => rate('known')} tabIndex={flipped ? 0 : -1}>
              <ThumbsUp /> Known
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}