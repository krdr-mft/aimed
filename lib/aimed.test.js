/**
 * AIMED Parser Test Suite
 * Run: node lib/aimed.test.js
 *
 * AIMED/1 S:2 D:4 V:5 | tool=claude-opus-4
 */

const AIMED = require('./aimed.js');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ ${message}`);
  }
}

function assertThrows(fn, message) {
  try {
    fn();
    failed++;
    console.error(`  ✗ ${message} (expected error, got none)`);
  } catch {
    passed++;
    console.log(`  ✓ ${message}`);
  }
}

function assertDeepEqual(actual, expected, message) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ ${message}`);
    console.error(`    expected: ${e}`);
    console.error(`    actual:   ${a}`);
  }
}

// ── Parse Tests ──────────────────────────────────────────

console.log('\n── parse() ──');

(() => {
  const r = AIMED.parse('AIMED/1 I:2 D:4 E:3');
  assert(r.aimed.version === '1.0', 'parse basic: version');
  assertDeepEqual(r.aimed.scores, { I: 2, D: 4, E: 3 }, 'parse basic: scores');
  assert(!r.aimed.metadata, 'parse basic: no metadata');
})();

(() => {
  const r = AIMED.parse('AIMED/1 R:5 A:5 D:1 V:3 | tool=claude-4');
  assertDeepEqual(r.aimed.scores, { R: 5, A: 5, D: 1, V: 3 }, 'parse with metadata: scores');
  assert(r.aimed.metadata.tool === 'claude-4', 'parse with metadata: tool');
})();

(() => {
  const r = AIMED.parse('AIMED/1 D:0 E:2 | note="AI used only for grammar"');
  assert(r.aimed.scores.D === 0, 'parse zero score');
  assert(r.aimed.metadata.note === 'AI used only for grammar', 'parse quoted metadata');
})();

(() => {
  const r = AIMED.parse('AIMED/1 D:3 +mu:4 | custom.mu="Music composition" tool=udio');
  assert(r.aimed.scores['+mu'] === 4, 'parse custom area: score');
  assert(r.aimed.metadata.custom_areas['+mu'] === 'Music composition', 'parse custom area: definition');
  assert(r.aimed.metadata.tool === 'udio', 'parse custom area: other metadata preserved');
})();

(() => {
  const r = AIMED.parse('AIMED/1 I:0 D:0 E:0 R:0 S:0 T:0 V:0 A:0 G:0 X:0');
  assert(Object.keys(r.aimed.scores).length === 10, 'parse all core areas');
})();

assertThrows(() => AIMED.parse('not aimed at all'), 'reject invalid header');
assertThrows(() => AIMED.parse('AIMED/2 D:3'), 'reject unsupported version');
assertThrows(() => AIMED.parse('AIMED/1 '), 'reject no scores');
assertThrows(() => AIMED.parse('AIMED/1 D:3 D:4'), 'reject duplicate areas');

// ── toCompact Tests ──────────────────────────────────────

console.log('\n── toCompact() ──');

(() => {
  const decl = { aimed: { version: '1.0', scores: { D: 4, I: 2, E: 3 } } };
  const compact = AIMED.toCompact(decl);
  assert(compact.startsWith('AIMED/1'), 'toCompact: header');
  assert(compact.includes('D:4'), 'toCompact: contains D:4');
  assert(compact.includes('E:3'), 'toCompact: contains E:3');
  assert(compact.includes('I:2'), 'toCompact: contains I:2');
})();

(() => {
  const decl = {
    aimed: {
      version: '1.0',
      scores: { D: 3, '+mu': 4 },
      metadata: {
        tool: 'udio',
        custom_areas: { '+mu': 'Music composition' },
      },
    },
  };
  const compact = AIMED.toCompact(decl);
  assert(compact.includes('+mu:4'), 'toCompact custom: area included');
  assert(compact.includes('tool=udio'), 'toCompact custom: metadata');
  assert(compact.includes('custom.mu='), 'toCompact custom: custom area definition');
})();

