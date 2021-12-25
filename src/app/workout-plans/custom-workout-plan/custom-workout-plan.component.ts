import { Component, Input, OnInit } from "@angular/core";
import { IExercise } from "../../models/IExercise";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ExercisesService } from "src/app/services/exercises.service";
import { IUserWorkoutPlan } from "src/app/models/IUserWorkoutPlan";
import { AlertifyService } from "src/app/services/alertify.service";
import { UserWorkoutPlanService } from "src/app/services/userWorkoutPlan.service";

@Component({
  selector: 'app-custom-workout-plan',
  templateUrl: 'custom-workout-plan.component.html',
  styleUrls: ['custom-workout-plan.component.css']
})

export class CustomWorkoutPlanComponent implements OnInit{
  exercisesArray: Array<IExercise> | undefined;
  userWorkoutPlansArray!: Array<IUserWorkoutPlan>;
  days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  workoutPlanForm!: FormGroup;
  userWorkoutPlan!: IUserWorkoutPlan;
  userSubmitted!: boolean;
  userId = Number(localStorage.getItem('id'));
  dayOut: any;
  constructor(private exercisesService: ExercisesService, private fb: FormBuilder, private alertify: AlertifyService, private userWorkoutPlanService: UserWorkoutPlanService){}
  ngOnInit(): void {
    this.getAllExercises();
    this.getUserWorkoutPlans();
    this.createRegisterationForm();
  }

  createRegisterationForm(){
    this.workoutPlanForm = this.fb.group({
      exercises: [null, Validators.required],
      sets: [null, [Validators.required]],
      reps: [null, Validators.required],
    });
  }

  get exercises(){
    return this.workoutPlanForm.get('exercises') as FormControl;
  }

  get sets(){
    return this.workoutPlanForm.get('sets') as FormControl;
  }

  get reps(){
    return this.workoutPlanForm.get('reps') as FormControl;
  }
  onSubmit(){
    this.userSubmitted = true;
    if(this.workoutPlanForm.valid){
      this.userWorkoutPlanService.postUserWorkoutPlan(this.exerciseData()).subscribe(() =>
      {
        this.userSubmitted = false;
        this.workoutPlanForm.reset();
        this.alertify.success("Exercise submited");
        this.getUserWorkoutPlans();
      }, error => {
        this.alertify.error('Provide the required fields');
      });
    }
  }

  exerciseData(): IUserWorkoutPlan{
    return this.userWorkoutPlan = {
      usersId: this.userId,
      dayName: this.dayOut,
      exerciseName: this.exercises.value,
      sets: this.sets.value,
      reps: this.reps.value
    }
  }
  getUserWorkoutPlans(){
    this.userWorkoutPlanService.getUserWorkoutPlans().subscribe(
      data=>{
        this.userWorkoutPlansArray=data;
      },error=>{
        console.log(error);
      }
    )
  }

  getAllExercises(){
    this.exercisesService.getAllExercises().subscribe(
      data=>{
        this.exercisesArray=data;
      },error=>{
        console.log(error);
      });
  }
  addExerciseToArray(index: number){
    this.dayOut = this.days[index];
    if(this.workoutPlanForm.valid){
      this.userWorkoutPlansArray?.push(this.exerciseData());
    }
  }

  deleteExerciseFromArrayAndDb(exerciseToDelete: IUserWorkoutPlan, i: number){
    this.userWorkoutPlanService.deleteUserWorkoutPlan(exerciseToDelete).subscribe();
    const index = this.userWorkoutPlansArray!.findIndex((item) => item.id === exerciseToDelete.id);
    this.userWorkoutPlansArray.splice(index, 1);
    var link = document.getElementById(String(exerciseToDelete.id))!;
    link.style.visibility = 'hidden';
  }

  toggleWorkoutPlanAndFormVisibility(formId: number, userDietId: string){
    if(this.days[formId] === userDietId){
      var form = document.getElementById(String(formId))!;
      form.hidden = !form.hidden;
      var diet = document.getElementById(String(userDietId))!;
      diet.hidden = !diet.hidden;
    }
  }
}
