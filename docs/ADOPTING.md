# Adopting aiMed in Your Organization

This guide helps teams and organizations integrate aiMed into their workflow.

## Step 1: Decide Your Scope

Start by identifying where AI is used in your organization:

- **Content teams**: Blog posts, marketing copy, documentation, social media
- **Engineering teams**: Source code, architecture docs, test suites, CI configs
- **Research teams**: Papers, analysis, literature reviews, data processing
- **Design teams**: UI mockups, image assets, brand materials
- **Legal/Compliance**: Contracts, policy documents, regulatory filings

You don't have to cover everything at once. Pick one area and expand.

## Step 2: Choose Your Embedding Format

Pick the format that fits your workflow:

| Content Type | Recommended Format |
|---|---|
| Blog posts (Markdown) | YAML frontmatter |
| HTML pages | `<meta>` tag |
| Source code | Comment at file top |
| Git commits | Footer line in commit message |
| Documents (Word, PDF) | Footer or metadata field |
| Design files | Companion `.aimed` file |
| API responses | JSON field in payload |

## Step 3: Set a Policy

Define your organization's expectations. Example policies, from lightest to strictest:

**Voluntary**: "We encourage team members to add aiMed declarations to AI-assisted work."

**Recommended**: "All published content should include an aiMed declaration. Internally, it's encouraged."

**Required**: "All deliverables must include an aiMed declaration. Omission implies zero AI involvement."

## Step 4: Add to Templates

Make compliance easy by adding aiMed to your existing templates:

- Blog post template → add `aimed:` to frontmatter
- Code file template → add AIMED comment header
- PR template → add AIMED field
- Document template → add AIMED footer

## Step 5: Create a Domain Profile (Optional)

If your field has specific AI involvement areas not covered by the core set, define custom areas:

```yaml
# Example: Marketing domain profile
aimed_profile: marketing
custom_areas:
  +cp: "Copywriting"
  +ab: "A/B test variant generation"
  +sg: "Audience segmentation"
  +pe: "Personalization"
```

Publish your profile so others in your industry can use it.

## FAQ for Organizations

**Q: Does AIMED create legal liability?**
A: aiMed is a transparency tool, not a legal instrument. Consult your legal team about any specific concerns, but the declarations themselves carry no legal weight beyond what your organization assigns them in policy.

**Q: What if people don't report honestly?**
A: aiMed relies on self-reporting, just like many existing standards (accessibility, content ratings, etc.). Culture and policy do more than enforcement. Start with trust.

**Q: Should we mandate specific score thresholds?**
A: Generally, no. aiMed is about transparency, not gatekeeping. Let the scores inform decisions rather than block them.

**Q: How do we handle legacy content?**
A: You can retroactively add aiMed declarations to existing content if you know the AI involvement. Otherwise, absence of a declaration simply means no claim is made.

---

`AIMED/1 I:3 S:3 D:4 E:2 | tool=claude-opus-4`
