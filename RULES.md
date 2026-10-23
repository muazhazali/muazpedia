# RULE.md — Interactive Learning Website

> **Status:** Project rules — confirmed scope (2026-10-23).  
> **Audience:** AI coding agents, the site owner, and anyone reviewing or extending lessons.  
> **Applies to:** All pages, subjects, lessons, visualizations, animations, quizzes, flashcards, and generated code.  
> **Purpose:** Make complicated ideas clear through accurate explanations, meaningful visuals, learner-controlled experiments, and active recall.

**Read and follow this file before implementing or modifying any lesson.** It is a quality contract, not a list of effects to demonstrate.

---

## 0. Confirmed product decisions

These decisions are **settled** unless the owner explicitly changes them:

| Dimension | Decision | Implementation consequence |
| --- | --- | --- |
| Primary audience | Owner first; site publicly accessible | Personal learning workflow, but explanations must make sense to a new visitor without private context |
| Subject scope | **Any subject**, including non-technical topics | No math-only layouts, terminology, animations, or mandatory simulations |
| Lesson creation | Owner asks an AI coding agent to **manually build each lesson** | Hand-authored, reviewed MDX/React lessons; **no automatic note/PDF-to-lesson pipeline** |
| Visualization priority | Step-by-step animations **and** live simulations, chosen by concept | Use the representation that teaches best; no universal one-size-fits-all visualization |
| Difficulty | Simple explanations first; optional advanced depth | Beginner view by default; progressively disclose equations, derivations, evidence, and nuance |
| Study tools | **Quizzes and flashcards** | Include meaningful comprehension checks and concise Q/A cards in each lesson |
| Devices | Desktop and mobile **equally important** | Design both intentionally, with touch and keyboard parity; never treat mobile as a squeezed desktop |
| Style | Clear, concise, academically trustworthy | Accuracy and comprehension take precedence over visual novelty |

### Proposed technical baseline (reversible, not a product requirement)

- **Vite + React + TypeScript** for the application.
- **Tailwind CSS + shadcn/ui** for consistent layout and controls.
- **Motion for React** as the default JavaScript animation library.
- **GSAP** selectively for complex choreography that would be harder to maintain with Motion.
- **SVG** for annotated diagrams; **Recharts** for conventional graphs; **D3** for custom data/mathematical visuals; **React Flow** only where node manipulation is meaningful.
- **KaTeX** for formulas in math-related lessons; not required for other subjects.
- **MDX + React components** for individually authored lessons.
- **Local version-controlled content**; optional `localStorage` for browser-only quiz/flashcard progress. No backend, login, AI API, or upload feature required for MVP.

When a technical decision is unknown, choose the smallest reversible solution. **Do not build additional features just because they are feasible.**

## 1. Non-negotiable hierarchy

When requirements conflict, prioritize in this order:

1. **Factual/academic correctness** — the content, calculations, claims, citations, and depictions must be defensible.
2. **Learning effectiveness** — a beginner can understand the central idea and test understanding.
3. **Relevance** — every visual and interaction serves a specific learning objective.
4. **Accessibility** — essential information and interactions work across abilities, inputs, and devices.
5. **Visual hierarchy** — the page draws attention to one important idea at a time.
6. **Consistency** — predictable lesson structure, typography, notation, and controls.
7. **Maintainability and performance** — small reusable components and deterministic behavior.
8. **Polish** — attractive visuals only after everything above passes.

**Never sacrifice accuracy or comprehension to make an animation look impressive.** A good static annotated image is better than a misleading animated diagram.

## 2. Learning and writing standards

Write for an **interested layperson**, even when the material is advanced.

- Start with **what it is**, **why it matters**, and **one concrete example**.
- Teach **one mental step at a time**. Explain cause and effect before introducing abstraction.
- Define unfamiliar terms when first used; do not assume background knowledge or rely on the owner's earlier lessons.
- Use short, direct sentences. Prefer precise everyday language to unnecessary jargon.
- Use an analogy **only when it clarifies**; explicitly note where the analogy stops working.
- Distinguish what a phenomenon **is** from one **example** of it.
- Layer depth: `Simple` (default) → `More detail` → `Advanced / Formal / Evidence` as appropriate.
- Do not hide essential definitions, caveats, or limitations behind an advanced toggle.
- Avoid filler intros, repetitive summaries, inspirational copy, emojis as substitute labels, and unnecessarily long walls of text.
- State when knowledge is unsettled, context-dependent, disputed, model-specific, or approximate.
- For non-technical subjects, avoid fake scientific precision or pseudo-mathematical demonstrations.

