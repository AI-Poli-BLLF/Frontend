import { Component, OnInit } from '@angular/core';
import {Team} from '../models/team.model';
import {TeamService} from "../services/team.service";
import {ActivatedRoute} from '@angular/router';
import {Student} from '../models/student.model';

@Component({
  selector: 'app-professor-teams',
  templateUrl: './professor-teams.component.html',
  styleUrls: ['./professor-teams.component.css']
})
export class ProfessorTeamsComponent implements OnInit {
  teams: Team[] = [];
  teamsMembers: Array<Array<Student>> = [];

  constructor(private teamService: TeamService, private route: ActivatedRoute) {
    const courseName = this.route.parent.snapshot.params.name;
    teamService.getAllTeams(courseName)
      .subscribe(
        data => {
          this.teams = data;
          this.teams.forEach(t => this.getMembers(courseName, t.id));
          console.log(data);
        },
        error => console.log(error)
      );
  }

  ngOnInit(): void {
  }

  deleteTeam(team: Team) {
    // todo: da implementare
    alert('Da implementare');
  }

  getMembers(courseName: string, teamId: number){
    this.teamService.getTeamMembers(courseName, teamId)
      .subscribe(
        data => this.teamsMembers[teamId] = data,
        error => {
          this.teamsMembers[teamId] = [];
          console.log(error);
        }
      );
  }
}
