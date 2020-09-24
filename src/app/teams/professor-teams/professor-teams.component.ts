import { Component, OnInit } from '@angular/core';
import {Team} from '../../models/team.model';
import {TeamService} from '../../services/team.service';
import {ActivatedRoute} from '@angular/router';
import {Student} from '../../models/student.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-professor-teams',
  templateUrl: './professor-teams.component.html',
  styleUrls: ['./professor-teams.component.css']
})
// componente per i professoi e per gli admin che permette di visualizzare i team creati
// sia attivi che pendenti ed eventualmente eliminarli
export class ProfessorTeamsComponent implements OnInit {
  teams: Team[] = [];
  teamsMembers: Array<Array<Student>> = [];

  constructor(private teamService: TeamService, private route: ActivatedRoute, private snackBar: MatSnackBar) {
  }

  // effettuo la richiesta al server di tutti i team del corso
  ngOnInit(): void {
    const courseName = this.route.parent.snapshot.params.name;
    this.teamService.getAllTeams(courseName)
      .subscribe(
        data => {
          this.teams = data;
          // richiedo anche i membri per ogni team
          this.teams.forEach(t => this.getMembers(courseName, t.id));
        },
        error => console.log(error)
      );
  }

  // il team selezionato dall'html viene passato al service che si occupa di eliminarlo
  // in caso affermativo aggiorno i team visualizzati senza richiederli nuovamente al server
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

  // richiedo i membri per uno specifico team
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