### Explain formulas and notation progressively

When equations are relevant:

1. Describe the idea without symbols.
2. Explain each symbol, dimension, and unit before manipulating it.
3. Show **one** operation or transformation at a time, with an immediately visible example.
4. Connect every formula term to the corresponding element of the visual.
5. Offer a complete worked example and a collapsible formal derivation if useful.
6. State assumptions, edge cases, and the limits of the toy example.

A non-technical lesson must not gain a formula section just to fit the template.

## 3. Mandatory lesson experience

Every substantive lesson should deliver these learning outcomes, though nearby sections may be combined and the layout may adapt to subject matter.

1. **Orientation** — clear title, subject, difficulty, optional prerequisite, and one sentence: “After this lesson, you can …”.
2. **Plain-language explanation** — typically 2–4 short sentences describing the core intuition.
3. **Core representation** — an interactive visualization, staged diagram, comparison, meaningful illustration, map, timeline, text annotation, or clear static figure, whichever is most effective.
4. **Guided understanding** — a step-through explanation **or** another structured walkthrough; keep a steady link between words and visuals.
5. **Explore / Try it** — interactive controls only if changing them teaches something. For non-interactive concepts, use worked examples, counterexamples, comparisons, or evidence inspection instead.
6. **Deeper understanding** — optional definitions, formal details, competing interpretations, original sources, and limitations.
7. **Quick quiz** — normally 2–3 checks with explanations for correct and incorrect answers.
8. **Flashcards** — normally 2–5 high-quality recall cards for key ideas; avoid repeating trivial facts.
9. **Recap and sources** — at most 3–5 takeaways, with references or further reading appropriate to the claims.

Do **not** force a slider, simulation, mathematical formula, or animation into every lesson. **Quizzes and flashcards are part of the learning product**, not an excuse to add superficial content. For very short reference pages, a single check and card can be sufficient if explicitly justified.

### Default page reading order

`Title / goal → brief intuition → primary visual or example → controls / guided steps → observed result → explanation → deeper detail → quiz → flashcards → recap / sources`

Use a visible but unobtrusive table of contents for long pages. The learner should not have to scroll past lengthy theory to discover the main demonstration.

## 4. Choosing the right visualization

**First write this sentence:** “This visual will help a beginner understand **[concept]** by showing **[relationship/change/comparison]**.”

If this sentence cannot be completed specifically, do not implement that visual.

| Learning need | Prefer | Notes |
| --- | --- | --- |
| Sequence, process, algorithm, lifecycle | Staged diagram / step controller | Highlight one transition at a time |
| Cause and effect / parameter sensitivity | Live simulation with meaningful controls | Recalculate outputs; display numerical or qualitative consequence |
| Mathematical function / probability | Labeled axes, plot, worked values | State scale, units, assumptions, uncertainty as applicable |
| Network / system architecture | Annotated diagram or node-edge map | React Flow only if moving/selecting nodes teaches something |
| Comparison / misconception | Matched side-by-side examples | Use consistent scales and conditions |
| Historical events / chronology | Timeline with dated events and source notes | Separate documented facts from interpretation |
| Geography / spatial relationships | Map with scale, legend, and grounded locations | Explain geographic limitations and uncertainty |
| Biology / physical structures | Annotated illustration or staged mechanism | Preserve essential scientific relationships; mark not-to-scale drawings |
| Language / grammar / literature | Highlighted text, sentence transformations, annotated examples | Preserve contextual meaning; use examples/counterexamples |
| Philosophy / arguments / ethics | Argument map, claim–evidence graph, perspective comparison | Do not depict a contested interpretation as indisputable fact |
| Business / economics / society | Timeline, Sankey, process map, comparison, data chart | Separate descriptive data from proposed causal mechanisms |
| Definition / small factual distinction | Short text, table, example | **No animation required** |

### Mandatory visualization safeguards

