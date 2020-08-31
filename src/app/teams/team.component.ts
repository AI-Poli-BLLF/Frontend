import { Component, OnInit } from '@angular/core';
import {TeamService} from '../services/team.service';
import {Team} from '../models/team.model';
import {Student} from '../models/student.model';
import {MatDialog} from '@angular/material/dialog';
import {CreateTeamDialogComponent} from './create-team-dialog/create-team-dialog.component';
import {Observable} from 'rxjs';
import {ActivatedRoute, ParamMap} from '@angular/router';

type TeamData = {
  team: Team;
  teamMembers: Observable<Student[]>;
  teamProposer: Observable<Student>;
};

@Component({
  selector: 'app-team-home',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  teams: TeamData[];
  activeTeam: boolean;
  courseName: string;
  constructor(private service: TeamService,
              public dialog: MatDialog,
              private route: ActivatedRoute) {
    this.activeTeam = false;
    this.teams = new Array<TeamData>();
  }

  ngOnInit(): void {
    this.route.parent.paramMap.subscribe((params: ParamMap) => {
      this.courseName = params.get('name');
    });

    this.service.getTeamsByStudent(this.courseName)
      .subscribe(data => {
        const teamArray: Team[] = data;
        for (const i in teamArray) {
          if (data.hasOwnProperty(i)) {
            const team: Team = data[i];
            if (team.status === 'ACTIVE') {
              this.activeTeam = true;
            }
            console.log('Requesting members of team ' + team.id);
            const members$ = this.service.getTeamMembers(this.courseName, team.id);
            const proposer$ = this.service.getTeamProposer(this.courseName, team.id);
            this.teams.push({team, teamMembers: members$, teamProposer: proposer$});
          }
        }
      });
  }

  openCreateTeamDialog(): void {
    const dialogRef = this.dialog.open(CreateTeamDialogComponent, {
      data: { courseName: this.courseName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.proposeTeam(this.courseName, result.teamName, result.members, result.timeout)
          .subscribe(
            data => {
              console.log(data);
            }
          );
      }
    });
  }

}
