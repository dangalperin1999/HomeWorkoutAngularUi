import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ICalories } from 'src/app/models/ICalories';
import { IFood } from 'src/app/models/IFood';
import { IUserDiet } from 'src/app/models/IUserDiet';
import { AlertifyService } from 'src/app/services/alertify.service';
import { FoodService } from 'src/app/services/food.service';
import { UserDietService } from 'src/app/services/userDiet.service';

@Component({
  selector: 'app-Diet',
  templateUrl: './Diet.component.html',
  styleUrls: ['./Diet.component.css']
})
export class DietComponent implements OnInit {
  foodArray: Array<IFood> | undefined;
  days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  userDietForm!: FormGroup;
  userDiet!: IUserDiet;
  userSubmitted!: boolean;
  userId = Number(localStorage.getItem('id'));
  dayOut: any;
  userDietsArray: IUserDiet[] = [];
  calories!: number;
  dailyCalories: ICalories[] = [];
  requiredCalories: ICalories = {
    day: '',
    caloriesSum: 0,
    proteinsCalories: 0,
    fatsCalories: 0,
    carbsCalories: 0
  };
  constructor(private router: Router, private fb: FormBuilder, private alertify: AlertifyService, private userDietService: UserDietService, private foodService: FoodService) { }

  ngOnInit() {
    this.calculateCalories();
    this.getAllFood();
    this.getUserDiets();
    this.populateArray();
    this.createRegisterationForm();
  }

  createRegisterationForm(){
    this.userDietForm = this.fb.group({
      foodName: [null, Validators.required],
      foodType: [null, [Validators.required]],
      grams: [null, Validators.required],
    });
  }

  get foodName(){
    return this.userDietForm.get('foodName') as FormControl;
  }

  get foodType(){
    return this.userDietForm.get('foodType') as FormControl;
  }

  get grams(){
    return this.userDietForm.get('grams') as FormControl;
  }

  onSubmit(){
    this.userSubmitted = true;
    if(this.userDietForm.valid){
      this.userDietService.postUserDiet(this.dietData()).subscribe(() =>
      {
        this.userSubmitted = false;
        this.userDietForm.reset();
        this.alertify.success("Diet submited");
        this.getUserDiets();
      }, error => {
        this.alertify.error('Provide the required fields');
      });
    }
  }

  dietData(): IUserDiet{
    return this.userDiet = {
      userId: Number(localStorage.getItem('id')),
      dayName: this.dayOut,
      foodName: this.foodName.value,
      foodTypeName: this.foodType.value,
      grams: Math.round(this.grams.value),
      calories: this.calories
    }
  }
  getAllFood(){
    this.foodService.getAllFood().subscribe(
      data=>{
        this.foodArray=data;
      },error=>{
        console.log(error);
      }
    );
  }
  getUserDiets(){
    this.userDietService.getUserDiets().subscribe(
      data=>{
        this.userDietsArray=data;
      },error=>{
        console.log(error);
      }
    )
  }
  addDietToArray(index: number){
    this.dayOut = this.days[index];
    if(this.userDietForm.valid){
      this.userDietsArray?.push(this.dietData());
    }
  }

  deleteDietFromArrayAndDb(dietToDelete: IUserDiet, i: number){
    this.userDietService.deleteUserDiet(dietToDelete).subscribe();
    for (let i = 0; i < this.userDietsArray.length; i++) {
      if(this.userDietsArray[i].id === dietToDelete.id){
        this.userDietsArray.splice(i, 1);
        break;
      }
    }
    var link = document.getElementById(String(dietToDelete.id))!;
    link.style.visibility = 'hidden';
  }

  setCalories(calories: number, grams: number){
    this.calories = Math.round(Number((calories / 100 * grams).toFixed(2)));
    return true;
  }

  populateArray(){
    for (let i = 0; i < this.days.length; i++) {
      this.dailyCalories[i] = {day: this.days[i], caloriesSum: 0, proteinsCalories: 0, fatsCalories: 0, carbsCalories: 0};
    }
  }

