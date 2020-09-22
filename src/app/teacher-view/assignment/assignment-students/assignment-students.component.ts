import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Draft} from '../../../models/draft.model';
import {MatTableDataSource} from '@angular/material/table';
import {Assignment} from '../../../models/assignment.model';
import {Student} from '../../../models/student.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Route} from '@angular/router';
import {AssignmentService} from '../../../services/assignment.service';
import {AuthService} from '../../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AddAssignmentDialogComponent} from '../add-assignment-dialog/add-assignment-dialog.component';
import {EvaluateDraftDialogComponent} from '../draft/evaluate-draft-dialog/evaluate-draft-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {DraftEvaluateComponent} from '../draft-evaluate/draft-evaluate.component';
import {Subscription} from 'rxjs';
import {DraftHistoryComponent} from '../draft-history/draft-history.component';

@Component({
  selector: 'app-assignment-students',
  templateUrl: './assignment-students.component.html',
  styleUrls: ['./assignment-students.component.css']
})
export class AssignmentStudentsComponent implements OnInit, AfterViewInit, OnDestroy {
  columnsToDisplay: string[] = ['id', 'firstName', 'lastName', 'state', 'timestampD', 'link', 'correction', 'grade', 'history'];
  dataSource: MatTableDataSource<Draft>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input()
  assignmentId: number;
  @Input()
  courseName: string;

  sub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private assignmentService: AssignmentService) {
    const testData = [
      new Draft(1, '2020-09-25T22:00:00.000+0000', 0, 'READ', false),
      new Draft(2, '2020-09-25T22:00:00.000+0000', 30, 'REVIEWED', true),
      new Draft(3, '2020-09-25T22:00:00.000+0000', 0, 'SUBMITTED', false)
    ];
    testData[0].student = new Student('s123456', 'Stefano', 'Loscalzo', undefined);
    testData[1].student = new Student('s123457', 'Lorenzo', 'Limoli', undefined);
    testData[2].student = new Student('s123458', 'Angelo', 'Floridia', undefined);

    this.dataSource = new MatTableDataSource<Draft>(testData);
  }

  ngOnDestroy(): void {
    if (this.sub !== undefined){
      this.sub.unsubscribe();
    }
  }

  update(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    // todo: riabilitare
    // this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDraftInfo(draft: Draft){
    if (draft.student.id === ''){
      // todo: ottenere info sugli studenti
      // magari usando i link allegati

      // this.assignmentService.getStudentForDraft(draft.id).subscribe(
      //   s => draft.student = s,
      //   error => {
      //     console.log(error);
      //     this.snackBar.open('Errore nel caricamente dello studente per la consegna', 'Chiudi');
      //   }
      // );
    }
  }

  uploadCorrection(event, element: Draft){
    const selectedFile: File = event.target.files[0];
    // console.log(selectedFile);
    if (selectedFile === undefined){
      return;
    }
    this.snackBar.open(
      'Correzione caricata correttamente.', 'Chiudi');
    element.state = 'REVIEWED';
    element.timestampT = new Date(Date.now());
    // this.assignmentService.uploadCorrection(this.authService.getId(), this.courseName, this.assignmentId, element.id, selectedFile)
    //   .subscribe(
    //     () => {
    //       this.snackBar.open(
    //         'Correzione caricata correttamente.', 'Chiudi');
    //       element.state = 'REVIEWED';
    //       element.timestampT = new Date(Date.now());
    //       },
    //     error => {
    //       console.log(error);
    //       this.snackBar.open(
    //         'Si è verificato un errore nell\'upload della correzione. La massima dimensione consentita dei file è 3 MB.',
    //         'Chiudi');
    //     }
    //   );
  }

  evaluateDraft(element: Draft){
    const c = { data: {courseName: this.courseName, draftId: element.id, assignmentId: this.assignmentId}};
    const dialogRef = this.dialog.open(DraftEvaluateComponent, c);
    this.sub = dialogRef.afterClosed().subscribe( data => {
      if (data !== undefined && data.data !== undefined){
        const i = this.dataSource.data.findIndex(e => e.id === element.id);
        this.dataSource.data[i].locker = true;
        this.dataSource.data[i].state = 'REVIEWED';

        // todo: valutare se si riesce a fare senza ricaricare tutto, penso di si
        // this.loadData();
      }
    });
  }

  historyStudent(element: Draft){
    const c = { data: {courseName: this.courseName, studentId: element.student.id, assignmentId: this.assignmentId}};
    this.dialog.open(DraftHistoryComponent, c);
  }

  openDraft(element: Draft){
    alert('openDraft correction');
  }

  canOpen(element: Draft) {
    return (element.state !== 'READ' && element.state !== 'NULL');
  }

  canCorrection(element: Draft) {
    return (element.state === 'SUBMITTED');
  }

  canEvaluate(element: Draft){
    return (element.locker === false);

  }

  private loadData() {
    this.assignmentService.getProfessorDrafts(this.authService.getId(), this.courseName, this.assignmentId)
      .subscribe(
        drafts => {
          drafts.forEach(d => this.getDraftInfo(d));
          this.dataSource.data = drafts;
          this.update();
        },
        err => {
          console.log(err);
          this.snackBar.open('Errore nel caricamente degli elaborati', 'Chiudi');
        }
      );
  }
}