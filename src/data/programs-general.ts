import type { WorkoutDay } from './program';

// ── Beginner Full Body Strength ──────────────────────────────────────────────

export const BEGINNER_STRENGTH_NAME = 'Beginner Full Body Strength';
export const BEGINNER_STRENGTH_DESCRIPTION =
  '4-week introductory strength program. 3 sessions per week using bodyweight and dumbbells with progressive overload.';

export const BEGINNER_STRENGTH: WorkoutDay[] = [
  // Week 1 – Foundation
  {
    id: 'fbs-w1-d1', week: 1, dayLabel: 'Monday',
    title: 'Squat & Push',
    focus: 'Learn squat and push patterns with perfect form',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', note: 'Light cardio + leg swings + arm circles', isWarmup: true },
      { name: 'Goblet Squat', sets: 3, reps: '12', note: 'Light KB or DB — chest up, knees track toes' },
      { name: 'Push-ups', sets: 3, reps: '8-12', note: 'Full range; use knee push-ups if needed' },
      { name: 'Reverse Lunge', sets: 3, reps: '10/leg', note: 'Controlled descent, knee hovers floor' },
      { name: 'DB Shoulder Press', sets: 3, reps: '12', note: 'Press overhead, elbows at 90° at bottom' },
      { name: 'Glute Bridge', sets: 3, reps: '15', note: 'Squeeze glutes at top, hold 1 sec' },
      { name: 'Cool-down stretch', sets: 1, reps: '5 min', note: 'Hip flexor + quad + chest', isWarmup: true },
    ],
  },
  {
    id: 'fbs-w1-d3', week: 1, dayLabel: 'Wednesday',
    title: 'Hinge & Pull',
    focus: 'Introduce hip hinge and pulling patterns',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', note: 'Cat-cow + hip circles + thoracic rotation', isWarmup: true },
      { name: 'Romanian Deadlift', sets: 3, reps: '12', note: 'Light weight — hinge at hips, bar close to legs' },
      { name: 'DB Row', sets: 3, reps: '12/arm', note: 'Brace core, pull elbow to hip' },
      { name: 'Incline Push-ups', sets: 3, reps: '12', note: 'Hands on bench/table, chest touches surface' },
      { name: 'Resistance Band Row', sets: 3, reps: '15', note: 'Retract shoulder blades, slow lowering' },
      { name: 'Plank', sets: 3, reps: '30s', note: 'Neutral spine, breathe normally' },
      { name: 'Cool-down', sets: 1, reps: '5 min', note: 'Hamstring + chest + child\'s pose', isWarmup: true },
    ],
  },
  {
    id: 'fbs-w1-d5', week: 1, dayLabel: 'Friday',
    title: 'Full Body Circuit',
    focus: 'Combine all patterns and build work capacity',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', note: 'Jumping jacks + dynamic stretches', isWarmup: true },
      { name: 'Squat', sets: 3, reps: '12' },
      { name: 'Push-ups', sets: 3, reps: '10' },
      { name: 'DB Row', sets: 3, reps: '10/arm' },
      { name: 'Walking Lunges', sets: 3, reps: '12 total' },
      { name: 'Dead Bug', sets: 3, reps: '8/side', note: 'Lower back pressed to floor throughout' },
      { name: 'Mountain Climbers', sets: 3, reps: '20 total', note: 'Controlled pace, hips level' },
      { name: 'Cool-down', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },

  // Week 2 – Build
  {
    id: 'fbs-w2-d1', week: 2, dayLabel: 'Monday',
    title: 'Squat & Push — More Volume',
    focus: 'Increase sets and add weight to the squat',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Goblet Squat', sets: 4, reps: '10', note: 'Slightly heavier than week 1' },
      { name: 'Push-ups', sets: 4, reps: '10' },
      { name: 'Bulgarian Split Squat', sets: 3, reps: '8/leg', note: 'Back foot on bench/chair, hold wall for balance' },
      { name: 'DB Shoulder Press', sets: 3, reps: '12' },
      { name: 'Hip Thrust', sets: 3, reps: '15', note: 'Shoulders on bench, full hip extension' },
      { name: 'Cool-down', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'fbs-w2-d3', week: 2, dayLabel: 'Wednesday',
    title: 'Hinge & Pull — More Volume',
    focus: 'Add volume to pulling and hinge movements',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Romanian Deadlift', sets: 4, reps: '10' },
      { name: 'DB Row', sets: 4, reps: '10/arm' },
      { name: 'Bench Dips', sets: 3, reps: '8-10', note: 'Feet on floor, lower to 90°' },
      { name: 'Lat Pulldown or Assisted Pull-up', sets: 3, reps: '12', note: 'Pull to collarbone' },
      { name: 'Side Plank', sets: 3, reps: '20s/side' },
      { name: 'Cool-down', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'fbs-w2-d5', week: 2, dayLabel: 'Friday',
    title: 'Full Body — Level Up',
    focus: 'Increase intensity across all patterns',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Squat', sets: 4, reps: '10' },
      { name: 'Push-ups', sets: 4, reps: '8' },
      { name: 'DB Row', sets: 4, reps: '8/arm' },
      { name: 'Step-ups', sets: 3, reps: '10/leg', note: 'Use a chair/bench, drive through heel' },
      { name: 'Hollow Body Hold', sets: 3, reps: '20s', note: 'Arms overhead, low back on floor' },
      { name: 'Mountain Climbers', sets: 3, reps: '20 total' },
      { name: 'Cool-down', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },

  // Week 3 – Strengthen
  {
    id: 'fbs-w3-d1', week: 3, dayLabel: 'Monday',
    title: 'Squat & Push — Intensity',
    focus: 'Heavier loads and more challenging push variations',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Squat', sets: 4, reps: '8', note: 'More weight than week 2, maintain form' },
      { name: 'Diamond Push-ups', sets: 3, reps: '8', note: 'Hands form a diamond, targets triceps' },
      { name: 'Bulgarian Split Squat', sets: 3, reps: '10/leg' },
      { name: 'DB Overhead Press', sets: 4, reps: '10' },
      { name: 'Romanian Deadlift', sets: 3, reps: '12' },
      { name: 'Cool-down', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'fbs-w3-d3', week: 3, dayLabel: 'Wednesday',
    title: 'Hinge & Pull — Intensity',
    focus: 'Heavier hinge and harder pulling variations',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Deadlift', sets: 4, reps: '8', note: 'Heavier than RDL — keep bar close to shins' },
      { name: 'Renegade Row', sets: 3, reps: '8/arm', note: 'Push-up position, row one arm at a time' },
      { name: 'Push-ups', sets: 4, reps: '10' },
      { name: 'Negative Pull-ups', sets: 3, reps: '5', note: '5-second lower; sub: band pulldown 3x12' },
      { name: 'RKC Plank', sets: 3, reps: '20s', note: 'Squeeze every muscle, create full-body tension' },
      { name: 'Cool-down', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'fbs-w3-d5', week: 3, dayLabel: 'Friday',
    title: 'Full Body — Strength Focus',
    focus: 'Challenge all movement patterns with heavier intent',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Squat', sets: 4, reps: '8' },
      { name: 'Push-ups', sets: 5, reps: '10' },
      { name: 'DB Row', sets: 4, reps: '10/arm' },
      { name: 'Lateral Lunges', sets: 3, reps: '10/leg', note: 'Sit back into the working leg' },
      { name: 'Dead Bug', sets: 3, reps: '10/side' },
      { name: 'Bicycle Crunches', sets: 3, reps: '15/side', note: 'Slow and controlled' },
      { name: 'Cool-down', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },

  // Week 4 – Deload & Test
  {
    id: 'fbs-w4-d1', week: 4, dayLabel: 'Monday',
    title: 'Test Day',
    focus: 'Assess progress with lower volume and one max test',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Squat', sets: 3, reps: '10', note: 'Comfortable weight to assess form improvement' },
      { name: 'Push-up Max Test', sets: 1, reps: 'Max reps', note: 'Record your number — compare to start' },
      { name: 'DB Row', sets: 3, reps: '10/arm' },
      { name: 'DB Overhead Press', sets: 3, reps: '10' },
      { name: 'Glute Bridge', sets: 3, reps: '15' },
      { name: 'Cool-down', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'fbs-w4-d3', week: 4, dayLabel: 'Wednesday',
    title: 'Active Recovery',
    focus: 'Light movement to flush soreness and restore range of motion',
    exercises: [
      { name: 'Warm-up walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Light Romanian Deadlift', sets: 3, reps: '12', note: '50% of normal weight, feel the movement' },
      { name: 'Band Rows', sets: 3, reps: '15' },
      { name: 'Dead Bug', sets: 3, reps: '8/side' },
      { name: 'Hip 90/90 Stretch', sets: 2, reps: '60s/side', note: 'Relax into the stretch, breathe', isWarmup: true },
      { name: 'Doorframe Chest Stretch', sets: 2, reps: '60s', isWarmup: true },
      { name: 'Cat-Cow', sets: 1, reps: '10 reps', isWarmup: true },
    ],
  },
  {
    id: 'fbs-w4-d5', week: 4, dayLabel: 'Friday',
    title: 'Benchmark Circuit',
    focus: 'Full body circuit to measure fitness gains over 4 weeks',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Full Body Circuit', sets: 3, reps: '10 each', note: 'Squat → Push-up → Row → Lunge — rest 60s between rounds' },
      { name: 'Push-up Max Set', sets: 1, reps: 'Max reps', note: 'Compare to week 4 Monday — note any improvement' },
      { name: 'Plank Max Hold', sets: 1, reps: 'Max time', note: 'Record time — compare to start of program' },
      { name: 'Cool-down', sets: 1, reps: '10 min', note: 'Full body stretch', isWarmup: true },
    ],
  },
];

// ── Couch to 5K ──────────────────────────────────────────────────────────────

export const COUCH_TO_5K_NAME = 'Couch to 5K';
export const COUCH_TO_5K_DESCRIPTION =
  '8-week beginner running program. Start with run/walk intervals and build to running 5K continuously.';

export const COUCH_TO_5K: WorkoutDay[] = [
  // Week 1 – First Steps (run 1 min / walk 2 min)
  {
    id: 'c5k-w1-d2', week: 1, dayLabel: 'Tuesday',
    title: 'First Run',
    focus: 'Get comfortable with running — focus on breathing',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', note: 'Warm up, gradually increase pace', isWarmup: true },
      { name: 'Run/Walk Intervals', sets: 6, reps: '1 min run / 2 min walk', note: 'Easy conversational pace — if you can\'t speak full sentences, slow down' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Calf & Hip Flexor Stretch', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'c5k-w1-d4', week: 1, dayLabel: 'Thursday',
    title: 'Second Run',
    focus: 'Repeat day 1 intervals, focus on steady pace',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Run/Walk Intervals', sets: 6, reps: '1 min run / 2 min walk', note: 'Try to keep the same effort level throughout' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Post-Run Stretch', sets: 1, reps: '5 min', note: 'Quad, hamstring, hip flexor', isWarmup: true },
    ],
  },
  {
    id: 'c5k-w1-d6', week: 1, dayLabel: 'Saturday',
    title: 'Longer Effort',
    focus: 'Push slightly past 6 intervals if feeling good',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Run/Walk Intervals', sets: 7, reps: '1 min run / 2 min walk', note: 'Add an extra round if comfortable — no pressure' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Full Body Stretch', sets: 1, reps: '10 min', note: 'Take extra time on the weekend session', isWarmup: true },
    ],
  },

  // Week 2 – Building (run 2 min / walk 2 min)
  {
    id: 'c5k-w2-d2', week: 2, dayLabel: 'Tuesday',
    title: 'Longer Run Intervals',
    focus: 'Double the run time, maintain easy pace',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Run/Walk Intervals', sets: 5, reps: '2 min run / 2 min walk', note: 'Slightly slower pace is fine — the key is the longer run interval' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Stretch', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'c5k-w2-d4', week: 2, dayLabel: 'Thursday',
    title: 'Consolidate 2-Minute Intervals',
    focus: 'Repeat week 2 day 1 — consistency builds fitness',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Run/Walk Intervals', sets: 5, reps: '2 min run / 2 min walk' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Stretch', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'c5k-w2-d6', week: 2, dayLabel: 'Saturday',
    title: 'Weekend Run',
    focus: 'Match or exceed weekday sessions',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Run/Walk Intervals', sets: 6, reps: '2 min run / 2 min walk', note: 'Extra round this weekend' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Full Body Stretch', sets: 1, reps: '10 min', isWarmup: true },
    ],
  },

  // Week 3 – Progression (run 3 min / walk 90 sec)
  {
    id: 'c5k-w3-d2', week: 3, dayLabel: 'Tuesday',
    title: 'Three-Minute Intervals',
    focus: 'Extend run intervals to 3 minutes with shorter rest',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Run/Walk Intervals', sets: 5, reps: '3 min run / 90 sec walk', note: 'Shorter rest — you\'re building real aerobic fitness now' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Stretch', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'c5k-w3-d4', week: 3, dayLabel: 'Thursday',
    title: 'Mixed Intervals',
    focus: 'Alternate long and short run blocks',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Long Run Intervals', sets: 2, reps: '5 min run / 2 min walk', note: 'Two longer running blocks' },
      { name: 'Short Run Intervals', sets: 3, reps: '2 min run / 1 min walk' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Stretch', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'c5k-w3-d6', week: 3, dayLabel: 'Saturday',
    title: 'Longer Session',
    focus: 'Build duration — longest session so far',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Run/Walk Intervals', sets: 6, reps: '3 min run / 90 sec walk', note: 'Aim for at least 25 minutes total movement' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Full Body Stretch', sets: 1, reps: '10 min', isWarmup: true },
    ],
  },

  // Week 4 – Half Way (run 5 min / walk 2 min)
  {
    id: 'c5k-w4-d2', week: 4, dayLabel: 'Tuesday',
    title: 'Five-Minute Blocks',
    focus: 'Big milestone — 5-minute continuous running',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Run/Walk Intervals', sets: 4, reps: '5 min run / 2 min walk', note: 'Halfway point — pace yourself, 4 more weeks to go' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Stretch', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'c5k-w4-d4', week: 4, dayLabel: 'Thursday',
    title: 'Tempo Effort',
    focus: 'Introduce slightly faster tempo running',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Easy Run', sets: 1, reps: '5 min', note: 'Very easy, just getting the legs moving' },
      { name: 'Tempo Run', sets: 2, reps: '5 min', note: 'Comfortably hard — can speak a few words but not full sentences' },
      { name: 'Easy Run', sets: 1, reps: '5 min', note: 'Cool-down running pace' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Stretch', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'c5k-w4-d6', week: 4, dayLabel: 'Saturday',
    title: 'Long Run',
    focus: 'Longest run yet — 25 minutes of running total',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Run/Walk Intervals', sets: 5, reps: '5 min run / 2 min walk', note: 'Total run time: 25 minutes. Longest running effort so far!' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Full Body Stretch', sets: 1, reps: '10 min', isWarmup: true },
    ],
  },

  // Week 5 – Continuous Running (8-10 min blocks)
  {
    id: 'c5k-w5-d2', week: 5, dayLabel: 'Tuesday',
    title: 'Eight-Minute Intervals',
    focus: 'Extend to 8-minute continuous running blocks',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Run/Walk', sets: 3, reps: '8 min run / 3 min walk', note: 'Keep pace comfortable — hold a conversation' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Stretch', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'c5k-w5-d4', week: 5, dayLabel: 'Thursday',
    title: 'Race Pace Practice',
    focus: 'Find your 5K target pace',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Easy Run', sets: 1, reps: '10 min' },
      { name: 'Race Pace Run', sets: 1, reps: '5 min', note: 'The pace you\'d like to run your 5K at — note how it feels' },
      { name: 'Easy Run', sets: 1, reps: '5 min' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Stretch', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'c5k-w5-d6', week: 5, dayLabel: 'Saturday',
    title: '20-Minute Continuous Run',
    focus: 'First major milestone — run without stopping',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Continuous Run', sets: 1, reps: '20 min', note: 'No walking breaks! Very easy pace. This is a huge milestone.' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Full Body Stretch', sets: 1, reps: '10 min', note: 'Celebrate — you just ran 20 minutes straight!', isWarmup: true },
    ],
  },

  // Week 6 – Building Continuously (20-25 min)
  {
    id: 'c5k-w6-d2', week: 6, dayLabel: 'Tuesday',
    title: 'Interval Sharpening',
    focus: 'Mix tempo and recovery running',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Easy Run', sets: 1, reps: '5 min' },
      { name: 'Tempo Intervals', sets: 4, reps: '2 min tempo / 1 min easy', note: 'Tempo = comfortably hard pace' },
      { name: 'Easy Run', sets: 1, reps: '5 min' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Stretch', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'c5k-w6-d4', week: 6, dayLabel: 'Thursday',
    title: '22-Minute Run',
    focus: 'Extend continuous run by 2 minutes',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Continuous Run', sets: 1, reps: '22 min', note: 'Easy conversational pace throughout' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Stretch', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'c5k-w6-d6', week: 6, dayLabel: 'Saturday',
    title: '25-Minute Run',
    focus: 'Longest continuous run yet — almost at 5K distance',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Continuous Run', sets: 1, reps: '25 min', note: 'Very easy pace — you\'re close to 5K distance' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Full Body Stretch', sets: 1, reps: '10 min', isWarmup: true },
    ],
  },

  // Week 7 – Taper (25-28 min)
  {
    id: 'c5k-w7-d2', week: 7, dayLabel: 'Tuesday',
    title: 'Steady 25',
    focus: 'Solidify 25-minute continuous running',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Continuous Run', sets: 1, reps: '25 min', note: 'Focus on steady breathing and relaxed form' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Stretch', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'c5k-w7-d4', week: 7, dayLabel: 'Thursday',
    title: 'Race Rehearsal',
    focus: 'Practice your race-day strategy at target pace',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Easy Run', sets: 1, reps: '5 min' },
      { name: 'Race Pace Run', sets: 1, reps: '15 min', note: 'Your target 5K pace — practice even splits' },
      { name: 'Easy Run', sets: 1, reps: '5 min' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Stretch', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'c5k-w7-d6', week: 7, dayLabel: 'Saturday',
    title: 'Easy Long Run',
    focus: 'Easy 28-minute run to build confidence before race week',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Continuous Run', sets: 1, reps: '28 min', note: 'Very easy — save legs for race week' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Full Body Stretch', sets: 1, reps: '10 min', isWarmup: true },
    ],
  },

  // Week 8 – Race Week
  {
    id: 'c5k-w8-d2', week: 8, dayLabel: 'Tuesday',
    title: 'Short Shakeout',
    focus: 'Keep legs fresh with an easy short run',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Easy Run', sets: 1, reps: '20 min', note: 'Very easy pace, just keeping legs loose' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Stretch', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'c5k-w8-d4', week: 8, dayLabel: 'Thursday',
    title: 'Race Prep',
    focus: 'Light strides and race-day mindset',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Easy Run', sets: 1, reps: '10 min' },
      { name: 'Strides', sets: 4, reps: '20 sec', note: 'Controlled accelerations — feel quick, don\'t sprint' },
      { name: 'Cool-down Walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Stretch', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'c5k-w8-d6', week: 8, dayLabel: 'Saturday',
    title: '5K Race Day',
    focus: 'Your first 5K — enjoy every step',
    exercises: [
      { name: 'Race Day Warm-up', sets: 1, reps: '10 min', note: 'Brisk walk + easy strides — don\'t stand around', isWarmup: true },
      { name: '5K Run', sets: 1, reps: '3.1 miles / 5K', note: 'Start slightly slower than goal pace — you\'ll thank yourself in mile 2. You\'ve got this!' },
      { name: 'Cool-down Walk', sets: 1, reps: '10 min', note: 'Walk it out — you just ran a 5K!', isWarmup: true },
      { name: 'Full Body Stretch', sets: 1, reps: '10 min', isWarmup: true },
    ],
  },
];

