import {Injectable} from '@angular/core';
import {Student} from '../models/student.model';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Team} from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private url = 'https://localhost:4200/API';

  constructor(private httpClient: HttpClient) { }

  // Get all (active and inactive) teams for course
  getAllTeams(courseName: string): Observable<Array<Team>>{
    console.log('ALL TEAMS');
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
    console.log('TEAMS BY STUDENT');
    /*
     TODO: do GET at {studentId}/teams, then compute intersection of the two arrays
           (i.e. teams in the course AND with the student).
           Finally, if a team is active prune all other teams
    */
    return this.getAllTeams(courseName);
  }
}
