import {Injectable} from '@angular/core';
import {Student} from '../models/student.model';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Course} from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private url = 'https://localhost:4200/API/courses';
  private urlProfessors = 'https://localhost:4200/API/professors';

  constructor(private httpClient: HttpClient) { }

  // add a course
  add(course: Course): Observable<Course>{
    console.log('UPDATE');
    return this.httpClient.post<Course>(this.url, course)
      .pipe(
        map(c =>  new Course(c.name, c.enabled, c.min, c.max)),
        catchError( err => {
          console.error(err);
          return throwError(err);
        })
      );
  }

  deleteOne(name: string): Observable<any>{
    // todo: gestire eccezioni
    return this.httpClient.delete(this.url + '/' + name);
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

  // get all courses
  getAllByProfessor(professorId: string): Observable<Array<Course>>{
    return this.httpClient.get<Array<Course>>(this.urlProfessors + '/' + professorId + '/courses')
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
