import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable, throwError} from 'rxjs';
import {Assignment} from '../models/assignment.model';
import {catchError, map} from 'rxjs/operators';
import {Draft} from '../models/draft.model';
import {Student} from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  private host = 'https://localhost:4200';
  private url = this.host + '/API';

  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  getAllAssignments(professorId: string, courseName: string): Observable<Array<Assignment>> {
    return this.httpClient
      .get<Array<Assignment>>(this.url + '/professors/' + professorId + '/' + courseName + '/assignments')
      .pipe(
        map(arr => arr.map(
          a => new Assignment(a.id, a.name, a.releaseDate, a.expiryDate),
          // a => console.log('helo' + a)
        )),
        catchError(err => {
          console.error(err);
          return throwError('AssignmentService getAllAssignments error: ' + err.message);
        })
      );
  }

  createAssignment(professorId: string, courseName: string, assignment: Assignment): Observable<Assignment> {
    return this.httpClient
      .post<Assignment>(this.url + '/professors/' + professorId + '/' + courseName + '/createAssignment', assignment)
      .pipe(
        map(a => new Assignment(a.id, a.name, a.releaseDate, a.expiryDate)),
        catchError(err => {
          console.error(err);
          return throwError('AssignmentService addAssignment error: ' + err.message);
        })
      );
  }

    getDrafts(professorId: string, courseName: string, assignmentId: number) {
    return this.httpClient
      .get<Array<Draft>>(this.url + '/professors/' + professorId + '/' + courseName + '/' + assignmentId + '/drafts')
      .pipe(
        map(arr => arr.map(
          a => new Draft(a.id, a.timestamp, a.grade, a.state, a.lock, a.student),
        )),
        catchError(err => {
          console.error(err);
          return throwError('AssignmentService getDrafts error:', err);
        })
      );
  }

  getStudentForDraft(draftId: number) {
    return this.httpClient
      .get<Student>(this.url + '/professors/' + draftId + '/getStudent')
      .pipe(
        map( s => new Student(s.id, s.name, s.firstName, s.photoName, s.email)),
        catchError(err => {
          console.error(err);
          return throwError('AssignmentService getStudentForDraft error: ${err.message}', err);
        })
      );
  }

  getAssignmentForCourse(courseName: string){
    return this.httpClient
      .get<Array<Assignment>>(this.url + '/courses/' + courseName + '/assignments')
      .pipe(
        map(arr => arr.map(
          a => new Assignment(a.id, a.name, a.releaseDate, a.expiryDate)
        )),
        catchError(err => {
          console.error(err);
          return throwError('AssignmentService getAssignmentForCourse error: ', err);
        })
      );
  }

  getDraftForStudent(studentId: string){
    return this.httpClient
      .get<Array<Draft>>(this.url + /students/ + studentId + '/drafts')
      .pipe(
        map(arr => arr.map(
          a => new Draft(a.id, a.timestamp, a.grade, a.state, a.lock, a.student)
        )),
        catchError(err => {
          console.error(err);
          return throwError('AssignmentService getDraftForStudent error: ', err);
        })
      );
  }

  addDraft(draft: Draft, assignment: Assignment, studentId: string){
    // this.httpClient
    //   .post<Draft>('')
  }


}
