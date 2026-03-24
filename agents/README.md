# aiMed Agent Skills

Ready-to-use instruction files that teach AI coding agents to self-declare their involvement using the AIMED/1 standard.

## What Is This

Drop one of these files into your project and your AI coding agent will automatically tag its output with AIMED declarations — in file headers, docblocks, commit messages, and PR descriptions.

## Quick Setup

### Claude Code

Copy `claude-code/AIMED.md` content into your project's `CLAUDE.md`:

```bash
cat aimed-agent-skills/claude-code/AIMED.md >> /path/to/your/project/CLAUDE.md
```

### GitHub Copilot

Copy `copilot/copilot-instructions.md` content into your repo's `.github/copilot-instructions.md`:

```bash
mkdir -p /path/to/your/project/.github
cat aimed-agent-skills/copilot/copilot-instructions.md >> /path/to/your/project/.github/copilot-instructions.md
```

### Cursor

Copy `cursor/.cursorrules` into your project root:

```bash
cp aimed-agent-skills/cursor/.cursorrules /path/to/your/project/.cursorrules
```

### Any Other Agent

Use `generic/AIMED-AGENT-INSTRUCTIONS.md` — it works with any LLM-based coding tool. Add it to whatever system prompt or project instructions your agent reads.

## What the Agent Will Do

After setup, the agent will:

1. Add `// AIMED/1 D:5 E:3 | tool=<agent>` to the top of files it creates
2. Add AIMED declarations to docblocks of functions/classes it generates
3. Include AIMED declarations in commit messages
4. Self-score honestly on a 0-5 scale per area of involvement

## Full Skill Reference

See `SKILL.md` for the complete skill specification, including:

- Detailed scoring guidelines with examples
- Placement rules for every file type and context
- Granularity guidelines (project vs file vs function level)
- Integration patterns for CI/CD and code review
- Validation rules

## File Structure

```
aimed-agent-skills/
├── SKILL.md                              # Full skill spec (agent-readable)
├── README.md                             # This file (human-readable)
├── claude-code/
│   └── AIMED.md                          # Drop into CLAUDE.md
├── copilot/
│   └── copilot-instructions.md           # Drop into .github/copilot-instructions.md
├── cursor/
│   └── .cursorrules                      # Drop into project root
└── generic/
    └── AIMED-AGENT-INSTRUCTIONS.md       # Works with any agent
```

## License

CC0 1.0 Universal — same as the aiMed standard itself.

---

`AIMED/1 I:3 S:3 D:4 E:2 | tool=claude-opus-4`
