import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUserDiet } from '../models/IUserDiet';

@Injectable({
  providedIn: 'root'
})
export class UserDietService {

constructor(private http: HttpClient) { }

getUserDiets(): Observable<IUserDiet[]>{
  return this.http.get("https://localhost:44386/api/UsersDiets").pipe(
    map(data => {
      const jsonData = JSON.stringify(data);
      const userDietsArray: IUserDiet[] = [];
      let jsonObject = JSON.parse(jsonData);
      for(let i = 0;i<jsonObject.length;i++){
        userDietsArray.push(jsonObject[i]);
      }
      return userDietsArray;
    })
  );
}

postUserDiet(userDiet: IUserDiet){
  return this.http.post("https://localhost:44386/api/UsersDiets", userDiet);
}

deleteUserDiet(userDiet: IUserDiet){
  return this.http.delete("https://localhost:44386/api/UsersDiets/" + userDiet.id);
}
}
