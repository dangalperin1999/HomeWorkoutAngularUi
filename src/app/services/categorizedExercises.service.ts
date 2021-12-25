import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs/internal/Observable';
import { ICategorizedExercise } from '../models/ICategorizedExercise';
@Injectable({
  providedIn: 'root'
})
export class CategorizedExercisesService {

  constructor(private http:HttpClient) { }

  getAllCategorizedExercises(): Observable<ICategorizedExercise[]>{
    return this.http.get('https://localhost:44386/api/CategorisedExercises').pipe(
      map(data => {
        const jsonData = JSON.stringify(data);
        const categorizedExercisesArray: Array<ICategorizedExercise> = new Array;
        let jsonObject = JSON.parse(jsonData);
        for(let i = 0;i<jsonObject.length;i++){
          categorizedExercisesArray.push(jsonObject[i]);
        }
        return categorizedExercisesArray;
      })
    );
  }

}
