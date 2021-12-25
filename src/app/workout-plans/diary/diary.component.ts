import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IExercise } from 'src/app/models/IExercise';
import { IUserWorkoutPlan } from 'src/app/models/IUserWorkoutPlan';
import { AlertifyService } from 'src/app/services/alertify.service';
import { ExercisesService } from 'src/app/services/exercises.service';
import { UserWorkoutPlanService } from 'src/app/services/userWorkoutPlan.service';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css']
})
export class DiaryComponent implements OnInit {
  diaryForm!: FormGroup;
  userSubmitted = false;
  exercisesArray: IExercise[] = [];
  isDiaryFormVisible = false;
  isExerciseVisible = true;
  userDiary!: IUserWorkoutPlan;
  userWorkoutPlansArray: IUserWorkoutPlan[] = [];
  userId = Number(localStorage.getItem('id'));
  constructor(private router:Router, private exercisesService: ExercisesService, private fb: FormBuilder, private alertify: AlertifyService, private userWorkoutPlanService: UserWorkoutPlanService) { }

  ngOnInit() {
    this.getAllExercises();
    this.getUserWorkoutPlans();
    this.createRegisterationForm();
  }

  createRegisterationForm(){
    this.diaryForm = this.fb.group({
      exercises: [null, Validators.required],
      sets: [null, [Validators.required]],
      reps: [null, Validators.required],
    });
  }

  get exercises(){
    return this.diaryForm.get('exercises') as FormControl;
  }

  get sets(){
    return this.diaryForm.get('sets') as FormControl;
  }

  get reps(){
    return this.diaryForm.get('reps') as FormControl;
  }
  onSubmit(){
    this.userSubmitted = true;
    if(this.diaryForm.valid){
      this.userWorkoutPlanService.postUserWorkoutPlan(this.diaryData()).subscribe(() =>
      {
        this.userSubmitted = false;
        this.diaryForm.reset();
        this.alertify.success("Exercise submited");
        this.getUserWorkoutPlans();
      }, error => {
        this.alertify.error('Provide the required fields');
      });
    }
  }

  diaryData(): IUserWorkoutPlan{
    return this.userDiary = {
      usersId: this.userId,
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

  addExerciseToArray(){
    if(this.diaryForm.valid){
      this.userWorkoutPlansArray?.push(this.diaryData());
    }
  }

  deleteExerciseFromArrayAndDb(exerciseToDelete: IUserWorkoutPlan, i: number){
    this.userWorkoutPlanService.deleteUserWorkoutPlan(exerciseToDelete).subscribe();
    const index = this.userWorkoutPlansArray!.findIndex((item) => item.id === exerciseToDelete.id);
    this.userWorkoutPlansArray.splice(index, 1);
    var link = document.getElementById(String(i))!;
    link.style.visibility = 'hidden';
  }

  updateUserWorkoutPlan(id: number, exercise: string, sets: string, reps: string){
    var updatedUserWorkoutPlan: IUserWorkoutPlan = {id: id, usersId: this.userId, exerciseName: exercise, sets: Number(sets), reps: Number(reps)};
    this.userWorkoutPlanService.updateUserWorkoutPlan(id, updatedUserWorkoutPlan).subscribe();
    this.getUserWorkoutPlans();
    this.alertify.success("Exercise updated");
    window.location.reload();
  }

  toggleDietAndFormVisibility(editExercise: string, exerciseId: number){
    if(exerciseId === Number(editExercise.slice(8))){
      var form = document.getElementById(String(exerciseId))!;
      form.hidden = !form.hidden;
      var diet = document.getElementById(editExercise)!;
      diet.hidden = !diet.hidden;
    }
  }
}
