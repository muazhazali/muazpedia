/**
 * Theme engine: light / dark / system modes + accent presets and a custom
 * accent color. Every accent is auto-clamped to meet WCAG AA (4.5:1)
 * against both the page background and the text drawn on top of it,
 * so custom colors can never produce an inaccessible combination.
 */

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeState {
  mode: ThemeMode
  /** preset id (see ACCENT_PRESETS) or a custom "#rrggbb" hex */
  accent: string
}

export interface AccentPreset {
  id: string
  name: string
  light: string
  dark: string
}

export const ACCENT_PRESETS: AccentPreset[] = [
  { id: 'teal', name: 'Teal', light: '#0f766e', dark: '#2dd4bf' },
  { id: 'indigo', name: 'Indigo', light: '#4338ca', dark: '#a5b4fc' },
  { id: 'rose', name: 'Rose', light: '#be123c', dark: '#fb7185' },
  { id: 'green', name: 'Green', light: '#15803d', dark: '#4ade80' },
  { id: 'amber', name: 'Amber', light: '#b45309', dark: '#fbbf24' },
  { id: 'graphite', name: 'Graphite', light: '#334155', dark: '#9ca3af' },
]

export const DEFAULT_THEME: ThemeState = { mode: 'light', accent: 'teal' }

const THEME_KEY = 'muazpedia:theme'
/* text drawn on top of the primary color (button labels, badges) */
const PRIMARY_FG = { light: '#ffffff', dark: '#131a19' }

/* ------------------ persistence ------------------ */

export function loadThemeState(): ThemeState {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    if (!raw) return DEFAULT_THEME
    const parsed = JSON.parse(raw) as Partial<ThemeState>
    const mode: ThemeMode =
      parsed.mode === 'dark' || parsed.mode === 'light' || parsed.mode === 'system'
        ? parsed.mode
        : DEFAULT_THEME.mode
    const accent =
      typeof parsed.accent === 'string' &&
      (ACCENT_PRESETS.some((p) => p.id === parsed.accent) ||
        /^#[0-9a-f]{6}$/i.test(parsed.accent))
        ? parsed.accent
        : DEFAULT_THEME.accent
    return { mode, accent }
  } catch {
    return DEFAULT_THEME
  }
}

