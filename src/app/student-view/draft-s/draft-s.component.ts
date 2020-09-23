import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
  sub: Subscription;
  @Input()
  courseName: string;
  @Input()
  assignmentId: number;

  @Output()
  lastDraft: EventEmitter<Draft>;

  // states: Array<string> = ['NULL', 'READ', 'SUBMITTED'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private service: AssignmentService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {
    this.lastDraft = new EventEmitter<Draft>();
    this.studentId = authService.getId();
    this.dataSource = new MatTableDataSource<Draft>(this.drafts);
  }

  ngOnInit(): void {
    this.update();
  }


  update(){
    this.service.getDraftForStudent(this.studentId, this.courseName, this.assignmentId).subscribe(
      d => {
        const v = d.sort((d1, d2) => d2.timestampT.getTime() - d1.timestampT.getTime());
        this.dataSource.data = v;
        this.lastDraft.emit(v.length > 0 ? v[0] : new Draft(0, undefined, 0, 'NULL', true));
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      err => {
        console.log(err);
        this.snackBar.open('Errore nel caricamento degli elaborati', 'Chiudi');
      }
    );
  }

  checkError(draft: Draft): boolean{
    return !(draft.locker === true || draft.state === 'SUBMITTED' || draft.state === 'REVIEWED');
  }

  canOpen(element: Draft) {
    return element.state === 'SUBMITTED' || element.state === 'REVIEWED';
  }

  canOpenCorrection(element: Draft) {
    return element.state === 'REVIEWED';
  }

  add(element: Draft) {
    const v = [...this.dataSource.data];
    v.unshift(element);
    this.dataSource.data = v;
    this.lastDraft.emit(element);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
