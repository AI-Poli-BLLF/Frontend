import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable, throwError} from 'rxjs';
import {Assignment} from '../models/assignment.model';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  private host = 'https://localhost:4200';
  private url = this.host + '/API';
  constructor(private httpClient: HttpClient, private authService: AuthService){}

  getAllAssignments(professorId: string, courseName: string): Observable<Array<Assignment>>{
    return this.httpClient
      .get<Array<Assignment>>(this.url + '/professors/' + professorId + '/' + courseName + '/assignments')
      .pipe(
        map(arr => arr.map(
          a => new Assignment(a.id, a.releaseDate, a.expiryDate),
          a => console.log('helo' + a)
        )),
        catchError( err => {
          console.error(err);
          return throwError('AssignmentService getAllAssignments error: ' + err.message);
        })
      );
  }
}