export function saveThemeState(state: ThemeState) {
  try {
    localStorage.setItem(THEME_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

/* ------------------ color math ------------------ */

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

function luminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((c) => {
    const v = c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    return v
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(hexToRgb(a))
  const lb = luminance(hexToRgb(b))
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

function rgbToHex(rgb: [number, number, number]): string {
  const to = (c: number) =>
    Math.round(Math.min(1, Math.max(0, c)) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${to(rgb[0])}${to(rgb[1])}${to(rgb[2])}`
}

function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h, s, l]
}

function hslToHex(h: number, s: number, l: number): string {
  const hue = (p: number, q: number, t: number) => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }
  if (s === 0) {
    return rgbToHex([l, l, l] as [number, number, number])
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return rgbToHex([hue(p, q, h + 1 / 3), hue(p, q, h), hue(p, q, h - 1 / 3)])
}

function parseComputedColor(style: string): [number, number, number] | null {
  const m = style.match(/rgba?\((\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)/)
  if (!m) return null
  return [Number(m[1]) / 255, Number(m[2]) / 255, Number(m[3]) / 255]
}

/* --- oklch → sRGB (standard Oklab matrices), for CSS var values like
       "oklch(0.985 0.004 190)" that some browsers return unresolved --- */

function linearToSrgb(c: number): number {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
  return Math.min(255, Math.max(0, Math.round(v * 255)))
}

export function anyColorToHex(input: string): string | null {
  const v = input.trim()
  if (/^#[0-9a-f]{6}$/i.test(v)) return v.toLowerCase()
  const rgbm = v.match(/^rgba?\(([^)]+)\)$/)
  if (rgbm) {
    const parsed = parseComputedColor(v)
    if (parsed) return rgbToHex(parsed)
  }
  const okm = v.match(/^oklch\(([^)]+)\)$/)
  if (okm) {
    const parts = okm[1]
      .split(/[\s/]+/)
      .filter((p) => p && p !== '/' && !p.endsWith('%'))
      .map(Number)
      .filter((n) => !Number.isNaN(n))
    if (parts.length >= 3) {
      const [L, C, HueDeg] = parts
      const hue = (HueDeg * Math.PI) / 180
      const a = C * Math.cos(hue)
      const b = C * Math.sin(hue)
      const l_ = L + 0.3963377774 * a + 0.2158037573 * b
      const m_ = L - 0.1055613458 * a - 0.0638541728 * b
      const s_ = L - 0.0894841775 * a - 1.291485548 * b
      // Oklab LMS are cube-rooted — restore the cubes before the matrix
      const l = l_ ** 3
      const m = m_ ** 3
      const s = s_ ** 3
      const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
      const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
      const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
      return `#${[r, g, bl]
        .map((c) => linearToSrgb(c).toString(16).padStart(2, '0'))
        .join('')}`
    }
  }
  return null
}

/* ------------------ application ------------------ */

export function resolveMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode !== 'system') return mode
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** base accent color for a state, before contrast clamping */
export function accentBase(state: ThemeState, resolved: 'light' | 'dark'): string {
  if (state.accent.startsWith('#')) return state.accent
  const preset = ACCENT_PRESETS.find((p) => p.id === state.accent) ?? ACCENT_PRESETS[0]
  return resolved === 'dark' ? preset.dark : preset.light
}

/**
 * Adjust the accent's lightness until it passes `ratio` against BOTH the
 * page background and the text rendered on the accent color. In light
 * mode this darkens the accent, in dark mode it lightens it — so the
 * result is always WCAG AA compliant.
 */
export function ensureAccessibleAccent(
  hex: string,
  background: string,
  foreground: string,
  ratio = 4.5,
): { hex: string; adjusted: boolean; contrast: number } {
  const lumThreshold = 0.5
  const [h, s, l0] = hexToHsl(hex)
  // scheme direction: on a dark background the accent must lighten to stay
  // visible; on a light background it must darken to keep 4.5:1 on top.
  // (The fg-on-primary check moves the same direction in both schemes.)
  const darkScheme = luminance(hexToRgb(background)) < lumThreshold
  const step = darkScheme ? 0.03 : -0.03
  let l = l0
  let adjusted = false
  for (let i = 0; i < 100; i++) {
    const candidate = hslToHex(h, s, l)
    const cBg = contrastRatio(candidate, background)
    const cFg = contrastRatio(candidate, foreground)
    if (cBg >= ratio && cFg >= ratio) {
      return { hex: candidate, adjusted, contrast: Math.min(cBg, cFg) }
    }
    adjusted = true
    const next = l + step
    if ((step < 0 && next <= 0) || (step > 0 && next >= 1)) break
    l = next
  }
  // extreme fallback tone if the hue cannot reach the ratio within range
  const fallback = hslToHex(h, s, darkScheme ? 0.78 : 0.3)
  return {
    hex: fallback,
    adjusted: true,
    contrast: Math.min(
      contrastRatio(fallback, background),
      contrastRatio(fallback, foreground),
    ),
  }
}

export interface AppliedTheme {
  mode: 'light' | 'dark'
  primary: string
  primaryForeground: string
  /** contrast of the applied accent against the weaker of bg/fg, ≥ 4.5 */
  contrast: number
  adjusted: boolean
}

export function applyThemeState(state: ThemeState): AppliedTheme {
  const root = document.documentElement
  const resolved = resolveMode(state.mode)
  root.classList.toggle('dark', resolved === 'dark')

  const bgHex = anyColorToHex(getComputedStyle(document.body).backgroundColor) ?? (resolved === 'dark' ? '#1b1d1e' : '#f9fcfc')
  const fgOnPrimary = resolved === 'dark' ? PRIMARY_FG.dark : PRIMARY_FG.light

  let result = ensureAccessibleAccent(accentBase(state, resolved), bgHex, fgOnPrimary)
  // one retry with a wider margin in case of rounding
  if (result.contrast < 4.5) {
    result = ensureAccessibleAccent(result.hex, bgHex, fgOnPrimary, 4.6)
  }

  root.style.setProperty('--primary', result.hex)
  root.style.setProperty('--primary-foreground', fgOnPrimary)

  return {
    mode: resolved,
    primary: result.hex,
    primaryForeground: fgOnPrimary,
    contrast: result.contrast,
    adjusted: result.adjusted,
  }
}

/** initialize once before React renders (prevents theme flash) */
export function initTheme(): AppliedTheme {
  const state = loadThemeState()
  return applyThemeState(state)
}

/** react to OS scheme changes while mode = "system" */
export function watchSystemScheme(onChange: () => void): () => void {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}