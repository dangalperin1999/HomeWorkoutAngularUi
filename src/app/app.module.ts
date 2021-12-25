import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomWorkoutPlanComponent } from './workout-plans/custom-workout-plan/custom-workout-plan.component';
import { WorkoutPlanComponent } from './workout-plans/workout-plan/workout-plan.component';
import { HttpClientModule } from '@angular/common/http';
import { CategorizedExercisesService } from './services/categorizedExercises.service';
import { DiaryComponent } from './workout-plans/diary/diary.component';
import { DietComponent } from './workout-plans/diet/diet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserRegisterComponent } from './user/user-register/user-register.component';
import { AlertifyService } from './services/alertify.service';
import { AuthService } from './services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ExercisesService } from './services/exercises.service';
import { UserWorkoutPlanService } from './services/userWorkoutPlan.service';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';


const appRoutes: Routes = [
  {path: '', component: WorkoutPlanComponent},
  {path: 'custom-workout-plan', component: CustomWorkoutPlanComponent},
  {path: 'diary', component: DiaryComponent},
  {path: 'diet', component: DietComponent},
  {path: 'user/login', component: UserLoginComponent},
  {path: 'user/register', component: UserRegisterComponent},
  {path: 'user/profile', component: UserProfileComponent},
  {path: '**', component: WorkoutPlanComponent}
]
@NgModule({
  declarations: [
    AppComponent,
    CustomWorkoutPlanComponent,
    WorkoutPlanComponent,
    NavBarComponent,
    DiaryComponent,
    DietComponent,
    UserLoginComponent,
    UserRegisterComponent,
    UserProfileComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    BsDropdownModule
  ],
  providers: [
    CategorizedExercisesService,
    AlertifyService,
    AuthService,
    ExercisesService,
    UserWorkoutPlanService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
