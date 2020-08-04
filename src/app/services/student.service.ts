import {Injectable} from '@angular/core';
import {Student} from '../student.model';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private url = 'https://localhost:4200/api/students';

  constructor(private httpClient: HttpClient) { }

  create(student: Student): Observable<Student>{
    console.log('CREATE');
    return this.httpClient.post<Student>(this.url,  student)
      .pipe(
        map(s => new Student(s.id, s.name, s.firstName, s.group, s.courseId)),
        catchError( err => {
          console.error(err);
          return throwError('StudentService create error: ${err.message}');
        })
      );
  }

  update(student: Student): Observable<Student>{
    console.log('UPDATE');
    return this.httpClient.put<Student>(this.url + '/' + student.id, student)
      .pipe(
        map(s => new Student(s.id, s.name, s.firstName, s.group, s.courseId)),
        catchError( err => {
          console.error(err);
          return throwError('StudentService update error: ${err.message}');
        })
      );
  }

  find(id: number): Observable<Student>{
    console.log('FIND');
    return this.httpClient.get<Student>(this.url + '/' + id)
      .pipe(
        map(s => new Student(s.id, s.name, s.firstName, s.group, s.courseId)),
        catchError( err => {
          console.error(err);
          return throwError('StudentService find error: ${err.message}');
        }));
  }

  query(): Observable<Array<Student>>{
    console.log('QUERY');
    return this.httpClient.get<Array<Student>>(this.url)
      .pipe(
        map(s => s.map(s2 => new Student(s2.id, s2.name, s2.firstName, s2.group, s2.courseId))),
        catchError( err => {
          console.error(err);
          return throwError('StudentService query error: ${err.message}');
        })
      );
  }

  del(id: number): Observable<Student>{
    return this.httpClient.get<Student>(this.url + '/' + id).pipe(
      catchError( err => {
      console.error(err);
      return throwError('StudentService del error: ${err.message}');
    }));
  }

  updateEnrolled(student: Student, courseId: number): Observable<Student>{
    console.log('ENROLL/UNROLL STUDENT');
    student.courseId = courseId;
    return this.httpClient.put<Student>(this.url + '/' + student.id, student)
      .pipe(
        map(s => new Student(s.id, s.name, s.firstName, s.group, s.courseId)),
        catchError( err => {
          console.error(err);
          return throwError('StudentService update enrolled error: ${err.message}');
        })
      );
  }

  getEnrolled(courseId: number): Observable<Array<Student>>{
    console.log('GET ENROLLED STUDENT');
    return this.httpClient.get<Array<Student>>(this.url)
      .pipe(
        map(s => s.map(s2 => new Student(s2.id, s2.name, s2.firstName, s2.group, s2.courseId),
          catchError( err => {
            console.error(err);
            return throwError('StudentService get enrolled error: ${err.message}');
          })
          )
        .filter(s3 => s3.courseId === courseId)));
  }

}
