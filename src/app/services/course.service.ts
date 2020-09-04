import {Injectable} from '@angular/core';
import {Student} from '../models/student.model';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Course} from '../models/course.model';
import {Team} from "../models/team.model";
import {VmConfig} from "../models/vm.config.model";
import {Vm} from "../models/vm.model";

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private url = 'https://localhost:4200/API/courses';
  private urlProfessors = 'https://localhost:4200/API/professors';
  private urlStudents = 'https://localhost:4200/API/students';

  constructor(private httpClient: HttpClient) { }

  // add a course
  update(course: Course): Observable<Course>{
    console.log('UPDATE');
    return this.httpClient.put<Course>(this.url + '/' + course.name, course)
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
          return throwError('CourseService getAll of professor error: ${err.message}');
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

  // get all courses of a student
  getAllByStudent(studentId: string): Observable<Array<Course>>{
    return this.httpClient.get<Array<Course>>(this.urlStudents + '/' + studentId + '/courses')
      .pipe(
        map(c => c.map(c2 => new Course(c2.name, c2.enabled, c2.min, c2.max))),
        catchError( err => {
          console.error(err);
          return throwError('CourseService getAll of student error: ${err.message}');
        })
      );
  }

  // get all teams of a course
  getTeamsForCourse(courseName: string): Observable<Array<Team>>{
    return this.httpClient.get<Array<Team>>(this.url + '/' + courseName + '/teams')
      .pipe(
        map(c => c.map(c2 => new Team(c2.id, c2.name, c2.status))),
        catchError( err => {
          console.error(err);
          return throwError('CourseService getTeamsForCourse error: ${err.message}');
        })
      );
  }

  getTeamVMConfig(courseName: string, teamId: number, teamName: string): Observable<VmConfig>{
    return this.httpClient.get<VmConfig>(this.url + '/' + courseName + '/teams/' + teamId + '/vm-config')
      .pipe(
        map(c => new VmConfig(c.id, teamId, teamName, c.maxCpu, c.maxRam, c.maxDisk, c.maxVm, c.maxActive)),
        catchError( err => {
          console.error(err);
          return throwError('CourseService getTeamVMConfig error: ${err.message}');
        })
      );
  }

  getTeamVMs(courseName: string, teamId: number): Observable<Array<Vm>>{
    return this.httpClient.get<Array<Vm>>(this.url + '/' + courseName + '/teams/' + teamId + '/vms')
      .pipe(
        map(c => {
          console.log(c);
          // todo: ricavare lo studente
          return c.map(c2 => new Vm(c2.id, c2.active, c2.cpu, c2.ramSize, c2.diskSize));
        }),
        catchError( err => {
          console.error(err);
          return throwError('CourseService getTeamVMs error: ${err.message}');
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
