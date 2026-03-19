# aiMed v1.0 — AI Involvement Marking for Every Document

## Open Specification

**Version:** 1.0.0  
**Status:** Draft  
**License:** CC0 1.0 Universal (Public Domain Dedication)  
**Date:** 2026-03-19

---

## 1. Purpose

aiMed is an open standard for transparently declaring the nature and degree of AI involvement in any piece of content or code. It answers two questions:

1. **Where** was AI involved? (which areas of the creative or production process)
2. **How much** was AI involved? (on a consistent numeric scale)

aiMed is format-agnostic, domain-neutral, and freely usable by anyone without restriction.

> **Note on naming:** The standard's display name is **aiMed**. In machine-readable declarations, the identifier is always uppercase `AIMED/1` for parsing consistency.

---

## 2. Design Principles

- **Transparency** — Readers and consumers deserve to know how content was produced.
- **Granularity** — A single "made with AI" label is insufficient. aiMed breaks involvement into distinct areas, each scored independently.
- **Simplicity** — The standard must be easy to read, write, and parse by both humans and machines.
- **Extensibility** — Anyone can define custom area codes for their domain while remaining compatible with the core standard.
- **Universality** — aiMed works for blog posts, academic papers, source code, design files, videos, music, legal documents, and anything else.

---

## 3. Core Concepts

### 3.1 Areas of Involvement

An **area** represents a distinct phase or aspect of the production process where AI may have played a role. Each area is identified by a single uppercase letter code.

#### Core Areas (reserved by the standard)

| Code | Area           | Description                                                                 |
|------|----------------|-----------------------------------------------------------------------------|
| `I`  | Ideation       | Brainstorming, concept generation, topic selection, creative direction      |
| `R`  | Research        | Fact-finding, data gathering, source discovery, literature review           |
| `D`  | Drafting       | Producing the initial version of text, code, or other content               |
| `E`  | Editing        | Revising, restructuring, improving clarity, refactoring, debugging          |
| `T`  | Translation    | Converting content between human languages                                  |
| `V`  | Validation     | Fact-checking, testing, code review, quality assurance, proofreading        |
| `A`  | Analysis       | Data analysis, pattern recognition, statistical processing, summarization   |
| `G`  | Visual/Design  | Image generation, graphic design, layout, UI/UX design                      |
| `S`  | Strategy       | Planning, architecture, structure design, outline creation, prompt design   |
| `X`  | Execution      | Running automated pipelines, compilation, deployment, rendering             |

#### Custom Areas

Domains may define additional area codes using lowercase letters or two-character codes prefixed with `+`. Custom areas MUST be declared in the declaration's metadata section.

Examples:
- `+mu` — Music composition
- `+le` — Legal review
- `+mc` — Medical consultation

### 3.2 Intensity Scale

Each area receives an **intensity score** from `0` to `5`:

| Score | Label          | Meaning                                                                  |
|-------|----------------|--------------------------------------------------------------------------|
| `0`   | None           | AI was not involved in this area at all.                                 |
| `1`   | Minimal        | AI provided minor suggestions that were mostly discarded or trivially obvious. |
| `2`   | Light          | AI contributed noticeably but a human drove the process and made key decisions. |
| `3`   | Moderate       | AI and human contributed roughly equally; human selected and shaped AI output. |
| `4`   | Heavy          | AI produced most of the output; human guided, curated, and refined.       |
| `5`   | Full           | AI generated the output with little to no human modification.             |

A score of `0` may be omitted from the declaration (absence implies zero involvement).

### 3.3 Declaration

A **declaration** is the complete aiMed markup for a single document or artifact. It consists of:

1. **Header** — Standard identifier and version.
2. **Scores** — One or more area-intensity pairs.
3. **Metadata** (optional) — Tool names, custom area definitions, notes.

---

## 4. Syntax

### 4.1 Compact Notation (human-readable)

The compact notation is a single-line string suitable for comments, footers, and inline use.

**Format:**

```
AIMED/1 <AreaCode>:<Score> [<AreaCode>:<Score> ...] [| <metadata>]
```

**Examples:**

```
AIMED/1 I:2 D:4 E:3
AIMED/1 R:5 A:5 D:1 V:3 | tool=claude-4
AIMED/1 D:0 E:2 | note="AI used only for grammar suggestions"
```

**Rules:**
- Areas are separated by spaces.
- Metadata follows a `|` delimiter and uses `key=value` pairs separated by spaces.
- Omitted areas are assumed to be `0`.
- Order of areas does not matter, but alphabetical is recommended.

### 4.2 Structured Notation (machine-readable)

For embedding in JSON, YAML, or other structured formats.

**JSON:**

```json
{
  "aimed": {
    "version": "1.0",
    "scores": {
      "I": 2,
      "D": 4,
      "E": 3
    },
    "metadata": {
      "tool": "claude-4",
      "date": "2026-03-18",
      "note": "AI drafted initial code; human refactored architecture"
    }
  }
}
```

