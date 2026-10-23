export interface QuizResult {
  correct: number
  total: number
  at: number
}

export interface LessonProgress {
  visitedAt?: number
  completed?: boolean
  quiz?: QuizResult
}

export type ProgressMap = Record<string, LessonProgress>

const PROGRESS_KEY = 'muazpedia:progress:v1'
const CARD_KEY = 'muazpedia:flashcards:v1'

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage unavailable (private mode) — progress is simply not persisted
  }
}

export const PROGRESS_EVENT = 'muazpedia:progress'

function emitProgressChange() {
  try {
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT))
  } catch {
    // ignore
  }
}

export function loadProgress(): ProgressMap {
  return readJSON<ProgressMap>(PROGRESS_KEY, {})
}

function updateLesson(lessonId: string, patch: (p: LessonProgress) => LessonProgress): ProgressMap {
  const map = loadProgress()
  const current = map[lessonId] ?? {}
  const next = patch(current)
  map[lessonId] = next
  writeJSON(PROGRESS_KEY, map)
  emitProgressChange()
  return map
}

export function recordVisit(lessonId: string): ProgressMap {
  return updateLesson(lessonId, (p) => ({ ...p, visitedAt: Date.now() }))
}

export function recordQuizResult(lessonId: string, correct: number, total: number): ProgressMap {
  return updateLesson(lessonId, (p) => ({
    ...p,
    quiz: { correct, total, at: Date.now() },
    completed: p.completed || correct >= Math.ceil(total * 0.7),
  }))
}

export function markCompleted(lessonId: string): ProgressMap {
  return updateLesson(lessonId, (p) => ({ ...p, completed: true }))
}

export interface FlashcardRating {
  rating: 'again' | 'known'
  at: number
  streak: number
}

export type CardRatings = Record<string, FlashcardRating>

export function loadCardRatings(): CardRatings {
  return readJSON<CardRatings>(CARD_KEY, {})
}

export function rateCard(cardId: string, rating: 'again' | 'known'): CardRatings {
  const cards = loadCardRatings()
  const prev = cards[cardId]
  const streak = rating === 'known' ? (prev?.streak ?? 0) + 1 : 0
  cards[cardId] = { rating, at: Date.now(), streak }
  writeJSON(CARD_KEY, cards)
  return cards
}