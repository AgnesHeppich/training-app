import { neon } from '@neondatabase/serverless';
import { PROGRAM } from '@/data/program';

export const sql = neon(process.env.DATABASE_URL!);

let initPromise: Promise<void> | null = null;

export function initDb(): Promise<void> {
    if (!initPromise) {
        initPromise = (async () => {
            await sql`
                CREATE TABLE IF NOT EXISTS workout_history (
                    user_id TEXT PRIMARY KEY,
                    completed_workouts JSONB DEFAULT '[]',
                    logs JSONB DEFAULT '{}',
                    notes JSONB DEFAULT '{}',
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                )
            `;
            await sql`
                CREATE TABLE IF NOT EXISTS program_overrides (
                    user_id TEXT PRIMARY KEY,
                    overrides JSONB DEFAULT '{}',
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                )
            `;
            // Migration: support old tables that had integer id=1 primary key
            await sql`ALTER TABLE workout_history ADD COLUMN IF NOT EXISTS user_id TEXT`;
            await sql`ALTER TABLE program_overrides ADD COLUMN IF NOT EXISTS user_id TEXT`;
            await sql`CREATE UNIQUE INDEX IF NOT EXISTS uq_workout_history_user_id ON workout_history(user_id)`;
            await sql`CREATE UNIQUE INDEX IF NOT EXISTS uq_program_overrides_user_id ON program_overrides(user_id)`;
            await sql`
                CREATE TABLE IF NOT EXISTS programs (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT,
                    is_active BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMPTZ DEFAULT NOW()
                )
            `;
            await sql`
                CREATE TABLE IF NOT EXISTS workout_days (
                    id SERIAL PRIMARY KEY,
                    program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
                    slug TEXT NOT NULL,
                    week INTEGER NOT NULL,
                    day_label TEXT NOT NULL,
                    title TEXT NOT NULL,
                    focus TEXT NOT NULL,
                    sort_order INTEGER NOT NULL,
                    UNIQUE (program_id, slug)
                )
            `;
            await sql`
                CREATE TABLE IF NOT EXISTS exercises (
                    id SERIAL PRIMARY KEY,
                    workout_day_id INTEGER NOT NULL REFERENCES workout_days(id) ON DELETE CASCADE,
                    name TEXT NOT NULL,
                    sets INTEGER NOT NULL,
                    reps TEXT NOT NULL,
                    note TEXT,
                    is_warmup BOOLEAN DEFAULT FALSE,
                    sort_order INTEGER NOT NULL
                )
            `;
            await seedProgram();
        })();
    }
    return initPromise;
}

async function seedProgram() {
    const existing = await sql`SELECT id FROM programs LIMIT 1`;
    if (existing.length > 0) return;

    const [program] = await sql`
        INSERT INTO programs (name, description, is_active)
        VALUES ('Pull-Up Mastery', '10-week progressive pull-up program', TRUE)
        RETURNING id
    `;
    const programId = program.id;

    for (let i = 0; i < PROGRAM.length; i++) {
        const day = PROGRAM[i];
        const [insertedDay] = await sql`
            INSERT INTO workout_days (program_id, slug, week, day_label, title, focus, sort_order)
            VALUES (${programId}, ${day.id}, ${day.week}, ${day.dayLabel}, ${day.title}, ${day.focus}, ${i})
            RETURNING id
        `;
        const dayId = insertedDay.id;

        for (let j = 0; j < day.exercises.length; j++) {
            const ex = day.exercises[j];
            await sql`
                INSERT INTO exercises (workout_day_id, name, sets, reps, note, is_warmup, sort_order)
                VALUES (${dayId}, ${ex.name}, ${ex.sets}, ${ex.reps}, ${ex.note ?? null}, ${ex.isWarmup ?? false}, ${j})
            `;
        }
    }
}
