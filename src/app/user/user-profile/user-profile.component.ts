import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/models/IUser';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  isPasswordInputVisible = false;
  isFitnessGoalInputVisible = false;
  isFitnessLevelInputVisible = false;
  isAgeInputVisible = false;
  isHeightInputVisible = false;
  isWeightInputVisible = false;
  isGenderInputVisible = false;
  userId = Number(localStorage.getItem('id')!);
  localUserName = localStorage.getItem('userName')!;
  localFitnessGoal = localStorage.getItem('fitnessGoal')!;
  localFitnessLevel = localStorage.getItem('fitnessLevel')!;
  localAge = Number(localStorage.getItem('age')!);
  localHeight = Number(localStorage.getItem('height')!);
  localWeight = Number(localStorage.getItem('weight')!);
  localGender = localStorage.getItem('gender')!;
  userForm!: FormGroup;
  user!: IUser;
  userSubmitted!: boolean;
  profileForm!: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.createRegisterationForm();
  }

  createRegisterationForm(){
    this.profileForm = this.fb.group({
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [null, [Validators.required]],
      fitnessGoal: [null, Validators.required],
      fitnessLevel: [null, Validators.required],
      age: [null, Validators.required],
      height: [null, Validators.required],
      weight: [null, Validators.required],
      gender: [null, Validators.required],
    }, {validators: this.passwordMatchingValidator});
  }
  passwordMatchingValidator(fc: AbstractControl): Validators | null{
    return fc.get('password')?.value === fc.get('confirmPassword')?.value ? null :
    {notmatched: true};
  }

  get password(){
    return this.profileForm.get('password') as FormControl;
  }

  get confirmPassword(){
    return this.profileForm.get('confirmPassword') as FormControl;
  }

  get fitnessGoal(){
    return this.profileForm.get('fitnessGoal') as FormControl;
  }

  get fitnessLevel(){
    return this.profileForm.get('fitnessLevel') as FormControl;
  }

  get age(){
    return this.profileForm.get('age') as FormControl;
  }

  get height(){
    return this.profileForm.get('height') as FormControl;
  }

  get weight(){
    return this.profileForm.get('weight') as FormControl;
  }

  get gender(){
    return this.profileForm.get('gender') as FormControl;
  }
  onSubmit(){
    this.userSubmitted = true;
      console.log(this.profileForm);
      this.authService.updateUser(this.userData()).subscribe(() =>
      {
        this.userSubmitted = false;
        this.profileForm.reset();
        this.alertify.success("Profile updated");
        if(this.password.errors!.minLength && this.isPasswordInputVisible || this.password.errors!.required && this.isPasswordInputVisible){
          this.alertify.error("Password was not changed");
        }
        window.location.reload();
      }, error => {
        this.alertify.error('Provide the required fields');
      });
      localStorage.setItem('fitnessGoal', this.user.fitnessGoal);
      localStorage.setItem('fitnessLevel', this.user.fitnessLevel);
      localStorage.setItem('age', String(this.user.age));
      localStorage.setItem('height', String(this.user.height));
      localStorage.setItem('weight', String(this.user.weight));
      localStorage.setItem('gender', this.user.gender);
  }

  userData(): IUser{
    this.user = {
      id: 0,
      userName: "",
      password: "",
      fitnessGoal: "",
      fitnessLevel: "",
      age: 0,
      height: 0,
      weight: 0,
      gender: ""
    };
    this.user.id = this.userId;
    this.user.userName = this.localUserName;
    if(this.password.value && !this.password.errors){
      this.user.password = this.password.value;
    }else{
      this.user.password = null;
    }

    if(this.fitnessGoal.value){
      this.user.fitnessGoal = this.fitnessGoal.value;
    }else{
      this.user.fitnessGoal = this.localFitnessGoal;
    }

    if(this.fitnessLevel.value){
      this.user.fitnessLevel = this.fitnessLevel.value;
    }else{
      this.user.fitnessLevel = this.localFitnessLevel;
    }

    if(this.age.value){
      this.user.age = this.age.value;
    }else{
      this.user.age = this.localAge;
    }

    if(this.height.value){
      this.user.height = this.height.value;
    }else{
      this.user.height = this.localHeight;
    }

    if(this.weight.value){
      this.user.weight = this.weight.value;
    }else{
      this.user.weight = this.localWeight;
    }

    if(this.gender.value){
      this.user.gender = this.gender.value;
    }else{
      this.user.gender = this.localGender;
    }

    return this.user;
  }

}
