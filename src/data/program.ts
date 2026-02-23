export type Exercise = {
  name: string;
  sets: number;
  reps: string; // The target string, e.g. "8-10" or "max time"
  note?: string;
  isWarmup?: boolean;
};

export type WorkoutDay = {
  id: string;
  week: number;
  dayLabel: string; // "Monday", "Tuesday" etc.
  title: string;
  focus: string;
  exercises: Exercise[];
};

export const PROGRAM_NEXT: WorkoutDay[] = [
  // ─────────────────────────────────────────────
  // PHASE 1 – WEEKS 5-6: Build the Second Rep
  // Goal: reliably string 2 pull-ups together
  // ─────────────────────────────────────────────

  // Week 5
  {
    id: "w1-d1",
    week: 1,
    dayLabel: "Monday",
    title: "Upper Pull – Double Attempt",
    focus: "Turn 1 clean rep into 2",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Light cardio + band pull-aparts (2x20) + scapular pull-ups (2x10)", isWarmup: true },
      { name: "2-Rep Attempt Pull-ups", sets: 5, reps: "1-2", note: "Full dead hang reset between reps. Stop if form breaks." },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "4-5", note: "Focus on smooth initiation" },
      { name: "Negative Pull-ups", sets: 3, reps: "3", note: "6-8s descent, full hang at bottom" },
      { name: "Chest-Supported Rows", sets: 3, reps: "10-12" },
      { name: "Straight Arm Pulldowns", sets: 3, reps: "12-15" },
      { name: "Dead Hangs", sets: 3, reps: "30-45s", note: "Active shoulders" }
    ]
  },
  {
    id: "w1-d2",
    week: 1,
    dayLabel: "Tuesday",
    title: "Lower Body + Core",
    focus: "Maintain leg strength",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Bike/elliptical + dynamic stretches", isWarmup: true },
      { name: "Squats", sets: 4, reps: "8-10" },
      { name: "Romanian Deadlifts", sets: 3, reps: "10-12" },
      { name: "Walking Lunges", sets: 3, reps: "10/leg" },
      { name: "Plank", sets: 3, reps: "45-60s" },
      { name: "Dead Bug", sets: 3, reps: "10/side" },
      { name: "Cardio finisher", sets: 1, reps: "15 min", note: "Steady state moderate intensity" }
    ]
  },
  {
    id: "w1-d4",
    week: 1,
    dayLabel: "Thursday",
    title: "Upper Pull – Lat Strength",
    focus: "Build pulling power for consecutive reps",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Scapular pull-ups (2x10)", isWarmup: true },
      { name: "Assisted Pull-ups (minimal band)", sets: 5, reps: "3-4", note: "Slow controlled tempo, 2s pause at top" },
      { name: "Flexed Arm Hang", sets: 4, reps: "20-30s", note: "Hold at chin-over-bar position" },
      { name: "Single-arm Dumbbell Rows", sets: 3, reps: "10-12/arm", note: "Heavy, full ROM" },
      { name: "Face Pulls", sets: 3, reps: "15-20" },
      { name: "Band Pull-aparts", sets: 3, reps: "20-25" },
      { name: "Dead Hangs", sets: 2, reps: "30-40s" }
    ]
  },
  {
    id: "w1-d5",
    week: 1,
    dayLabel: "Friday",
    title: "Full Body + Posture",
    focus: "Recovery & structural balance",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Thoracic mobility", isWarmup: true },
      { name: "Push-ups", sets: 3, reps: "10-12" },
      { name: "Goblet Squats", sets: 3, reps: "12-15" },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12" },
      { name: "Wall Angels", sets: 3, reps: "12-15" },
      { name: "Y-T-W Raises", sets: 3, reps: "8 each" },
      { name: "Cardio", sets: 1, reps: "20 min", note: "Steady state easy pace" }
    ]
  },

  // Week 6
  {
    id: "w2-d1",
    week: 2,
    dayLabel: "Monday",
    title: "Upper Pull – Consecutive Reps",
    focus: "No dead hang reset – touch-and-go",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Light cardio + band pull-aparts (2x20) + scap pull-ups (2x10)", isWarmup: true },
      { name: "Touch-and-Go Pull-ups", sets: 5, reps: "1-2", note: "Brief pause at bottom, do NOT fully hang off. Stop if form breaks." },
      { name: "2-Rep Attempt Pull-ups", sets: 3, reps: "2", note: "Dead hang reset between reps – backup if touch-and-go too hard" },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "4" },
      { name: "Negative Pull-ups", sets: 3, reps: "3", note: "8s descent" },
      { name: "Inverted Rows", sets: 3, reps: "10-12" },
      { name: "Dead Hangs", sets: 3, reps: "40-50s" }
    ]
  },
  {
    id: "w2-d2",
    week: 2,
    dayLabel: "Tuesday",
    title: "Lower Body + Core",
    focus: "Strength progression",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Bike + dynamic stretches", isWarmup: true },
      { name: "Squats", sets: 4, reps: "8-10", note: "Increase weight from last week" },
      { name: "Romanian Deadlifts", sets: 4, reps: "10-12" },
      { name: "Bulgarian Split Squats", sets: 3, reps: "8-10/leg" },
      { name: "Side Planks", sets: 3, reps: "35-40s/side" },
      { name: "Hanging Knee Raises", sets: 3, reps: "10-12" },
      { name: "Cardio finisher", sets: 1, reps: "15 min", note: "Intervals: 30s hard / 90s easy" }
    ]
  },
  {
    id: "w2-d4",
    week: 2,
    dayLabel: "Thursday",
    title: "Upper Pull – Volume & Grip",
    focus: "Fatigue tolerance",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Scapular pull-ups (2x10)", isWarmup: true },
      { name: "Assisted Pull-ups (minimal band)", sets: 5, reps: "4", note: "Slow & strict, 3s up / 2s down" },
      { name: "Flexed Arm Hang", sets: 4, reps: "25-35s" },
      { name: "Chest-Supported Rows", sets: 3, reps: "10-12" },
      { name: "Straight Arm Pulldowns", sets: 3, reps: "12-15" },
      { name: "Band Pull-aparts", sets: 3, reps: "25" }
    ]
  },
  {
    id: "w2-d5",
    week: 2,
    dayLabel: "Friday",
    title: "Full Body + Posture",
    focus: "Structural balance",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Mobility", isWarmup: true },
      { name: "Push-ups", sets: 4, reps: "10-15" },
      { name: "Goblet Squats", sets: 3, reps: "15" },
      { name: "Arnold Press", sets: 3, reps: "10-12" },
      { name: "Wall Angels", sets: 4, reps: "15" },
      { name: "Prone Y-T-I Raises", sets: 3, reps: "10 each" },
      { name: "Cardio", sets: 1, reps: "20 min", note: "Easy steady state" }
    ]
  },

  // ─────────────────────────────────────────────
  // PHASE 2 – WEEKS 7-8: Solidify 2, Reach for 3
  // ─────────────────────────────────────────────

  // Week 7
  {
    id: "w3-d1",
    week: 3,
    dayLabel: "Monday",
    title: "Upper Pull – 2-Rep Sets",
    focus: "Make doubles feel routine",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Full scap prep + band pull-aparts (2x20)", isWarmup: true },
      { name: "Unassisted Pull-ups", sets: 6, reps: "2", note: "5 min rest between sets. Quality reps, stop if form breaks." },
      { name: "3-Rep Attempt Pull-ups", sets: 2, reps: "1-3", note: "At end, attempt a third rep on one fresh set" },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "4-5" },
      { name: "Negative Pull-ups", sets: 3, reps: "3", note: "8-10s descent" },
      { name: "Straight Arm Pulldowns", sets: 3, reps: "12-15" },
      { name: "Dead Hangs", sets: 3, reps: "45s" }
    ]
  },
  {
    id: "w3-d2",
    week: 3,
    dayLabel: "Tuesday",
    title: "Lower Body + Core",
    focus: "Intensity peak",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Bike + dynamic stretches", isWarmup: true },
      { name: "Squats", sets: 5, reps: "6-8", note: "Increase weight" },
      { name: "Conventional Deadlifts", sets: 4, reps: "6-8" },
      { name: "Walking Lunges", sets: 3, reps: "12/leg" },
      { name: "Weighted Plank", sets: 3, reps: "45-60s" },
      { name: "Hanging Knee Raises", sets: 3, reps: "10-12" },
      { name: "Cardio finisher", sets: 1, reps: "15 min", note: "HIIT: 20s sprint / 40s rest" }
    ]
  },
  {
    id: "w3-d4",
    week: 3,
    dayLabel: "Thursday",
    title: "Upper Pull – 3-Rep Chase",
    focus: "Fresh nervous system attempt",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Extra scap prep", isWarmup: true },
      { name: "Unassisted Pull-ups (3-rep attempt)", sets: 4, reps: "1-3", note: "5 min rest. Aim for 3 reps – stop cleanly before grind." },
      { name: "Assisted Pull-ups (minimal band)", sets: 3, reps: "4" },
      { name: "Flexed Arm Hang", sets: 3, reps: "25-35s" },
      { name: "Chest-Supported Rows", sets: 3, reps: "10-12" },
      { name: "Band Pull-aparts", sets: 3, reps: "25" }
    ]
  },
  {
    id: "w3-d5",
    week: 3,
    dayLabel: "Friday",
    title: "Full Body + Posture",
    focus: "Deload-ish recovery",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "10 min", note: "Mobility focus", isWarmup: true },
      { name: "Push-ups", sets: 3, reps: "10-12" },
      { name: "Bodyweight Squats", sets: 3, reps: "20" },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: "10", note: "Light" },
      { name: "Wall Angels", sets: 4, reps: "20" },
      { name: "Cardio", sets: 1, reps: "20 min", note: "Easy pace" },
      { name: "Stretching", sets: 1, reps: "10 min", note: "Full body" }
    ]
  },

  // Week 8
  {
    id: "w4-d1",
    week: 4,
    dayLabel: "Monday",
    title: "Upper Pull – Double Volume",
    focus: "Accumulate quality doubles",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Light cardio + scap pull-ups (2x10) + band pull-aparts (2x20)", isWarmup: true },
      { name: "Unassisted Pull-ups", sets: 8, reps: "2", note: "4 min rest between sets. All reps must be clean." },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "4-5", note: "After main sets" },
      { name: "Negative Pull-ups", sets: 3, reps: "3", note: "10s descent" },
      { name: "Single-arm Dumbbell Rows", sets: 3, reps: "10-12/arm" },
      { name: "Dead Hangs", sets: 3, reps: "45-60s" }
    ]
  },
  {
    id: "w4-d2",
    week: 4,
    dayLabel: "Tuesday",
    title: "Lower Body + Core",
    focus: "Maintain intensity",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Bike + dynamic stretches", isWarmup: true },
      { name: "Squats", sets: 4, reps: "8-10", note: "Maintain weight from last week" },
      { name: "Romanian Deadlifts", sets: 4, reps: "10-12" },
      { name: "Step-ups", sets: 3, reps: "10/leg" },
      { name: "Plank variations", sets: 3, reps: "3 rounds", note: "Front 45s, side 30s each" },
      { name: "Hanging Leg Raises", sets: 3, reps: "10-15" },
      { name: "Cardio finisher", sets: 1, reps: "15 min", note: "Intervals" }
    ]
  },
  {
    id: "w4-d4",
    week: 4,
    dayLabel: "Thursday",
    title: "Upper Pull – 3-Rep Push",
    focus: "Consolidate triples",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Full scap prep", isWarmup: true },
      { name: "Unassisted Pull-ups", sets: 5, reps: "2-3", note: "5 min rest. Push for 3 on each set but stop cleanly." },
      { name: "Assisted Pull-ups (minimal band)", sets: 3, reps: "4" },
      { name: "Flexed Arm Hang", sets: 3, reps: "30s" },
      { name: "Chest-Supported Rows", sets: 3, reps: "10-12" },
      { name: "Band Pull-aparts", sets: 3, reps: "25" }
    ]
  },
  {
    id: "w4-d5",
    week: 4,
    dayLabel: "Friday",
    title: "Full Body + Posture",
    focus: "Structural balance",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Thoracic mobility", isWarmup: true },
      { name: "Push-ups", sets: 4, reps: "10-15" },
      { name: "Goblet Squats", sets: 3, reps: "15-20" },
      { name: "Overhead Press", sets: 3, reps: "10-12" },
      { name: "Wall Angels", sets: 4, reps: "15" },
      { name: "Y-T-W Raises", sets: 3, reps: "10 each" },
      { name: "Cardio", sets: 1, reps: "20 min", note: "Steady state" }
    ]
  },

  // ─────────────────────────────────────────────
  // PHASE 3 – WEEKS 9-10: Own the Triple
  // ─────────────────────────────────────────────

  // Week 9
  {
    id: "w5-d1",
    week: 5,
    dayLabel: "Monday",
    title: "Upper Pull – Triple Focus",
    focus: "3 reps as the new baseline",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Light cardio + band pull-aparts (2x20) + scap pull-ups (2x10)", isWarmup: true },
      { name: "Unassisted Pull-ups", sets: 5, reps: "3", note: "5 min rest. If 3 is not there, do 2 and note it." },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "4-5" },
      { name: "Negative Pull-ups", sets: 3, reps: "3", note: "10s descent" },
      { name: "Chest-Supported Rows", sets: 3, reps: "10-12" },
      { name: "Straight Arm Pulldowns", sets: 3, reps: "12-15" },
      { name: "Dead Hangs", sets: 3, reps: "45-60s" }
    ]
  },
  {
    id: "w5-d2",
    week: 5,
    dayLabel: "Tuesday",
    title: "Lower Body + Core",
    focus: "Strength",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Bike + dynamic stretches", isWarmup: true },
      { name: "Squats", sets: 4, reps: "8-10", note: "Progress weight" },
      { name: "Romanian Deadlifts", sets: 4, reps: "10-12" },
      { name: "Bulgarian Split Squats", sets: 3, reps: "8-10/leg" },
      { name: "Plank", sets: 3, reps: "60s" },
      { name: "Hanging Knee Raises", sets: 3, reps: "12-15" },
      { name: "Cardio finisher", sets: 1, reps: "15 min", note: "Intervals: 30s hard / 90s easy" }
    ]
  },
  {
    id: "w5-d4",
    week: 5,
    dayLabel: "Thursday",
    title: "Upper Pull – 4-Rep Attempt",
    focus: "Reach beyond 3",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Scapular focus + band pull-aparts", isWarmup: true },
      { name: "Unassisted Pull-ups (max attempt)", sets: 4, reps: "3-4", note: "5 min rest. Go for 4 on your freshest set." },
      { name: "Assisted Pull-ups (minimal band)", sets: 3, reps: "4" },
      { name: "Flexed Arm Hang", sets: 3, reps: "30-40s" },
      { name: "Dumbbell Rows", sets: 3, reps: "10-12/arm" },
      { name: "Band Pull-aparts", sets: 3, reps: "25" }
    ]
  },
  {
    id: "w5-d5",
    week: 5,
    dayLabel: "Friday",
    title: "Full Body + Posture",
    focus: "Balance & recovery",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Thoracic mobility", isWarmup: true },
      { name: "Push-ups", sets: 4, reps: "10-15" },
      { name: "Front Squats", sets: 3, reps: "10-12" },
      { name: "Dumbbell Arnold Press", sets: 3, reps: "10-12" },
      { name: "Wall Angels", sets: 4, reps: "15" },
      { name: "Prone Y-T-I Raises", sets: 3, reps: "10 each" },
      { name: "Cardio", sets: 1, reps: "20 min", note: "Steady state" }
    ]
  },

  // Week 10
  {
    id: "w6-d1",
    week: 6,
    dayLabel: "Monday",
    title: "Upper Pull – Density Block",
    focus: "More total reps at 3",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Full scap prep + band pull-aparts (2x20)", isWarmup: true },
      { name: "Unassisted Pull-ups", sets: 7, reps: "3", note: "4 min rest. Focus on consistency across all sets." },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "4" },
      { name: "Negative Pull-ups", sets: 3, reps: "3", note: "10-12s descent" },
      { name: "Straight Arm Pulldowns", sets: 3, reps: "12-15" },
      { name: "Dead Hangs", sets: 3, reps: "50-60s" }
    ]
  },
  {
    id: "w6-d2",
    week: 6,
    dayLabel: "Tuesday",
    title: "Lower Body + Core",
    focus: "Intensity peak",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Bike + dynamic stretches", isWarmup: true },
      { name: "Squats", sets: 5, reps: "6-8", note: "Heavy" },
      { name: "Conventional Deadlifts", sets: 4, reps: "6-8" },
      { name: "Walking Lunges", sets: 3, reps: "12/leg" },
      { name: "Side Planks", sets: 3, reps: "40s/side" },
      { name: "Hanging Leg Raises", sets: 3, reps: "10-15" },
      { name: "Cardio finisher", sets: 1, reps: "15 min", note: "HIIT: 20s sprint / 40s rest" }
    ]
  },
  {
    id: "w6-d4",
    week: 6,
    dayLabel: "Thursday",
    title: "Upper Pull – 4-Rep Solidify",
    focus: "Consolidate the fourth rep",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Extra scap prep", isWarmup: true },
      { name: "Unassisted Pull-ups", sets: 5, reps: "3-4", note: "5 min rest. Chase 4 on every set you feel good." },
      { name: "Assisted Pull-ups (minimal band)", sets: 3, reps: "4" },
      { name: "Flexed Arm Hang", sets: 3, reps: "35-45s" },
      { name: "Chest-Supported Rows", sets: 3, reps: "10-12" },
      { name: "Band Pull-aparts", sets: 3, reps: "25-30" }
    ]
  },
  {
    id: "w6-d5",
    week: 6,
    dayLabel: "Friday",
    title: "Full Body + Posture",
    focus: "Active recovery",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Mobility", isWarmup: true },
      { name: "Push-ups", sets: 3, reps: "10-12" },
      { name: "Goblet Squats", sets: 3, reps: "15" },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12" },
      { name: "Wall Angels", sets: 4, reps: "15-20" },
      { name: "Y-T-W Raises", sets: 3, reps: "10 each" },
      { name: "Cardio", sets: 1, reps: "20 min", note: "Easy pace" }
    ]
  },

  // ─────────────────────────────────────────────
  // PHASE 4 – WEEKS 11-12: Push to 5
  // ─────────────────────────────────────────────

  // Week 11
  {
    id: "w7-d1",
    week: 7,
    dayLabel: "Monday",
    title: "Upper Pull – 5-Rep Chase",
    focus: "Fresh attempt at 5",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "10 min", note: "Thorough warm-up – light cardio + scap pull-ups (2x10) + band pull-aparts (2x20)", isWarmup: true },
      { name: "Unassisted Pull-ups (max attempt)", sets: 3, reps: "4-5", note: "5-6 min rest. Best effort on each set, stop cleanly before grind." },
      { name: "Unassisted Pull-ups (back-off sets)", sets: 3, reps: "3", note: "3 min rest" },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "4" },
      { name: "Negative Pull-ups", sets: 3, reps: "3", note: "10-12s descent" },
      { name: "Straight Arm Pulldowns", sets: 3, reps: "12-15" },
      { name: "Dead Hangs", sets: 3, reps: "50-60s" }
    ]
  },
  {
    id: "w7-d2",
    week: 7,
    dayLabel: "Tuesday",
    title: "Lower Body + Core",
    focus: "Maintain strength",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Bike + dynamic stretches", isWarmup: true },
      { name: "Squats", sets: 4, reps: "8-10", note: "Maintain intensity" },
      { name: "Romanian Deadlifts", sets: 4, reps: "10-12" },
      { name: "Step-ups", sets: 3, reps: "10/leg" },
      { name: "Plank variations", sets: 3, reps: "3 rounds", note: "Front 60s, side 35s each" },
      { name: "Hanging Leg Raises", sets: 3, reps: "12-15" },
      { name: "Cardio finisher", sets: 1, reps: "15 min", note: "Intervals" }
    ]
  },
  {
    id: "w7-d4",
    week: 7,
    dayLabel: "Thursday",
    title: "Upper Pull – Volume at 4",
    focus: "Lock in the fourth rep",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Scapular focus + band work", isWarmup: true },
      { name: "Unassisted Pull-ups", sets: 6, reps: "4", note: "4-5 min rest. Consistent quality sets." },
      { name: "Assisted Pull-ups (minimal band)", sets: 3, reps: "3-4" },
      { name: "Flexed Arm Hang", sets: 3, reps: "40-50s" },
      { name: "Dumbbell Rows", sets: 3, reps: "10-12/arm" },
      { name: "Band Pull-aparts", sets: 3, reps: "25-30" }
    ]
  },
  {
    id: "w7-d5",
    week: 7,
    dayLabel: "Friday",
    title: "Full Body + Posture",
    focus: "Structural balance",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Thoracic mobility", isWarmup: true },
      { name: "Decline Push-ups", sets: 4, reps: "10-15" },
      { name: "Goblet Squats", sets: 3, reps: "15-20" },
      { name: "Overhead Press", sets: 4, reps: "8-10" },
      { name: "Wall Angels", sets: 4, reps: "15" },
      { name: "Prone I-Y-T Raises", sets: 3, reps: "12 each" },
      { name: "Cardio", sets: 1, reps: "20 min", note: "Steady state" }
    ]
  },

  // Week 12 – Test Week
  {
    id: "w8-d1",
    week: 8,
    dayLabel: "Monday",
    title: "Upper Pull – Test Day",
    focus: "Max consecutive reps",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "10-12 min", note: "Thorough & calm – light cardio, scap pull-ups (2x8), band pull-aparts (2x15)", isWarmup: true },
      { name: "Unassisted Pull-ups (max set)", sets: 1, reps: "Max", note: "Full effort, 8 min rest after" },
      { name: "Unassisted Pull-ups (2nd attempt)", sets: 1, reps: "Max", note: "Second all-out effort after full rest" },
      { name: "Unassisted Pull-ups (3rd attempt)", sets: 1, reps: "Max", note: "Optional – only if feeling good" },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "5", note: "Pump-out after max attempts" },
      { name: "Dead Hangs", sets: 2, reps: "45-60s" }
    ]
  },
  {
    id: "w8-d2",
    week: 8,
    dayLabel: "Tuesday",
    title: "Lower Body + Core",
    focus: "Maintain",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Bike + dynamic stretches", isWarmup: true },
      { name: "Squats", sets: 4, reps: "8-10" },
      { name: "Romanian Deadlifts", sets: 3, reps: "10-12" },
      { name: "Walking Lunges", sets: 3, reps: "10/leg" },
      { name: "Plank", sets: 3, reps: "60s" },
      { name: "Hanging Knee Raises", sets: 3, reps: "12-15" },
      { name: "Cardio finisher", sets: 1, reps: "15 min", note: "Moderate intervals" }
    ]
  },
  {
    id: "w8-d4",
    week: 8,
    dayLabel: "Thursday",
    title: "Upper Pull – Technique Celebration",
    focus: "Quality reps, reflect on progress",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Scap work + band pull-aparts", isWarmup: true },
      { name: "Unassisted Pull-ups", sets: 4, reps: "3-4", note: "Pristine form – enjoy these reps" },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "5", note: "Controlled" },
      { name: "Flexed Arm Hold", sets: 3, reps: "Max time" },
      { name: "Chest-Supported Rows", sets: 3, reps: "10-12" },
      { name: "Band Pull-aparts", sets: 3, reps: "25" }
    ]
  },
  {
    id: "w8-d5",
    week: 8,
    dayLabel: "Friday",
    title: "Full Body + Posture (Deload)",
    focus: "Recovery & Mobility",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "10 min", note: "Thoracic mobility", isWarmup: true },
      { name: "Push-ups", sets: 3, reps: "10-12", note: "Lighter day" },
      { name: "Bodyweight Squats", sets: 3, reps: "15-20" },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12", note: "Light" },
      { name: "Wall Angels", sets: 4, reps: "15-20" },
      { name: "Y-T-W Raises", sets: 3, reps: "10 each" },
      { name: "Foam rolling & stretching", sets: 1, reps: "15-20 min", note: "Full body" },
      { name: "Light cardio", sets: 1, reps: "20 min", note: "Easy pace" }
    ]
  }
];


export const PROGRAM: WorkoutDay[] = [...PROGRAM_NEXT]
