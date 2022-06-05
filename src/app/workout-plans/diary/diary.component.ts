import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IExercise } from 'src/app/models/IExercise';
import { IUserDiery } from 'src/app/models/IUserDiery';
import { AlertifyService } from 'src/app/services/alertify.service';
import { ExercisesService } from 'src/app/services/exercises.service';
import { UserDieryService } from 'src/app/services/userDiery.service';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css']
})
export class DiaryComponent implements OnInit {
  dieryForm!: FormGroup;
  userSubmitted = false;
  exercisesArray: IExercise[] = [];
  isDieryFormVisible = false;
  isExerciseVisible = true;
  userDiery!: IUserDiery;
  userDieriesArray: IUserDiery[] = [];
  userId = Number(localStorage.getItem('id'));
  constructor(private router:Router, private exercisesService: ExercisesService, private fb: FormBuilder, private alertify: AlertifyService, private userDieryService: UserDieryService) { }

  ngOnInit() {
    this.getAllExercises();
    this.getUserDieries();
    this.createRegisterationForm();
  }

  createRegisterationForm(){
    this.dieryForm = this.fb.group({
      exercises: [null, Validators.required],
      sets: [null, [Validators.required]],
      reps: [null, Validators.required],
    });
  }

  get exercises(){
    return this.dieryForm.get('exercises') as FormControl;
  }

  get sets(){
    return this.dieryForm.get('sets') as FormControl;
  }

  get reps(){
    return this.dieryForm.get('reps') as FormControl;
  }
  onSubmit(){
    this.userSubmitted = true;
    if(this.dieryForm.valid){
      this.userDieryService.postUserDiery(this.dieryData()).subscribe(() =>
      {
        this.userSubmitted = false;
        this.dieryForm.reset();
        this.alertify.success("Exercise submited");
        this.getUserDieries();
      }, error => {
        this.alertify.error('Provide the required fields');
      });
    }
  }

  dieryData(): IUserDiery{
    return this.userDiery = {
      userId: this.userId,
      exerciseName: this.exercises.value,
      sets: this.sets.value,
      reps: this.reps.value
    }
  }

  getUserDieries(){
    this.userDieryService.getUserDieries().subscribe(
      data=>{
        this.userDieriesArray=data;
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
    if(this.dieryForm.valid){
      this.userDieriesArray?.push(this.dieryData());
    }
  }

  deleteExerciseFromArrayAndDb(exerciseToDelete: IUserDiery, i: number){
    this.userDieryService.deleteUserDiery(exerciseToDelete).subscribe();
    const index = this.userDieriesArray!.findIndex((item) => item.id === exerciseToDelete.id);
    this.userDieriesArray.splice(index, 1);
    var link = document.getElementById(String(i))!;
    link.style.visibility = 'hidden';
  }

  updateUserDiary(id: number, exercise: string, sets: string, reps: string){
    var updatedUserWorkoutPlan: IUserDiery = {id: id, userId: this.userId, exerciseName: exercise, sets: Number(sets), reps: Number(reps)};
    this.userDieryService.updateUserDiery(id, updatedUserWorkoutPlan).subscribe();
    this.getUserDieries();
    this.alertify.success("Exercise updated");
    window.location.reload();
  }

  toggleDieryAndFormVisibility(editExercise: string, exerciseId: number){
    if(exerciseId === Number(editExercise.slice(8))){
      var form = document.getElementById(String(exerciseId))!;
      form.hidden = !form.hidden;
      var diet = document.getElementById(editExercise)!;
      diet.hidden = !diet.hidden;
    }
  }
}
