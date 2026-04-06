import { openai } from '@ai-sdk/openai';
import { generateText, Output } from 'ai';
import { NextRequest } from 'next/server';
import { AnalysisSchema } from '@/lib/analysisSchema';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
    const { summary, lastSessions, upcomingSessions } = await req.json();

    const prompt = `You are a personal pull-up strength coach analyzing an athlete's performance data.

Program progress: ${summary.totalCompleted}/${summary.totalInProgram} sessions completed.
Goal: Increase unassisted pull-up reps over a 10-week program. The program also includes lower body, core, and accessory work — analyse all of it.

## Last 10 Completed Sessions (actual logged performance, chronological)
${lastSessions ? JSON.stringify(lastSessions, null, 2) : 'No sessions completed yet'}

## Next 10 Upcoming Sessions (not yet completed, these can receive program updates)
${upcomingSessions && upcomingSessions.length > 0 ? JSON.stringify(upcomingSessions, null, 2) : 'Program is complete'}

## Full Performance Trend — all exercises, chronological (avgReps = actual average per set vs programTarget, avgWeight = kg)
${JSON.stringify(summary.performanceTrend, null, 2)}

Based on this data:
1. Write a coaching response referencing the actual numbers from the recent sessions
2. Suggest specific program adjustments for the UPCOMING (not completed) sessions if the athlete is clearly over- or under-performing vs targets across multiple sessions
3. Only suggest updates if evidence across sessions clearly warrants it — do not change for one-off sessions
4. Explain your reasoning for any changes or for keeping the program as-is`;

    const result = await generateText({
          model: openai('gpt-5.4'),
        output: Output.object({ schema: AnalysisSchema }),
        prompt,
        maxRetries: 2,
    });

    return Response.json(result.output);
}
