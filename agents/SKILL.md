---
name: aimed-declaration
description: "Automatically add AIMED/1 AI involvement declarations to all code and content generated or modified by the agent. Use this skill whenever the agent creates files, writes code, makes commits, generates documentation, performs code review, or modifies existing content. Triggers include any task where AI contributes to ideation, research, drafting, editing, strategy, validation, analysis, translation, visual design, or execution of code or content."
---

# AIMED Agent Skill — AI Involvement Self-Declaration

## Purpose

This skill enables AI coding agents to automatically declare their involvement in generated or modified content using the [aiMed](https://github.com/krdr-mft/aimed) open standard. Agents MUST self-report honestly using the AIMED/1 compact notation after completing any task.

## Quick Reference

### Compact Syntax

```
AIMED/1 <Area>:<Score> [<Area>:<Score> ...] [| tool=<agent-name>]
```

### Areas

| Code | Area        | Use when agent...                                      |
|------|-------------|--------------------------------------------------------|
| `I`  | Ideation    | Suggested the approach, proposed solutions, brainstormed |
| `R`  | Research    | Looked up docs, searched codebases, found references   |
| `S`  | Strategy    | Designed architecture, planned structure, created outlines |
| `D`  | Drafting    | Wrote the initial code, text, or content               |
| `E`  | Editing     | Refactored, debugged, improved existing code/content   |
| `V`  | Validation  | Ran tests, reviewed code, checked for errors           |
| `A`  | Analysis    | Analyzed data, logs, patterns, or metrics              |
| `T`  | Translation | Converted between human languages                      |
| `G`  | Visual      | Generated images, diagrams, UI layouts                 |
| `X`  | Execution   | Ran pipelines, compiled, deployed, rendered            |

### Intensity Scale

| Score | Meaning                                                  |
|-------|----------------------------------------------------------|
| 0     | No AI involvement (omit from declaration)                |
| 1     | Minor suggestions, mostly discarded by human             |
| 2     | AI contributed but human drove the process               |
| 3     | Roughly equal AI/human contribution                      |
| 4     | AI produced most output; human guided and refined        |
| 5     | AI generated with minimal human modification             |

## Self-Scoring Rules for Agents

When scoring your own involvement, follow these principles:

1. **Score what you actually did, not what you could do.** If the human gave you a complete spec and you just typed it out, that is D:5 but S:0.

2. **Err toward higher scores.** When uncertain, round up. Underreporting AI involvement defeats the purpose.

3. **Only score areas you participated in.** Omit areas with zero involvement.

4. **Always include `tool=<your-identifier>`.** Use your model/agent name (e.g., `claude-code`, `copilot`, `cursor`, `claude-opus-4`).

5. **Common scoring patterns:**

| Task                                    | Typical Declaration                              |
|-----------------------------------------|--------------------------------------------------|
| Agent writes code from human spec       | `AIMED/1 D:5 E:3 | tool=agent`                  |
| Agent refactors existing code           | `AIMED/1 E:4 V:3 | tool=agent`                  |
| Agent fixes a bug                       | `AIMED/1 A:3 E:4 V:3 | tool=agent`              |
| Agent writes code + designs approach    | `AIMED/1 S:3 D:5 E:3 V:2 | tool=agent`          |
| Agent does code review only             | `AIMED/1 V:4 A:3 | tool=agent`                  |
| Agent generates tests                   | `AIMED/1 D:5 V:4 | tool=agent`                  |
| Agent writes docs from code             | `AIMED/1 R:3 D:5 E:2 | tool=agent`              |
| Human writes code, agent suggests edits | `AIMED/1 E:2 | tool=agent`                      |
| Agent translates content                | `AIMED/1 T:5 E:2 | tool=agent`                  |

## Where to Place Declarations

### In source code files

Place as the first comment block in the file, after any shebang or language declaration:

```python
#!/usr/bin/env python3
# AIMED/1 S:2 D:5 E:3 V:2 | tool=claude-code

class PaymentProcessor:
    ...
```

```javascript
// AIMED/1 D:5 E:3 | tool=claude-code

export function authenticate(token) {
    ...
}
```

```php
<?php
// AIMED/1 D:4 E:3 V:2 | tool=claude-code

namespace App\Services;
```

For method-level or class-level granularity, place in the docblock:

```python
def calculate_tax(amount, region):
    """Calculate tax for a given amount and region.
    
    AIMED/1 D:5 V:3 | tool=claude-code
    """
    ...
```

```javascript
/**
 * Validate and refresh authentication tokens.
 * 
 * AIMED/1 S:3 D:5 E:2 | tool=copilot
 */
async function refreshToken(token) {
    ...
}
```

```php
/**
 * Process a refund for a completed order.
 *
 * AIMED/1 D:5 E:3 V:2 | tool=claude-code
 */
public function processRefund(Order $order): RefundResult
{
    ...
}
```

### In git commit messages

Place on its own line after the commit body:

```
feat: add payment processing module

Implements Stripe integration with idempotency keys
and webhook signature verification.

AIMED/1 S:2 D:5 E:3 V:2 | tool=claude-code
```

### In pull request descriptions

Place at the end of the PR description:

```markdown
## Summary
Refactored the authentication module to use JWT refresh tokens.

## Changes
- Added refresh token rotation
- Updated middleware to handle expired tokens
- Added integration tests

---
AIMED/1 S:3 D:4 E:3 V:3 | tool=claude-code
```

### In package manifests

```json
// package.json
{
  "aimed": {
    "version": "1.0",
    "scores": { "S": 2, "D": 5, "E": 3 },
    "metadata": { "tool": "claude-code" }
  }
}
```

```json
// composer.json
{
  "extra": {
    "aimed": "AIMED/1 S:2 D:5 E:3 | tool=claude-code"
  }
}
```

### In markdown / documentation files

Place at the bottom of the file:

```markdown
---
*AIMED/1 R:3 D:4 E:2 | tool=claude-opus-4*
```

Or in frontmatter:

```yaml
---
title: API Documentation
aimed: "AIMED/1 R:3 D:5 E:2 | tool=claude-code"
---
```

### In configuration / YAML / TOML files

```yaml
# AIMED/1 D:5 E:2 | tool=claude-code

server:
  port: 8080
  host: 0.0.0.0
```

### In HTML templates

```html
<!-- AIMED/1 D:4 G:3 E:2 | tool=claude-code -->
<meta name="aimed" content="AIMED/1 D:4 G:3 E:2 | tool=claude-code">
```

## Granularity Guidelines

Choose the right level of granularity based on the scope of the task:

| Scope | Where to declare | When to use |
|-------|-----------------|-------------|
| **Project** | `package.json`, `composer.json`, or root `README.md` | Agent scaffolded or generated entire project |
| **File** | Comment at top of file | Agent wrote or substantially modified the file |
| **Class/Function** | Docblock of the class or function | Mixed authorship within a file |
| **Commit** | Commit message | Agent contributed to a specific set of changes |
| **PR** | PR description | Agent contributed across multiple commits |

**Rule of thumb:** Use the broadest scope that is still accurate. If the entire file was AI-generated, do not tag every function individually — tag the file. If only one function in a human-written file was AI-generated, tag that function.

## Integration with Agent Workflows

### CLAUDE.md / Project Instructions

Add to your project's `CLAUDE.md` or agent configuration:

```markdown
## AIMED Declaration Policy

All AI-generated or AI-modified code must include an AIMED/1 declaration.
- File-level: comment at top of file
- Commit-level: last line of commit body
- PR-level: end of PR description
- Use honest self-scoring per the AIMED specification
```

### Code Review Context

When an agent performs code review, it should:

1. Check for existing AIMED declarations on reviewed code
2. Add its own review declaration: `AIMED/1 V:4 A:3 | tool=<agent>`
3. Flag if AI-generated code lacks an AIMED declaration

Example review comment:

```
This function appears to be AI-generated but has no AIMED declaration.
Consider adding one for transparency.

Review: AIMED/1 V:4 A:3 | tool=claude-code
```

### Automated Pipelines

When an agent runs as part of CI/CD or automated workflows:

```
AIMED/1 X:5 V:4 | tool=<agent> note="Automated pipeline execution"
```

## Validation

A valid AIMED/1 declaration must:
- Start with `AIMED/1`
- Have at least one area:score pair
- Use only valid area codes (A, D, E, G, I, R, S, T, V, X, or custom +xx)
- Use integer scores 0-5
- Not repeat area codes

```
✓ AIMED/1 D:5 E:3 | tool=claude-code
✓ AIMED/1 S:2 D:4 E:3 V:2
✓ AIMED/1 V:4 A:3 | tool=copilot note="code review only"
✗ AIMED/1 D:6 E:3          (score out of range)
✗ AIMED/1 D:4 D:3          (duplicate area)
✗ AIMED/1                   (no scores)
✗ AIMED D:4 E:3            (missing version)
```

---

This skill: `AIMED/1 I:3 S:3 D:4 E:2 | tool=claude-opus-4`
