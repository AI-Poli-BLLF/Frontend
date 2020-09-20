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
export class DraftSComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Draft>;
  columnsToDisplayDraft: string[] = ['id', 'state', 'timestamp'];
  drafts: Array<Draft>;
  studentId: string;
  assignment: Assignment;
  sub: Subscription;
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
  }

  @Input()
  set Assignment(assignment: Assignment){
    this.assignment = assignment;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Draft>(this.drafts);
  }

  ngAfterViewInit() {
    this.service.getDraftForStudent(this.studentId).subscribe(
      d => {
        d.forEach(draft => this.getDraftInfo(draft));
        this.dataSource.data = d;
        console.log(d);
      },
      err => {
        this.snackBar.open('Errore nel caricamento degli elaborati', 'Chiudi');
      }
    );
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private getDraftInfo(draft: Draft) {
    console.log('draftInfo');
    if (draft.student === undefined) {
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
}
