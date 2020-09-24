import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProfileService} from '../services/profile.service';
import {Profile} from '../models/profile.model';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit, OnDestroy {
  profileData: Profile;
  photoPath: any;

  constructor(
    private service: ProfileService,
    private dialogRef: MatDialogRef<ProfileViewComponent>,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer) {
    this.photoPath = 'assets/img/default.png';
  }

  // nell'on init inizializzo il profilo che dei valori nulli, così da iniziare ad aprire la dialog
  // poi quando verranno ricevuti i dati la riempirò correttamente
  ngOnInit(): void {
    this.profileData = new Profile('', '', '', '', '');
    this.service.get().subscribe(
      data => {
        // console.log(data);
        this.profileData = data;
        this.getPhoto(this.profileData.roles[0], this.profileData.id);
      },
      error => {
        console.log(error);
        this.snackBar.open('Si è verificato un errore nel caricamento nel caricamento delle informazioni.', 'Chiudi');
        this.dialogRef.close();
      });
  }

  getPhoto(role: string, id: string): void {
    this.service.getPhoto(role, id).subscribe(
      data => {
        // prima creo un url dal blob che ho ricevuto, successivamente
        // per impostare un'url sul tag [src] di un'immagine devo sanitizzarlo
        const objectURL = URL.createObjectURL(data);
        this.photoPath = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error => {
        // in caso di errore mostro l'immagine di default e mostro un errore sulla snackbar
        this.photoPath = 'assets/img/default.png';
        // console.log(error);
        this.snackBar.open('Si è verificato un errore nel caricamento della foto profilo.', 'Chiudi');
      }
    );
  }

  ngOnDestroy(): void {
  }

  // una volta selezionata la foto la passo al service per inviarla al backend in caso di risposta positiva
  // faccio richiesta al backend per scaricarla
  changePhoto($event) {
    // console.log($event);
    const selectedFile: File = $event.target.files[0];
    // console.log(selectedFile);
    if (selectedFile === undefined){
      return;
    }
    this.service.uploadPhoto(this.profileData.roles[0], this.profileData.id, selectedFile).subscribe(
      data => {
        // console.log(data);
        this.getPhoto(this.profileData.roles[0], this.profileData.id);
      },
      error => {
        console.log(error);
        this.snackBar.open(
          'Si è verificato un errore nell\'upload della foto. La massima dimensione consentita dei file è 3 MB.',
          'Chiudi');
      }
    );
  }
}
