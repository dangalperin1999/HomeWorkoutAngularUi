import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IUserWorkoutPlan } from '../models/IUserWorkoutPlan';

@Injectable({
  providedIn: 'root'
})
export class UserWorkoutPlanService {

constructor(private http: HttpClient) { }

getUserWorkoutPlans(){
  return this.http.get("https://localhost:44386/api/UserWorkoutPlans").pipe(
    map(data => {
      const jsonData = JSON.stringify(data);
      const userWorkoutPlansArray: Array<IUserWorkoutPlan> = new Array;
      let jsonObject = JSON.parse(jsonData);
      for(let i = 0;i<jsonObject.length;i++){
        userWorkoutPlansArray.push(jsonObject[i]);
      }
      return userWorkoutPlansArray;
    })
  );
}

postUserWorkoutPlan(userWorkoutPlan: IUserWorkoutPlan){
  return this.http.post("https://localhost:44386/api/UserWorkoutPlans", userWorkoutPlan);
}

deleteUserWorkoutPlan(userWorkoutPlan: IUserWorkoutPlan){
  return this.http.delete("https://localhost:44386/api/UserWorkoutPlans/" + userWorkoutPlan.id);
}

updateUserWorkoutPlan(id: number, userWorkoutPlan: IUserWorkoutPlan){
  return this.http.put("https://localhost:44386/api/UserWorkoutPlans/" + id, userWorkoutPlan);
}
}
