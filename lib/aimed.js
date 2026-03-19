/**
 * AIMED — AI Involvement Marking for Every Document
 * Parser, Validator & Utilities — v1.0.0
 * License: CC0 1.0 Universal (Public Domain)
 */

const AIMED_VERSION = '1';

const CORE_AREAS = {
  I: 'Ideation',
  R: 'Research',
  D: 'Drafting',
  E: 'Editing',
  T: 'Translation',
  V: 'Validation',
  A: 'Analysis',
  G: 'Visual/Design',
  S: 'Strategy',
  X: 'Execution',
};

const INTENSITY_LABELS = {
  0: 'None',
  1: 'Minimal',
  2: 'Light',
  3: 'Moderate',
  4: 'Heavy',
  5: 'Full',
};

// ── Parsing ──────────────────────────────────────────────

/**
 * Parse a compact AIMED notation string.
 * @param {string} input - e.g. "AIMED/1 I:2 D:4 E:3 | tool=claude-4"
 * @returns {object} Structured AIMED declaration
 * @throws {Error} If the input is invalid
 */
function parse(input) {
  const str = input.trim();

  // Match header
  const headerMatch = str.match(/^AIMED\/(\d+)\s+/);
  if (!headerMatch) {
    throw new Error('Invalid AIMED declaration: must start with "AIMED/<version> "');
  }

  const majorVersion = headerMatch[1];
  if (majorVersion !== AIMED_VERSION) {
    throw new Error(`Unsupported AIMED version: ${majorVersion} (this parser supports v${AIMED_VERSION})`);
  }

  const rest = str.slice(headerMatch[0].length);

  // Split on metadata delimiter
  const [scoresPart, metaPart] = rest.split('|').map(s => s.trim());

  // Parse scores
  const scores = {};
  const scorePattern = /([A-Z]|\+[a-z]{2}):([0-5])/g;
  let match;
  while ((match = scorePattern.exec(scoresPart)) !== null) {
    const [, area, score] = match;
    if (scores[area] !== undefined) {
      throw new Error(`Duplicate area code: ${area}`);
    }
    scores[area] = parseInt(score, 10);
  }

  if (Object.keys(scores).length === 0) {
    throw new Error('Invalid AIMED declaration: no valid area-score pairs found');
  }

  // Parse metadata
  const metadata = {};
  if (metaPart) {
    // Handle key=value and key="quoted value" pairs
    const metaPattern = /(\w[\w.]*)\s*=\s*(?:"([^"]*)"|(\S+))/g;
    while ((match = metaPattern.exec(metaPart)) !== null) {
      const [, key, quotedVal, plainVal] = match;
      metadata[key] = quotedVal !== undefined ? quotedVal : plainVal;
    }
  }

  const result = {
    aimed: {
      version: '1.0',
      scores,
    },
  };

  if (Object.keys(metadata).length > 0) {
    // Extract custom area definitions
    const customAreas = {};
    for (const [key, value] of Object.entries(metadata)) {
      if (key.startsWith('custom.')) {
        const code = '+' + key.slice(7);
        customAreas[code] = value;
        delete metadata[key];
      }
    }
    if (Object.keys(customAreas).length > 0) {
      metadata.custom_areas = customAreas;
    }
    result.aimed.metadata = metadata;
  }

  return result;
}

// ── Serialization ────────────────────────────────────────

/**
 * Convert a structured AIMED declaration to compact notation.
 * @param {object} declaration - Structured AIMED object
 * @returns {string} Compact notation string
 */
