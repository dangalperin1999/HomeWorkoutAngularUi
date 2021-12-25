export interface ICategorizedExercise{
  categoryExerciseId: number;
  dayName: string;
  fitnessGoalName: string | null;
  fitnessLevelName: string | null;
  exerciseName: string;
  sets: number;
  reps: number;
}
