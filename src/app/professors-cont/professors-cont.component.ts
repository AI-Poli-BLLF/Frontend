import { Component, OnInit } from '@angular/core';
import {ProfessorService} from '../services/professor.service';
import {Professor} from '../models/professor.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-professors-cont',
  templateUrl: './professors-cont.component.html',
  styleUrls: ['./professors-cont.component.css']
})
export class ProfessorsContComponent implements OnInit {
  professors: Professor[] = [];

  constructor(private professorService: ProfessorService, private snackBar: MatSnackBar) {
    professorService.getAll()
      .subscribe(
        data => this.professors = data,
        error => {
          console.log(error);
          snackBar.open('Si è verificato un errore nel caricamento dei professori', 'Chiudi');
        }
      );
  }

  ngOnInit(): void {
  }

}
