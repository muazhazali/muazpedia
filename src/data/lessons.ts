import topicsData from '@/data/topics.json'
import { ATTENTION_FLASHCARDS, type LessonFlashcard } from '@/data/flashcards'
import type { MdxContentComponent } from '@/types/mdx-components'
import AttentionLesson from '@/content/llm/attention.mdx'

/* ---------------- topics (categories) ---------------- */

export type IconName = 'brain' | 'sigma' | 'binary' | 'shapes'

export interface Topic {
  id: string
  name: string
  blurb: string
  icon: IconName
}

export const TOPICS: Topic[] = topicsData.categories as Topic[]

/* ---------------- concepts & lessons ---------------- */

export interface Concept {
  title: string
  category: string
  /** present when the concept has an implemented lesson */
  lesson?: Lesson
}

export interface Lesson {
  slug: string
  title: string
  subtitle: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  tags: string[]
  flashcards: LessonFlashcard[]
  quizCount: number
  component: MdxContentComponent
}

const ATTENTION: Lesson = {
  slug: 'attention',
  title: 'Attention Mechanism',
  subtitle: 'Understanding Q, K and V',
  category: 'llm-internals',
  difficulty: 'Beginner',
  tags: ['transformers', 'attention', 'decoder'],
  flashcards: ATTENTION_FLASHCARDS,
  quizCount: 3,
  component: AttentionLesson,
}

export const CONCEPTS: Concept[] = [
  { title: 'Linear Regression', category: 'machine-learning' },
  { title: 'Gradient Descent', category: 'machine-learning' },
  { title: 'Neural Networks', category: 'machine-learning' },

  { title: 'Probability Distributions', category: 'statistics' },
  { title: 'Hypothesis Testing', category: 'statistics' },
  { title: 'Confidence Intervals', category: 'statistics' },

  { title: 'Tokenization', category: 'llm-internals' },
  { title: 'Attention Mechanism', category: 'llm-internals', lesson: ATTENTION },
  { title: 'Sampling', category: 'llm-internals' },
  { title: 'Quantization', category: 'llm-internals' },

  { title: 'Limits & Derivatives', category: 'mathematics' },
  { title: 'Vectors & Matrices', category: 'mathematics' },
  { title: "Bayes' Theorem", category: 'mathematics' },
]

/* ---------------- helpers ---------------- */

export function conceptsForTopic(topicId: string): Concept[] {
  return CONCEPTS.filter((c) => c.category === topicId)
}

export function topicById(topicId: string | undefined): Topic | undefined {
  return TOPICS.find((t) => t.id === topicId)
}

export function allLessons(): Lesson[] {
  return CONCEPTS.map((c) => c.lesson).filter((l): l is Lesson => Boolean(l))
}

export function lessonBySlug(slug: string | undefined): Lesson | undefined {
  return allLessons().find((l) => l.slug === slug)
}

export function topicForLesson(lesson: Lesson): Topic | undefined {
  return topicById(lesson.category)
}

export function availableConceptCount(topicId: string): number {
  return conceptsForTopic(topicId).filter((c) => c.lesson).length
}

/** all flashcards across implemented lessons, for the Review page */
export function allFlashcards(): { lesson: Lesson; cards: LessonFlashcard[] }[] {
  return allLessons().map((lesson) => ({ lesson, cards: lesson.flashcards }))
}