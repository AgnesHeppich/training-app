import { neon } from '@neondatabase/serverless';
import { PROGRAM } from '@/data/program';
import { PUSHUP_PROGRAM, PUSHUP_PROGRAM_NAME, PUSHUP_PROGRAM_DESCRIPTION } from '@/data/program-pushup';
import type { WorkoutDay } from '@/data/program';

export const sql = neon(process.env.DATABASE_URL!);

let initPromise: Promise<void> | null = null;

export function initDb(): Promise<void> {
    if (!initPromise) {
        initPromise = (async () => {
            await createCoreTables();
            await runMigrations();
            // Seeding is best-effort — don't let it break the app
            await seedPrograms().catch(e => console.error('Seed error (non-fatal):', e));
        })().catch(e => {
            initPromise = null; // Allow retry on critical failure
            throw e;
        });
    }
    return initPromise;
}

async function createCoreTables() {
    await sql`
        CREATE TABLE IF NOT EXISTS programs (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            is_active BOOLEAN DEFAULT FALSE,
            created_by TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `;
    // Add created_by if this is an existing programs table without it
    await sql`ALTER TABLE programs ADD COLUMN IF NOT EXISTS created_by TEXT`;

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
}

async function runMigrations() {
    // Detect old single-user schema: workout_history existed but had no program_id.
    // If program_id column is missing, drop the old tables and recreate.
    const hasProgramId = await sql`
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'workout_history' AND column_name = 'program_id'
        LIMIT 1
    `;

    if (hasProgramId.length === 0) {
        await sql`DROP TABLE IF EXISTS workout_history CASCADE`;
        await sql`DROP TABLE IF EXISTS program_overrides CASCADE`;
        await sql`DROP TABLE IF EXISTS user_programs CASCADE`;
    }

    await sql`
        CREATE TABLE IF NOT EXISTS workout_history (
            id                 SERIAL PRIMARY KEY,
            user_id            TEXT NOT NULL,
            program_id         INTEGER NOT NULL REFERENCES programs(id),
            completed_workouts JSONB DEFAULT '[]',
            logs               JSONB DEFAULT '{}',
            notes              JSONB DEFAULT '{}',
            updated_at         TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(user_id, program_id)
        )
    `;
    await sql`
        CREATE TABLE IF NOT EXISTS program_overrides (
            id         SERIAL PRIMARY KEY,
            user_id    TEXT NOT NULL,
            program_id INTEGER NOT NULL REFERENCES programs(id),
            overrides  JSONB DEFAULT '{}',
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(user_id, program_id)
        )
    `;
    await sql`
        CREATE TABLE IF NOT EXISTS user_program_enrollments (
            id           SERIAL PRIMARY KEY,
            user_id      TEXT NOT NULL,
            program_id   INTEGER NOT NULL REFERENCES programs(id),
            status       TEXT NOT NULL DEFAULT 'active',
            started_at   TIMESTAMPTZ DEFAULT NOW(),
            completed_at TIMESTAMPTZ,
            UNIQUE(user_id, program_id)
        )
    `;
}

async function seedPrograms() {
    const pullupExists = await sql`SELECT id FROM programs WHERE name = 'Pull-Up Mastery' LIMIT 1`;
    if (pullupExists.length === 0) {
        await seedProgramData('Pull-Up Mastery', '10-week progressive pull-up program', true, PROGRAM);
    }

    const pushupExists = await sql`SELECT id FROM programs WHERE name = ${PUSHUP_PROGRAM_NAME} LIMIT 1`;
    if (pushupExists.length === 0) {
        await seedProgramData(PUSHUP_PROGRAM_NAME, PUSHUP_PROGRAM_DESCRIPTION, false, PUSHUP_PROGRAM);
    }
}

async function seedProgramData(name: string, description: string, isActive: boolean, days: WorkoutDay[]) {
    const [program] = await sql`
        INSERT INTO programs (name, description, is_active)
        VALUES (${name}, ${description}, ${isActive})
        RETURNING id
    `;
    const programId = program.id;

    // Batch-insert all workout days in a single HTTP round-trip
    const dayQueries = days.map((day, i) =>
        sql`INSERT INTO workout_days (program_id, slug, week, day_label, title, focus, sort_order)
            VALUES (${programId}, ${day.id}, ${day.week}, ${day.dayLabel}, ${day.title}, ${day.focus}, ${i})
            RETURNING id`
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dayResults: any[] = await sql.transaction(dayQueries);

    // Batch-insert all exercises in a single HTTP round-trip
    const exerciseQueries = days.flatMap((day, i) => {
        const dayId = dayResults[i][0].id;
        return day.exercises.map((ex, j) =>
            sql`INSERT INTO exercises (workout_day_id, name, sets, reps, note, is_warmup, sort_order)
                VALUES (${dayId}, ${ex.name}, ${ex.sets}, ${ex.reps}, ${ex.note ?? null}, ${ex.isWarmup ?? false}, ${j})`
        );
    });
    await sql.transaction(exerciseQueries);
}
