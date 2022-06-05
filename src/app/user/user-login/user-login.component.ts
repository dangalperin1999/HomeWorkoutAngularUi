import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  constructor(private authService: AuthService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
  }

  onLogin(loginForm: NgForm){
    this.authService.authUser(loginForm.value).subscribe(
      response => {
        const user = Object.values(response);
        localStorage.setItem('id', user[0]);
        localStorage.setItem('userName', user[1]);
        localStorage.setItem('fitnessGoal', user[2]);
        localStorage.setItem('fitnessLevel', user[3]);
        localStorage.setItem('age', user[4]);
        localStorage.setItem('height', user[5]);
        localStorage.setItem('weight', user[6]);
        localStorage.setItem('gender', user[7]);
        localStorage.setItem('token', user[8]);
        this.alertify.success('Login successful');
        this.router.navigate(['/']);
      }, error => {
        console.log(error);
        this.alertify.error("Username or password is incorrect");
      }
    );
  }

  routeToRegisterForm(){
    this.router.navigate(['/user/register']);
  }
}
