import {Injectable} from '@angular/core';
import {Student} from '../models/student.model';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Team} from "../models/team.model";
import {Professor} from "../models/professor.model";

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  private url = 'https://localhost:4200/API/professors';

  constructor(private httpClient: HttpClient) { }

  // get all professors
  getAll(): Observable<Array<Professor>>{
    return this.httpClient.get<Array<Professor>>(this.url)
      .pipe(
        map(s => s.map(s2 => new Professor(s2.id, s2.name, s2.firstName))),
        catchError( err => {
          console.error(err);
          return throwError('ProfessorService getAll error: ' + err.message);
        })
      );
  }

  // invito a uno o più docenti a partecipare alla gestione del corso
  shareCourse(courseName: string, professorId: string, memberIds: string[]): Observable<any>{
    return this.httpClient.post<any>(this.url + '/' + professorId + '/courses/' + courseName + '/cooperate' , memberIds)
      .pipe(
        catchError( err => {
          console.error(err);
          return throwError(`ProfessorService shareCourse error: ${err.message}`);
        })
      );
  }

  getPhoto(professorId: string): Observable<any>{
    return this.httpClient.get(this.url + '/' + professorId + '/photo',  { responseType: 'blob' });
  }
}