**YAML:**

```yaml
aimed:
  version: "1.0"
  scores:
    I: 2
    D: 4
    E: 3
  metadata:
    tool: claude-4
    date: 2026-03-18
```

### 4.3 Embedding in Common Formats

#### HTML (meta tag)

```html
<meta name="aimed" content="AIMED/1 I:2 D:4 E:3 | tool=claude-4">
```

#### Markdown (frontmatter)

```yaml
---
title: My Article
aimed: "AIMED/1 R:3 D:4 E:2"
---
```

#### Source Code (comment block)

```python
# AIMED/1 D:4 E:3 V:2 | tool=claude-4

def hello():
    print("Hello, world!")
```

```javascript
// AIMED/1 D:5 E:1 | tool=copilot
```

```css
/* AIMED/1 D:3 G:2 */
```

#### Git Commit Message

```
feat: add authentication module

AIMED/1 S:2 D:4 E:3 V:2
```

#### PDF (XMP metadata field)

Use the custom XMP property `aimed:declaration` within the document's metadata stream.

#### Image / Media Files (EXIF or XMP)

Use the `aimed:declaration` field in XMP sidecar or embedded metadata.

---

## 5. Aggregation

When a document is composed of multiple sections with different AI involvement, authors MAY provide:

- A **document-level** declaration (overall summary).
- **Section-level** declarations for individual parts.

Section-level declarations override the document-level declaration for their scope.

**Example in Markdown:**

```markdown
---
aimed: "AIMED/1 I:1 D:2 E:2"
---

# Introduction
<!-- AIMED/1 D:0 -->
This section was written entirely by hand.

# Data Analysis
<!-- AIMED/1 R:4 A:5 D:4 -->
This section relied heavily on AI for research and analysis.
```

---

## 6. Composite Score (Optional)

For contexts where a single summary number is useful (badges, dashboards, quick comparison), aiMed defines an optional **composite score**:

```
Composite = round( sum(all scores) / (number of declared areas × 5) × 100 )
```

This yields a percentage from `0%` (no AI involvement) to `100%` (full AI across all declared areas).

**Example:**  
`I:2 D:4 E:3` → (2+4+3) / (3×5) × 100 = **60%**

The composite score is a convenience metric. It MUST NOT be used as a substitute for the full area-by-area declaration.

---

## 7. Validation Rules

A valid aiMed declaration MUST:

1. Begin with `AIMED/` followed by the major version number.
2. Contain at least one area-score pair.
3. Use only recognized core area codes OR declare custom codes in metadata.
4. Use integer scores in the range `0–5` inclusive.
5. Not declare the same area code more than once per scope.

---

## 8. Best Practices

1. **Be honest.** aiMed relies on self-reporting. Overstating or understating AI involvement undermines the standard's value.
2. **Be specific.** Prefer granular area scores over a single composite number.
3. **Update when content changes.** If AI is used to revise previously human-written content, update the declaration.
4. **Declare the tool when possible.** Including `tool=<name>` helps readers understand the nature of AI assistance.
5. **Use section-level declarations for mixed content.** A long document may have sections with very different AI involvement levels.
6. **Err toward higher scores.** When uncertain about intensity, round up rather than down.
7. **Include AIMED in templates.** If your organization adopts AIMED, add it to document and code templates so authors fill it in naturally.

---

## 9. Extensibility

### 9.1 Custom Areas

To define a custom area, include it in metadata:

```
AIMED/1 D:3 +mu:4 | custom.mu="Music composition"
```

In structured notation:

```json
{
  "aimed": {
    "version": "1.0",
    "scores": {
      "D": 3,
      "+mu": 4
    },
    "metadata": {
      "custom_areas": {
        "+mu": "Music composition"
      }
    }
  }
}
```

### 9.2 Domain Profiles

Communities may publish **domain profiles** — predefined sets of custom areas relevant to their field. For example:

- **Academic Profile:** adds `+mt` (Methodology), `+ci` (Citation), `+pe` (Peer review assistance)
- **Music Profile:** adds `+mu` (Composition), `+ly` (Lyrics), `+mx` (Mixing/mastering)
- **Legal Profile:** adds `+le` (Legal research), `+ct` (Contract drafting), `+cm` (Compliance check)

Domain profiles are published as separate documents referencing this specification.

---

## 10. Versioning

aiMed follows semantic versioning (`MAJOR.MINOR.PATCH`).

- **Major** version changes indicate breaking changes to the syntax or core area definitions.
- **Minor** version changes add new core areas or optional features.
- **Patch** version changes are clarifications and typo fixes.

The compact notation includes only the major version (`AIMED/1`) to keep declarations concise. Parsers SHOULD accept any declaration whose major version they support.

---

## 11. Conformance Levels

Implementations may declare conformance at three levels:

