import { Component, OnInit } from '@angular/core';
import {TeamService} from '../services/team.service';
import {Team} from '../models/team.model';
import {Student} from '../models/student.model';
import {MatDialog} from '@angular/material/dialog';
import {CreateTeamDialogComponent} from './create-team-dialog/create-team-dialog.component';
import {Observable} from 'rxjs';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Course} from '../models/course.model';
import {CourseService} from '../services/course.service';
import {AuthService} from '../services/auth.service';
import {Token} from '../models/token.model';
import {MatSnackBar} from '@angular/material/snack-bar';

type TeamData = {
  team: Team;
  activeMembers: Observable<Student[]>;
  pendingMembers: Observable<Student[]>;
  proposer: Observable<Student>;
  token: Observable<Token>;
};

@Component({
  selector: 'app-team-home',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  teams: Map<number, TeamData>;
  activeTeam: boolean;
  course: Course;
  constructor(private teamService: TeamService,
              private courseService: CourseService,
              private authService: AuthService,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) {
    this.activeTeam = false;
    this.teams = new Map<number, TeamData>();
  }

  ngOnInit(): void {
    // 1. Get the course name
    this.route.parent.paramMap.subscribe((params: ParamMap) => {
      const courseName = params.get('name');

      // 2. Get infos about the user's teams in this course
      this.getStudentTeams(courseName);

      // 3. Get infos about the course (e.g. min/max of team members)
      this.courseService.getOne(courseName).subscribe(
        c => this.course = c,
        error => {
          this.snackBar.open('Errore nel caricamento del corso ' + courseName, 'Chiudi');
        });
    });
  }

  private getStudentTeams(courseName: string) {
    this.teamService.getTeamsByStudent(courseName)
      .subscribe(
        data => {
          const teamArray: Team[] = data;
          for (const i in teamArray) {
            if (data.hasOwnProperty(i)) {
              this.getTeamInfos(courseName, data[i]);
            }
          }
        },
        err => {
          this.snackBar.open('Errore nel caricamento dei gruppi', 'Chiudi');
        }
      );
  }

  private getTeamInfos(courseName: string, team: Team) {
    console.log('Requesting members of team ' + team.id);
    let activeMembers$;
    let pendingMembers$;
    let proposer$: Observable<Student>;
    if (team.status === 'ACTIVE') {
      this.activeTeam = true;
      activeMembers$ = this.teamService.getTeamMembers(courseName, team.id);
    } else {
      activeMembers$ = this.teamService.getTeamMembersByStatus(courseName, team.id, true);
      pendingMembers$ = this.teamService.getTeamMembersByStatus(courseName, team.id, false);
      proposer$ = this.teamService.getTeamProposer(courseName, team.id);
    }
    const data: TeamData = {team, activeMembers: activeMembers$, pendingMembers: pendingMembers$,
      proposer: proposer$, token: null};
    this.teams.set(team.id, data);

    if (team.status !== 'ACTIVE') {
      pendingMembers$.subscribe(sArr => {
        if (sArr.map(s => s.id).indexOf(this.authService.getId()) !== -1) {
          const token$ = this.teamService.getTeamConfirmationToken(courseName, team.id);
          this.teams.get(team.id).token = token$;
        }
      });
    }
  }

  openCreateTeamDialog(): void {
    const dialogRef = this.dialog.open(CreateTeamDialogComponent, {
      data: { course: this.course }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.teamService.proposeTeam(this.course.name, result.value.teamName, result.value.members, result.value.timeout)
          .subscribe(
            res => {
              console.log('propose team data');
              this.teams.clear();
              this.getStudentTeams(this.course.name);
            },
            err => {
              if (err.status === 409) {
                this.snackBar.open(err.error.message, 'Chiudi');
              } else {
                this.snackBar.open('Impossibile creare il gruppo', 'Chiudi');
              }
              this.getStudentTeams(this.course.name);
            }
          );
      }
    });
  }

  respondToProposal(token: Token, accepted: boolean): void {
    this.teamService.respondToProposal(token, accepted)
      .subscribe(
        res => {
          this.teams.clear();
          this.getStudentTeams(this.course.name);
        },
        err => {
          if (err.status === 409) {
            this.snackBar.open('Il team indicato non è più valido', 'Chiudi');
          } else {
            this.snackBar.open('Impossibile prendere in carico la richiesta. Riprova', 'Chiudi');
          }
          this.teams.clear();
          this.getStudentTeams(this.course.name);
        }
      );
  }

  getTeams(map: Map<number, TeamData>): TeamData[] {
    return Array.from(map.values());
  }

}
