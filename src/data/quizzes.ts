export interface QuizQuestion {
  q: string
  options: string[]
  answerIndex: number
  explanation: string
}

export const ATTENTION_QUIZ: QuizQuestion[] = [
  {
    q: 'In attention, what does the Query (Q) represent?',
    options: [
      'What information the current token is looking for in the other tokens.',
      'The position of the token in the sequence.',
      'The final prediction the model will output.',
      'The vocabulary size of the tokenizer.',
    ],
    answerIndex: 0,
    explanation:
      'Q encodes the "question" a token asks. Each key answers how relevant that token is, and the value carries the information that gets mixed in.',
  },
  {
    q: 'Why are the raw Query×Key scores divided by √d_k before softmax?',
    options: [
      'To make the numbers integers so they are easier to store.',
      'To keep scores from growing with dimension, which would saturate softmax.',
      'To make attention attend only to future tokens.',
      'To normalize the value vectors to unit length.',
    ],
    answerIndex: 1,
    explanation:
      'Dot products grow with dimension. Dividing by √d_k keeps the variance stable, so softmax produces sharp-but-broken-down weights instead of near one-hot outputs.',
  },
  {
    q: 'With causal masking (decoder-only attention), which keys can the token "cat" attend to?',
    options: [
      'All three tokens: The, cat, sleeps.',
      'Only itself.',
      'The and cat.',
      'cat and sleeps.',
    ],
    answerIndex: 2,
    explanation:
      'The causal mask forbids looking at tokens that come after the query (index j > i). "cat" is at position 1, so it sees position 0 ("The") and itself, but not "sleeps".',
  },
]