| Level    | Requirements                                                        |
|----------|---------------------------------------------------------------------|
| **Basic**    | Can parse and produce compact notation with core areas.         |
| **Standard** | Supports both compact and structured notation, custom areas, metadata, and section-level declarations. |
| **Full**     | Supports all features including composite scores, domain profiles, aggregation, and validation. |

---

## 12. MIME Type and File Extension

- **MIME type for aiMed declaration files:** `application/aimed+json` or `text/aimed`
- **File extension:** `.aimed` (for standalone declaration files)

A standalone `.aimed` file contains a single JSON structured notation declaration and may be placed alongside the artifact it describes.

---

## 13. Examples

### Blog Post

```
AIMED/1 I:1 R:3 D:4 E:2 | tool=claude-4 note="AI helped research and draft; human directed topic and edited final version"
```

Reading: *The author chose the topic with minor AI brainstorming (I:1), used AI substantially for research (R:3), AI produced most of the first draft (D:4), and the author did light editing passes (E:2).*

### Open Source Code

```python
# AIMED/1 S:2 D:5 E:3 V:4 | tool=claude-code
# AI generated all code from a human-designed spec; human reviewed and refactored.
```

### Academic Paper

```yaml
aimed:
  version: "1.0"
  scores:
    I: 0
    R: 2
    D: 1
    E: 3
    A: 4
    V: 2
  metadata:
    tool: claude-4
    note: "AI used primarily for statistical analysis and editing. All ideas, methodology, and conclusions are the authors' own."
```

### Marketing Email (no AI)

```
AIMED/1 I:0 D:0 E:0
```

Or simply: if no aiMed declaration is present, no claim is made about AI involvement.

---

## 14. FAQ

**Q: Is an aiMed declaration mandatory?**  
A: No. aiMed is voluntary. Its value comes from adoption, not enforcement.

**Q: What if I used AI but don't want to disclose it?**  
A: aiMed does not compel disclosure. However, some organizations or publishers may require aiMed declarations as part of their policies.

**Q: Can I use aiMed for content generated by non-AI automation?**  
A: aiMed is designed specifically for AI involvement. Traditional automation (scripts, macros, templates) is generally not in scope, but organizations may choose to include it.

**Q: What counts as "AI"?**  
A: For aiMed purposes, AI includes large language models, image generation models, code completion tools, AI-powered search/summarization, and similar systems. Simple spell-checkers, grammar tools without generative capabilities, and traditional search engines are generally excluded.

**Q: How does aiMed interact with copyright or legal frameworks?**  
A: aiMed is a transparency tool, not a legal instrument. It does not make claims about copyright ownership, authorship rights, or legal liability.

**Q: What if someone fakes or misreports their aiMed declaration?**  
A: aiMed relies on self-reporting and good faith. There is no built-in verification or enforcement mechanism. The aiMed project and its contributors accept no responsibility for false or misleading declarations. If accuracy matters for your use case, seek independent verification. See Section 17 for the full disclaimer.

**Q: Can I use the aiMed logo on my project?**  
A: The aiMed logos and marks may only be used to indicate compatibility with or implementation of the aiMed standard. They may not be used to imply endorsement or affiliation. See Section 16 for details.

---

## 15. License

This specification is released under **CC0 1.0 Universal (Public Domain Dedication)**. Anyone may use, modify, extend, and redistribute it without restriction. No attribution is required, though it is appreciated.

---

## 16. Trademark and Logo Usage

The aiMed name, logo, marks (including the "a" mark and the "brain" mark), and logotype are **not** covered by the CC0 dedication. They are proprietary and may only be used in direct conjunction with the aiMed standard — for example, to indicate that a document, tool, or service implements or is compatible with aiMed. Use of the aiMed logos to imply endorsement, affiliation, or certification beyond standard compatibility is prohibited without explicit permission.

In short: the standard is free; the brand assets have usage rules.

---

## 17. Disclaimer of Accuracy

aiMed is a self-reporting transparency tool. The aiMed project, its authors, maintainers, and contributors:

- **Make no guarantees** about the accuracy, truthfulness, or completeness of any aiMed declaration made by any party.
- **Accept no responsibility** for false, misleading, fabricated, or intentionally misreported declarations.
- **Provide no verification mechanism.** aiMed declarations are assertions by their authors, not verified facts.
- **Bear no liability** for any decisions, actions, or consequences arising from reliance on aiMed declarations.

Anyone encountering an aiMed declaration should treat it as a good-faith disclosure by the author, not as a certified or audited statement. If accuracy of AI involvement is critical for your use case, you should seek independent verification beyond the aiMed declaration.

---

## 18. Contributing

aiMed is a living standard. Contributions, corrections, and extensions are welcome. To propose changes:

1. Open an issue or pull request in the aiMed repository.
2. Discuss on the aiMed mailing list or forum.
3. Follow the versioning rules in Section 10.

---

*This document itself:*  
`AIMED/1 I:3 S:3 D:4 E:2 | tool=claude-opus-4`
