import {Injectable} from '@angular/core';
import {Student} from '../models/student.model';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Team} from "../models/team.model";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private url = 'https://localhost:4200/API/students';
  private urlCourses = 'https://localhost:4200/API/courses';

  constructor(private httpClient: HttpClient) { }

  // add a student
  add(student: Student): Observable<Student>{
    console.log('UPDATE');
    return this.httpClient.post<Student>(this.url, student)
      .pipe(
        map(s =>  new Student(s.id, s.name, s.firstName, s.photoName, s.email)),
        catchError( err => {
          console.error(err);
          return throwError('StudentService add error: ' + err.message);
        })
      );
  }

  // get a student
  getOne(id: string): Observable<Student>{
    console.log('FIND');
    return this.httpClient.get<Student>(this.url + '/' + id)
      .pipe(
        map(s =>  new Student(s.id, s.name, s.firstName, s.photoName, s.email)),
        catchError( err => {
          console.error(err);
          return throwError('StudentService getOne error: ' + err.message);
        }));
  }

  // get all students
  getAll(): Observable<Array<Student>>{
    console.log('QUERY');
    return this.httpClient.get<Array<Student>>(this.url)
      .pipe(
        map(s => s.map(s2 => new Student(s2.id, s2.name, s2.firstName, s2.photoName, s2.email))),
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
        map(s => s.map(s2 => new Student(s2.id, s2.name, s2.firstName, s2.photoName, s2.email))),
        catchError( err => {
          console.error(err);
          return throwError('StudentService getEnrolled error: ' + err.message);
        })
      );
  }

  enrollStudent(courseName: string, studentId: string): Observable<any>{
    return this.httpClient.post<any>(this.urlCourses + '/' + courseName + '/enrollOne', studentId)
      .pipe(
        catchError( err => {
          console.error(err);
          return throwError('StudentService getAll error: ' + err.message);
        })
      );
  }

  getTeam(courseName: string, studentId: string): Observable<Team>{
    return this.httpClient.post<any>(this.urlCourses + '/' + courseName + '/enrollOne', studentId)
      .pipe(
        catchError( err => {
          console.error(err);
          return throwError('StudentService getAll error: ' + err.message);
        })
      );
  }
}
