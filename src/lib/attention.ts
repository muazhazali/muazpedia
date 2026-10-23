/**
 * Correct, dependency-free attention math used by the Attention demo.
 * All numeric values shown in the UI come from these functions.
 */

export function dot(a: number[], b: number[]): number {
  let sum = 0
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i]
  return sum
}

export function scaleScores(scores: number[], keyDim: number): number[] {
  const s = Math.sqrt(keyDim)
  return scores.map((v) => v / s)
}

/**
 * Numerically stable softmax over a score array.
 * `mask[j] === true` means key j is NOT allowed: it gets probability 0
 * (it is treated as -inf before normalization).
 */
export function softmax(scores: number[], mask: boolean[]): number[] {
  const negInf = Number.NEGATIVE_INFINITY
  const x = scores.map((v, j) => (mask[j] ? negInf : v))
  const max = Math.max(...x.filter((v) => v !== negInf))
  const exps = x.map((v) => (v === negInf ? 0 : Math.exp(v - max)))
  const total = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => (total === 0 ? 0 : e / total))
}

export interface AttentionRow {
  /** dot(q_i, k_j) for every key j */
  raw: number[]
  /** raw scaled by 1/sqrt(d_k) */
  scaled: number[]
  /** causal mask: true when key j is after the query token */
  masked: boolean[]
  /** softmax weights over the allowed keys */
  weights: number[]
  /** weighted combination of value vectors */
  output: number[]
}

export function computeAttentionRow(
  q: number[],
  keys: number[][],
  values: number[][],
  queryIndex: number,
): AttentionRow {
  const raw = keys.map((k) => dot(q, k))
  const scaled = scaleScores(raw, keys[0].length)
  const masked = keys.map((_, j) => j > queryIndex)
  const weights = softmax(scaled, masked)
  const dim = values[0].length
  const output = new Array<number>(dim).fill(0)
  keys.forEach((_, j) => {
    values[j].forEach((v, d) => {
      output[d] += weights[j] * v
    })
  })
  return { raw, scaled, masked, weights, output }
}

export function formatVec(v: number[], digits = 2): string {
  return `[${v.map((n) => n.toFixed(digits)).join(', ')}]`
}

export function breakdown(q: number[], k: number[]): string {
  return q.map((qv, i) => `${qv.toFixed(1)}·${k[i].toFixed(1)}`).join(' + ')
}