function toCompact(declaration) {
  const { aimed } = declaration;
  if (!aimed || !aimed.scores) {
    throw new Error('Invalid declaration: missing aimed.scores');
  }

  const parts = [`AIMED/${AIMED_VERSION}`];

  // Sort areas: core alphabetical first, then custom alphabetical
  const sortedAreas = Object.keys(aimed.scores).sort((a, b) => {
    const aCustom = a.startsWith('+');
    const bCustom = b.startsWith('+');
    if (aCustom !== bCustom) return aCustom ? 1 : -1;
    return a.localeCompare(b);
  });

  for (const area of sortedAreas) {
    parts.push(`${area}:${aimed.scores[area]}`);
  }

  let result = parts.join(' ');

  // Add metadata
  if (aimed.metadata) {
    const metaPairs = [];
    for (const [key, value] of Object.entries(aimed.metadata)) {
      if (key === 'custom_areas') {
        for (const [code, name] of Object.entries(value)) {
          metaPairs.push(`custom.${code.slice(1)}="${name}"`);
        }
      } else if (typeof value === 'string' && value.includes(' ')) {
        metaPairs.push(`${key}="${value}"`);
      } else {
        metaPairs.push(`${key}=${value}`);
      }
    }
    if (metaPairs.length > 0) {
      result += ' | ' + metaPairs.join(' ');
    }
  }

  return result;
}

/**
 * Convert to JSON structured notation.
 * @param {object} declaration
 * @returns {string} Pretty-printed JSON
 */
function toJSON(declaration) {
  return JSON.stringify(declaration, null, 2);
}

/**
 * Convert to YAML structured notation.
 * @param {object} declaration
 * @returns {string} YAML string
 */
function toYAML(declaration) {
  const { aimed } = declaration;
  let yaml = 'aimed:\n';
  yaml += `  version: "${aimed.version}"\n`;
  yaml += '  scores:\n';
  for (const [area, score] of Object.entries(aimed.scores)) {
    yaml += `    ${area}: ${score}\n`;
  }
  if (aimed.metadata) {
    yaml += '  metadata:\n';
    for (const [key, value] of Object.entries(aimed.metadata)) {
      if (typeof value === 'object') {
        yaml += `    ${key}:\n`;
        for (const [k, v] of Object.entries(value)) {
          yaml += `      ${k}: "${v}"\n`;
        }
      } else {
        yaml += `    ${key}: ${typeof value === 'string' ? `"${value}"` : value}\n`;
      }
    }
  }
  return yaml;
}

// ── Validation ───────────────────────────────────────────

/**
 * Validate a structured AIMED declaration.
 * @param {object} declaration
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validate(declaration) {
  const errors = [];

  if (!declaration || !declaration.aimed) {
    return { valid: false, errors: ['Missing root "aimed" property'] };
  }

  const { aimed } = declaration;

  // Check version
  if (!aimed.version) {
    errors.push('Missing "version" property');
  } else if (!/^1\.\d+$/.test(aimed.version)) {
    errors.push(`Invalid version format: "${aimed.version}" (expected "1.x")`);
  }

  // Check scores
  if (!aimed.scores || typeof aimed.scores !== 'object') {
    errors.push('Missing or invalid "scores" property');
  } else {
    const scoreKeys = Object.keys(aimed.scores);
    if (scoreKeys.length === 0) {
      errors.push('Scores must contain at least one area-score pair');
    }

    for (const [area, score] of Object.entries(aimed.scores)) {
      // Validate area code
      const isCoreArea = /^[A-Z]$/.test(area);
      const isCustomArea = /^\+[a-z]{2}$/.test(area);

      if (!isCoreArea && !isCustomArea) {
        errors.push(`Invalid area code: "${area}"`);
      }

      if (isCoreArea && !CORE_AREAS[area]) {
        errors.push(`Unknown core area code: "${area}" (valid: ${Object.keys(CORE_AREAS).join(', ')})`);
      }

      if (isCustomArea) {
        // Check if custom area is declared in metadata
        const customDefined =
          aimed.metadata?.custom_areas && aimed.metadata.custom_areas[area];
        if (!customDefined) {
          errors.push(`Custom area "${area}" used but not declared in metadata.custom_areas`);
        }
      }

      // Validate score
      if (!Number.isInteger(score) || score < 0 || score > 5) {
        errors.push(`Invalid score for "${area}": ${score} (must be integer 0-5)`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

// ── Utilities ────────────────────────────────────────────

/**
 * Calculate the composite score (0-100).
 * @param {object} scores - Area-score map
 * @returns {number} Composite percentage
 */
