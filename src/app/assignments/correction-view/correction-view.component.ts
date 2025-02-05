import { Component, OnInit } from '@angular/core';
import {AssignmentService} from '../../services/assignment.service';
import {AuthService} from '../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-correction-view',
  templateUrl: './correction-view.component.html',
  styleUrls: ['./correction-view.component.css']
})
export class CorrectionViewComponent implements OnInit {
  photoPath: any;
  courseName: string;
  assignmentId: number;
  draftId: number;

  constructor(
    private assignmentService: AssignmentService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute) {
    this.courseName = this.route.parent.parent.parent.snapshot.params.name;
    this.assignmentId = this.route.parent.snapshot.params.assignmentId;
    this.draftId = this.route.snapshot.params.draftId;

    this.route.params.subscribe(
      data => {
        this.draftId = data.draftId;
        this.getDraftInfo();
      }
    );
  }

  ngOnInit() {
  }

  // in base al ruolo di chi sta visualizzando scelgo il link corretto
  // l'admin non è previsto che veda questa pagina
  // il draft è legato allo studente, quindi devo recuperare la sua
  // matricola per visualizzare la foto
  getDraftInfo() {
    if (this.authService.getRole() === 'ROLE_STUDENT') {
      this.getPhoto(this.authService.getId());
      return;
    }
    if (this.authService.getRole() === 'ROLE_PROFESSOR'){
      this.assignmentService.getStudentForDraft(this.courseName, this.assignmentId, this.draftId)
        .subscribe(
          data => this.getPhoto(data.id),
          error => {
            console.log(error);
            this.snackBar.open('Si è verificato un errore nel caricamento delle informazioni sulla correzione.', 'Chiudi');
          }
        );
      return;
    }
  }

  getPhoto(studentId): void {
    this.assignmentService.getCorrection(studentId, this.courseName, this.assignmentId, this.draftId)
      .subscribe(
        data => {
          const objectURL = URL.createObjectURL(data);
          this.photoPath = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        },
        error => {
          // this.photoPath = 'assets/img/red.svg';
          this.snackBar.open('Si è verificato un errore nel caricamento della foto della correzione.', 'Chiudi');
        }
      );
  }

  // torno alle consegne alla pressione del tasto
  back() {
    this.router.navigate(['../'], {relativeTo: this.route.parent});
  }
}
