import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getWeatherForCity(city: string): Observable<any> {
    const path = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=dd65c4d6391f2e77d438c664e5005e7c`;
    return this.http.get(path).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 404) {
      // A client-side or network error occurred. Handle it accordingly.
      let input = document.getElementById("input")
      if(input){
        input.style.color = "#9b797d"
      }
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
