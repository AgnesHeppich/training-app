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

export const PROGRAM: WorkoutDay[] = [
  // Week 1
  {
    id: "w1-d1",
    week: 1,
    dayLabel: "Monday",
    title: "Upper Pull Focus",
    focus: "Master form, build base strength",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Light cardio + arm circles, band pull-aparts (2x15)", isWarmup: true },
      { name: "Assisted Pull-ups (band)", sets: 4, reps: "5-6", note: "Use your thinnest band" },
      { name: "Negative Pull-ups", sets: 3, reps: "3-4", note: "5-second descent" },
      { name: "Inverted Rows", sets: 3, reps: "8-10" },
      { name: "Lat Pulldowns", sets: 3, reps: "10-12", note: "Moderate weight" },
      { name: "Face Pulls", sets: 3, reps: "12-15", note: "Posture work" },
      { name: "Dead Hangs", sets: 3, reps: "20-30s" }
    ]
  },
  {
    id: "w1-d2",
    week: 1,
    dayLabel: "Tuesday",
    title: "Lower Body + Core",
    focus: "Leg strength & core stability",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Bike/elliptical + dynamic stretches", isWarmup: true },
      { name: "Squats", sets: 4, reps: "8-10" },
      { name: "Romanian Deadlifts", sets: 3, reps: "10-12" },
      { name: "Walking Lunges", sets: 3, reps: "10/leg" },
      { name: "Plank", sets: 3, reps: "30-45s" },
      { name: "Bird Dogs", sets: 3, reps: "10/side", note: "Core stability" },
      { name: "Cardio finisher", sets: 1, reps: "10 min", note: "Moderate intensity" }
    ]
  },
  {
    id: "w1-d4",
    week: 1,
    dayLabel: "Thursday",
    title: "Upper Pull Focus",
    focus: "Volume & row strength",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Light cardio + scapular pull-ups (2x10)", isWarmup: true },
      { name: "Assisted Pull-ups (band)", sets: 4, reps: "4-5", note: "SLOWER tempo than Monday" },
      { name: "Flexed Arm Hang", sets: 3, reps: "Max time", note: "Aim for 10-20 seconds" },
      { name: "Dumbbell Rows", sets: 3, reps: "10-12/arm" },
      { name: "Seated Cable Rows", sets: 3, reps: "10-12" },
      { name: "Band Pull-aparts", sets: 3, reps: "15-20" },
      { name: "Scapular Shrugs (on bar)", sets: 3, reps: "10-12" }
    ]
  },
  {
    id: "w1-d5",
    week: 1,
    dayLabel: "Friday",
    title: "Full Body + Posture",
    focus: "Mobility & structural balance",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Thoracic spine mobility", isWarmup: true },
      { name: "Push-ups", sets: 3, reps: "8-12" },
      { name: "Goblet Squats", sets: 3, reps: "12-15" },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12" },
      { name: "Wall Angels", sets: 3, reps: "10-12", note: "Thoracic mobility" },
      { name: "Y-T-W Raises", sets: 3, reps: "8 each" },
      { name: "Russian Twists", sets: 3, reps: "20 total" },
      { name: "Cardio", sets: 1, reps: "15 min", note: "Steady state" }
    ]
  },

  // Week 2
  {
    id: "w2-d1",
    week: 2,
    dayLabel: "Monday",
    title: "Upper Pull Focus",
    focus: "Increase volume, improve negative control",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Light cardio + band pull-aparts (2x15)", isWarmup: true },
      { name: "Assisted Pull-ups (band)", sets: 5, reps: "5-6" },
      { name: "Negative Pull-ups", sets: 4, reps: "3-4", note: "6-second descent" },
      { name: "Inverted Rows", sets: 4, reps: "10-12" },
      { name: "Lat Pulldowns", sets: 3, reps: "8-10", note: "Increase weight" },
      { name: "Face Pulls", sets: 3, reps: "15" },
      { name: "Dead Hangs", sets: 3, reps: "30-40s" }
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
      { name: "Squats", sets: 4, reps: "8-10", note: "Increase weight" },
      { name: "Romanian Deadlifts", sets: 4, reps: "10-12" },
      { name: "Bulgarian Split Squats", sets: 3, reps: "8-10/leg" },
      { name: "Plank", sets: 3, reps: "45-60s" },
      { name: "Side Planks", sets: 3, reps: "30s/side" },
      { name: "Cardio finisher", sets: 1, reps: "12 min", note: "Intervals (30s hard / 90s easy)" }
    ]
  },
  {
    id: "w2-d4",
    week: 2,
    dayLabel: "Thursday",
    title: "Upper Pull Focus",
    focus: "Controlled tempo",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Scapular pull-ups (2x10)", isWarmup: true },
      { name: "Assisted Pull-ups (band)", sets: 5, reps: "4-5", note: "Controlled tempo" },
      { name: "Flexed Arm Hang", sets: 4, reps: "Max time", note: "Aim for 15-25 seconds" },
      { name: "Chest-Supported Rows", sets: 3, reps: "10-12" },
      { name: "Straight Arm Pulldowns", sets: 3, reps: "12-15" },
      { name: "Band Pull-aparts", sets: 3, reps: "20" },
      { name: "Scapular Pull-ups", sets: 3, reps: "12-15" }
    ]
  },
  {
    id: "w2-d5",
    week: 2,
    dayLabel: "Friday",
    title: "Full Body + Posture",
    focus: "Endurance & stability",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Thoracic mobility", isWarmup: true },
      { name: "Push-ups", sets: 4, reps: "10-15" },
      { name: "Front Squats", sets: 3, reps: "10-12" },
      { name: "Dumbbell Arnold Press", sets: 3, reps: "10-12" },
      { name: "Wall Angels", sets: 3, reps: "12-15" },
      { name: "Prone Y-T-I Raises", sets: 3, reps: "10 each" },
      { name: "Pallof Press", sets: 3, reps: "10/side" },
      { name: "Cardio", sets: 1, reps: "20 min", note: "Moderate intensity" }
    ]
  },

  // Week 3
  {
    id: "w3-d1",
    week: 3,
    dayLabel: "Monday",
    title: "Upper Pull Focus",
    focus: "Test unassisted attempts",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Band pull-aparts (2x20)", isWarmup: true },
      { name: "Unassisted Pull-up Attempts", sets: 3, reps: "1-2 attempts", note: "Max effort" },
      { name: "Assisted Pull-ups (band)", sets: 4, reps: "5-6", note: "Lighter band if available" },
      { name: "Negative Pull-ups", sets: 4, reps: "3-4", note: "8-second descent" },
      { name: "Weighted Inverted Rows", sets: 4, reps: "8-10" },
      { name: "Weighted Lat Pulldowns", sets: 4, reps: "8-10" },
      { name: "Face Pulls", sets: 3, reps: "15-20" },
      { name: "Dead Hangs", sets: 3, reps: "40-50s" }
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
      { name: "Hanging Knee Raises", sets: 3, reps: "8-12" },
      { name: "Cardio finisher", sets: 1, reps: "15 min", note: "HIIT (20s sprint / 40s rest)" }
    ]
  },
  {
    id: "w3-d4",
    week: 3,
    dayLabel: "Thursday",
    title: "Upper Pull Focus",
    focus: "Fresh attempt & volume",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Scapular pull-ups (3x10)", isWarmup: true },
      { name: "Unassisted Pull-up Attempts", sets: 3, reps: "1-2 attempts", note: "Fresh effort" },
      { name: "Assisted Pull-ups (band)", sets: 4, reps: "4-5" },
      { name: "Flexed Arm Hang", sets: 4, reps: "Max time", note: "Aim for 20-30 seconds" },
      { name: "Weighted Dumbbell Rows", sets: 4, reps: "8-10" },
      { name: "Straight Arm Pulldowns", sets: 4, reps: "12-15" },
      { name: "Band Pull-aparts", sets: 4, reps: "20-25" }
    ]
  },
  {
    id: "w3-d5",
    week: 3,
    dayLabel: "Friday",
    title: "Full Body + Posture",
    focus: "Resilience",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Thoracic mobility", isWarmup: true },
      { name: "Decline or Weighted Push-ups", sets: 4, reps: "10-15" },
      { name: "Goblet Squats", sets: 3, reps: "15-20" },
      { name: "Overhead Press", sets: 4, reps: "8-10" },
      { name: "Wall Angels", sets: 4, reps: "15" },
      { name: "Prone I-Y-T Raises", sets: 3, reps: "12 each" },
      { name: "Ab Wheel Rollouts", sets: 3, reps: "8-12" },
      { name: "Cardio", sets: 1, reps: "20 min", note: "Steady state" }
    ]
  },

  // Week 4
  {
    id: "w4-d1",
    week: 4,
    dayLabel: "Monday",
    title: "Upper Pull Focus",
    focus: "Max attempt",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "10 min", note: "Thorough warm-up + mobility", isWarmup: true },
      { name: "Unassisted Pull-up Max Attempt", sets: 1, reps: "1", note: "Test with 5 min rest between attempts" },
      { name: "Assisted Pull-ups (band)", sets: 4, reps: "4-6", note: "Minimal band" },
      { name: "Negative Pull-ups", sets: 3, reps: "3-5", note: "10-second descent" },
      { name: "Inverted Rows", sets: 4, reps: "10-12" },
      { name: "Lat Pulldowns", sets: 3, reps: "8-10" },
      { name: "Face Pulls", sets: 3, reps: "20" },
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
      { name: "Squats", sets: 4, reps: "8-10", note: "Maintain intensity" },
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
    title: "Upper Pull Focus",
    focus: "Technique perfection",
    exercises: [
      { name: "Warm-up", sets: 1, reps: "5-10 min", note: "Scapular work", isWarmup: true },
      // Prompt says "Unassisted Pull-ups: Practice your technique".
      // I will map this to sets.
      { name: "Unassisted Pull-ups", sets: 3, reps: "Practice", note: "Quality over quantity" },
      { name: "Assisted Pull-ups (band)", sets: 3, reps: "5-6", note: "Controlled" },
      { name: "Flexed Arm Hold", sets: 3, reps: "Max time" },
      { name: "T-Bar Rows", sets: 4, reps: "8-10" },
      { name: "Cable Pulldowns", sets: 3, reps: "10-12" },
      { name: "Band Pull-aparts", sets: 3, reps: "25" }
    ]
  },
  {
    id: "w4-d5",
    week: 4,
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
