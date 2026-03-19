/**
 * AIMED Badge Generator
 * Generates SVG badges for AIMED declarations (shields.io style).
 *
 * Usage:
 *   node generate-badge.js "AIMED/1 I:2 D:4 E:3" > badge.svg
 *   node generate-badge.js --composite "AIMED/1 I:2 D:4 E:3" > badge.svg
 *
 * AIMED/1 S:2 D:4 E:2 | tool=claude-opus-4
 */

const AIMED = (() => {
  try { return require('../lib/aimed.js'); } catch { return null; }
})();

const SCORE_COLORS = ['#555', '#3b5998', '#2e86de', '#f0a03c', '#e05030', '#d63384'];
const ACCENT = '#4af0c0';

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function measureText(text, fontSize = 11) {
  // Approximation: average char width at 11px Verdana ≈ 6.8px
  return Math.ceil(text.length * 6.8) + 10;
}

function generateDetailedBadge(scores) {
  const label = 'aiMed';
  const labelWidth = measureText(label, 11);

  const scoreParts = Object.entries(scores)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `${k}:${v}`);
  const scoreText = scoreParts.join(' ');
  const scoreWidth = measureText(scoreText, 11);

  const totalWidth = labelWidth + scoreWidth;

  let scoreSpans = '';
  let xPos = labelWidth + 5;
  for (const [code, score] of Object.entries(scores)) {
    if (score === 0) continue;
    const text = `${code}:${score}`;
    scoreSpans += `<text x="${xPos}" y="14" fill="#ccc" font-family="Verdana,sans-serif" font-size="11">${text}</text>`;
    xPos += measureText(text, 11) - 4;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
  <clipPath id="r"><rect width="${totalWidth}" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#111"/>
    <rect x="${labelWidth}" width="${scoreWidth}" height="20" fill="#222"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11">
    <text x="${labelWidth / 2}" y="14" font-weight="600">${label}</text>
  </g>
  <g text-anchor="start">${scoreSpans}</g>
</svg>`;
}

function generateCompositeBadge(scores) {
  if (!AIMED) {
    console.error('Error: aimed.js not found. Run from repo root.');
    process.exit(1);
  }

  const composite = AIMED.compositeScore(scores);
  const label = 'aiMed';
  const value = `${composite}%`;

  const labelWidth = measureText(label, 11);
  const valueWidth = measureText(value, 11);
  const totalWidth = labelWidth + valueWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
  <clipPath id="r"><rect width="${totalWidth}" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#111"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="#222"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11">
    <text x="${labelWidth / 2}" y="14" font-weight="600">${label}</text>
    <text x="${labelWidth + valueWidth / 2}" y="14">${value}</text>
  </g>
</svg>`;
}

// ── CLI ──

if (typeof process !== 'undefined' && process.argv.length > 2) {
  const args = process.argv.slice(2);
  const compositeMode = args.includes('--composite');
  const input = args.filter(a => !a.startsWith('--')).join(' ');

  if (!input) {
    console.error('Usage: node generate-badge.js [--composite] "AIMED/1 I:2 D:4 E:3"');
    process.exit(1);
  }

  try {
    const parsed = AIMED.parse(input);
    const svg = compositeMode
      ? generateCompositeBadge(parsed.aimed.scores)
      : generateDetailedBadge(parsed.aimed.scores);
    console.log(svg);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateDetailedBadge, generateCompositeBadge };
}
