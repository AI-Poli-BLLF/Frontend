import {Injectable} from '@angular/core';
import {Student} from '../models/student.model';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Course} from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private url = 'https://localhost:8080/API/courses';

  constructor(private httpClient: HttpClient) { }

  // add a course
  add(course: Course): Observable<Course>{
    console.log('UPDATE');
    return this.httpClient.post<Course>(this.url, course)
      .pipe(
        map(c =>  new Course(c.name, c.enabled, c.min, c.max)),
        catchError( err => {
          console.error(err);
          return throwError('CourseService add error: ${err.message}');
        })
      );
  }

  // get a course
  getOne(name: string): Observable<Course>{
    console.log('FIND');
    return this.httpClient.get<Course>(this.url + '/' + name)
      .pipe(
        map(c =>  new Course(c.name, c.enabled, c.min, c.max)),
        catchError( err => {
          console.error(err);
          return throwError('CourseService getOne error: ${err.message}');
        }));
  }

  // get all courses
  getAll(): Observable<Array<Course>>{
    return this.httpClient.get<Array<Course>>(this.url)
      .pipe(
        map(c => c.map(c2 => new Course(c2.name, c2.enabled, c2.min, c2.max))),
        catchError( err => {
          console.error(err);
          return throwError('CourseService getAll error: ${err.message}');
        })
      );
  }

  // get all students enrolled
  getEnrolled(): Observable<Array<Student>>{
    return this.httpClient.get<Array<Student>>(this.url + '/' + name + '/enrolled')
      .pipe(
        map(s => s.map(s2 => new Student(s2.id, s2.name, s2.firstName, s2.photoName, s2.email))),
        catchError( err => {
          console.error(err);
          return throwError('CourseService getEnrolled error: ${err.message}');
        })
      );
  }
}
