import { Component, OnInit } from '@angular/core';
import {AssignmentService} from '../services/assignment.service';
import {AuthService} from '../services/auth.service';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-assignment-view',
  templateUrl: './assignment-view.component.html',
  styleUrls: ['./assignment-view.component.css']
})
export class AssignmentViewComponent implements OnInit {
  photoPath: any;
  courseName: string;
  assignmentId: number;

  constructor(
    private assignmentService: AssignmentService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute) {
    this.courseName = this.route.parent.parent.parent.snapshot.params.name;
    this.assignmentId = this.route.parent.snapshot.params.assignmentId;
    console.log(this.courseName, this.assignmentId);
    // this.route.parent.parent.parent.params.subscribe(
    //   data => {
    //     this.courseName = data.name;
    //     // this.getPhoto();
    //   }
    // );
    this.route.parent.params.subscribe(
      data => {
        this.assignmentId = data.assignmentId;
        this.getPhoto();
      }
    );
  }

  ngOnInit() {
    // this.getPhoto();
  }

  getPhoto(): void {
    let obs: Observable<any>;
    switch (this.authService.getRole()) {
      case 'ROLE_PROFESSOR':
        obs = this.assignmentService.getAssigmentProf(this.authService.getId(), this.courseName, this.assignmentId);
        break;
      case 'ROLE_STUDENT':
        obs = this.assignmentService.getAssigment(this.authService.getId(), this.courseName, this.assignmentId);
        break;
      default:
        // this.photoPath = 'assets/img/red.svg';
        return;
    }
    obs.subscribe(
      data => {
        const objectURL = URL.createObjectURL(data);
        this.photoPath = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error => {
        // this.photoPath = 'assets/img/red.svg';
        this.snackBar.open('Si è verificato un errore nel caricamento della foto della consegna.', 'Chiudi');
      }
    );
  }
}