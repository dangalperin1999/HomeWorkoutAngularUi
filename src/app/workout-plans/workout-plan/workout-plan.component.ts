import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategorizedExercisesService } from 'src/app/services/categorizedExercises.service';
import { ICategorizedExercise } from '../../models/ICategorizedExercise';
@Component({
  selector: 'app-workout-plan',
  templateUrl: './workout-plan.component.html',
  styleUrls: ['./workout-plan.component.css']
})
export class WorkoutPlanComponent implements OnInit {
  categorizedExercises!: Array<ICategorizedExercise>;
  days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  fitnessGoal: string = "";
  fitnessLevel: string = "";
  constructor(private categorizedExercisesService: CategorizedExercisesService, private router: Router) { }

  ngOnInit(): void {
    this.fitnessGoal = localStorage.getItem('fitnessGoal')!;
    this.fitnessLevel = localStorage.getItem('fitnessLevel')!;
    if(localStorage.getItem('userName')){
      this.categorizedExercisesService.getAllCategorizedExercises().subscribe(
        data=>{
          this.categorizedExercises=data;
        },error=>{
          console.log(error);
        }
      )
    }else{
      this.router.navigate(['user/login']);
    }
  }
}
