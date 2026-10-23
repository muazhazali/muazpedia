import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CheckCircle2, ChevronRight, RotateCcw, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { recordQuizResult } from '@/lib/progress'
import { cn } from '@/lib/utils'
import type { QuizQuestion } from '@/data/quizzes'

export interface QuizProps {
  /** lesson id used to persist the quiz result */
  lessonId: string
  questions: QuizQuestion[]
  title?: string
}

/**
 * Active-recall quiz: one question at a time, immediate feedback
 * with an explanation, and a short results summary with retry.
 */
export function Quiz({ lessonId, questions, title = 'Check yourself' }: QuizProps) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const reduced = useReducedMotion() ?? false

  const question = questions[index]
  const answered = selected !== null
  const isCorrect = answered && selected === question.answerIndex

  const advance = () => {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1)
      setSelected(null)
    } else {
      setFinished(true)
      recordQuizResult(lessonId, correctCount, questions.length)
    }
  }

  const retry = () => {
    setIndex(0)
    setSelected(null)
    setCorrectCount(0)
    setFinished(false)
  }

  if (finished) {
    const passed = correctCount >= Math.ceil(questions.length * 0.7)
    return (
      <Card className="p-6 text-center">
        <p className="text-foreground/80 text-sm">Your score</p>
        <p className="text-primary mt-1 font-mono text-3xl font-semibold tabular-nums">
          {correctCount}/{questions.length}
        </p>
        <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">
          {passed
            ? 'Solid recall — revisit the flashcards in a few days to keep it fresh.'
            : 'Close to it. Re-read the summary above and try again — repetition is the point.'}
        </p>
        {passed ? (
          <Badge variant="accent" className="mt-3">
            Lesson completed ✓
          </Badge>
        ) : null}
        <Button variant="outline" size="sm" onClick={retry} className="mt-4">
          <RotateCcw /> Try again
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-primary font-mono text-[11px] font-medium tracking-widest uppercase">
          {title}
        </p>
        <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
          {index + 1}/{questions.length}
        </span>
      </div>
      <Progress value={((index + (answered ? 1 : 0)) / questions.length) * 100} className="mb-5 h-1" />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <p className="text-foreground text-base font-medium">{question.q}</p>
          <ul className="mt-4 space-y-2">
            {question.options.map((option, i) => {
              const chosen = selected === i
              const showAsCorrect = answered && i === question.answerIndex
              const showAsWrong = answered && chosen && i !== question.answerIndex
              return (
                <li key={i}>
                  <button
                    type="button"
                    disabled={answered}
                    onClick={() => {
                      setSelected(i)
                      if (i === question.answerIndex) setCorrectCount((c) => c + 1)
                    }}
                    className={cn(
                      'border bg-background flex w-full items-start gap-3 rounded-lg p-3 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                      !answered && 'hover:bg-accent hover:border-primary/40 cursor-pointer',
                      showAsCorrect && 'border-success/60 bg-success/10 text-foreground',
                      showAsWrong &&
                        'border-destructive/50 bg-destructive/5 text-destructive line-through',
                      answered && !showAsCorrect && !showAsWrong && 'text-muted-foreground',
                    )}
                  >
                    <span className="mt-0.5 font-mono text-xs opacity-60">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    <span className="flex-1">{option}</span>
                    {showAsCorrect && <CheckCircle2 className="text-success size-4 shrink-0 mt-0.5" />}
                    {showAsWrong && <XCircle className="text-destructive size-4 shrink-0 mt-0.5" />}
                  </button>
                </li>
              )
            })}
          </ul>

          {answered && (
            <div role="status" className="mt-4">
              <p
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm',
                  isCorrect
                    ? 'border-success/40 bg-success/5 text-foreground/90'
                    : 'border-destructive/40 bg-destructive/5 text-foreground/90',
                )}
              >
                <strong>{isCorrect ? 'Correct. ' : 'Not quite. '}</strong>
                {question.explanation}
              </p>
              <Button size="sm" onClick={advance} className="mt-3">
                {index + 1 < questions.length ? 'Next question' : 'See results'}
                <ChevronRight />
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  )
}