- Use **direct labels** first; add legends only when direct labeling is impractical.
- Communicate relationships with **position, geometry, shape, arrows, text, and scale**, not color alone.
- Keep a stable visual vocabulary within a lesson and across related lessons. A color has one meaning in a view.
- Every shape, arrow, highlighted region, axis, or animated object must have an interpretable purpose.
- Show **before → operation/change → after**, or **input → mechanism → output**, where applicable.
- Distinguish **illustrative/toy/synthetic data** from **observed/real data** prominently in the visual caption.
- Charts need meaningful titles, axis labels, units, valid scales, and appropriate uncertainty/context.
- Do not truncate a bar chart's value axis without a conspicuous, defensible reason. Avoid misleading comparisons.
- Do not imply correlation proves causation; do not portray conceptual networks as established physical mechanisms.
- Use time-correct maps, borders, terminology, and historical context where applicable.
- Add short captions explaining the **takeaway**, not just repeating the figure title.
- Provide an accessible text or table alternative that conveys the key learning message.
- Don't add stock photos, unrelated illustrations, 3D, particles, or decorative diagrams just to fill space.

## 5. Visual hierarchy and UI design system

### Hierarchy

1. **One primary teaching object per view** (diagram, plot, example, or comparison).
2. One primary action (for example **Next step**, **Run**, or **Check answer**) at a time.
3. Secondary actions such as **Previous**, **Reset**, **Replay**, and **Show solution** remain discoverable but visually quieter.
4. Closely related controls and outcomes belong near their respective visual elements.
5. Advanced explanations sit below or behind clearly labeled disclosure, never floating over the core visual.

### Layout and readability

- Optimize long-form prose for roughly **65–80 characters per line**; give diagrams additional width when useful.
- Maintain a consistent spacing scale, restrained color palette, clear type hierarchy, and descriptive section labels.
- Use semantic page structure and heading levels (`h1`, `h2`, `h3`) without skipped hierarchy.
- Prefer neutral backgrounds, one primary accent, and selective semantic colors for correctness/warnings.
- Avoid gradients, glassmorphism, shadow stacks, giant hero sections, and ornamental scroll effects in the lesson area.
- Keep formulas readable; allow intentional horizontal scroll when necessary, with proper hints and alternatives.
- Labels should remain visible during interaction; do not require hover to understand controls.
- Prevent layout jumps during animated steps by reserving space or using stable containers.
- Use helpful empty/loading/error states; never leave an unexplained blank visualization.

### Desktop **and** mobile are first-class

- Design layouts for at least **~360 px mobile**, **~768 px tablet**, and **~1280 px desktop** reference widths; test intermediate sizes, not just these points.
- On mobile: arrange `explanation → visualization → controls → result` in a sensible single-column flow; use tabs only when necessary and do not hide key output behind a second tab.
- On desktop: place explanation, visual, controls, and results side by side **only if** this improves eye tracking; never cram them together.
- Use touch-friendly targets (prefer approximately **44 × 44 CSS px** when space allows), adequate spacing, and input controls that don't depend on precision dragging.
- Provide tap and keyboard alternatives for hover, drag, scrub, or pan interactions.
- Never shrink charts, formulas, or node labels until they become unreadable; instead adapt composition, reveal details, or offer zoom/pan where genuinely necessary.
- No essential feature may be desktop-only or mobile-only.

## 6. Animation standards: teach, don't decorate

Every animation must answer at least one question: **What changed? Why? What depends on it? What happens next?**

- Prefer **explicit learner control** over autoplay. For stage-based lessons use **Next / Previous / Reset / Replay**; include **Pause** for longer continuous motion.
- Simulations may update live while changing a slider; the state must remain understandable when paused.
- Show the starting state and the resulting state. Use motion to reveal the transformation, not obscure it.
- Preserve visual continuity: elements that represent the same thing should keep position/color/identity when practical.
- Typical UI transitions: **~150–400 ms**; use longer educational transitions only when learners need time to observe a mechanism.
- Numeric answers, highlighted formula terms, arrows, and plots must refer to the **same computed state**.
- Never use animated DOM positions as the underlying source of mathematical or factual truth.
- Avoid unnecessary looping, parallax, scroll-jacking, letter-by-letter reveals, uncontrolled camera motion, and constant pulsing.
- Allow learners to re-run an experiment without duplicated timelines, stale output, or inconsistent initial state.
- When animation adds no meaningful information, render a static diagram with clear annotations.

### Animation library selection: Motion vs. GSAP

