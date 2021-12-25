import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IExercise } from '../models/IExercise';
import { map } from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class ExercisesService {

constructor(private http: HttpClient) { }
getAllExercises(): Observable<IExercise[]>{
  return this.http.get('https://localhost:44386/api/Exercises').pipe(
    map(data => {
      const jsonData = JSON.stringify(data);
      const exercisesArray: Array<IExercise> = new Array;
      let jsonObject = JSON.parse(jsonData);
      for(let i = 0;i<jsonObject.length;i++){
        exercisesArray.push(jsonObject[i]);
      }
      return exercisesArray;
    })
  );
}
}
