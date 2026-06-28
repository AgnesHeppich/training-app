import { z } from 'zod';

export const GeneratedProgramSchema = z.object({
    name: z.string(),
    description: z.string().describe('Brief program summary, at most two sentences'),
    workouts: z.array(z.object({
        week: z.number(),
        dayLabel: z.string(),
        title: z.string(),
        focus: z.string(),
        exercises: z.array(z.object({
            name: z.string(),
            sets: z.number(),
            reps: z.string(),
            note: z.string().nullable(),
            isWarmup: z.boolean(),
        })),
    })),
});

export type GeneratedProgram = z.infer<typeof GeneratedProgramSchema>;
