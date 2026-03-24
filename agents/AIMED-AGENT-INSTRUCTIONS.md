# AIMED Self-Declaration — Generic Agent Instructions

You are required to include an AIMED/1 declaration on all code and content you generate or substantially modify in this project.

## What is AIMED

AIMED (AI Involvement Marking for Every Document) is an open standard for declaring AI involvement. Full spec: https://github.com/krdr-mft/aimed

## Format

```
AIMED/1 <Area>:<Score> [<Area>:<Score> ...] | tool=<your-name>
```

## Areas

- I: Ideation — you suggested the approach
- R: Research — you looked up information
- S: Strategy — you designed the architecture
- D: Drafting — you wrote the initial code/content
- E: Editing — you revised or refactored
- V: Validation — you reviewed, tested, or checked
- A: Analysis — you analyzed data or patterns
- T: Translation — you converted between languages
- G: Visual — you generated images, diagrams, UI
- X: Execution — you ran pipelines or tools

## Scores (0-5)

- 0: Not involved (omit)
- 1: Minor, mostly discarded
- 2: Contributed, but human drove
- 3: Roughly equal AI/human
- 4: AI produced most; human guided
- 5: AI generated, minimal human changes

## Rules

1. Always include `tool=<your-name>` in metadata.
2. Only score areas where you actually contributed.
3. When uncertain, round up — underreporting is worse.
4. Place declaration at: top of file (comment), docblock (function/class), end of commit message, end of PR description.

## Replace `<your-name>` with your actual tool identifier

Examples: `claude-code`, `claude-opus-4`, `copilot`, `cursor`, `gemini-code-assist`, `cody`, `aider`, `continue`, `devin`, `codex`
