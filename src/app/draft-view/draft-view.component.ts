import { Component, OnInit } from '@angular/core';
import {AssignmentService} from '../services/assignment.service';
import {AuthService} from '../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Student} from '../models/student.model';
import {subscribeOn} from 'rxjs/operators';

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
    // this.getPhoto();
  }

  private getDraftInfo() {
    // todo: l'api sarà da cambiare
    this.assignmentService.getStudentForDraft(this.draftId)
      .subscribe(
        data => this.getPhoto(data.id),
        error => {
          console.log(error);
          this.snackBar.open('Si è verificato un errore nel caricamento delle informazioni dell\'elaborato.', 'Chiudi');
        }
      );
  }

  getPhoto(studentId): void {
    this.assignmentService.getDraft(studentId, this.courseName, this.assignmentId, this.draftId)
       .subscribe(
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
}