// ── Roundtrip Tests ──────────────────────────────────────

console.log('\n── roundtrip ──');

(() => {
  const original = 'AIMED/1 A:3 D:4 E:2 I:1 R:5 | tool=claude-4';
  const parsed = AIMED.parse(original);
  const compact = AIMED.toCompact(parsed);
  const reparsed = AIMED.parse(compact);
  assertDeepEqual(reparsed.aimed.scores, parsed.aimed.scores, 'roundtrip: scores preserved');
  assert(reparsed.aimed.metadata.tool === parsed.aimed.metadata.tool, 'roundtrip: metadata preserved');
})();

// ── Validate Tests ───────────────────────────────────────

console.log('\n── validate() ──');

(() => {
  const decl = { aimed: { version: '1.0', scores: { D: 4, E: 3 } } };
  const { valid, errors } = AIMED.validate(decl);
  assert(valid, 'validate: valid declaration');
  assert(errors.length === 0, 'validate: no errors');
})();

(() => {
  const { valid } = AIMED.validate({});
  assert(!valid, 'validate: reject missing aimed');
})();

(() => {
  const { valid, errors } = AIMED.validate({ aimed: { version: '1.0', scores: { Z: 3 } } });
  assert(!valid, 'validate: reject unknown area code');
  assert(errors.some(e => e.includes('Z')), 'validate: error mentions Z');
})();

(() => {
  const { valid, errors } = AIMED.validate({
    aimed: { version: '1.0', scores: { D: 7 } },
  });
  assert(!valid, 'validate: reject score > 5');
})();

(() => {
  const { valid, errors } = AIMED.validate({
    aimed: { version: '1.0', scores: { D: -1 } },
  });
  assert(!valid, 'validate: reject score < 0');
})();

(() => {
  const { valid, errors } = AIMED.validate({
    aimed: { version: '1.0', scores: { '+mu': 3 } },
  });
  assert(!valid, 'validate: reject undeclared custom area');
  assert(errors.some(e => e.includes('+mu')), 'validate: error mentions +mu');
})();

(() => {
  const { valid } = AIMED.validate({
    aimed: {
      version: '1.0',
      scores: { '+mu': 3 },
      metadata: { custom_areas: { '+mu': 'Music' } },
    },
  });
  assert(valid, 'validate: accept declared custom area');
})();

(() => {
  const { valid } = AIMED.validate({ aimed: { version: '1.0', scores: {} } });
  assert(!valid, 'validate: reject empty scores');
})();

// ── compositeScore Tests ─────────────────────────────────

console.log('\n── compositeScore() ──');

assert(AIMED.compositeScore({ I: 2, D: 4, E: 3 }) === 60, 'composite: I:2 D:4 E:3 = 60%');
assert(AIMED.compositeScore({ D: 5 }) === 100, 'composite: D:5 = 100%');
assert(AIMED.compositeScore({ D: 0, E: 0 }) === 0, 'composite: all zeros = 0%');
assert(AIMED.compositeScore({ I: 1, R: 1, D: 1, E: 1, V: 1 }) === 20, 'composite: all 1s = 20%');
assert(AIMED.compositeScore({ I: 5, R: 5, D: 5, E: 5 }) === 100, 'composite: all 5s = 100%');

// ── intensityLabel Tests ─────────────────────────────────

console.log('\n── intensityLabel() ──');

assert(AIMED.intensityLabel(0) === 'None', 'label: 0 = None');
assert(AIMED.intensityLabel(1) === 'Minimal', 'label: 1 = Minimal');
assert(AIMED.intensityLabel(3) === 'Moderate', 'label: 3 = Moderate');
assert(AIMED.intensityLabel(5) === 'Full', 'label: 5 = Full');

// ── areaName Tests ───────────────────────────────────────

console.log('\n── areaName() ──');

assert(AIMED.areaName('D') === 'Drafting', 'areaName: D = Drafting');
assert(AIMED.areaName('I') === 'Ideation', 'areaName: I = Ideation');
assert(AIMED.areaName('+mu', { '+mu': 'Music' }) === 'Music', 'areaName: custom');
assert(AIMED.areaName('+zz') === '+zz', 'areaName: unknown returns code');

