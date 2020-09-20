import {AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Assignment} from '../../../models/assignment.model';
import {Draft} from '../../../models/draft.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AssignmentService} from '../../../services/assignment.service';
import {Student} from '../../../models/student.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {AssignmentsContComponent} from '../assignments-cont.component';
import {MAT_TAB_GROUP} from '@angular/material/tabs';
import {AssignmentComponent} from '../assignment.component';

@Component({
  selector: 'app-draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class DraftComponent implements OnInit, AfterViewInit {
  professorId = '';
  courseName = '';
  assignment: Assignment;

  drafts: Array<Draft> = [];

  columnsToDisplayDraft: string[] = ['firstName', 'name', 'id', 'state', 'timestamp'/*, 'link', 'review'*/];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) dSort: MatSort;

  dataSource: MatTableDataSource<Draft>;

  constructor(
    private service: AssignmentService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private authServ: AuthService,
    private dialog: MatDialog,
  ) {
    this.route.parent.params.subscribe(params => {
      this.courseName = params.name;
    });
    this.professorId = authServ.getId();
  }

  @Input()
  set Drafts(drafts: Array<Draft>){
    this.drafts = drafts;
    this.dataSource.data = this.drafts;
  }
  @Input()
  set Assignment(assignment: Assignment) {
    this.assignment = assignment;
    // console.log('setter');
    // console.log(this.assignment);
    if (this.assignment !== undefined) {
      this.getDrafts();
      // console.log('getDraft()');
    }
    return;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.drafts);
    // console.log(this.assignment);
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.dSort;
  }

  private getDrafts(){
    this.service.getDrafts(this.professorId, this.courseName, this.assignment.id).subscribe(
      d => {
        // const draftsArray: Draft[] = d;
        console.log(d);
        const v = [...this.drafts];
        d.forEach(d1 => v.push(d1));
        console.log(v);
        this.drafts = v;
        for (const i of this.drafts){
          this.getDraftInfo(i);
        }
        this.dataSource.data = this.drafts;
      },
      err => {
        this.snackBar.open('Errore nel caricamente degli elaborati', 'Chiudi');
      }
    );
    this.ngAfterViewInit();
  }

  private getDraftInfo(draft: Draft){
    console.log('draftInfo');
    if (draft.student === undefined){
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
}
