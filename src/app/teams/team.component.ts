import { Component, OnInit } from '@angular/core';
import {TeamService} from '../services/team.service';
import {Team} from '../models/team.model';
import {Student} from '../models/student.model';
import {MatDialog} from '@angular/material/dialog';
import {CreateTeamDialogComponent} from './create-team-dialog/create-team-dialog.component';
import {Observable} from 'rxjs';

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
  constructor(private service: TeamService, public dialog: MatDialog) {
    this.activeTeam = false;
  }

  ngOnInit(): void {
    this.teams = new Array<TeamData>();
    this.service.getTeamsByStudent('ai', 'abc')
      .subscribe(data => {
        const teamArray: Team[] = data;
        for (const i in teamArray) {
          if (data.hasOwnProperty(i)) {
            const team: Team = data[i];
            if (team.status === 'ACTIVE') {
              this.activeTeam = true;
            }
            console.log('Requesting members of team ' + team.id);
            const members$ = this.service.getTeamMembers('ai', team.id);
            const proposer$ = this.service.getTeamProposer('ai', team.id);
            this.teams.push({team, teamMembers: members$, teamProposer: proposer$});
          }
        }
      });
  }

  openCreateTeamDialog(): void {
    const dialogRef = this.dialog.open(CreateTeamDialogComponent, {
      data: { courseName: 'ai' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.proposeTeam('ai', result.teamName, result.members, result.timeout)
          .subscribe(
            data => {
              console.log(data);
            }
          );
      }
    });
  }

}
