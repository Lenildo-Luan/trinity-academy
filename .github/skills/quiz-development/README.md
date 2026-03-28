# Quiz Development Skill

## Overview

This skill enables the creation of high-quality educational quizzes for Trinity Academy courses. It covers the complete quiz development workflow: understanding Trinity's quiz architecture, designing pedagogically-sound questions, implementing proper answer structure to avoid obvious solutions, and integrating quizzes into the course system.

## What This Skill Covers

- **Quiz Structure & Architecture** — Understanding how quizzes are stored, validated, and loaded in Trinity
- **Pedagogical Design Principles** — Creating questions that test deep understanding, not surface-level knowledge
- **Question Design Patterns** — Writing questions with plausible distractors (wrong answers) that challenge learners
- **Answer Explanation Strategy** — Crafting explanations that teach, not just correct
- **Integration Workflow** — Registering quizzes in `module.json` and validating JSON structure

## When to Use This Skill

Use this skill when:
- Creating a new quiz for a chapter/lesson
- Designing questions for a specific learning objective
- Improving existing quiz content (rewriting questions or distractors)
- Adding explanations to quiz answers
- Validating quiz structure and compliance with Trinity standards

## Guiding Philosophy

A great quiz question:
1. **Tests a specific learning objective** — Not random facts, but meaningful concepts
2. **Has a clearly correct answer** — No ambiguity about what's right
3. **Has plausible, challenging distractors** — Wrong answers that test real misconceptions, not obvious wrong choices
4. **Includes educational explanations** — Even after choosing, the learner understands *why*
5. **Respects the learner's cognitive load** — Not a gotcha or trick question (unless explicitly testing critical reading)

## Key Files in This Skill

- `SKILL.md` — Complete guide to quiz development (design principles, structure, patterns)
- `references/question-types.md` — Templates for different question styles
- `references/distractor-patterns.md` — Strategies for writing plausible wrong answers
- `references/explanation-guide.md` — How to write educational answer explanations
- `references/real-examples.md` — Annotated examples from Trinity's existing quizzes

## Related Documentation

- **Trinity Project Context** → Read `copilot-instructions.md` for project architecture
- **Quiz Data Format** → Check `src/data/quizzes/` in the project for existing quiz JSON
- **Module Registration** → See `src/data/lessons/[course]/module.json` for quiz linking
- **Validation** → Run `src/data/quizzes.ts` to validate quiz JSON structure


