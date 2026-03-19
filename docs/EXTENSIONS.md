# Extending aiMed: Custom Areas and Domain Profiles

AIMED's 10 core areas cover the most common forms of AI involvement. But every domain has unique workflows. This guide explains how to extend AIMED for your field.

## Custom Area Codes

Custom areas use a `+` prefix followed by two lowercase letters:

```
+mu  → Music composition
+le  → Legal research
+ci  → Citation assistance
```

### Rules for Custom Codes

1. Must start with `+` followed by exactly two lowercase letters.
2. Must be declared in the declaration's metadata.
3. Must not conflict with existing codes in your domain profile.
4. Should be mnemonic — readers should guess the meaning.

### Using Custom Areas

Compact notation:
```
AIMED/1 D:3 +mu:4 | custom.mu="Music composition"
```

Structured notation:
```json
{
  "aimed": {
    "version": "1.0",
    "scores": { "D": 3, "+mu": 4 },
    "metadata": {
      "custom_areas": { "+mu": "Music composition" }
    }
  }
}
```

## Domain Profiles

A domain profile is a published set of custom areas for a specific field. Profiles make custom areas portable — instead of every author defining `+mu` independently, the Music Profile defines it once.

### Profile Structure

A domain profile is a YAML or JSON file:

```yaml
# aimed-profile-academic.yaml
profile:
  name: academic
  version: "1.0"
  description: "AIMED domain profile for academic and research writing"
  areas:
    +mt: "Methodology design"
    +ci: "Citation and reference management"
    +pe: "Peer review response drafting"
    +ab: "Abstract writing"
    +da: "Dataset preparation"
    +fo: "Formula derivation"
    +lt: "Literature review"
```

### Example Profiles

**Music Production**
```yaml
profile:
  name: music
  areas:
    +mu: "Composition and arrangement"
    +ly: "Lyrics writing"
    +mx: "Mixing and mastering"
    +sn: "Sound design and synthesis"
    +sa: "Sampling and selection"
```

**Legal**
```yaml
profile:
  name: legal
  areas:
    +le: "Legal research and case law"
    +ct: "Contract drafting"
    +cm: "Compliance review"
    +ar: "Argumentation and brief writing"
    +rg: "Regulatory analysis"
```

**Software Engineering**
```yaml
profile:
  name: software
  areas:
    +tc: "Test case generation"
    +dc: "Documentation writing"
    +cr: "Code review and suggestions"
    +db: "Debugging assistance"
    +rf: "Refactoring"
    +dp: "Deployment and DevOps"
```

**Journalism**
```yaml
profile:
  name: journalism
  areas:
    +iv: "Interview question preparation"
    +fc: "Fact-checking"
    +hl: "Headline generation"
    +sm: "Social media adaptation"
    +tr: "Transcript processing"
```

### Referencing a Profile

When using a domain profile, reference it in metadata:

```
AIMED/1 D:3 +mu:4 +ly:2 | profile=music tool=udio
```

```json
{
  "aimed": {
    "version": "1.0",
    "scores": { "D": 3, "+mu": 4, "+ly": 2 },
    "metadata": {
      "domain_profile": "music",
      "tool": "udio"
    }
  }
}
```

### Publishing a Profile

1. Create a YAML file following the structure above.
2. Submit a PR to the aiMed repository under `profiles/`.
3. Or publish it independently and reference the aiMed spec.

Profiles are not governed by the aiMed spec — anyone can create and publish one. The repository serves as a shared registry for discoverability.

## Guidelines for Extension Authors

1. **Don't duplicate core areas.** If a core area covers it, use the core area.
2. **Be specific.** `+mu` (music composition) is better than `+cr` (creation) — the latter overlaps with core `D` (Drafting).
3. **Keep codes mnemonic.** Two letters should hint at the meaning.
4. **Document each area.** Include a clear description and examples of what score levels mean for that area.
5. **Version your profile.** As your domain evolves, update the profile version.

---

`AIMED/1 I:3 S:3 D:4 E:2 | tool=claude-opus-4`