  setCaloriesForEachDay(){
    var caloriesSum = 0;
    var proteinsCalories = 0;
    var carbsCalories = 0;
    var fatsCalories = 0;
    this.dailyCalories.forEach(dayCalories => {
      this.userDietsArray.forEach(userDiets => {
        if(userDiets.dayName === dayCalories.day && userDiets.userId === this.userId){
          caloriesSum += userDiets.calories;
        }
        if(userDiets.dayName === dayCalories.day && userDiets.foodTypeName === "Protein" && userDiets.userId === this.userId){
          proteinsCalories += userDiets.calories;
        }
        if(userDiets.dayName === dayCalories.day && userDiets.foodTypeName === "Carbohydrate" && userDiets.userId === this.userId){
          carbsCalories += userDiets.calories;
        }
        if(userDiets.dayName === dayCalories.day && userDiets.foodTypeName === "Fat" && userDiets.userId === this.userId){
          fatsCalories += userDiets.calories;
        }
      });
      dayCalories.caloriesSum = caloriesSum;
      dayCalories.proteinsCalories = proteinsCalories;
      dayCalories.carbsCalories = carbsCalories;
      dayCalories.fatsCalories = fatsCalories;
      caloriesSum = 0;
      proteinsCalories = 0;
      carbsCalories = 0;
      fatsCalories = 0;
    });
    return true;
  }

  toggleDietAndFormVisibility(formId: number, userDietId: string){
    if(this.days[formId] === userDietId){
      var form = document.getElementById(String(formId))!;
      form.hidden = !form.hidden;
      var diet = document.getElementById(String(userDietId))!;
      diet.hidden = !diet.hidden;
    }
  }

  calculateCalories(){
    var fitnessGoal = localStorage.getItem("fitnessGoal");
    var age = localStorage.getItem("age");
    var height = localStorage.getItem("height");
    var weight = localStorage.getItem("weight");
    var gender = localStorage.getItem("gender");
    if(gender === "Male" && fitnessGoal !== "Burn Fat"){
      this.requiredCalories.caloriesSum = (10 * Number(weight)) + (6.25 * Number(height)) + (-5 * Number(age)) + 5 + 200;
      this.requiredCalories.carbsCalories = Math.round(Number((this.requiredCalories.caloriesSum / 100 * 50).toFixed(2)));
      this.requiredCalories.proteinsCalories = Math.round(Number((this.requiredCalories.caloriesSum / 100 * 20).toFixed(2)));
      this.requiredCalories.fatsCalories = Math.round(Number((this.requiredCalories.caloriesSum / 100 * 30).toFixed(2)));
    }
    if(gender === "Female" && fitnessGoal !== "Burn Fat"){
      this.requiredCalories.caloriesSum = (10 * Number(weight)) + (6.25 * Number(height)) + (-5 * Number(age)) - 165 + 200;
      this.requiredCalories.carbsCalories = Math.round(Number((this.requiredCalories.caloriesSum / 100 * 50).toFixed(2)));
      this.requiredCalories.proteinsCalories = Math.round(Number((this.requiredCalories.caloriesSum / 100 * 20).toFixed(2)));
      this.requiredCalories.fatsCalories = Math.round(Number((this.requiredCalories.caloriesSum / 100 * 30).toFixed(2)));
    }
    if(gender === "Male" && fitnessGoal === "Burn Fat"){
      this.requiredCalories.caloriesSum = (10 * Number(weight)) + (6.25 * Number(height)) + (-5 * Number(age)) + 5;
      this.requiredCalories.carbsCalories = Math.round(Number((this.requiredCalories.caloriesSum / 100 * 50).toFixed(2)));
      this.requiredCalories.proteinsCalories = Math.round(Number((this.requiredCalories.caloriesSum / 100 * 20).toFixed(2)));
      this.requiredCalories.fatsCalories = Math.round(Number((this.requiredCalories.caloriesSum / 100 * 30).toFixed(2)));
    }
    if(gender === "Female" && fitnessGoal === "Burn Fat"){
      this.requiredCalories.caloriesSum = (10 * Number(weight)) + (6.25 * Number(height)) + (-5 * Number(age)) - 165;
      this.requiredCalories.carbsCalories = Math.round(Number((this.requiredCalories.caloriesSum / 100 * 50).toFixed(2)));
      this.requiredCalories.proteinsCalories = Math.round(Number((this.requiredCalories.caloriesSum / 100 * 20).toFixed(2)));
      this.requiredCalories.fatsCalories = Math.round(Number((this.requiredCalories.caloriesSum / 100 * 30).toFixed(2)));
    }
  }
}