| Use case | Preferred choice |
| --- | --- |
| Hover/focus/press feedback and basic transitions | CSS |
| React state changes, step transitions, component layouts, SVG highlighting/paths | **Motion for React** |
| Simple learner-controlled experiments with React state | **Motion** for presentation + pure functions for computation |
| Precisely synchronized multi-object choreography / complex SVG or canvas sequences | **GSAP** if significantly simpler and more reliable |
| Scroll-linked animation | Only if pedagogically necessary; **GSAP ScrollTrigger** or Motion as appropriate |

Rules:

- Default to `motion` and imports from `motion/react` in React components. Prefer current official APIs rather than old `framer-motion` examples unless that package is deliberately installed.
- GSAP is **not** forbidden, but every GSAP visual must have a concrete justification in the component documentation or lesson spec.
- With GSAP in React, follow official `@gsap/react` `useGSAP()` or scoped `gsap.context()` patterns and reliably revert animations, listeners, and triggers on cleanup.
- **Never let GSAP and Motion update the same element/property at the same time.** Define one animation owner per animated component.
- React/component state owns the learning model; Motion/GSAP only display transitions between correct states.
- Use the installed library versions and verify official API syntax before writing or modifying code.
- Do not introduce a dependency just for a trivial effect CSS can implement.

### Reduced motion

- Respect `prefers-reduced-motion` and provide equivalent static or low-motion representations.
- Motion can use `MotionConfig` and `useReducedMotion`; apply equivalent logic for GSAP.
- Reduced motion must **not** remove essential instructional information, step controls, or quiz feedback.
- Avoid flashing, uncontrolled motion, and essential audio-only explanations.

Official docs: https://motion.dev/docs/react and https://gsap.com/resources/React/.

## 7. Scholarly accuracy — applies to **all** subjects

A trustworthy lesson distinguishes **established facts, formal definitions, interpretations, simplified models, hypotheses, and examples**.

### Evidence rules

- Verify meaningful claims against **appropriate authoritative sources** before writing visuals or learning questions.
- Prefer primary research, textbooks, scholarly references, official technical documentation, archival material, primary historical documents, or reputable institutional publications as suited to the subject.
- For rapidly changing topics, check source **date** and state when a claim was true.
- For contested subjects, accurately present material perspectives and their supporting evidence **without false equivalence** or unearned certainty.
- Do not fabricate citations, quotations, dates, datasets, numerical results, experiment outcomes, or sources.
- Distinguish a source's direct claim from **your interpretation** of it.
- Use concise source references (title, author/organization, date if relevant, URL) close to major claims or in a clear Sources section.
- Use only appropriately licensed visual assets; credit images/data/quotes where licenses or academic practice require it. Prefer self-authored diagrams rather than copying protected figures.
- Never imply an interactive demonstration proves more than it actually demonstrates.

### Quantitative rules (where applicable)

- Keep computational methods in **pure, typed, testable functions** separate from the rendering layer.
- Compute plots, result labels, tables, positions, and visual highlighting from a **shared source of truth**.
- Validate dimensions, units, mathematical domains, parameter constraints, and edge cases.
- Use numerically stable algorithms; distinguish exact from rounded numbers and test with greater precision than displayed.
- Show assumptions and relevant uncertainty, error margins, estimation limits, and sample-size context.
- Clearly distinguish simulated demonstrations, hypothetical values, and measured empirical data.
- A plotted or animated result must change **correctly** when the input changes, not merely look plausible.

### Domain guardrails

- **Math:** notation and intermediate operations must be valid; state assumptions and counterexamples.
- **Statistics:** separate population vs sample, association vs causation, uncertainty vs certainty; never define a p-value as the probability the null is true.
- **ML/LLMs:** distinguish training vs inference, architectural simplification vs real implementation, and attention scores vs normalized weights. For decoder-only masked attention, show causal masking if relevant.
- **Natural science:** annotate not-to-scale illustrations; distinguish models, observations, and hypotheses; do not animate an invented physical process as fact.
- **History:** distinguish the established chronology from disputed accounts and modern interpretations; use dated, attributable evidence.
- **Humanities and language:** preserve context, ambiguity, and meaning; do not imply one interpretation is uniquely correct where evidence supports alternatives.
- **Social science/economics:** identify timeframe, population, uncertainty, causal limitations, and normative assumptions.
- **Health/legal/financial examples:** contextualize as educational rather than individualized advice; avoid definitive claims outside supported evidence.

