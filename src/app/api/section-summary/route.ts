import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextRequest } from 'next/server';

export const maxDuration = 30;

type ExercisePayload = {
    name: string;
    sets: number;
    targetReps: string;
    actualLogs: { weight: string; reps: string }[];
    exerciseNote?: string;
    previousLogs?: { weight: string; reps: string }[];
};

export async function POST(req: NextRequest) {
    const { workoutTitle, workoutFocus, exercises, sessionNote } = await req.json() as {
        workoutTitle: string;
        workoutFocus: string;
        exercises: ExercisePayload[];
        sessionNote?: string;
    };

    const exerciseSummaries = exercises.map((ex) => {
        const setsText = ex.actualLogs.length
            ? ex.actualLogs.map((log, i) => `  Set ${i + 1}: ${log.weight || '—'}kg × ${log.reps || '—'} reps`).join('\n')
            : '  No sets logged';
        const prevText = ex.previousLogs?.length
            ? ex.previousLogs.map((log, i) => `  Set ${i + 1}: ${log.weight || '—'}kg × ${log.reps || '—'} reps`).join('\n')
            : null;

        return [
            `${ex.name} (target: ${ex.sets} sets × ${ex.targetReps} reps)`,
            prevText ? `  Previous:\n${prevText}` : null,
            `  Today:\n${setsText}`,
            ex.exerciseNote ? `  Note: "${ex.exerciseNote}"` : null,
        ].filter(Boolean).join('\n');
    }).join('\n\n');

    const prompt = `You are a personal strength coach reviewing a completed workout session.

Workout: ${workoutTitle}
Focus: ${workoutFocus}
${sessionNote ? `\nAthlete's session note: "${sessionNote}"\n` : ''}
## Exercises
${exerciseSummaries}

Write a coaching summary for the full session (3-5 sentences). Comment on overall performance vs targets, any notable lifts or trends, and address anything the athlete noted. Be specific with numbers, direct, and motivating.`;

    const result = await generateText({
        model: openai('gpt-5.4'),
        prompt,
        maxRetries: 2,
    });

    return Response.json({ summary: result.text });
}
