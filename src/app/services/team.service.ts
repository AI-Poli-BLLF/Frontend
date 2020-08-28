import {Injectable} from '@angular/core';
import {Student} from '../models/student.model';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, filter, map} from 'rxjs/operators';
import {Team} from '../models/team.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private url = 'https://localhost:4200/API';

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  // Get all (active and inactive) teams for course
  getAllTeams(courseName: string): Observable<Array<Team>>{
    return this.httpClient.get<Array<Team>>(this.url + '/courses/' + courseName + '/teams')
      .pipe(
        map(t => t.map(t2 => new Team(t2.id, t2.name, t2.status))),
        catchError( err => {
          console.error(err);
          return throwError('TeamService getAllTeams error: ' + err.message);
        })
      );
  }

  // Get team(s) a certain student is member of for a specific course.
  // If a student is part of an active team, only this will be returned,
  // otherwise all inactive teams the student is part of will be returned
  getTeamsByStudent(courseName: string, studentId: string): Observable<Array<Team>>{
    const userId = this.authService.getId();
    console.log('userId: ' + userId);
    return this.httpClient.get<Array<Team>>(this.url + '/students/' + userId + '/teams/' + courseName)
      .pipe(
        map(t => t.map(t2 => new Team(t2.id, t2.name, t2.status))),
        catchError( err => {
          console.error(err);
          return throwError('TeamService getTeamsByStudent error: ' + err.message);
        })
      );
  }

  getTeamMembers(courseName: string, teamId: number): Observable<Array<Student>>{
    return this.httpClient.get<Array<Student>>(this.url + '/courses/' + courseName + '/teams/' + teamId + '/members')
      .pipe(
        map(t => t.map(t2 => new Student(t2.id, t2.name, t2.firstName, t2.photoName, t2.email))),
        catchError( err => {
          console.error(err);
          return throwError('TeamService getTeamsByStudent error: ' + err.message);
        })
      );
  }

  getAvailableStudents(courseName: string): Observable<Student[]> {
    console.log('AVAILABLE STUDENTS');
    return this.httpClient.get<Student[]>(this.url + '/courses/' + courseName + '/availableStudents')
      .pipe(
        map(arr => {
          return arr.map(s => new Student(s.id, s.name, s.firstName, s.photoName, s.email))
                    .filter(s => s.id !== this.authService.getId()); // l'utente non è mostrato nella lista
        }),
        catchError( err => {
          console.error(err);
          return throwError('TeamService getAvailableStudents error: ' + err.message);
        })
      );
  }

  proposeTeam(courseName: string, teamName: string, members: Student[]) {
    console.log('PROPOSE TEAM');
    const memberIds = members.map(m => m.id);
    const body = {
      teamName,
      memberIds
    };
    return this.httpClient.post(this.url + '/courses/' + courseName + '/proposeTeam',
      body)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError('TeamService proposeTeam error: ' + err.message);
        })
      );
  }
}