// ── extract Tests ────────────────────────────────────────

console.log('\n── extract() ──');

(() => {
  const html = `<html><head><meta name="aimed" content="AIMED/1 D:4 E:2"></head></html>`;
  const r = AIMED.extract(html);
  assert(r !== null, 'extract HTML meta: found');
  assert(r.aimed.scores.D === 4, 'extract HTML meta: correct score');
})();

(() => {
  const md = `---\ntitle: Test\naimed: "AIMED/1 R:3 D:4"\n---\n# Hello`;
  const r = AIMED.extract(md);
  assert(r !== null, 'extract frontmatter: found');
  assert(r.aimed.scores.R === 3, 'extract frontmatter: correct score');
})();

(() => {
  const py = `#!/usr/bin/env python3\n# AIMED/1 D:5 E:3 V:4 | tool=copilot\nimport os`;
  const r = AIMED.extract(py);
  assert(r !== null, 'extract Python comment: found');
  assert(r.aimed.scores.D === 5, 'extract Python comment: correct score');
})();

(() => {
  const js = `// AIMED/1 S:2 D:4\nconst x = 1;`;
  const r = AIMED.extract(js);
  assert(r !== null, 'extract JS comment: found');
  assert(r.aimed.scores.S === 2, 'extract JS comment: correct score');
})();

(() => {
  const css = `/* AIMED/1 D:3 G:4 */\nbody { color: red; }`;
  const r = AIMED.extract(css);
  assert(r !== null, 'extract CSS comment: found');
  assert(r.aimed.scores.G === 4, 'extract CSS comment: correct score');
})();

(() => {
  const bare = `AIMED/1 I:1 D:2 E:1`;
  const r = AIMED.extract(bare);
  assert(r !== null, 'extract bare: found');
  assert(r.aimed.scores.I === 1, 'extract bare: correct score');
})();

(() => {
  const none = `Just a normal file with no AIMED declaration.`;
  const r = AIMED.extract(none);
  assert(r === null, 'extract: returns null when not found');
})();

// ── Format Output Tests ──────────────────────────────────

console.log('\n── format outputs ──');

(() => {
  const compact = 'AIMED/1 D:4 E:3';
  assert(AIMED.toMetaTag(compact).includes('<meta'), 'toMetaTag: contains meta tag');
  assert(AIMED.toHTMLComment(compact).startsWith('<!--'), 'toHTMLComment: starts with <!--');
  assert(AIMED.toCodeComment(compact, 'python').startsWith('#'), 'toCodeComment python: starts with #');
  assert(AIMED.toCodeComment(compact, 'js').startsWith('//'), 'toCodeComment js: starts with //');
  assert(AIMED.toCodeComment(compact, 'css').startsWith('/*'), 'toCodeComment css: starts with /*');
  assert(AIMED.toCodeComment(compact, 'sql').startsWith('--'), 'toCodeComment sql: starts with --');
  assert(AIMED.toFrontmatter(compact).startsWith('aimed:'), 'toFrontmatter: starts with aimed:');
})();

(() => {
  const decl = { aimed: { version: '1.0', scores: { D: 4 } } };
  const json = AIMED.toJSON(decl);
  assert(JSON.parse(json).aimed.scores.D === 4, 'toJSON: valid and parseable');
})();

(() => {
  const decl = { aimed: { version: '1.0', scores: { D: 4, E: 2 } } };
  const yaml = AIMED.toYAML(decl);
  assert(yaml.includes('D: 4'), 'toYAML: contains score');
  assert(yaml.includes('version:'), 'toYAML: contains version');
})();

// ── Summary ──────────────────────────────────────────────

console.log('\n' + '─'.repeat(50));
console.log(`\n  ${passed} passed, ${failed} failed, ${passed + failed} total\n`);

if (failed > 0) {
  process.exit(1);
}
