import { useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Formula } from '@/components/Formula'
import { StepPlayer } from '@/components/StepPlayer'
import {
  DEFAULT_VECTORS,
  TOKENS,
  type DemoVectors,
} from '@/data/attention-demo'
import {
  breakdown,
  computeAttentionRow,
  formatVec,
  type AttentionRow,
} from '@/lib/attention'
import { clamp, cn, round2 } from '@/lib/utils'

/* ---------------- geometry ---------------- */

const BOX_W = 112
const BOX_H = 44
const TOKEN_Y = 20
const TOKEN_X = [24, 168, 312]
const CENTERS = TOKEN_X.map((x) => x + BOX_W / 2)
const ARC_Y = TOKEN_Y + BOX_H
const SVG_W = 448
const SVG_H = 186

const STEP_TITLES = ['Query × Key', 'Scale by √d_k', 'Mask & softmax', 'Weighted values']

const STEP_FORMULAS = [
  's_{ij} = q_i \\cdot k_j',
  '\\tilde{s}_{ij} = \\dfrac{s_{ij}}{\\sqrt{d_k}}',
  'w_{ij} = \\text{softmax}(\\tilde{s}_{ij})',
  'o_i = \\sum_j w_{ij}\\, v_j',
]

/* ---------------- small pieces ---------------- */

function MiniBars({ vec, height = 40 }: { vec: number[]; height?: number }) {
  const maxAbs = Math.max(1e-6, ...vec.map((x) => Math.abs(x)))
  return (
    <div className="flex h-full items-end gap-1" style={{ height }}>
      {vec.map((x, i) => (
        <div
          key={i}
          title={`d${i + 1} = ${x.toFixed(2)}`}
          className={cn(
            'w-2.5 min-h-0.5 rounded-[3px]',
            x >= 0 ? 'bg-primary/75' : 'bg-rose-400',
          )}
          style={{ height: `${Math.max(6, (Math.abs(x) / maxAbs) * 100)}%` }}
        />
      ))}
    </div>
  )
}

function TokenBox({
  index,
  isQuery,
  isMasked,
  onSelect,
  reducedMotion,
}: {
  index: number
  isQuery: boolean
  isMasked: boolean
  onSelect: () => void
  reducedMotion: boolean
}) {
  const token = TOKENS[index]
  return (
    <g
      role="button"
      tabIndex={0}
      aria-pressed={isQuery}
      aria-label={`Use "${token}" as the query token`}
      className="cursor-pointer outline-none focus-visible:[outline:none]"
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
    >
      <motion.rect
        x={TOKEN_X[index]}
        y={TOKEN_Y}
        width={BOX_W}
        height={BOX_H}
        rx={10}
        strokeWidth={isQuery ? 2 : 1.25}
        initial={{ scale: 1 }}
        animate={{
          fill: isQuery ? 'var(--color-accent)' : 'var(--color-card)',
          stroke: isQuery ? 'var(--color-primary)' : 'var(--color-border)',
        }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.25 }}
      />
      <text
        x={CENTERS[index]}
        y={TOKEN_Y + BOX_H / 2 - 1}
        textAnchor="middle"
        dominantBaseline="middle"
        className={cn('font-mono text-[13px] font-semibold', isMasked ? 'fill-muted-foreground' : 'fill-foreground')}
      >
        {token}
      </text>
      <text
        x={TOKEN_X[index] + BOX_W - 11}
        y={TOKEN_Y + 11}
        className={cn('font-mono text-[9px]', isQuery ? 'fill-primary' : 'fill-muted-foreground/60')}
      >
        {isQuery ? 'Q' : 'K/V'}
      </text>
      {isQuery && (
        <motion.line
          x1={TOKEN_X[index]}
          x2={TOKEN_X[index] + BOX_W}
          y1={TOKEN_Y + BOX_H - 1}
          y2={TOKEN_Y + BOX_H - 1}
          className="stroke-primary"
          strokeWidth={2.5}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.3 }}
        />
      )}
    </g>
  )
}

