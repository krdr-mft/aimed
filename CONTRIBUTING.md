# Contributing to aiMed

Thank you for your interest in making AI transparency better. AIMED is a community-driven open standard, and every contribution matters.

## Ways to Contribute

### Improve the Specification
- Clarify ambiguous language
- Propose new core areas (with strong justification)
- Suggest improvements to the intensity scale
- Fix errors or inconsistencies

### Build Tools
- Port the parser to other languages (Python, PHP, Ruby, Go, Rust, etc.)
- Build editor plugins (VS Code, JetBrains, Vim, etc.)
- Create CI/CD integrations (GitHub Actions, GitLab CI, etc.)
- Develop linters that check for aiMed declarations

### Create Domain Profiles
- Define area sets for your field (academic, music, legal, medical, etc.)
- Document best practices for your domain
- Provide real-world examples

### Improve Documentation
- Write tutorials and guides
- Translate docs into other languages
- Add examples for new use cases

## Process

### For spec changes
1. Open an issue describing the proposed change and its motivation.
2. Discuss with the community.
3. Submit a pull request with the change.
4. Changes to core areas or the intensity scale require broad consensus.

### For tools and examples
1. Fork the repo.
2. Create a feature branch.
3. Add your contribution with tests where applicable.
4. Include an aiMed declaration in your contribution (practice what we preach).
5. Submit a pull request.

## Guidelines

- **Keep it simple.** AIMED's power comes from its simplicity. Resist complexity.
- **Be backward compatible.** Don't break existing declarations.
- **Include examples.** Every feature should have clear usage examples.
- **Test your parsers.** Use the examples in the `examples/` directory as test cases.
- **Self-declare.** Every file in this repo should carry its own aiMed declaration where practical.

## Code Style

- JavaScript: No build step required. ES modules + CommonJS dual support.
- Documentation: Standard Markdown.
- Commit messages: Conventional commits format preferred.

## License

By contributing to aiMed, you agree that your contributions will be released under CC0 1.0 Universal (Public Domain Dedication). This means you waive all copyright and related rights. This is intentional — an open standard must be truly open.

---

`AIMED/1 I:2 D:4 E:2 | tool=claude-opus-4`
