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
      .get<Array<Assignment>>(this.url + '/professors/' + professorId + '/courses/' + courseName + '/assignments')
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
      .post<Assignment>(this.url + '/professors/' + professorId + '/courses/' + courseName + '/createAssignment', assignment)
      .pipe(
        map(a => new Assignment(a.id, a.name, a.releaseDate, a.expiryDate)),
        catchError(err => {
          console.error(err);
          return throwError('AssignmentService addAssignment error: ' + err.message);
        })
      );
  }

  getProfessorDrafts(professorId: string, courseName: string, assignmentId: number) {
    return this.httpClient
      .get<Array<Draft>>(this.url + '/professors/' + professorId + '/courses/' + courseName + '/assignments/' + assignmentId + '/drafts')
      .pipe(
        map(arr => arr.map(
          a => new Draft(a.id, a.timestamp, a.grade, a.state, a.locker)
        )),
        catchError(err => {
          console.error(err);
          return throwError('AssignmentService getProfessorDrafts error:' + err.message);
        })
      );
  }

  getStudentForDraft(draftId: number) {
    return this.httpClient
      .get<Student>(this.url + '/professors/drafts/' + draftId + '/getStudent')
      .pipe(
        map( s => new Student(s.id, s.name, s.firstName, s.email)),
        catchError(err => {
          console.error(err);
          return throwError(`AssignmentService getStudentForDraft error: ${err.message}`);
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
          return throwError('AssignmentService getAssignmentForCourse error: ' + err.message);
        })
      );
  }

  getDraftForStudent(studentId: string, courseName: string, assignmentId: number): Observable<Draft[]>{
    return this.httpClient
      .get<Array<Draft>>(this.url + '/student/' + studentId + '/courses/' + courseName + '/assignments/' + assignmentId + '/drafts')
      .pipe(
        map(arr => arr.map(
          a => new Draft(a.id, a.timestamp, a.grade, a.state, a.locker)
        )),
        catchError(err => {
          console.error(err);
          return throwError('AssignmentService getDraftForStudent error: ' +  err.message);
        })
      );
  }

  addDraft(draft: Draft, assignment: Assignment, studentId: string){
    return this.httpClient
      .post<Draft>(this.url + '/students/' + studentId + '/assignments/' + assignment.id + '/createDraft/', draft)
      .pipe(
        map(d => new Draft(d.id, d.timestamp, d.grade, d.state, d.locker)),
        catchError(err => {
          console.log(err);
          return throwError('AssignmentService addDraft error: ' + err.message);
        })
      );
  }

  lockDraft(draft: Draft, assignmentId: number) {
    return this.httpClient
      .put<Draft>(this.url + '/professors/assignments/' + assignmentId + '/drafts/' + draft.id + '/lock', draft)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError('AssignmentService lockDraft error:', err.message);
        })
      );
  }


  uploadCorrection(professorId: string, courseName: string, assignmentId: number, draftId: number, file: File): Observable<any>{
    const path = `${this.url}/professors/${professorId}/courses/${courseName}/assignments/${assignmentId}/drafts/${draftId}/correction`;
    const body = new FormData();
    body.append('image', file);
    return this.httpClient.post(path, body);
  }

  uploadDraft(studentId: string, courseName: string, assignmentId: number, draftId: number, file: File): Observable<Draft>{
    const path = `${this.url}/students/${studentId}/courses/${courseName}/assignments/${assignmentId}/drafts/${draftId}/drafts`;
    const body = new FormData();
    body.append('image', file);
    return this.httpClient.post<Draft>(path, body)
      .pipe(
        map(d => new Draft(d.id, d.timestamp, d.grade, d.state, d.locker)),
        catchError(err => {
          console.log(err);
          return throwError('AssignmentService addDraft error: ' + err.message);
        })
      );
  }

  uploadAssignment(professorId: string, courseName: string, file: File, assignment: Assignment): Observable<Assignment>{
    const path = `${this.url}/professors/${professorId}/courses/${courseName}/assignments`;
    const body = new FormData();
    body.append('image', file);
    body.append('json', JSON.stringify(assignment));
    return this.httpClient.post<Assignment>(path, body)
      .pipe(
      map(a => new Assignment(a.id, a.name, a.releaseDate, a.expiryDate)),
      catchError(err => {
        console.error(err);
        return throwError('AssignmentService getAssignmentForCourse error: ' + err.message);
      })
    );
  }

  uploadGradeAndCorrection(professorId: string, courseName: string, assignmentId: number,
                           draftId: number, file: File, grade: Draft): Observable<any>{
    const path = `${this.url}/professors/${professorId}/courses/${courseName}/assignments/${assignmentId}/drafts/${draftId}/evaluate`;
    const body = new FormData();
    body.append('image', file);
    body.append('json', JSON.stringify(grade));
    return this.httpClient.post(path, body);
  }

  getAssigment(studentId: string, courseName: string, assignmentId: number): Observable<any> {
    const path = `${this.url}/students/${studentId}/courses/${courseName}/assignments/${assignmentId}/image`;
    return this.httpClient.get(path,  { responseType: 'blob' });
  }

  getAssigmentProf(professorId: string, courseName: string, assignmentId: number): Observable<any> {
    const path = `${this.url}/professor/${professorId}/courses/${courseName}/assignments/${assignmentId}/image`;
    return this.httpClient.get(path,  { responseType: 'blob' });
  }

  getDraft(studentId: string, courseName: string, assignmentId: number, draftId: number): Observable<any> {
    const path = `${this.url}/students/${studentId}/courses/${courseName}/assignments/${assignmentId}/draft/${draftId}/image`;
    return this.httpClient.get(path,  { responseType: 'blob' });
  }

  getCorrection(studentId: string, courseName: string, assignmentId: number, draftId: number): Observable<any> {
    const path = `${this.url}/students/${studentId}/courses/${courseName}/assignments/${assignmentId}/draft/${draftId}/correction-image;`;
    return this.httpClient.get(path,  { responseType: 'blob' });
  }

}
