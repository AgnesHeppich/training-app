import { z } from 'zod';

export const ProgramUpdateSchema = z.object({
    workoutId: z.string().describe('The workout day ID from the program (e.g. "w3-d4")'),
    exerciseName: z.string().describe('Exact exercise name as it appears in the program'),
    field: z.enum(['reps', 'sets']).describe('Which field to update'),
    currentValue: z.string().describe('Current value of the field'),
    suggestedValue: z.string().describe('Suggested new value'),
});

export const AnalysisSchema = z.object({
    coachingResponse: z
        .string()
        .describe('Personalized coaching feedback based on actual performance numbers, under 200 words'),
    programUpdates: z
        .array(ProgramUpdateSchema)
        .describe(
            'Suggested adjustments to UPCOMING (not yet completed) workouts based on performance. Only suggest changes if there is clear evidence from multiple sessions that the athlete is significantly over- or under-performing. Leave empty if no changes are warranted.'
        ),
    updateReasons: z
        .string()
        .describe(
            'Concise explanation of why these program updates are recommended, or why no changes were made. Reference specific performance numbers.'
        ),
});

export type ProgramUpdate = z.infer<typeof ProgramUpdateSchema>;
export type AnalysisResult = z.infer<typeof AnalysisSchema>;