If claims or calculations cannot be verified, **stop short of presenting them as established fact**. Mark the material for review or state the limitation plainly.

## 8. Interaction rules

- Controls are present **only** when the learner can observe an educational consequence.
- Input change → valid model update → synchronized visual/numerical update → understandable explanation.
- Start with a useful worked example, not an empty canvas that demands configuration.
- Label each input with a plain-language name; explain units, min/max, current value, and consequence.
- Provide reasonable bounds and useful defaults; handle missing and invalid values gracefully.
- Offer **Reset to example** when learners can change parameters; optionally use seeded random examples for reproducibility.
- Explain edge cases (e.g., no solution, division by zero, nonapplicable operation, unsupported combination).
- Offer alternative buttons/text entry for tasks normally done by dragging or fine-motor gestures.
- Keep focus, labels, and results stable when state changes; avoid focus traps and surprise scrolling.
- If a learner changes parameters mid-animation, cancel or reconcile the animation before showing new output.
- For exploratory visuals, include short contextual statements such as “Try increasing X” and “Notice that Y changes because …”.

## 9. Quiz rules — comprehension, not trivia

Quizzes are a **required study feature**, normally 2–3 high-quality checks per lesson.

- Questions must match the stated learning objective and what the lesson actually taught.
- Include at least one **reasoning, application, interpretation, or misconception** question when appropriate; do not rely solely on word-for-word definition recall.
- Use single-choice, multiple-choice, short answer, or numeric answer **only as suitable to the concept**.
- Write unambiguous prompts. Avoid trick wording, “all of the above,” and arbitrary distracting details.
- Make distractors plausible and based on common misconceptions—not absurd options.
- After submission, explain **why** the selected answer is right/wrong. When useful, point the learner back to the relevant visualization.
- For numeric questions, validate sensible tolerances, units, and rounding; avoid exact-string traps.
- Support keyboard, touch, retry, and an explicit **Show explanation** action when needed.
- Do not reveal the correct answer through styling before submission.
- Track correctness locally only if useful; do not require an account.
- Never present unsupported, contested, or oversimplified claims as uniquely correct without appropriate qualifiers.

## 10. Flashcard rules — concise active recall

Flashcards are a **required study feature**, normally 2–5 per lesson, covering the most important recall targets.

- Use a simple **Front (question) / Back (answer)** format.
- **One concept per card.** Prefer direct questions over vague prompts such as “Explain everything about …”.
- Keep the answer short: ordinarily **one or two sentences**, or 2–3 small bullets if necessary.
- Add an **example only when it materially clarifies a difficult concept**; do not add filler examples to every card.
- Include contrast cards, small interpretation questions, and misconception checks as useful—not only vocabulary definitions.
- Each card must be accurate on its own without relying on an animation that cannot be seen during review.
- Avoid duplicate or near-duplicate cards and trivial facts unlikely to aid retention.
- Use simple flip interaction accessible by button/keyboard/tap, not flip-on-hover.
- Allow **Next**, **Previous**, **Shuffle**, and **Restart** if multiple cards are shown; provide clear card counts.
- If progress is saved, explain it is stored locally in that browser and may not synchronize across devices.
- Do not claim spaced repetition is implemented unless scheduling logic actually exists.
- Exports (Anki/TSV) are **optional future enhancements**, not part of the baseline.

### Flashcard writing example

**Front:** Why is softmax used in attention?  
**Back:** It converts attention scores into nonnegative weights that sum to 1.

Only add an example when the explanation would otherwise remain unclear.

## 11. Accessibility requirements

Target **WCAG 2.2 AA**, not merely “looks accessible.”

- Use semantic markup, descriptive headings, meaningful labels, correct button/input roles, and visible keyboard focus.
- Ensure essential operations work without mouse hover, dragging, or touch-only gestures.
- Use contrast appropriate for text, control states, and non-text graphical information.
- Never encode correctness, categories, progress, or importance using color alone.
- Provide titles/descriptions for SVGs and equivalent textual or tabular descriptions of important plots.
- For visual sequences, provide readable step descriptions and screen-reader feedback without excessive announcements.
- Test at browser zoom 200% and 400% where appropriate; avoid clipping essential content.
- Protect against motion sensitivity and flashing; implement reduced-motion variants.
- Keep quiz/flashcard controls available at all screen sizes.
- Avoid auto-playing sound; provide captions/transcripts if meaningful video or audio is later introduced.

