import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/models/IUser';
import { AuthService } from 'src/app/services/auth.service';
import * as alertyfy from 'alertifyjs';
import { AlertifyService } from 'src/app/services/alertify.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {

  registerationForm!: FormGroup;
  user!: IUser;
  userSubmitted!: boolean;
  constructor(private fb: FormBuilder, private authService: AuthService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.createRegisterationForm();
  }

  createRegisterationForm(){
    this.registerationForm = this.fb.group({
      userName: [null, Validators.required],
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

  get userName(){
    return this.registerationForm.get('userName') as FormControl;
  }

  get password(){
    return this.registerationForm.get('password') as FormControl;
  }

  get confirmPassword(){
    return this.registerationForm.get('confirmPassword') as FormControl;
  }

  get fitnessGoal(){
    return this.registerationForm.get('fitnessGoal') as FormControl;
  }

  get fitnessLevel(){
    return this.registerationForm.get('fitnessLevel') as FormControl;
  }

  get age(){
    return this.registerationForm.get('age') as FormControl;
  }

  get height(){
    return this.registerationForm.get('height') as FormControl;
  }

  get weight(){
    return this.registerationForm.get('weight') as FormControl;
  }

  get gender(){
    return this.registerationForm.get('gender') as FormControl;
  }
  onSubmit(){
    this.userSubmitted = true;
    if(this.registerationForm.valid){
      console.log(this.registerationForm);
      this.authService.registerUser(this.userData()).subscribe(() =>
      {
        this.userSubmitted = false;
        this.registerationForm.reset();
        this.alertify.success("Congrats, you are successfully registered");
      }, error => {
        this.alertify.error('Provide the required fields');
      });
    }
  }

  userData(): IUser{
    return this.user = {
      userName: this.userName.value,
      password: this.password.value,
      fitnessGoal: this.fitnessGoal.value,
      fitnessLevel: this.fitnessLevel.value,
      age: this.age.value,
      height: this.height.value,
      weight: this.weight.value,
      gender: this.gender.value,
    }
  }

  routeToLoginForm(){
    this.router.navigate(['/user/login']);
  }
}
