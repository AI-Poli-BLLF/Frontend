import { Component, OnInit } from '@angular/core';
import {ProfessorService} from '../../services/professor.service';
import {Professor} from '../../models/professor.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Student} from '../../models/student.model';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-professors-cont',
  templateUrl: './professors-cont.component.html',
  styleUrls: ['./professors-cont.component.css']
})
export class ProfessorsContComponent implements OnInit {
  professors: Professor[] = [];

  // carico tutti i professori presenti sul database e li mostro nella tabella
  constructor(private professorService: ProfessorService,
              private snackBar: MatSnackBar,
              private sanitizer: DomSanitizer) {
    professorService.getAll()
      .subscribe(
        data => {
          this.professors = data;
          this.getPhotos(this.professors);
        },
        error => {
          console.log(error);
          snackBar.open('Si è verificato un errore nel caricamento dei professori', 'Chiudi');
        }
      );
  }

  // scarica la foto per ogni professore nell'array
  getPhotos(professors: Professor[]){
    professors.forEach(s => this.getPhoto(s));
  }

  // scarica la foto per singolo professore
  getPhoto(professor: Professor){
    this.professorService.getPhoto(professor.id)
      .subscribe(
        data => {
          const objectURL = URL.createObjectURL(data);
          professor.photoUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        },
        error => {
          professor.photoUrl = 'assets/img/default.png';
          console.log(error);
        }
      );
  }

  ngOnInit(): void {
  }

}