Accessibility is a **launch gate**, not an optional cleanup item. Reference: https://www.w3.org/TR/WCAG22/.

## 12. Architecture and AI-agent implementation rules

The site is **manually authored, lesson by lesson with AI assistance**. The AI agent must not assume a user-facing lesson generator, upload/OCR pipeline, or content management system exists.

Recommended structure:

```text
src/
  app/                       # routes, layout, navigation
  components/
    learning/                # LessonLayout, StepPlayer, Quiz, Flashcards
    ui/                      # shared design-system components
  content/
    subjects/<subject>/      # one lesson .mdx per topic
  visualizations/
    <topic>/                 # typed visualization + styles + tests
  lib/
    math/                    # pure numerical models (if needed)
    content/                 # lesson metadata / discovery
    study/                   # quiz/flashcard local persistence
  data/                      # small version-controlled example datasets
```

Engineering principles:

- A lesson is a **self-contained, reviewable change**: MDX/content, necessary visual component, quiz data, flashcards, sources, and tests.
- Define reusable lesson primitives, not one giant generic visualization engine.
- Use typed props and accessible HTML/SVG, keeping visual rendering separate from factual/computational logic.
- Avoid hardcoded demo outputs that differ from the underlying data model.
- Use a single source of truth for React state; Motion or GSAP animates the presentation only.
- Scope SVG IDs; clean up observers, timers, event handlers, GSAP contexts, and animation resources.
- Prefer dynamic import/code splitting for heavy visualizations so an unrelated lesson stays lightweight.
- Avoid adding React Flow, D3, GSAP, maps, or 3D libraries unless the lesson actually needs them.
- Use the existing stack/design tokens/components before inventing new ones.
- Keep critical content accessible without JavaScript-driven motion; handle failed visual loads gracefully.
- Test with independently calculated examples and clear acceptance cases; do not rely on screenshots alone.
- Public website: never hardcode private information, secrets, API keys, proprietary data, or unpublished personal notes in client bundles or public repositories.

### Suggested per-lesson metadata

```yaml
---
title: "Attention Mechanism"
slug: "attention-mechanism"
subject: "LLMs"
level: "Beginner"
objective: "Explain how queries, keys, and values produce an attention output."
prerequisites: []
lastReviewed: "2026-10-23"
---
```

This is an example, not an enforced schema. Avoid fields you don't use. Dates must reflect actual review, not an automatic claim of validation.

## 13. Mandatory workflow for adding a lesson

**Before writing code, the AI agent must produce a compact Visual Lesson Spec:**

```text
Title / subject:
Target learner + prerequisites:
Learning objective (observable skill):
Plain-language explanation (2–4 sentences):
Primary misconception / confusing point:
Claim/equation/interpretation that needs verification:
Sources and source dates where relevant:
Best representation and why (including option for static/no animation):
Step-through vs live simulation vs both — reason:
Inputs/controls and precisely what they change:
Worked example / data provenance / expected result:
Optional advanced layer:
Quiz targets and answer explanations:
Flashcard targets:
Mobile layout and accessible alternative:
Test cases and known limitations:
```

Then implement in this exact order:

1. **Research and validate:** check facts, definitions, dates, sources, and applicable assumptions.
2. **Design the lesson:** objective, short explanations, one clear visual purpose, and misconception.
3. **Implement a correct static version:** diagram or worked example should already explain something without movement.
4. **Build and test logic (if any):** pure functions; independently verified sample output.
5. **Add meaningful interaction:** controls with observable, consistent outcomes.
6. **Add purposeful animation:** choose Motion, GSAP, or CSS by need, not fashion.
7. **Add optional depth, quiz, flashcards, and sources:** ensure all agree with the main lesson.
8. **QA on desktop and mobile:** actual touch, keyboard, zoom, reduced motion, light/dark, and reset/replay.
9. **Review academically:** verify captions, edge cases, labels, limitations, citations, correct quiz answers.

**Do not** generate an entire catalogue of shallow lessons in one pass. Deliver **one finished, accurate lesson** at a time or a small user-requested batch.

## 14. Definition of done — must pass before calling a lesson complete

### Accuracy and understanding

