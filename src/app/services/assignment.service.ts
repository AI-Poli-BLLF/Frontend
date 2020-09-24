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

  // restituisce tutti gli elaborati, dato il corso e la consegna.
  // chiamata dal docente
  getProfessorDrafts(courseName: string, assignmentId: number) {
    return this.httpClient
      .get<Array<Draft>>(this.url + '/courses/' + courseName + '/assignments/' + assignmentId + '/drafts')
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

  // restituisce lo studente relativo ad un certo elaborato
  getStudentForDraft(courseName: string, assignmentId: number, draftId: number) {
    return this.httpClient
      .get<Student>(`${this.url}/courses/${courseName}/assignments/${assignmentId}/drafts/${draftId}/student`)
      .pipe(
        map( s => new Student(s.id, s.name, s.firstName, s.email)),
        catchError(err => {
          console.error(err);
          return throwError(`AssignmentService getStudentForDraft error: ${err.message}`);
        })
      );
  }

  // restituisce tutte le consegne create per un determinato corso
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

  // restituisce tutti gli elaborati dello studente, per specifico corso
  // e per specifica consegna
  getDraftForStudent(studentId: string, courseName: string, assignmentId: number): Observable<Draft[]>{
    return this.httpClient
      .get<Array<Draft>>(this.url + '/students/' + studentId + '/courses/' + courseName + '/assignments/' + assignmentId + '/drafts')
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

  // permette di aggiungere una nuova correzione ad un particolare elaborato
  // la correzione è un'immagine
  uploadCorrection(courseName: string, assignmentId: number, draftId: number, file: File): Observable<any>{
    const path = `${this.url}/courses/${courseName}/assignments/${assignmentId}/drafts/${draftId}/correction`;
    const body = new FormData();
    body.append('image', file);
    return this.httpClient.post(path, body);
  }

  // permette di caricare un nuovo elaborato, data la consegna e lo studente
  // viene fatta dallo studente
  // l'elaborato è un'immagine
  // ritorna l'elaborato
  uploadDraft(studentId: string, courseName: string, assignmentId: number, file: File): Observable<Draft>{
    const path = `${this.url}/students/${studentId}/courses/${courseName}/assignments/${assignmentId}/drafts/`;
    const body = new FormData();
    body.append('image', file);
    return this.httpClient.post<Draft>(path, body)
      .pipe(
        map(d => new Draft(d.id, d.timestamp, d.grade, d.state, d.locker)),
        catchError(err => {
          console.log(err);
          return throwError('AssignmentService uploadDraft error: ' + err.message);
        })
      );
  }

  // permette di caricare una nuova consegna per un corso
  // viene chiamata da uno dei docenti del corso
  // la consegna è un'immagine
  // ritorna la consegna
  uploadAssignment(courseName: string, file: File, assignment: Assignment): Observable<Assignment>{
    const path = `${this.url}/courses/${courseName}/assignments`;
    const body = new FormData();
    body.append('image', file);
    body.append('json', JSON.stringify(assignment));
    return this.httpClient.post<Assignment>(path, body)
      .pipe(
      map(a => new Assignment(a.id, a.name, a.releaseDate, a.expiryDate)),
      catchError(err => {
        console.error(err);
        return throwError('AssignmentService uploadAssignment error: ' + err.message);
      })
    );
  }


  // permette al docente di caricare la correzione per un determinato elaborato
  // e nel contempo dare un voto.
  // da questo momento in poi l'elaborato non è più modificabile dallo studente
  // la correzione è un'immagine
  uploadGradeAndCorrection(courseName: string, assignmentId: number, draftId: number,
                           file: File, grade: number): Observable<any>{
    const path = `${this.url}/courses/${courseName}/assignments/${assignmentId}/drafts/${draftId}/evaluate`;
    const body = new FormData();
    body.append('image', file);
    body.append('grade', '' + grade);
    return this.httpClient.post(path, body);
  }

  // restituisce l'immagine della consegna per lo studente
  getAssigment(studentId: string, courseName: string, assignmentId: number): Observable<any> {
    const path = `${this.url}/students/${studentId}/courses/${courseName}/assignments/${assignmentId}/image`;
    return this.httpClient.get(path,  { responseType: 'blob' });
  }

  // restituisce l'immagine della consegna per il docente
  getAssigmentProf(courseName: string, assignmentId: number): Observable<any> {
    const path = `${this.url}/courses/${courseName}/assignments/${assignmentId}/image`;
    return this.httpClient.get(path,  { responseType: 'blob' });
  }

  // restituisce l'elaborato per lo studente
  getDraft(studentId: string, courseName: string, assignmentId: number, draftId: number): Observable<any> {
    const path = `${this.url}/students/${studentId}/courses/${courseName}/assignments/${assignmentId}/draft/${draftId}/image`;
    return this.httpClient.get(path,  { responseType: 'blob' });
  }

  // restituisce l'elaborato per il docente
  getDraftProf(courseName: string, assignmentId: number, draftId: number): Observable<any> {
    const path = `${this.url}/courses/${courseName}/assignments/${assignmentId}/draft/${draftId}/image`;
    return this.httpClient.get(path,  { responseType: 'blob' });
  }

  // restituisce l'immagine della correzione per lo studente
  getCorrection(studentId: string, courseName: string, assignmentId: number, draftId: number): Observable<any> {
    const path = `${this.url}/students/${studentId}/courses/${courseName}/assignments/${assignmentId}/draft/${draftId}/correction-image`;
    return this.httpClient.get(path,  { responseType: 'blob' });
  }
}
