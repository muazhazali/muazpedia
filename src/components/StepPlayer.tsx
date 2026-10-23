import { useCallback, type KeyboardEvent, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Formula } from '@/components/Formula'
import { cn } from '@/lib/utils'

export interface StepPlayerProps {
  /** zero-based index of the active step */
  stepIndex: number
  stepCount: number
  title: string
  formulaTex?: string
  description: ReactNode
  onPrev: () => void
  onNext: () => void
  onReplay: () => void
  children: ReactNode
}

/**
 * Reusable step controller for guided explanations.
 * Renders a "STEP n OF m" header, the visualization slot, an explanation
 * panel with the live formula, and Prev / Replay / Next controls.
 * Arrow keys work anywhere inside the card (except inside inputs).
 */
export function StepPlayer({
  stepIndex,
  stepCount,
  title,
  formulaTex,
  description,
  onPrev,
  onNext,
  onReplay,
  children,
}: StepPlayerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowRight' && stepIndex < stepCount - 1) {
        e.preventDefault()
        onNext()
      } else if (e.key === 'ArrowLeft' && stepIndex > 0) {
        e.preventDefault()
        onPrev()
      }
    },
    [stepIndex, stepCount, onNext, onPrev],
  )

  return (
    <div className="p-4 sm:p-5" onKeyDown={handleKeyDown}>
      {/* step header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-primary font-mono text-[11px] font-medium tracking-widest uppercase">
          Step {stepIndex + 1} of {stepCount} · {title}
        </p>
        <div className="text-muted-foreground hidden text-[11px] sm:block">
          ← → keys to navigate
        </div>
      </div>

      {children}

      {/* explanation + controls */}
      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div aria-live="polite" className="space-y-2">
          {formulaTex && <Formula tex={formulaTex} />}
          {description}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrev}
            disabled={stepIndex === 0}
            aria-label="Previous step"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onReplay}
            aria-label="Replay from step 1"
            title="Replay from step 1"
          >
            <RotateCcw />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            disabled={stepIndex === stepCount - 1}
            aria-label="Next step"
          >
            <ChevronRight />
          </Button>
          <div className="ml-1 flex items-center gap-1" aria-hidden="true">
            {Array.from({ length: stepCount }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === stepIndex ? 'bg-primary w-5' : 'bg-muted-foreground/30 w-1.5',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}