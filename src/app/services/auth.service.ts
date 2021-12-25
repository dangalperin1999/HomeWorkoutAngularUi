import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserForLogin, IUser } from '../models/IUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

constructor(private http: HttpClient) { }

authUser(user: IUserForLogin){
  return this.http.post("https://localhost:44386/api/Users/authenticate", user);
}

registerUser(user: IUser){
  return this.http.post("https://localhost:44386/api/Users", user);
}

updateUser(user: IUser){
  return this.http.put("https://localhost:44386/api/Users/" + user.id, user);
}
}