function compositeScore(scores) {
  const entries = Object.entries(scores).filter(([, v]) => v > 0);
  if (entries.length === 0) return 0;
  const sum = entries.reduce((acc, [, v]) => acc + v, 0);
  return Math.round((sum / (entries.length * 5)) * 100);
}

/**
 * Get human-readable label for a score.
 * @param {number} score
 * @returns {string}
 */
function intensityLabel(score) {
  return INTENSITY_LABELS[score] || 'Unknown';
}

/**
 * Get human-readable name for an area code.
 * @param {string} code
 * @param {object} [customAreas] - Custom area definitions
 * @returns {string}
 */
function areaName(code, customAreas = {}) {
  if (CORE_AREAS[code]) return CORE_AREAS[code];
  if (customAreas[code]) return customAreas[code];
  return code;
}

/**
 * Generate an HTML comment embedding.
 * @param {string} compact - Compact notation string
 * @returns {string}
 */
function toHTMLComment(compact) {
  return `<!-- ${compact} -->`;
}

/**
 * Generate an HTML meta tag.
 * @param {string} compact
 * @returns {string}
 */
function toMetaTag(compact) {
  return `<meta name="aimed" content="${compact.replace(/"/g, '&quot;')}">`;
}

/**
 * Generate a code comment for a given language.
 * @param {string} compact
 * @param {string} language - 'js', 'python', 'css', 'html', 'php', 'ruby', 'java', 'c', 'bash'
 * @returns {string}
 */
function toCodeComment(compact, language = 'js') {
  const commentStyles = {
    js: `// ${compact}`,
    javascript: `// ${compact}`,
    typescript: `// ${compact}`,
    python: `# ${compact}`,
    ruby: `# ${compact}`,
    bash: `# ${compact}`,
    php: `// ${compact}`,
    java: `// ${compact}`,
    c: `// ${compact}`,
    cpp: `// ${compact}`,
    css: `/* ${compact} */`,
    html: `<!-- ${compact} -->`,
    sql: `-- ${compact}`,
    lua: `-- ${compact}`,
  };
  return commentStyles[language.toLowerCase()] || `// ${compact}`;
}

/**
 * Generate Markdown frontmatter entry.
 * @param {string} compact
 * @returns {string}
 */
function toFrontmatter(compact) {
  return `aimed: "${compact}"`;
}

/**
 * Extract AIMED declaration from a string of content.
 * Searches for compact notation in comments, meta tags, frontmatter, etc.
 * @param {string} content
 * @returns {object|null} Parsed declaration or null if not found
 */
function extract(content) {
  // Try patterns in order of specificity
  const patterns = [
    // HTML meta tag
    /<meta\s+name="aimed"\s+content="([^"]+)">/i,
    // YAML frontmatter
    /aimed:\s*"([^"]+)"/,
    // HTML comment
    /<!--\s*(AIMED\/\d+[^-]+?)\s*-->/,
    // Line comment (// or #)
    /(?:\/\/|#)\s*(AIMED\/\d+.+?)$/m,
    // Block comment
    /\/\*\s*(AIMED\/\d+.+?)\s*\*\//,
    // SQL/Lua comment
    /--\s*(AIMED\/\d+.+?)$/m,
    // Bare (standalone line)
    /^(AIMED\/\d+.+?)$/m,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      try {
        return parse(match[1].trim());
      } catch {
        continue;
      }
    }
  }

  return null;
}

// ── Exports ──────────────────────────────────────────────

const AIMED = {
  CORE_AREAS,
  INTENSITY_LABELS,
  parse,
  toCompact,
  toJSON,
  toYAML,
  validate,
  compositeScore,
  intensityLabel,
  areaName,
  toHTMLComment,
  toMetaTag,
  toCodeComment,
  toFrontmatter,
  extract,
};

// Support both ESM and CJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIMED;
}
if (typeof window !== 'undefined') {
  window.AIMED = AIMED;
}

// AIMED/1 S:3 D:4 E:2 | tool=claude-opus-4
