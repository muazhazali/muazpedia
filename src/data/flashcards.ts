export interface LessonFlashcard {
  id: string
  front: string
  back: string
}

export const ATTENTION_FLASHCARDS: LessonFlashcard[] = [
  {
    id: 'fc-attention-formula',
    front: 'Write the attention formula from memory.',
    back: 'Attention(Q, K, V) = softmax(Q Kᵀ / √d_k) · V',
  },
  {
    id: 'fc-attention-qkv',
    front: 'What do Q, K and V each represent?',
    back: 'Q — what am I looking for? K — what matches my query? V — what information is retrieved and combined.',
  },
  {
    id: 'fc-attention-causal',
    front: 'Why does decoder-only attention use a causal mask?',
    back: 'So a token cannot peek at future tokens. During generation, the next token does not exist yet — attending to it would leak answers.',
  },
]