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

const CARDIO_NAME_KEYWORDS = [
    'run', 'sprint', 'jog', 'interval', 'cardio', 'cycling', 'bike',
    'row', 'rowing', 'swim', 'treadmill', 'elliptical', 'stair', 'walk',
];

export function isCardioExercise(name: string, reps?: string): boolean {
    const lower = name.toLowerCase();
    if (CARDIO_NAME_KEYWORDS.some(kw => lower.includes(kw))) return true;
    // Distance/time patterns in the name
    if (/\d+\s*(m|km|k|mile|min|sec)\b/.test(lower)) return true;
    // Time-based reps target
    if (reps) {
        const r = reps.toLowerCase();
        if (/\d+\s*(min|minutes|sec|seconds|km|mile|m\b)/.test(r)) return true;
    }
    return false;
}
