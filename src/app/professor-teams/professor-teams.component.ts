import { Component, OnInit } from '@angular/core';
import {Team} from '../models/team.model';
import {TeamService} from '../services/team.service';
import {ActivatedRoute} from '@angular/router';
import {Student} from '../models/student.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-professor-teams',
  templateUrl: './professor-teams.component.html',
  styleUrls: ['./professor-teams.component.css']
})
export class ProfessorTeamsComponent implements OnInit {
  teams: Team[] = [];
  teamsMembers: Array<Array<Student>> = [];

  constructor(private teamService: TeamService, private route: ActivatedRoute, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    const courseName = this.route.parent.snapshot.params.name;
    this.teamService.getAllTeams(courseName)
      .subscribe(
        data => {
          this.teams = data;
          this.teams.forEach(t => this.getMembers(courseName, t.id));
          // console.log(data);
        },
        error => console.log(error)
      );
  }

  deleteTeam(team: Team) {
    const courseName = this.route.parent.snapshot.params.name;
    this.teamService.deleteTeam(courseName, team.id)
      .subscribe(
        () => {
          this.snackBar.open(`Team ${team.name} eliminato con successo.`, 'Chiudi');
          this.teams = this.teams.filter(t => t.id !== team.id);
        },
        error => {
          console.log(error);
          this.snackBar.open(`Si è verificato un errore durante l'eliminazione del team.`, 'Chiudi');
        }
      );
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