function AttentionArc({
  queryIndex,
  keyIndex,
  weight,
  masked,
  stepIndex,
  label,
}: {
  queryIndex: number
  keyIndex: number
  weight: number
  masked: boolean
  stepIndex: number
  label: string
}) {
  const reduced = useReducedMotion()
  const x1 = CENTERS[queryIndex]
  const x2 = CENTERS[keyIndex]
  const dx = Math.abs(x2 - x1)
  const bulge = Math.min(88, 26 + dx * 0.22)
  const cx1 = (x1 + x2) / 2
  const apex = ARC_Y + bulge
  const path = `M ${x1} ${ARC_Y} Q ${cx1} ${apex} ${x2} ${ARC_Y}`
  const isActive = !masked
  const thick = stepIndex >= 2 && isActive ? 1.5 + weight * 5.5 : 1.5
  const dash = masked ? '3 4' : undefined
  const strokeClass = masked ? 'stroke-muted-foreground/50' : 'stroke-primary'
  const labelFill = masked ? 'fill-muted-foreground' : 'fill-accent-foreground'

  return (
    <>
      <motion.path
        d={path}
        fill="none"
        strokeWidth={thick}
        strokeLinecap="round"
        markerEnd={masked ? 'url(#arrow-muted)' : 'url(#arrow-teal)'}
        className={strokeClass} strokeDasharray={dash}
        initial={{ pathLength: 0.6, opacity: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
      />
      <motion.text
        x={cx1}
        y={apex / 2 + ARC_Y / 2 + 16}
        textAnchor="middle"
        className={cn('font-mono text-[10px] tabular-nums select-none', labelFill)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 0.3, delay: 0.15 }}
      >
        {label}
      </motion.text>
    </>
  )
}

/* ---------------- vector editor ---------------- */

function NumCell({ value, name, onChange }: { value: number; name: string; onChange: (n: number) => void }) {
  return (
    <input
      type="number"
      name={name}
      aria-label={name}
      min={-2}
      max={2}
      step={0.5}
      value={round2(value)}
      onChange={(e) => {
        const n = parseFloat(e.target.value)
        if (!Number.isNaN(n)) onChange(clamp(round2(n), -2, 2))
      }}
      className="h-7 w-12 rounded-md border border-input bg-background text-center font-mono text-xs tabular-nums shadow-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    />
  )
}

function VectorRow({
  name,
  label,
  vec,
  onChange,
}: {
  name: string
  label: string
  vec: number[]
  onChange: (next: number[]) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-6 w-5 pt-0.5 text-center font-mono text-xs font-semibold text-primary">{label}</span>
      <div className="flex gap-1">
        {vec.map((x, i) => (
          <NumCell
            key={i}
            name={`${name}-${label.toLowerCase()}-d${i + 1}`}
            value={x}
            onChange={(n) => {
              const copy = [...vec]
              copy[i] = n
              onChange(copy)
            }}
          />
        ))}
      </div>
    </div>
  )
}

function VectorEditor({
  vectors,
  onUpdate,
  onReset,
}: {
  vectors: DemoVectors
  onUpdate: (matrix: 'q' | 'k' | 'v', row: number, next: number[]) => void
  onReset: () => void
}) {
  return (
    <div className="border-border/80 bg-muted/40 rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium">Edit the example vectors</p>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw /> Reset vectors
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {TOKENS.map((token, i) => (
          <div key={token} className="bg-card rounded-lg border p-3">
            <p className="mb-2 font-mono text-xs font-semibold">{token}</p>
            <div className="space-y-1.5">
              <VectorRow name={token} label="Q" vec={vectors.q[i]} onChange={(n) => onUpdate('q', i, n)} />
              <VectorRow name={token} label="K" vec={vectors.k[i]} onChange={(n) => onUpdate('k', i, n)} />
              <VectorRow name={token} label="V" vec={vectors.v[i]} onChange={(n) => onUpdate('v', i, n)} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground mt-3 text-xs">
        Every score, weight and output on this page is recomputed live from these values — change a
        number and see what happens.
      </p>
    </div>
  )
}

/* ---------------- main visualizer ---------------- */

export function AttentionVisualizer() {
  const [vectors, setVectors] = useState<DemoVectors>(DEFAULT_VECTORS)
  const [queryIndex, setQueryIndex] = useState(2)
  const [stepIndex, setStepIndex] = useState(0)
  const [editorOpen, setEditorOpen] = useState(false)
  const [replayKey, setReplayKey] = useState(0)

  const row: AttentionRow = useMemo(
    () => computeAttentionRow(vectors.q[queryIndex], vectors.k, vectors.v, queryIndex),
    [vectors, queryIndex],
  )

  const qName = TOKENS[queryIndex]
  const firstAllowed = row.masked.findIndex((m) => !m)
  const breakdownLine =
    firstAllowed >= 0
      ? breakdown(vectors.q[queryIndex], vectors.k[firstAllowed])
      : breakdown(vectors.q[queryIndex], vectors.k[queryIndex])

  const descriptions: ReactNode[] = [
    // Step 1 — raw scores
    <div key="d0" className="space-y-2 text-sm">
      <p>
        The query of <strong>{qName}</strong> is compared with <em>every</em> key using a dot
        product; larger numbers mean higher relevance.
      </p>
      <p className="bg-muted rounded-md px-3 py-2 font-mono text-xs tabular-nums">
        q({qName})·k({TOKENS[Math.max(0, firstAllowed)]}) ={' '}
        <span className="block">{breakdownLine}</span>
        <span className="font-semibold">
          = {row.raw[Math.max(0, firstAllowed)].toFixed(2)}
        </span>
      </p>
      <p className="text-muted-foreground text-xs">
        Keys after the query are masked — a decoder may not peek at the future.
      </p>
    </div>,
    // Step 2 — scale
    <div key="d1" className="space-y-2 text-sm">
      <p>
        Raw scores are divided by <Formula tex="\sqrt{d_k}" /> ={' '}
        <Formula tex="\sqrt{4} = 2" /> so that softmax stays stable even in very large
        models.
      </p>
      <p className="bg-muted rounded-md px-3 py-2 font-mono text-xs tabular-nums">
        {row.scaled
          .map((s, j) => (row.masked[j] ? `${TOKENS[j]}: masked` : `${TOKENS[j]}: ${s.toFixed(2)}`))
          .join('  ·  ')}
      </p>
    </div>,
    // Step 3 — softmax
    <div key="d2" className="space-y-2 text-sm">
      <p>
        <Formula tex="\text{softmax}" /> turns scores into <strong>weights</strong> that are
        positive and sum to 1. Masked keys get exactly 0 weight.
      </p>
      <p className="bg-muted rounded-md px-3 py-2 font-mono text-xs tabular-nums">
        {row.weights.map((w, j) => `${TOKENS[j]}: ${row.masked[j] ? '0.00' : w.toFixed(2)}`).join('  ·  ')}
      </p>
      <p className="text-muted-foreground text-xs">
        The arrow thickness now tracks each key's weight.
      </p>
    </div>,
    // Step 4 — output
    <div key="d3" className="space-y-2 text-sm">
      <p>
        Each key's <strong>value vector</strong> is multiplied by its weight and everything is
        summed. That mixture is the query token's new representation.
      </p>
      <p className="bg-muted rounded-md px-3 py-2 font-mono text-xs tabular-nums">
        out({qName}) <span className="block">{formatVec(row.output)}</span>
      </p>
    </div>,
  ]

  const arcLabel = (j: number): string => {
    if (row.masked[j]) return 'blocked'
    if (stepIndex === 0) return row.raw[j].toFixed(2)
    if (stepIndex === 1) return row.scaled[j].toFixed(2)
    if (stepIndex === 2) return row.weights[j].toFixed(2)
    return `${(row.weights[j]).toFixed(2)}·v`
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return
    if (e.key === 'ArrowRight' && stepIndex < 3) {
      e.preventDefault()
      setStepIndex(stepIndex + 1)
    } else if (e.key === 'ArrowLeft' && stepIndex > 0) {
      e.preventDefault()
      setStepIndex(stepIndex - 1)
    }
  }

  const updateMatrix = (matrix: 'q' | 'k' | 'v', rowIdx: number, next: number[]) => {
    setVectors((prev) => {
      const copy: DemoVectors = { ...prev, [matrix]: prev[matrix].map((r) => [...r]) }
      copy[matrix][rowIdx] = next
      return copy
    })
  }

  return (
    <Card className="overflow-hidden" onKeyDown={onKeyDown}>
      {/* top bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4">
        <Badge variant="accent">Interactive demo · three tokens, causal masking</Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditorOpen((v) => !v)}
          aria-expanded={editorOpen}
        >
          {editorOpen ? <X /> : <SlidersHorizontal />}
          {editorOpen ? 'Hide vectors' : 'Edit vectors'}
        </Button>
      </div>

      <StepPlayer
        stepIndex={stepIndex}
        stepCount={4}
        title={STEP_TITLES[stepIndex]}
        formulaTex={STEP_FORMULAS[stepIndex]}
        description={descriptions[stepIndex]}
        onPrev={() => setStepIndex((s) => Math.max(0, s - 1))}
        onNext={() => setStepIndex((s) => Math.min(3, s + 1))}
        onReplay={() => {
          setStepIndex(0)
          setReplayKey((k) => k + 1)
        }}
      >
        {/* diagram + numeric panel */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full max-w-[520px] shrink-0 lg:flex-1"
            role="img"
            aria-label={`Attention flow for query "${qName}": raw scores ${row.raw.map((r, j) => (row.masked[j] ? 'masked' : r.toFixed(2))).join(', ')}`}
          >
            <defs>
              <marker
                id="arrow-teal"
                markerWidth="7"
                markerHeight="7"
                refX="6"
                refY="3.5"
                orient="auto"
              >
                <path d="M0,0 L7,3.5 L0,7 Z" className="fill-primary" />
              </marker>
              <marker
                id="arrow-muted"
                markerWidth="7"
                markerHeight="7"
                refX="6"
                refY="3.5"
                orient="auto"
              >
                <path d="M0,0 L7,3.5 L0,7 Z" className="fill-muted-foreground/60" />
              </marker>
            </defs>

            {TOKENS.map((t, j) => (
              <TokenBox
                key={t}
                index={j}
                isQuery={j === queryIndex}
                isMasked={row.masked[j] && j !== queryIndex}
                onSelect={() => setQueryIndex(j)}
                reducedMotion={false}
              />
            ))}

            {/* arcs from query to each key */}
            <g key={`arcs-${replayKey}-${queryIndex}`}>
              {TOKENS.map((_, j) => (
                <AttentionArc
                  key={j}
                  queryIndex={queryIndex}
                  keyIndex={j}
                  weight={row.weights[j]}
                  masked={j > queryIndex}
                  stepIndex={stepIndex}
                  label={arcLabel(j)}
                />
              ))}
            </g>
          </svg>

          {/* numbers panel */}
          <div className="w-full space-y-2 lg:w-[248px] lg:shrink-0 lg:border-l lg:border-border lg:pl-5">
            <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
              Numbers · query = {qName}
            </p>
            <table className="w-full text-left font-mono text-[11px] tabular-nums">
              <thead>
                <tr className="text-muted-foreground border-border border-b">
                  <th className="py-1 pr-1 font-medium">key</th>
                  <th className={cn('py-1 px-1 font-medium', stepIndex === 0 && 'text-foreground')}>
                    q·k
                  </th>
                  <th className={cn('py-1 px-1 font-medium', stepIndex === 1 && 'text-foreground')}>
                    ÷√dk
                  </th>
                  <th className={cn('py-1 px-1 font-medium', stepIndex === 2 && 'text-foreground')}>
                    weight
                  </th>
                </tr>
              </thead>
              <tbody>
                {TOKENS.map((t, j) => (
                  <tr
                    key={t}
                    className={cn(
                      'border-border/60 border-b last:border-0',
                      row.masked[j] && j !== queryIndex && 'opacity-40',
                      j === queryIndex && 'font-semibold',
                    )}
                  >
                    <td className="py-1.5 pr-1">{t}</td>
                    <td
                      className={cn(
                        'px-1 py-1.5',
                        stepIndex === 0 && !row.masked[j] && 'bg-accent/50 rounded',
                      )}
                    >
                      {row.masked[j] && j !== queryIndex ? '—' : row.raw[j].toFixed(2)}
                    </td>
                    <td
                      className={cn(
                        'px-1 py-1.5',
                        stepIndex === 1 && !row.masked[j] && 'bg-accent/50 rounded',
                      )}
                    >
                      {row.masked[j] && j !== queryIndex ? '—' : row.scaled[j].toFixed(2)}
                    </td>
                    <td
                      className={cn(
                        'px-1 py-1.5',
                        stepIndex === 2 && !row.masked[j] && j !== queryIndex && 'bg-accent/50 rounded',
                      )}
                    >
                      {row.masked[j] && j !== queryIndex ? '0.00' : row.weights[j].toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <AnimatePresence mode="wait">
              {stepIndex === 3 && (
                <motion.div
                  key="value-flow"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-primary/30 bg-primary/5 rounded-lg border px-3 py-2.5"
                >
                  <p className="text-muted-foreground mb-2 text-[10px] font-medium tracking-wide uppercase">
                    Weighted values → output
                  </p>
                  <div className="flex flex-wrap items-end gap-2">
                    {TOKENS.map((t, j) =>
                      !row.masked[j] ? (
                        <div key={t} className="flex items-end">
                          <div className="flex flex-col items-center gap-1">
                            <span className="rounded bg-accent px-1.5 text-[10px] font-mono font-semibold tabular-nums">
                              {row.weights[j].toFixed(2)}
                            </span>
                            <MiniBars vec={vectors.v[j]} height={34} />
                            <span className="text-[10px] text-muted-foreground font-mono">{t}</span>
                          </div>
                          <span className="text-muted-foreground pb-4">
                            {j < TOKENS.length - 1 ? '·' : ''}
                          </span>
                        </div>
                      ) : null,
                    )}
                    <ArrowRight className="text-primary mb-5 size-4" />
                    <div className="flex flex-col items-center gap-1">
                      <MiniBars vec={row.output} height={34} />
                      <span className="font-mono text-[10px] tabular-nums">
                        {formatVec(row.output)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* editor */}
        <AnimatePresence initial={false}>
          {editorOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <VectorEditor
                  vectors={vectors}
                  onUpdate={updateMatrix}
                  onReset={() => setVectors(DEFAULT_VECTORS)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </StepPlayer>
    </Card>
  )
}