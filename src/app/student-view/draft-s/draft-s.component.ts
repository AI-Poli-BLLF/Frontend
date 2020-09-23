import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Draft} from '../../models/draft.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AssignmentService} from '../../services/assignment.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AuthService} from '../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Assignment} from '../../models/assignment.model';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {AddDraftDialogComponent} from './add-draft-dialog/add-draft-dialog.component';

@Component({
  selector: 'app-draft-s',
  templateUrl: './draft-s.component.html',
  styleUrls: ['./draft-s.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class DraftSComponent implements OnInit {
  dataSource: MatTableDataSource<Draft>;
  columnsToDisplayDraft: string[] = ['state', 'timestamp', 'link', 'correction'];
  drafts: Array<Draft> = [];
  studentId: string;
  assignment: Assignment;
  sub: Subscription;
  states: Array<string> = ['NULL', 'READ', 'SUBMITTED'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private service: AssignmentService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.studentId = auth.getId();
    this.dataSource = new MatTableDataSource<Draft>(this.drafts);
  }

  @Input()
  set Assignment(assignment: Assignment){
    this.assignment = assignment;
  }

  ngOnInit(): void {
    this.update();
  }

  private getDraftInfo(draft: Draft) {
    if (draft.student.id === '') {
      // console.log(draft);
      this.service.getStudentForDraft(draft.id).subscribe(
        s => {
          draft.student = s;
        },
        err => {
          this.snackBar.open('Errore nel caricamente dello studente per la consegna', 'Chiudi');
        }
      );
    }
  }

  update(){
    // this.service.getDraftForStudent(this.studentId).subscribe(
    //   d => {
    //     d.forEach(draft => this.getDraftInfo(draft));
    //     this.dataSource.data = d;
    //     this.dataSource.sort = this.sort;
    //     this.dataSource.paginator = this.paginator;
    //   },
    //   err => {
    //     this.snackBar.open('Errore nel caricamento degli elaborati', 'Chiudi');
    //   }
    // );
  }

  openCreateDraft() {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.data = this.route;
    // const dialogRef = this.dialog.open(AddDraftDialogComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe( () => {
    //   this.sub = this.service.getDraftForStudent(this.studentId).subscribe(
    //     d => this.drafts = d,
    //     error => {
    //       console.log(error);
    //       this.snackBar.open('Si è verificato un errore aggiungendo un elaborato', 'Chiudi');
    //     }
    //   );
    // });
  }

  editDraft(draft: Draft) {
    this.service.lockDraft(draft, this.assignment.id).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.error(error);
      }
    );
    let draft1: Draft;
    draft1 = new Draft(undefined, undefined, draft.grade, 'SUBMITTED', draft.locker);
    // draft1 = draft;
    // draft1.id = undefined;
    // draft1.state = 'SUBMITTED';
    this.service.addDraft(draft1, this.assignment, this.studentId).subscribe(
      data => {
        console.log(data);
        this.snackBar.open('L\'elaborato è stato sottomesso.', 'Chiudi');
        this.update();
      },
      error => {
        console.log(error);
        this.snackBar.open('Qualcosa è andato storto nella sottomissione dell\'elaborato.', 'Chiudi');
      }
    );
    this.update();
  }

  getStates() {
    return this.states;
  }

  checkError(draft: Draft): boolean{
    return !(draft.locker === true || draft.state === 'SUBMITTED' || draft.state === 'REVIEWED');
  }

}
