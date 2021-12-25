export interface IUserWorkoutPlan{
  id?: number;
  usersId: number | null;
  dayName?: string;
  exerciseName: string;
  sets: number;
  reps: number;
}