- [ ] The learning objective states something the learner can explain or do.
- [ ] A first-time public visitor can follow the simple explanation without private context.
- [ ] Claims, examples, dates, terminology, and numerical results were checked using appropriate references.
- [ ] Every important simplification, assumption, uncertainty, and contested interpretation is labeled.
- [ ] No fabricated citations, datasets, quotations, mathematical calculations, or illustrative outcomes.

### Visualization and interaction

- [ ] The visual teaches a specific relationship; a static alternative was considered.
- [ ] One primary visual focal point and clear text/diagram/control hierarchy exist.
- [ ] Every marker, axis, arrow, symbol, color, scale, and control is intelligible.
- [ ] Interactive controls cause real, correct changes in outcomes; Reset works.
- [ ] If staged, Next/Previous/Replay work repeatedly and preserve state consistency.
- [ ] Animations do not hide results, cause layout shifts, or diverge from computations.
- [ ] Motion and GSAP never compete to modify the same property.

### Study outcomes

- [ ] Simple view is genuinely beginner-friendly; advanced view adds rather than replaces essential context.
- [ ] Quiz questions match the lesson; answers and explanations are correct and unambiguous.
- [ ] Flashcards are short, standalone, non-duplicative, and suitable for active recall.
- [ ] The recap states the central takeaway in a few lines.

### UX, accessibility, and engineering

- [ ] Mobile (~360 px) and desktop (~1280 px) are usable and thoughtfully laid out.
- [ ] Works with keyboard and touch; no essential hover-only or drag-only actions.
- [ ] Reduced-motion mode and accessible figure alternatives preserve meaning.
- [ ] Text, chart labels, and formulas remain readable when zoomed.
- [ ] No visible errors, console issues, leaked animation contexts, or broken state after interaction.
- [ ] Components reuse design patterns and have relevant automated tests.
- [ ] No private/unlicensed data or material is accidentally published.

If a criterion cannot pass, **fix it or document the precise gap**; do not represent the lesson as finished.

## 15. Common anti-patterns (avoid)

- One universal animation template for unrelated disciplines.
- A flashy visual chosen before the learning objective is established.
- Five animated diagrams fighting for the learner's attention.
- Fake interactivity where only a label or color changes while the mechanism stays unrelated.
- Scientific-looking numbers with no provenance, units, assumptions, or verification.
- Treating disputed interpretations as facts or toy experiments as empirical results.
- Turning an elementary explanation into jargon, or oversimplifying until it becomes false.
- Forced equations, sliders, or simulations in history, humanities, or other unsuitable lessons.
- Auto-progressing an essential explanation without pause, reverse, or reset.
- Long decorative transitions that delay the actual learning.
- Generating 20 weak quiz questions instead of 2–3 thoughtful ones.
- Flashcards that require a screenshot/animation to understand or give away the answer.
- Shrinking the desktop visualization to 320 px without designing a mobile version.
- Shipping API integrations, accounts, CMS, or automated lesson ingestion that the owner did not request.

## 16. Instruction precedence and agent behavior

- This file governs **default implementation and quality standards** for the project.
- The owner's explicit request for a particular lesson or feature may refine the scope, but does not override correctness, attribution, privacy, or essential accessibility.
- When an appropriate choice is obvious, **make it and explain briefly**; do not stall with repeated questions.
- If data or scholarship is insufficient, surface the uncertainty rather than inventing an authoritative-looking answer.
- Before adding a library, check whether the installed stack already solves the problem; consult the current official docs for unfamiliar APIs.
- When reviewing an existing lesson, use the checklist above and correct failures rather than merely changing styling.

## 17. Authoritative references for implementers

These links describe the technical tools and standards. They are **not substitutes for domain-specific academic references** in individual lessons.

- Motion for React: https://motion.dev/docs/react
- Motion accessibility: https://motion.dev/docs/react-accessibility
- GSAP React integration: https://gsap.com/resources/React/
- GSAP docs: https://gsap.com/docs/v3/
- MDX: https://mdxjs.com/docs/
- React Flow: https://reactflow.dev/
- Recharts: https://recharts.org/
- D3: https://d3js.org/
- KaTeX: https://katex.org/
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/

---

**Core rule:** Build a visual only when it teaches something true and important. Explain it simply, reveal deeper meaning when requested, make interactions honest, and let the learner verify their understanding through questions and flashcards.