// ── Core & Mobility Flow ─────────────────────────────────────────────────────

export const CORE_MOBILITY_NAME = 'Core & Mobility Flow';
export const CORE_MOBILITY_DESCRIPTION =
  '4-week program combining core stability with yoga-inspired flows and deep stretching. No equipment needed.';

export const CORE_MOBILITY: WorkoutDay[] = [
  // Week 1 – Foundations
  {
    id: 'mob-w1-d1', week: 1, dayLabel: 'Monday',
    title: 'Core Foundations',
    focus: 'Activate deep core stabilisers and establish body awareness',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', note: 'Cat-cow x10 + hip circles x10/side', isWarmup: true },
      { name: 'Dead Bug', sets: 3, reps: '10/side', note: 'Lower back glued to floor, extend opposite arm and leg' },
      { name: 'Plank Hold', sets: 3, reps: '30s', note: 'Neutral spine, brace as if about to take a punch' },
      { name: 'Bird Dog', sets: 3, reps: '10/side', note: 'Slow and controlled, no twisting' },
      { name: 'Glute Bridge', sets: 3, reps: '15' },
      { name: 'Side Plank', sets: 2, reps: '20s/side' },
      { name: 'Supine Spinal Twist', sets: 1, reps: '60s/side', note: 'Let gravity do the work', isWarmup: true },
    ],
  },
  {
    id: 'mob-w1-d3', week: 1, dayLabel: 'Wednesday',
    title: 'Hip Mobility',
    focus: 'Open hips and release tension from the hip joint complex',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', note: 'Leg swings (front/back + side) x10/direction', isWarmup: true },
      { name: 'Hip 90/90 Hold', sets: 2, reps: '60s/side', note: 'Both legs at 90°, sit tall, breathe into tight spots', isWarmup: true },
      { name: 'Pigeon Pose', sets: 2, reps: '90s/side', note: 'Front shin parallel, let hip relax toward floor', isWarmup: true },
      { name: 'Lizard Pose', sets: 2, reps: '60s/side', note: 'Deep lunge, back knee down, chest open', isWarmup: true },
      { name: 'Standing Hip CARs', sets: 2, reps: '5/side', note: 'Slow controlled articular rotations of the hip joint' },
      { name: 'Figure-4 Stretch', sets: 2, reps: '60s/side', note: 'Lying on back, cross ankle over knee, pull gently', isWarmup: true },
      { name: 'Happy Baby', sets: 1, reps: '60s', note: 'Relax and breathe', isWarmup: true },
    ],
  },
  {
    id: 'mob-w1-d5', week: 1, dayLabel: 'Friday',
    title: 'Full Body Flexibility Flow',
    focus: 'Head-to-toe flexibility sequence',
    exercises: [
      { name: 'Warm-up walk', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Standing Forward Fold', sets: 1, reps: '60s', note: 'Soft knees, let head hang heavy', isWarmup: true },
      { name: 'Low Lunge', sets: 2, reps: '60s/side', isWarmup: true },
      { name: 'Downward Dog', sets: 3, reps: '30s', note: 'Press heels toward floor, long spine', isWarmup: true },
      { name: 'Seated Hamstring Stretch', sets: 2, reps: '60s/side', isWarmup: true },
      { name: 'Thread the Needle', sets: 2, reps: '60s/side', note: 'Upper back rotation opener', isWarmup: true },
      { name: 'Child\'s Pose', sets: 1, reps: '2 min', isWarmup: true },
      { name: 'Savasana', sets: 1, reps: '5 min', note: 'Total relaxation — don\'t skip this', isWarmup: true },
    ],
  },

  // Week 2 – Building Range
  {
    id: 'mob-w2-d1', week: 2, dayLabel: 'Monday',
    title: 'Dynamic Core',
    focus: 'Core strength through full range of motion',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', note: 'Cat-cow + sun breaths', isWarmup: true },
      { name: 'Dead Bug with Hold', sets: 3, reps: '8/side', note: 'Pause 2 sec at full extension' },
      { name: 'Hollow Body Hold', sets: 3, reps: '20-30s', note: 'Arms overhead, low back pressed flat' },
      { name: 'Plank with Reach', sets: 3, reps: '10 total', note: 'Hold plank, slowly reach one arm forward at a time' },
      { name: 'Mountain Climbers', sets: 3, reps: '20 slow', note: 'Deliberate pace, full hip extension at the back' },
      { name: 'Copenhagen Plank', sets: 2, reps: '15s/side', note: 'Side plank with top leg elevated on a surface' },
      { name: 'Spinal Twist Flow', sets: 1, reps: '60s/side', isWarmup: true },
    ],
  },
  {
    id: 'mob-w2-d3', week: 2, dayLabel: 'Wednesday',
    title: 'Thoracic & Shoulder Mobility',
    focus: 'Upper back and shoulder joint range of motion',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', note: 'Arm circles + neck rolls', isWarmup: true },
      { name: 'Cat-Cow', sets: 2, reps: '10 reps', isWarmup: true },
      { name: 'Thread the Needle', sets: 3, reps: '10/side + hold 30s' },
      { name: 'Thoracic Extension on Roller', sets: 2, reps: '60s', note: 'Roll from lower thoracic to upper, pause on tight spots' },
      { name: 'Wall Slides', sets: 3, reps: '12', note: 'Arms on wall, slide up maintaining full contact' },
      { name: 'Shoulder CARs', sets: 2, reps: '5/side', note: 'Slow full rotation of the shoulder joint' },
      { name: 'Doorframe Chest Stretch', sets: 2, reps: '60s', isWarmup: true },
      { name: 'Neck Release Stretch', sets: 1, reps: '30s/side', isWarmup: true },
    ],
  },
  {
    id: 'mob-w2-d5', week: 2, dayLabel: 'Friday',
    title: 'Yoga-Inspired Flow',
    focus: 'Sun salutation sequence linking breath with movement',
    exercises: [
      { name: 'Breathing warm-up', sets: 1, reps: '5 min', note: '4-count inhale / 4-count exhale, seated', isWarmup: true },
      { name: 'Sun Salutation A', sets: 5, reps: '1 round each', note: 'Mountain → Forward Fold → Plank → Cobra → Down Dog → repeat. Slow pace.' },
      { name: 'Warrior I', sets: 2, reps: '45s/side' },
      { name: 'Warrior II', sets: 2, reps: '45s/side' },
      { name: 'Triangle Pose', sets: 2, reps: '45s/side' },
      { name: 'Seated Forward Fold', sets: 1, reps: '2 min', isWarmup: true },
      { name: 'Supine Spinal Twist', sets: 1, reps: '90s/side', isWarmup: true },
      { name: 'Savasana', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },

  // Week 3 – Strength in Length
  {
    id: 'mob-w3-d1', week: 3, dayLabel: 'Monday',
    title: 'Pilates Core',
    focus: 'Controlled Pilates-inspired movements for deep core strength',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Hundred', sets: 1, reps: '100 pulses', note: 'Legs at table top or extended, pump arms, breathe 5 in / 5 out' },
      { name: 'Roll-up', sets: 3, reps: '8', note: 'Slow articulated spine — use strap around feet if needed' },
      { name: 'Single Leg Stretch', sets: 3, reps: '10/side' },
      { name: 'Double Leg Stretch', sets: 3, reps: '10' },
      { name: 'Scissor Kicks', sets: 3, reps: '10/side', note: 'Low back stays flat against the floor' },
      { name: 'Swimming', sets: 3, reps: '20 total', note: 'Opposite arm/leg, flutter-kick tempo' },
      { name: 'Child\'s Pose', sets: 1, reps: '2 min', isWarmup: true },
    ],
  },
  {
    id: 'mob-w3-d3', week: 3, dayLabel: 'Wednesday',
    title: 'Deep Hip & Hamstring',
    focus: 'Intensive lower body flexibility session',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', note: 'Leg swings + sumo squat holds', isWarmup: true },
      { name: 'Sumo Squat Hold', sets: 3, reps: '60s', note: 'Hands on knees, elbows press out, chest tall' },
      { name: 'Pigeon Pose', sets: 2, reps: '2 min/side', note: 'Longer hold this week — breathe through the intensity' },
      { name: 'Lizard with Twist', sets: 2, reps: '60s/side', note: 'From lizard, rotate open reaching arm to sky' },
      { name: 'Standing Hamstring Stretch', sets: 2, reps: '60s/side', note: 'Foot on surface at hip height, fold toward foot' },
      { name: 'Frog Pose', sets: 1, reps: '2 min', note: 'Knees wide, on forearms, send hips back slowly' },
      { name: 'Happy Baby', sets: 1, reps: '2 min', isWarmup: true },
    ],
  },
  {
    id: 'mob-w3-d5', week: 3, dayLabel: 'Friday',
    title: 'Strength Flow',
    focus: 'Yoga poses requiring strength endurance',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Sun Salutation B', sets: 3, reps: '1 round each', note: 'Adds Warrior I to each side' },
      { name: 'Chair Pose', sets: 3, reps: '45s', note: 'Deep squat, arms overhead, chest up' },
      { name: 'Warrior III', sets: 2, reps: '30s/side', note: 'Balance on one leg, arms forward or at hips' },
      { name: 'Boat Pose', sets: 3, reps: '30s', note: 'V-shape, legs extended or bent' },
      { name: 'Crow Pose Prep', sets: 3, reps: '10 attempts', note: 'Squat, hands on floor, lean weight forward — no lift required' },
      { name: 'Savasana', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },

  // Week 4 – Integration
  {
    id: 'mob-w4-d1', week: 4, dayLabel: 'Monday',
    title: 'Power Core',
    focus: 'Challenge core with dynamic and isometric movements',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Plank to Pike', sets: 3, reps: '12', note: 'From plank, send hips up into pike/down dog, return' },
      { name: 'L-Sit Hold', sets: 3, reps: '15s', note: 'Hands on floor, lift hips — harder than it looks' },
      { name: 'Ab Wheel Rollout', sets: 3, reps: '8-10', note: 'Sub: hands-and-knees rollout — don\'t let lower back collapse' },
      { name: 'Side Plank Hip Dip', sets: 3, reps: '15/side' },
      { name: 'Lying Leg Raise', sets: 3, reps: '15', note: 'Lower back stays down, lower legs slowly' },
      { name: 'Cool-down', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'mob-w4-d3', week: 4, dayLabel: 'Wednesday',
    title: 'Mobility Assessment',
    focus: 'Test your range of motion improvement over 4 weeks',
    exercises: [
      { name: 'Warm-up', sets: 1, reps: '5 min', isWarmup: true },
      { name: 'Deep Squat Hold', sets: 1, reps: '2 min', note: 'How deep can you go? Note if heels stay down' },
      { name: 'Toe Touch / Forward Fold', sets: 1, reps: '60s', note: 'Can you touch the floor? Compare to week 1' },
      { name: 'Hip 90/90 Assessment', sets: 2, reps: '90s/side', note: 'Note how low your back knee gets to the floor in front' },
      { name: 'Shoulder Overhead Circles', sets: 1, reps: '10 each direction', note: 'Do shoulders round or compensate?' },
      { name: 'Thoracic Rotation', sets: 2, reps: '60s/side', note: 'Seated, rotate fully — note any asymmetry' },
      { name: 'Pigeon Pose', sets: 1, reps: '2 min/side', isWarmup: true },
      { name: 'Savasana', sets: 1, reps: '5 min', isWarmup: true },
    ],
  },
  {
    id: 'mob-w4-d5', week: 4, dayLabel: 'Friday',
    title: 'Restorative Yin',
    focus: 'Extended holds for deep fascial release — program finale',
    exercises: [
      { name: 'Gentle warm-up', sets: 1, reps: '10 min', note: 'Very slow movement, joint circles, shake out', isWarmup: true },
      { name: 'Yin: Butterfly', sets: 1, reps: '3 min', note: 'Soles together, fold forward, completely passive' },
      { name: 'Yin: Dragon (Lizard)', sets: 1, reps: '3 min/side', note: 'Low lunge, back knee down, totally relax' },
      { name: 'Yin: Sleeping Swan (Pigeon)', sets: 1, reps: '3 min/side' },
      { name: 'Yin: Spinal Twist', sets: 1, reps: '3 min/side' },
      { name: 'Savasana', sets: 1, reps: '10 min', note: 'You\'ve completed 4 weeks — allow yourself to fully rest', isWarmup: true },
    ],
  },
];
