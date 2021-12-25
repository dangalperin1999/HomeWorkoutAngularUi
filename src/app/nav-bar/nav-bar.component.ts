import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  loggedinUser: string | null = "";
  constructor(private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
    if(!this.loggedin()){
      this.router.navigate(['user/login']);
    }
  }

  loggedin(){
    this.loggedinUser = localStorage.getItem('userName');
    return this.loggedinUser;
  }

  onLogout(){
    localStorage.removeItem('id');
    localStorage.removeItem('userName');
    localStorage.removeItem('fitnessGoal');
    localStorage.removeItem('fitnessLevel');
    localStorage.removeItem('age');
    localStorage.removeItem('height');
    localStorage.removeItem('weight');
    localStorage.removeItem('gender');
    localStorage.removeItem('token');
    this.alertify.success('You are logged out!');
    this.router.navigate(['user/login']);
  }
}
