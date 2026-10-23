# Muazpedia

An interactive visual learning library for machine learning, statistics, mathematics and LLM internals — short notes, animated diagrams, hands-on experiments and quick self-tests.

Built on one principle:

**One concept → One visual explanation → One interactive experiment → One quick test.**

Every lesson follows the same loop: overview → interactive visualization → guided steps → experiment → check yourself → summary + flashcards. Progress, quiz results and flashcard ratings are stored locally in your browser (no account, no backend, no tracking).

## Current lessons

- **LLM Internals · Attention Mechanism (Q, K, V)** — a 3-token demo with live dot products, √d_k scaling, causal-masked softmax, weighted values, a step-by-step player, and fully editable Q/K/V vectors.

More concepts (gradient descent, distributions, quantization…) are planned — lesson cards appear as "Coming soon" until built.

## Tech stack

- [Vite](https://vite.dev) + React + TypeScript
- Tailwind CSS v4 + shadcn/ui-style components
- [Motion](https://motion.dev/docs/react) for animation
- KaTeX for formulas · MDX for lesson content
- IBM Plex Sans + JetBrains Mono (tabular figures everywhere)
- WCAG-AA-checked theming: light/dark/system modes, accent presets and a fully custom accent that is auto-clamped to keep 4.5:1 contrast
- localStorage for progress (theme, quiz scores, flashcard ratings)

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # typecheck + production build to dist/
pnpm preview    # serve the production build
```

## Adding a new lesson

1. Create a visualizer in `src/visualizations/` (typed props, live-computed numbers — the diagram and the math must always agree).
2. Write the lesson content in `src/content/<category>/<slug>.mdx`, reusing the shared `<Formula />`, `<Quiz />` and `<Flashcard />` components.
3. Register metadata (title, category, flashcards) in `src/data/lessons.ts`.

The layout, navigation, search, quiz and review pages pick everything up automatically.