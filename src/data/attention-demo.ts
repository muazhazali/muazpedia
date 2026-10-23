export const TOKENS = ['The', 'cat', 'sleeps'] as const

export type Vec = number[]

export interface DemoVectors {
  /** one query vector per token */
  q: Vec[]
  /** one key vector per token */
  k: Vec[]
  /** one value vector per token */
  v: Vec[]
}

/**
 * Hand-picked embeddings for the 3-token demo ("The cat sleeps").
 * Small decimals so a beginner can trace every dot product by hand.
 * d_k = d_v = 4, so sqrt(d_k) = 2.
 */
export const DEFAULT_VECTORS: DemoVectors = {
  q: [
    [1.0, 0.5, -0.5, 1.0],
    [0.5, 1.0, 1.0, 0.0],
    [1.0, 1.0, 0.5, -0.5],
  ],
  k: [
    [1.0, 0.0, 1.0, 0.5],
    [0.5, 1.0, 0.0, 1.0],
    [1.0, 0.5, 1.0, -1.0],
  ],
  v: [
    [1.0, 0.0, 0.5, 1.0],
    [0.0, 1.0, 1.0, 0.5],
    [-0.5, 0.5, 1.0, 1.0],
  ],
}

export const DEMO_TOKEN_DIM = 4