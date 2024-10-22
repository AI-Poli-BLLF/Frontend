import {Injectable} from '@angular/core';
import {Student} from '../models/student.model';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Course} from '../models/course.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private url = 'https://localhost:4200/API/students';
  private urlCourses = 'https://localhost:4200/API/courses';

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  // add a student
  add(student: Student): Observable<Student>{
    // console.log('UPDATE');
    return this.httpClient.post<Student>(this.url, student)
      .pipe(
        map(s =>  new Student(s.id, s.name, s.firstName, s.email)),
        catchError( err => {
          console.error(err);
          return throwError('StudentService add error: ' + err.message);
        })
      );
  }

  // get a student
  getOne(id: string): Observable<Student>{
    // console.log('FIND');
    return this.httpClient.get<Student>(this.url + '/' + id)
      .pipe(
        map(s =>  new Student(s.id, s.name, s.firstName, s.email)),
        catchError( err => {
          console.error(err);
          return throwError('StudentService getOne error: ' + err.message);
        }));
  }

  // get all students
  getAll(): Observable<Array<Student>>{
    // console.log('QUERY');
    return this.httpClient.get<Array<Student>>(this.url)
      .pipe(
        map(s => s.map(s2 => new Student(s2.id, s2.name, s2.firstName, s2.email))),
        catchError( err => {
          console.error(err);
          return throwError('StudentService getAll error: ' + err.message);
        })
      );
  }

  // get all enrolled students
  getEnrolled(courseName: string): Observable<Array<Student>>{
    return this.httpClient.get<Array<Student>>(this.urlCourses + '/' + courseName + '/enrolled')
      .pipe(
        map(s => s.map(s2 => new Student(s2.id, s2.name, s2.firstName, s2.email))),
        catchError( err => {
          console.error(err);
          return throwError('StudentService getEnrolled error: ' + err.message);
        })
      );
  }

  // permette una post al servizio di iscrizione di uno studente a un determinato corso
  enrollStudent(courseName: string, studentId: string): Observable<any>{
    return this.httpClient.post<any>(this.urlCourses + '/' + courseName + '/enrollOne', studentId)
      .pipe(
        catchError( err => {
          console.error(err);
          return throwError('StudentService getAll error: ' + err.message);
        })
      );
  }

  // permette chiamada al servizio di eliminazione di uno studente da un corso
  removeStudentFromCourse(courseName: string, studentId: string): Observable<any>{
    return this.httpClient.delete<any>(this.urlCourses + '/' + courseName + '/enrolled/' + studentId)
      .pipe(
        catchError( err => {
          console.error(err);
          return throwError('StudentService removeStudentFromCourse error: ' + err.message);
        })
      );
  }

  getPhoto(studentId: string): Observable<any>{
    return this.httpClient.get(this.url + '/' + studentId + '/photo',  { responseType: 'blob' });
  }

  // ritorna i corsi al quale lo studente può iscriversi
  // quindi corsi attivi ma a cui lo studente non è ancora iscritto
  getAvailableCourse() {
    const url = `${this.url}/${this.authService.getId()}/available-courses`;
    return this.httpClient.get<Array<Course>>(url)
      .pipe(
        map(c => c.map(c2 => new Course(c2.name, c2.enabled, c2.min, c2.max, c2.acronym))),
        catchError( err => {
          console.error(err);
          return throwError(`CourseService getAvailableCourseForStudent error: ${err.message}`);
        })
      );
  }
}
