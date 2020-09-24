import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {AssignmentComponent} from './assignment.component';
import {AssignmentService} from '../../services/assignment.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Assignment} from '../../models/assignment.model';
import {AddAssignmentDialogComponent} from './add-assignment-dialog/add-assignment-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-assignments-cont',
  templateUrl: './assignments-cont.component.html',
  styleUrls: ['./assignments-cont.component.css']
})
export class AssignmentsContComponent implements AfterViewInit, OnDestroy {
  professorId = '';
  courseName = '';
  private sub: Subscription;

  @ViewChild(AssignmentComponent)
  assignmentsComponent: AssignmentComponent;
  assignments: Assignment[] = [];

  constructor(
    private service: AssignmentService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.sub = this.route.parent.parent.params.subscribe(params => {
      this.courseName = params.name;
    });
    this.professorId = authService.getId();
  }

  // ottengo gli assigment da passare al component figlio
  // e in caso di errori lo notifico con una snackbar
  ngAfterViewInit(): void {
    this.service.getAssignmentForCourse(this.courseName).subscribe(
      s => {
        this.assignments = s;
        this.assignmentsComponent.Assignments = this.assignments;
      },
      error => {
        console.log(error);
        this.snackBar.open('Si è verificato un errore nel caricamente delle consegne.', 'Chiudi');
      });
  }

  ngOnDestroy(): void{
    if (this.sub !== undefined){
      this.sub.unsubscribe();
    }
  }

  // apro una dialog per creare un nuovo assignment e quando viene chiusa
  // e l'inserimento è andato a buon fine aggiungo il nuovo eleento come primo
  // in lista senza riscaricare i dati
  openCreateAssignment() {
    const c = { data: {courseName: this.courseName}};
    const dialogRef = this.dialog.open(AddAssignmentDialogComponent, c);
    this.sub = dialogRef.afterClosed().subscribe( data => {
      // console.log(data);
      if (data !== undefined && data !== ''){
        const v = [...this.assignments];
        v.unshift(data);
        this.assignments = v;
        this.assignmentsComponent.Assignments = this.assignments;
      }
    });
  }
}
