# AIMED/1 S:2 D:5 E:3 V:4 | tool=claude-code note="AI generated from spec; human reviewed logic and edge cases"

"""
CSV Data Cleaner
Reads a CSV file, normalizes columns, removes duplicates, and outputs clean data.
"""

import csv
import sys
from pathlib import Path


def normalize_header(header: str) -> str:
    """Convert header to snake_case."""
    return header.strip().lower().replace(" ", "_").replace("-", "_")


def clean_row(row: dict) -> dict:
    """Strip whitespace from all values, normalize empty strings to None."""
    return {
        k: v.strip() if v and v.strip() else None
        for k, v in row.items()
    }


def deduplicate(rows: list[dict], key_field: str) -> list[dict]:
    """Remove duplicate rows based on a key field."""
    seen = set()
    unique = []
    for row in rows:
        key = row.get(key_field)
        if key and key not in seen:
            seen.add(key)
            unique.append(row)
    return unique


def process_csv(input_path: str, output_path: str, dedup_key: str = None):
    """Main processing pipeline."""
    path = Path(input_path)
    if not path.exists():
        print(f"Error: {input_path} not found")
        sys.exit(1)

    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        original_headers = reader.fieldnames
        normalized_headers = [normalize_header(h) for h in original_headers]

        rows = []
        for row in reader:
            normalized_row = {
                normalize_header(k): v for k, v in row.items()
            }
            rows.append(clean_row(normalized_row))

    if dedup_key:
        dedup_key = normalize_header(dedup_key)
        before = len(rows)
        rows = deduplicate(rows, dedup_key)
        print(f"Removed {before - len(rows)} duplicates (key: {dedup_key})")

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=normalized_headers)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Processed {len(rows)} rows → {output_path}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python clean_csv.py <input.csv> <output.csv> [dedup_key]")
        sys.exit(1)

    process_csv(
        sys.argv[1],
        sys.argv[2],
        sys.argv[3] if len(sys.argv) > 3 else None,
    )
