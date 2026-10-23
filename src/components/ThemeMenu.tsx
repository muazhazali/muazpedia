import { useEffect, useRef, useState } from 'react'
import { Check, Palette, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ACCENT_PRESETS,
  anyColorToHex,
  applyThemeState,
  accentBase,
  contrastRatio,
  loadThemeState,
  resolveMode,
  saveThemeState,
  watchSystemScheme,
  type ThemeMode,
  type ThemeState,
} from '@/lib/theme'
import { cn } from '@/lib/utils'

const MODES: { id: ThemeMode; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'System' },
]

export function ThemeMenu() {
  const [state, setState] = useState<ThemeState>(loadThemeState)
  const [open, setOpen] = useState(false)
  const [customHex, setCustomHex] = useState(
    () => (state.accent.startsWith('#') ? state.accent : '#0ea5a0'),
  )
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const update = (next: ThemeState) => {
    saveThemeState(next)
    applyThemeState(next)
    setState(next)
  }

  // live-update when the OS scheme changes while mode = "system"
  useEffect(() => {
    if (state.mode !== 'system') return
    return watchSystemScheme(() => applyThemeState(loadThemeState()))
  }, [state.mode])

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const resolved = resolveMode(state.mode)
  // display the applied (clamped) primary for the contrast readout
  const applied = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary')
    .trim() || accentBase(state, resolved)
  // background is the other side of every contrast check
  const bgHex =
    anyColorToHex(getComputedStyle(document.body).backgroundColor) ??
    (resolved === 'dark' ? '#1b1d1e' : '#f9fcfc')
  const ratio = contrastRatio(applied, bgHex)
  const aaPass = ratio >= 4.5

  return (
    <div ref={rootRef} className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Customize theme"
      >
        <Palette />
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="Theme settings"
          className="border-border bg-popover absolute top-11 right-0 z-50 w-64 rounded-xl border p-3 shadow-md"
        >
          <p className="text-muted-foreground mb-1.5 text-[11px] font-medium tracking-wide uppercase">
            Mode
          </p>
          <div className="grid grid-cols-3 gap-1" role="group" aria-label="Color mode">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={state.mode === m.id}
                onClick={() => update({ ...state, mode: m.id })}
                className={cn(
                  'rounded-md px-2 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  state.mode === m.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                {m.label}
              </button>
            ))}
          </div>

          <p className="text-muted-foreground mt-3 mb-1.5 text-[11px] font-medium tracking-wide uppercase">
            Accent
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Accent presets">
            {ACCENT_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                title={p.name}
                aria-label={`Accent: ${p.name}`}
                aria-pressed={state.accent === p.id}
                onClick={() => update({ ...state, accent: p.id })}
                className={cn(
                  'flex size-7 items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover',
                  state.accent === p.id
                    ? 'ring-2 ring-ring ring-offset-2 ring-offset-popover'
                    : 'hover:scale-105',
                )}
                style={{ backgroundColor: accentBase({ mode: resolved, accent: p.id }, resolved) }}
              >
                {state.accent === p.id && <Check className="size-3.5 text-white" />}
              </button>
            ))}
          </div>

          <div className="border-border/70 mt-3 flex items-center justify-between gap-2 border-t pt-3">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
              Custom
              <input
                type="color"
                name="accent-color"
                value={customHex}
                aria-label="Custom accent color"
                onChange={(e) => {
                  const hex = e.target.value
                  setCustomHex(hex)
                  update({ ...state, accent: hex })
                }}
                className="border-input size-6 cursor-pointer overflow-hidden rounded-md border p-0.5"
              />
            </label>
            <span
              className={cn(
                'font-mono text-[11px] tabular-nums',
                aaPass ? 'text-success' : 'text-destructive',
              )}
              title="Contrast of the accent against the page background (WCAG AA requires 4.5:1)"
            >
              {ratio.toFixed(1)}:1 · {aaPass ? 'AA ✓' : 'AA ✗'}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full justify-start"
            onClick={() => {
              setCustomHex('#0ea5a0')
              update({ mode: 'light', accent: 'teal' })
            }}
          >
            <RotateCcw /> Reset to default
          </Button>
        </div>
      )}
    </div>
  )
}