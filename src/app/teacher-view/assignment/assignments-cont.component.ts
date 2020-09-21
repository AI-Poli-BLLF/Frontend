import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {AssignmentComponent} from './assignment.component';
import {AssignmentService} from '../../services/assignment.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Assignment} from '../../models/assignment.model';
import {AddAssignmentDialogComponent} from './add-assignment-dialog/add-assignment-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

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

  constructor(
    private service: AssignmentService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private authServ: AuthService,
    private dialog: MatDialog
  ) {
    this.sub = this.route.parent.params.subscribe(params => {
      this.courseName = params.name;
    });
    this.professorId = authServ.getId();
  }

  add(assignment: Assignment){
    console.log('add');
  }

  ngAfterViewInit(): void {
    // console.log('ciao');
    this.service.getAllAssignments(this.professorId, this.courseName).subscribe(
      s => this.assignmentsComponent.Assignments = s,
      // s => console.log(s),
      error => {
        console.log(error);
        this.snackBar.open('Si è verificato un errore nel caricamente delle consegne.', 'Chiudi');
      });
  }

  ngOnDestroy(): void{
    this.sub.unsubscribe();
  }

  openCreateAssignment() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.route;
    const dialogRef = this.dialog.open(AddAssignmentDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe( () => {
      // this.loadAssignments();
      this.sub = this.service.getAllAssignments(this.professorId, this.courseName).subscribe(
        s => this.assignmentsComponent.Assignments = s,
        error => {
          console.log(error);
          this.snackBar.open('Si è verificato un errore nel caricamente delle consegne.', 'Chiudi');
        }
      );
    });
  }
}