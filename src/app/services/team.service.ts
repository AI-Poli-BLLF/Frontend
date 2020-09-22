import {Injectable} from '@angular/core';
import {Student} from '../models/student.model';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, filter, map} from 'rxjs/operators';
import {Team} from '../models/team.model';
import {AuthService} from './auth.service';
import {Token} from '../models/token.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private host = 'https://localhost:4200';
  private url = this.host + '/API';

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  // Get all (active and inactive) teams for course
  getAllTeams(courseName: string): Observable<Array<Team>>{
    return this.httpClient
      .get<Array<Team>>(this.url + '/courses/' + courseName + '/teams')
      .pipe(
        map(arr => arr.map(
          t => new Team(t.id, t.name, t.status))),
        catchError( err => {
          console.error(err);
          return throwError('TeamService getAllTeams error: ' + err.message);
        })
      );
  }

  // Get team(s) a certain student is member of for a specific course.
  // If a student is part of an active team, only this will be returned,
  // otherwise all inactive teams the student is part of will be returned
  getTeamsByStudent(courseName: string): Observable<Array<Team>>{
    const userId = this.authService.getId();
    console.log('userId: ' + userId);
    return this.httpClient
      .get<Array<Team>>(this.url + '/students/' + userId + '/teams/' + courseName)
      .pipe(
        map(arr => arr.map(
          t => new Team(t.id, t.name, t.status))),
        catchError( err => {
          console.error(err);
          return throwError('TeamService getTeamsByStudent error: ' + err.message);
        })
      );
  }

  getTeamMembers(courseName: string, teamId: number): Observable<Array<Student>>{
    return this.httpClient
      .get<Array<Student>>(this.url + '/courses/' + courseName + '/teams/' + teamId + '/members')
      .pipe(
        map(arr => arr.map(
          s => new Student(s.id, s.name, s.firstName, s.photoName, s.email))),
        catchError( err => {
          console.error(err);
          return throwError('TeamService getTeamsMembers error: ' + err.message);
        })
      );
  }

  getTeamMembersByStatus(courseName: string, teamId: number, activeMembers: boolean): Observable<Array<Student>>{
    const postfix = activeMembers ? '/activeMembers' : '/pendingMembers';
    return this.httpClient
      .get<Array<Student>>(this.url + '/courses/' + courseName + '/teams/' + teamId + postfix)
      .pipe(
        map(arr => arr.map(
          s => new Student(s.id, s.name, s.firstName, s.photoName, s.email))),
        catchError( err => {
          console.error(err);
          return throwError('TeamService getTeamsMembersByStatus error: ' + err.message);
        })
      );
  }

  getTeamProposer(courseName: string, teamId: number): Observable<Student> {
    return this.httpClient
      .get<Student>(this.url + '/courses/' + courseName + '/teams/' + teamId + '/proposer')
      .pipe(
        map(s => new Student(s.id, s.name, s.firstName, s.photoName, s.email)),
        catchError( err => {
          console.error(err);
          return throwError('TeamService getTeamsByStudent error: ' + err.message);
        })
      );
  }

  getAvailableStudents(courseName: string): Observable<Student[]> {
    console.log('AVAILABLE STUDENTS');
    return this.httpClient
      .get<Student[]>(this.url + '/courses/' + courseName + '/availableStudents')
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

  proposeTeam(courseName: string, teamName: string, memberIds: string[], timeout: number) {
    console.log('PROPOSE TEAM');
    const proposerId = this.authService.getId();
    memberIds.push(proposerId);
    const body = { teamName, memberIds, timeout, proposerId };
    return this.httpClient
      .post(this.url + '/courses/' + courseName + '/proposeTeam', body)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(err);
        })
      );
  }

  getTeamConfirmationToken(courseName: string, teamId: number): Observable<Token> {
    const userId = this.authService.getId();
    console.log('CONFIRMATION TOKEN');
    return this.httpClient
      .get<Token>(this.url + '/courses/' + courseName + '/teams/' + teamId + '/pendingMembers/' + userId + '/token')
      .pipe(
        catchError( err => {
          console.error(err);
          return throwError('TeamService getTeamConfirmationToken error: ' + err.message);
        })
      );
  }

  respondToProposal(token: Token, accept: boolean) {
    console.log('RESPOND TO PROPOSAL');
    const action: string = accept ? 'confirm/' : 'reject/';
    return this.httpClient
      .post<any>(this.host + '/notification/' + action, token.id)
      .pipe(
        catchError( err => {
          console.error(err);
          return throwError('TeamService respondToProposal error: ' + err.message);
        })
      );
  }
}
