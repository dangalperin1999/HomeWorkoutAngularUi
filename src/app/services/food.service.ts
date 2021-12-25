import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IFood } from '../models/IFood';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

constructor(private http: HttpClient) { }
getAllFood(){
  return this.http.get('https://localhost:44386/api/Food').pipe(
    map(data => {
      const jsonData = JSON.stringify(data);
      const foodArray: Array<IFood> = new Array;
      let jsonObject = JSON.parse(jsonData);
      for(let i = 0;i<jsonObject.length;i++){
        foodArray.push(jsonObject[i]);
      }
      return foodArray;
    })
  );
}
}
