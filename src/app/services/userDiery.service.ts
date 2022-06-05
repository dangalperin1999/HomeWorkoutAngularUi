import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IUserDiery } from '../models/IUserDiery';

@Injectable({
  providedIn: 'root'
})
export class UserDieryService {

constructor(private http: HttpClient) { }
getUserDieries(){
  return this.http.get("https://localhost:44386/api/UsersDieries").pipe(
    map(data => {
      const jsonData = JSON.stringify(data);
      const userDieriesArray: Array<IUserDiery> = new Array;
      let jsonObject = JSON.parse(jsonData);
      for(let i = 0;i<jsonObject.length;i++){
        userDieriesArray.push(jsonObject[i]);
      }
      return userDieriesArray;
    })
  );
}

postUserDiery(userDiery: IUserDiery){
  return this.http.post("https://localhost:44386/api/UsersDieries", userDiery);
}

deleteUserDiery(userDiery: IUserDiery){
  return this.http.delete("https://localhost:44386/api/UsersDieries/" + userDiery.id);
}

updateUserDiery(id: number, userDiery: IUserDiery){
  return this.http.put("https://localhost:44386/api/UsersDieries/" + id, userDiery);
}
}
