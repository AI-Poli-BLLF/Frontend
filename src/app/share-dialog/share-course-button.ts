import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {CourseService} from '../services/course.service';
import {ShareDialogComponent} from './share-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../services/auth.service';
import {ProfessorService} from '../services/professor.service';
import {Professor} from '../models/professor.model';

@Component({
  selector: 'app-share-course-button',
  template: '<button (click)="getProfessors()" mat-button><mat-icon>share</mat-icon></button>',
  styleUrls: []
})
export class ShareCourseButtonComponent implements OnInit, OnDestroy {
  @Input()
  courseName: string;

  @Output()
  update = new EventEmitter();

  dialogRef: Subscription;
  options: Professor[];

  constructor(
    private professorsService: ProfessorService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private courseService: CourseService
  ) {
    this.options = [];
  }

  getProfessors(){
    this.courseService.getProfessors(this.courseName)
      .subscribe(
        data => {
          const owners = data.map(e => e.id);
          this.shareCourse(owners);
        },
        error => {
          console.log(error);
          this.snackBar.open('Si è verificato un errore nel recupero dei proprietari', 'Chiudi');
        }
      );
  }

  shareCourse(owners: string[]){
    const d = {
      text: `Condividi corso  ${this.courseName}`,
      disabled: owners,
      options: this.options,
      owners
    };
    this.dialogRef = this.dialog.open(ShareDialogComponent, {data: d})
      .afterClosed().subscribe(v => {
        if (v.ok){
          this.submit(v.data, owners);
        }
        this.dialogRef.unsubscribe();
      });
  }
  ngOnDestroy(){
    if (this.dialogRef !== undefined){
      this.dialogRef.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.professorsService.getAll()
      .subscribe(
        data => {
          this.options = data;
        },
        error => {
          console.log(error);
          this.options = [];
        }
      );
  }

  submit(values: string[], owners: string[]) {
    values = values.filter(e => owners.findIndex(o => o === e) === -1);
    // console.log('NEW:', values);
    this.professorsService.shareCourse(this.courseName, this.authService.getId(), values)
      .subscribe(
        () => this.snackBar.open('Invito inviato.', 'Chiudi'),
        error => {
          this.snackBar.open('Si è verificato un errore.', 'Chiudi')
          console.log(error);
        }
      );
  }
}
