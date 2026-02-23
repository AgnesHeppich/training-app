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
  // PHASE 1 – WEEKS 1-4: Build the Second Rep
  // Goal: develop enough reserve strength to
  // initiate a second rep after the first.
  // Heavy assisted work, negatives, hangs.
  // ─────────────────────────────────────────────

  // Week 1
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
    title: "Upper Pull",
    focus: "Build pulling reserve for consecutive reps",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Scapular pull-ups (2x10) + band pull-aparts (2x15)", isWarmup: true },
      { name: "Assisted Pull-ups (light band)", sets: 5, reps: "4-5", note: "Slow tempo: 3s up / 2s down. Smooth initiation." },
      { name: "Flexed Arm Hang", sets: 4, reps: "20-30s", note: "Hold at chin-over-bar. Squeeze lats." },
      { name: "Single-arm Dumbbell Rows", sets: 3, reps: "10-12/arm", note: "Heavy, full ROM" },
      { name: "Straight Arm Pulldowns", sets: 3, reps: "12-15" },
      { name: "Face Pulls", sets: 3, reps: "15-20" },
      { name: "Dead Hangs", sets: 3, reps: "30-40s", note: "Active shoulders" }
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
  {
    id: "w1-d1",
    week: 1,
    dayLabel: "Monday",
    title: "Upper Pull",
    focus: "Test the second rep with full rest",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Light cardio + band pull-aparts (2x20) + scapular pull-ups (2x10)", isWarmup: true },
      { name: "2-Rep Attempt Pull-ups", sets: 5, reps: "1-2", note: "Full dead hang reset between reps. Stop the set if form breaks on rep 1." },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "4-5", note: "Focus on smooth lat initiation" },
      { name: "Negative Pull-ups", sets: 3, reps: "3", note: "6-8s descent, full hang at bottom" },
      { name: "Chest-Supported Rows", sets: 3, reps: "10-12" },
      { name: "Straight Arm Pulldowns", sets: 3, reps: "12-15" },
      { name: "Dead Hangs", sets: 3, reps: "30-45s" }
    ]
  },

  // Week 2
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
    title: "Upper Pull",
    focus: "Increase time under tension",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Scapular pull-ups (2x10)", isWarmup: true },
      { name: "Assisted Pull-ups (light band)", sets: 5, reps: "5", note: "3s up / 3s down. All reps strict." },
      { name: "Flexed Arm Hang", sets: 4, reps: "25-35s" },
      { name: "Chest-Supported Rows", sets: 3, reps: "10-12" },
      { name: "Straight Arm Pulldowns", sets: 3, reps: "12-15" },
      { name: "Band Pull-aparts", sets: 3, reps: "25" },
      { name: "Dead Hangs", sets: 3, reps: "35-45s" }
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
  {
    id: "w2-d1",
    week: 2,
    dayLabel: "Monday",
    title: "Upper Pull",
    focus: "Dead-hang doubles with better recovery",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Light cardio + band pull-aparts (2x20) + scap pull-ups (2x10)", isWarmup: true },
      { name: "2-Rep Attempt Pull-ups", sets: 6, reps: "1-2", note: "5 min rest between sets. Rep 1 should feel easier than week 1." },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "5" },
      { name: "Negative Pull-ups", sets: 3, reps: "3", note: "8s descent" },
      { name: "Inverted Rows", sets: 3, reps: "10-12" },
      { name: "Dead Hangs", sets: 3, reps: "40-50s" }
    ]
  },

  // Week 3
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
    title: "Upper Pull",
    focus: "Minimal band, high quality",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Scapular pull-ups (2x10) + band pull-aparts", isWarmup: true },
      { name: "Assisted Pull-ups (minimal band)", sets: 5, reps: "4", note: "Thinnest band you have. Slow & strict." },
      { name: "Flexed Arm Hang", sets: 4, reps: "30-40s" },
      { name: "Single-arm Dumbbell Rows", sets: 3, reps: "10-12/arm", note: "Heavy" },
      { name: "Straight Arm Pulldowns", sets: 3, reps: "12-15" },
      { name: "Band Pull-aparts", sets: 3, reps: "25" },
      { name: "Dead Hangs", sets: 3, reps: "40-50s" }
    ]
  },
  {
    id: "w3-d5",
    week: 3,
    dayLabel: "Friday",
    title: "Full Body + Posture",
    focus: "Balance & recovery",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Thoracic mobility", isWarmup: true },
      { name: "Decline Push-ups", sets: 4, reps: "10-15" },
      { name: "Front Squats", sets: 3, reps: "10-12" },
      { name: "Dumbbell Arnold Press", sets: 3, reps: "10-12" },
      { name: "Wall Angels", sets: 4, reps: "15" },
      { name: "Prone I-Y-T Raises", sets: 3, reps: "10 each" },
      { name: "Cardio", sets: 1, reps: "20 min", note: "Steady state" }
    ]
  },
  {
    id: "w3-d1",
    week: 3,
    dayLabel: "Monday",
    title: "Upper Pull",
    focus: "Brief pause at bottom, don't fully hang off",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Full scap prep + band pull-aparts (2x20)", isWarmup: true },
      { name: "Touch-and-Go Pull-ups", sets: 5, reps: "1-2", note: "Don't fully relax at the bottom. Brief pause only. Stop if rep 1 feels ugly." },
      { name: "2-Rep Attempt Pull-ups (dead hang)", sets: 3, reps: "1-2", note: "Fallback if touch-and-go isn't there yet" },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "5" },
      { name: "Negative Pull-ups", sets: 3, reps: "3", note: "8-10s descent" },
      { name: "Chest-Supported Rows", sets: 3, reps: "10-12" },
      { name: "Dead Hangs", sets: 3, reps: "45s" }
    ]
  },

  // Week 4
  {
    id: "w4-d2",
    week: 4,
    dayLabel: "Tuesday",
    title: "Lower Body + Core",
    focus: "Maintain intensity",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Bike + dynamic stretches", isWarmup: true },
      { name: "Squats", sets: 4, reps: "8-10", note: "Maintain weight" },
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
    title: "Upper Pull",
    focus: "Lock in the second rep",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Scapular pull-ups (2x10)", isWarmup: true },
      { name: "Assisted Pull-ups (minimal band)", sets: 5, reps: "4-5", note: "2s pause at top each rep" },
      { name: "Flexed Arm Hang", sets: 4, reps: "35-45s" },
      { name: "Chest-Supported Rows", sets: 3, reps: "10-12" },
      { name: "Straight Arm Pulldowns", sets: 3, reps: "12-15" },
      { name: "Band Pull-aparts", sets: 3, reps: "25" },
      { name: "Dead Hangs", sets: 3, reps: "45-55s" }
    ]
  },
  {
    id: "w4-d5",
    week: 4,
    dayLabel: "Friday",
    title: "Full Body + Posture (Deload)",
    focus: "Active recovery before Phase 2",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "10 min", note: "Thoracic mobility", isWarmup: true },
      { name: "Push-ups", sets: 3, reps: "10-12", note: "Easy" },
      { name: "Bodyweight Squats", sets: 3, reps: "15-20" },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12", note: "Light" },
      { name: "Wall Angels", sets: 4, reps: "15-20" },
      { name: "Y-T-W Raises", sets: 3, reps: "10 each" },
      { name: "Foam rolling & stretching", sets: 1, reps: "15 min", note: "Full body" },
      { name: "Light cardio", sets: 1, reps: "20 min", note: "Easy pace" }
    ]
  },
  {
    id: "w4-d1",
    week: 4,
    dayLabel: "Monday",
    title: "Upper Pull",
    focus: "Are the doubles reliable yet?",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Full scap prep + band pull-aparts (2x20)", isWarmup: true },
      { name: "Unassisted Pull-ups", sets: 6, reps: "1-2", note: "5 min rest. Count how many sets you get 2 reps. Note it down." },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "5" },
      { name: "Negative Pull-ups", sets: 3, reps: "3", note: "10s descent" },
      { name: "Inverted Rows", sets: 3, reps: "10-12" },
      { name: "Dead Hangs", sets: 3, reps: "50-60s" }
    ]
  },

  // ─────────────────────────────────────────────
  // PHASE 2 – WEEKS 5-6: Solidify 2, Reach for 3
  // ─────────────────────────────────────────────

  // Week 5
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
    title: "Upper Pull",
    focus: "Fresh nervous system, reach beyond 2",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Extra scap prep + band pull-aparts", isWarmup: true },
      { name: "Unassisted Pull-ups (3-rep attempt)", sets: 4, reps: "2-3", note: "5 min rest. Stop cleanly before grind. Note how close rep 3 feels." },
      { name: "Assisted Pull-ups (minimal band)", sets: 3, reps: "4" },
      { name: "Flexed Arm Hang", sets: 3, reps: "30-40s" },
      { name: "Chest-Supported Rows", sets: 3, reps: "10-12" },
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
      { name: "Goblet Squats", sets: 3, reps: "15" },
      { name: "Arnold Press", sets: 3, reps: "10-12" },
      { name: "Wall Angels", sets: 4, reps: "15" },
      { name: "Prone Y-T-I Raises", sets: 3, reps: "10 each" },
      { name: "Cardio", sets: 1, reps: "20 min", note: "Easy steady state" }
    ]
  },
  {
    id: "w5-d1",
    week: 5,
    dayLabel: "Monday",
    title: "Upper Pull",
    focus: "Make doubles feel routine",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Full scap prep + band pull-aparts (2x20)", isWarmup: true },
      { name: "Unassisted Pull-ups", sets: 6, reps: "2", note: "5 min rest. All sets. If you can't hit 2, use lightest band for that set." },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "4-5" },
      { name: "Negative Pull-ups", sets: 3, reps: "3", note: "10s descent" },
      { name: "Straight Arm Pulldowns", sets: 3, reps: "12-15" },
      { name: "Dead Hangs", sets: 3, reps: "45s" }
    ]
  },

  // Week 6
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
    title: "Upper Pull",
    focus: "Density + top-end attempt",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Scapular focus + band pull-aparts", isWarmup: true },
      { name: "Unassisted Pull-ups", sets: 5, reps: "2-3", note: "5 min rest. Go for 3 on your freshest sets." },
      { name: "Assisted Pull-ups (minimal band)", sets: 3, reps: "4" },
      { name: "Flexed Arm Hang", sets: 3, reps: "35-45s" },
      { name: "Dumbbell Rows", sets: 3, reps: "10-12/arm" },
      { name: "Band Pull-aparts", sets: 3, reps: "25-30" }
    ]
  },
  {
    id: "w6-d5",
    week: 6,
    dayLabel: "Friday",
    title: "Full Body + Posture",
    focus: "Structural balance",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Mobility", isWarmup: true },
      { name: "Decline Push-ups", sets: 4, reps: "10-15" },
      { name: "Goblet Squats", sets: 3, reps: "15-20" },
      { name: "Overhead Press", sets: 4, reps: "8-10" },
      { name: "Wall Angels", sets: 4, reps: "15" },
      { name: "Prone I-Y-T Raises", sets: 3, reps: "12 each" },
      { name: "Cardio", sets: 1, reps: "20 min", note: "Steady state" }
    ]
  },
  {
    id: "w6-d1",
    week: 6,
    dayLabel: "Monday",
    title: "Upper Pull",
    focus: "Accumulate reps at 2",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Light cardio + band pull-aparts (2x20) + scap pull-ups (2x10)", isWarmup: true },
      { name: "Unassisted Pull-ups", sets: 8, reps: "2", note: "4 min rest. All sets should be clean. No grinding." },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "5" },
      { name: "Negative Pull-ups", sets: 3, reps: "3", note: "10-12s descent" },
      { name: "Dead Hangs", sets: 3, reps: "50-60s" }
    ]
  },

  // ─────────────────────────────────────────────
  // PHASE 3 – WEEKS 7-8: Own the Triple
  // ─────────────────────────────────────────────

  // Week 7
  {
    id: "w7-d2",
    week: 7,
    dayLabel: "Tuesday",
    title: "Lower Body + Core",
    focus: "Maintain strength",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Bike + dynamic stretches", isWarmup: true },
      { name: "Squats", sets: 4, reps: "8-10" },
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
    title: "Upper Pull",
    focus: "3 reps as the new baseline",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Full scap prep + band pull-aparts (2x20)", isWarmup: true },
      { name: "Unassisted Pull-ups", sets: 5, reps: "3", note: "5 min rest. If 3 is not there on a set, do 2 and note it." },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "4-5" },
      { name: "Negative Pull-ups", sets: 3, reps: "3", note: "10s descent" },
      { name: "Chest-Supported Rows", sets: 3, reps: "10-12" },
      { name: "Straight Arm Pulldowns", sets: 3, reps: "12-15" },
      { name: "Dead Hangs", sets: 3, reps: "50-60s" }
    ]
  },
  {
    id: "w7-d5",
    week: 7,
    dayLabel: "Friday",
    title: "Full Body + Posture",
    focus: "Active recovery",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Thoracic mobility", isWarmup: true },
      { name: "Push-ups", sets: 3, reps: "10-12" },
      { name: "Goblet Squats", sets: 3, reps: "15" },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12" },
      { name: "Wall Angels", sets: 4, reps: "15-20" },
      { name: "Y-T-W Raises", sets: 3, reps: "10 each" },
      { name: "Cardio", sets: 1, reps: "20 min", note: "Easy pace" }
    ]
  },
  {
    id: "w7-d1",
    week: 7,
    dayLabel: "Monday",
    title: "Upper Pull",
    focus: "Reach beyond 3",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Scapular focus + band pull-aparts", isWarmup: true },
      { name: "Unassisted Pull-ups (max attempt)", sets: 4, reps: "3-4", note: "5 min rest. Go for 4 on your freshest set." },
      { name: "Assisted Pull-ups (minimal band)", sets: 3, reps: "4" },
      { name: "Flexed Arm Hang", sets: 3, reps: "40-50s" },
      { name: "Dumbbell Rows", sets: 3, reps: "10-12/arm" },
      { name: "Band Pull-aparts", sets: 3, reps: "25-30" }
    ]
  },

  // Week 8
  {
    id: "w8-d2",
    week: 8,
    dayLabel: "Tuesday",
    title: "Lower Body + Core",
    focus: "Intensity peak",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Bike + dynamic stretches", isWarmup: true },
      { name: "Squats", sets: 5, reps: "6-8", note: "Heavy" },
      { name: "Conventional Deadlifts", sets: 4, reps: "6-8" },
      { name: "Walking Lunges", sets: 3, reps: "12/leg" },
      { name: "Weighted Plank", sets: 3, reps: "60s" },
      { name: "Hanging Leg Raises", sets: 3, reps: "12-15" },
      { name: "Cardio finisher", sets: 1, reps: "15 min", note: "HIIT: 20s sprint / 40s rest" }
    ]
  },
  {
    id: "w8-d4",
    week: 8,
    dayLabel: "Thursday",
    title: "Upper Pull",
    focus: "Consolidate the fourth rep",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Extra scap prep", isWarmup: true },
      { name: "Unassisted Pull-ups", sets: 5, reps: "3-4", note: "5 min rest. Chase 4 on every set you feel good." },
      { name: "Assisted Pull-ups (minimal band)", sets: 3, reps: "4" },
      { name: "Flexed Arm Hang", sets: 3, reps: "40-50s" },
      { name: "Chest-Supported Rows", sets: 3, reps: "10-12" },
      { name: "Band Pull-aparts", sets: 3, reps: "25-30" }
    ]
  },
  {
    id: "w8-d5",
    week: 8,
    dayLabel: "Friday",
    title: "Full Body + Posture",
    focus: "Structural balance",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Mobility", isWarmup: true },
      { name: "Push-ups", sets: 4, reps: "10-15" },
      { name: "Goblet Squats", sets: 3, reps: "15" },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12" },
      { name: "Wall Angels", sets: 4, reps: "15-20" },
      { name: "Y-T-W Raises", sets: 3, reps: "10 each" },
      { name: "Cardio", sets: 1, reps: "20 min", note: "Easy pace" }
    ]
  },
  {
    id: "w8-d1",
    week: 8,
    dayLabel: "Monday",
    title: "Upper Pull",
    focus: "More total reps at 3",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Light cardio + band pull-aparts (2x20) + scap pull-ups (2x10)", isWarmup: true },
      { name: "Unassisted Pull-ups", sets: 7, reps: "3", note: "4 min rest. Consistency across all sets." },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "4" },
      { name: "Negative Pull-ups", sets: 3, reps: "3", note: "10-12s descent" },
      { name: "Straight Arm Pulldowns", sets: 3, reps: "12-15" },
      { name: "Dead Hangs", sets: 3, reps: "55-60s" }
    ]
  },

  // ─────────────────────────────────────────────
  // PHASE 4 – WEEKS 9-10: Push to 5, Test
  // ─────────────────────────────────────────────

  // Week 9
  {
    id: "w9-d2",
    week: 9,
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
    id: "w9-d4",
    week: 9,
    dayLabel: "Thursday",
    title: "Upper Pull",
    focus: "Fresh attempt at 5",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "10 min", note: "Thorough – light cardio + scap pull-ups (2x10) + band pull-aparts (2x20)", isWarmup: true },
      { name: "Unassisted Pull-ups (max attempt)", sets: 3, reps: "4-5", note: "5-6 min rest. Best effort. Stop cleanly before grind." },
      { name: "Unassisted Pull-ups (back-off sets)", sets: 3, reps: "3", note: "3 min rest" },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "4" },
      { name: "Negative Pull-ups", sets: 3, reps: "3", note: "10-12s descent" },
      { name: "Dead Hangs", sets: 3, reps: "55-60s" }
    ]
  },
  {
    id: "w9-d5",
    week: 9,
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
  {
    id: "w9-d1",
    week: 9,
    dayLabel: "Monday",
    title: "Upper Pull",
    focus: "Lock in the fourth rep",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Scapular focus + band work", isWarmup: true },
      { name: "Unassisted Pull-ups", sets: 6, reps: "4", note: "4-5 min rest. Consistent quality sets." },
      { name: "Assisted Pull-ups (minimal band)", sets: 3, reps: "3-4" },
      { name: "Flexed Arm Hang", sets: 3, reps: "45-55s" },
      { name: "Dumbbell Rows", sets: 3, reps: "10-12/arm" },
      { name: "Band Pull-aparts", sets: 3, reps: "25-30" }
    ]
  },

  // Week 10 – Test Week
  {
    id: "w10-d2",
    week: 10,
    dayLabel: "Tuesday",
    title: "Lower Body + Core",
    focus: "Maintain before test week",
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
    id: "w10-d4",
    week: 10,
    dayLabel: "Thursday",
    title: "Upper Pull",
    focus: "Quality reps, save energy for Monday",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "8-10 min", note: "Scap work + band pull-aparts", isWarmup: true },
      { name: "Unassisted Pull-ups", sets: 4, reps: "3", note: "Pristine form. Do not push to max – save it." },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "5", note: "Controlled" },
      { name: "Flexed Arm Hold", sets: 3, reps: "Max time" },
      { name: "Chest-Supported Rows", sets: 3, reps: "10-12" },
      { name: "Band Pull-aparts", sets: 3, reps: "25" }
    ]
  },
  {
    id: "w10-d5",
    week: 10,
    dayLabel: "Friday",
    title: "Full Body + Posture (Deload)",
    focus: "Fresh legs for Monday test",
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
  },
  {
    id: "w10-d1",
    week: 10,
    dayLabel: "Monday",
    title: "Upper Pull",
    focus: "Max consecutive reps",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "10-12 min", note: "Thorough & calm – light cardio, scap pull-ups (2x8), band pull-aparts (2x15)", isWarmup: true },
      { name: "Unassisted Pull-ups (max set)", sets: 1, reps: "Max", note: "Full effort. 8 min rest after." },
      { name: "Unassisted Pull-ups (2nd attempt)", sets: 1, reps: "Max", note: "Second all-out effort after full rest" },
      { name: "Unassisted Pull-ups (3rd attempt)", sets: 1, reps: "Max", note: "Optional – only if feeling strong" },
      { name: "Assisted Pull-ups (light band)", sets: 3, reps: "5", note: "Pump-out after max attempts" },
      { name: "Dead Hangs", sets: 2, reps: "45-60s" }
    ]
  }
];


export const PROGRAM: WorkoutDay[] = [...PROGRAM_NEXT]
