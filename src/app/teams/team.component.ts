import { Component, OnInit } from '@angular/core';
import {TeamService} from '../services/team.service';
import {Observable} from 'rxjs';
import {Team} from '../models/team.model';
import {Student} from '../models/student.model';

@Component({
  selector: 'app-team-home',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  teams: Team[];
  teamMembers: Array<Array<Student>>;
  activeTeam: boolean;
  constructor(private service: TeamService) {
    this.teamMembers = new Array<Array<Student>>();
    this.activeTeam = false;
  }

  ngOnInit(): void {
    this.service.getTeamsByStudent('ai', 'abc')
      .subscribe(data => {
        this.teams = data;
        for (const i in data) {
          if (data.hasOwnProperty(i)) {
            const team = data[i];
            if (team.status === 'ACTIVE') {
              this.activeTeam = true;
            }
            console.log('Requesting members of team ' + team.id);
            this.service.getTeamMembers('ai', team.id)
              .subscribe(membersData => this.teamMembers[i] = membersData);
          }
        }
      });
  }

}
