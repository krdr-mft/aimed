# AIMED Declaration Policy for GitHub Copilot

## Instruction

When generating code, include an AIMED/1 declaration to transparently mark AI involvement. Use the aiMed open standard (https://github.com/krdr-mft/aimed).

## Format

```
AIMED/1 <Area>:<Score> [...] | tool=copilot
```

## Areas and Scores

Only include areas where you contributed. Score 0-5 (0 = none, 5 = fully AI-generated).

Common patterns:
- Code completion / suggestion: `AIMED/1 D:4 | tool=copilot`
- Full function generation: `AIMED/1 D:5 E:2 | tool=copilot`
- Test generation: `AIMED/1 D:5 V:3 | tool=copilot`
- Refactoring suggestion: `AIMED/1 E:3 | tool=copilot`

## Placement

- New files: first comment after language declaration
- Functions/methods: in the docblock
- Commit messages: last line of commit body

## Example

```javascript
/**
 * Calculate shipping cost based on weight and destination.
 *
 * AIMED/1 D:5 E:2 | tool=copilot
 */
function calculateShipping(weight, destination) {
    ...
}
```
