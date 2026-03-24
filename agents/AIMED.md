# AIMED Declaration Policy for Claude Code

## Rule

All code you generate or substantially modify must include an AIMED/1 declaration. This is non-negotiable for this project.

## How

1. **Every file you create or substantially rewrite:** Add `// AIMED/1 <scores> | tool=claude-code` as the first comment.

2. **Every commit you make:** Add `AIMED/1 <scores> | tool=claude-code` as the last line of the commit body.

3. **Functions/methods you add to existing files:** Add the declaration to the docblock.

## Scoring Yourself

Be honest. Score what you actually did:

- `D:5` — You wrote it from scratch or from a brief instruction
- `D:4` — You wrote most of it; human provided significant structure
- `D:3` — You and the human contributed roughly equally
- `E:4` — You did major refactoring or rewriting of existing code
- `E:2` — You made minor improvements or fixes
- `S:3+` — You decided the architecture or approach, not just implemented it
- `V:3+` — You reviewed, tested, or validated code (yours or human's)

When in doubt, round up. Underreporting is worse than overreporting.

## Examples

```python
# AIMED/1 S:2 D:5 E:3 V:2 | tool=claude-code

class OrderService:
    ...
```

```
git commit -m "feat: add order processing service

Implements order creation, validation, and payment integration.

AIMED/1 S:2 D:5 E:3 V:2 | tool=claude-code"
```

## Reference

Full specification: https://github.com/krdr-mft/aimed
