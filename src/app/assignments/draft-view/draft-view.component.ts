import { Component, OnInit } from '@angular/core';
import {AssignmentService} from '../../services/assignment.service';
import {AuthService} from '../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-draft-view',
  templateUrl: './draft-view.component.html',
  styleUrls: ['./draft-view.component.css']
})
export class DraftViewComponent implements OnInit {
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
        this.getDraft();
      }
    );
  }

  ngOnInit() {
    // this.getPhoto();
  }
  // in base al ruolo di chi sta visualizzando scelgo il link corretto
  // l'admin non è previsto che veda questa pagina
  private getDraft() {
    let obs: Observable<any>;
    switch (this.authService.getRole()) {
      case 'ROLE_STUDENT':
        obs = this.assignmentService.getDraft(this.authService.getId(), this.courseName, this.assignmentId, this.draftId);
        break;
      default:
        obs = this.assignmentService.getDraftProf(this.courseName, this.assignmentId, this.draftId);
        break;
    }
    obs.subscribe(
      data => {
        const objectURL = URL.createObjectURL(data);
        this.photoPath = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error => {
        // this.photoPath = 'assets/img/red.svg';
        this.snackBar.open('Si è verificato un errore nel caricamento della foto dell\'elaborato.', 'Chiudi');
      }
    );
  }

  // torno alle consegne alla pressione del tasto
  back() {
    this.router.navigate(['../'], {relativeTo: this.route.parent});
  }
}
