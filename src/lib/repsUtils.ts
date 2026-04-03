/**
 * Parse a program target reps string to a number.
 * Handles "4" → 4, "2-3" → 2 (lower bound), "max" → null, "45s" → null.
 */
export function parseRepTarget(reps: string): number | null {
    const match = reps.trim().match(/^(\d+)(?:-\d+)?$/);
    if (!match) return null;
    return parseInt(match[1], 10);
}

const PULLUP_KEYWORDS = ['pull-up', 'chin-up', 'negative', 'pullup'];

export function isPullUpExercise(name: string): boolean {
    const lower = name.toLowerCase();
    return PULLUP_KEYWORDS.some(kw => lower.includes(kw));
}
