import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Draft} from '../../../models/draft.model';
import {AuthService} from '../../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {AssignmentService} from '../../../services/assignment.service';
import {Student} from '../../../models/student.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-draft-history',
  templateUrl: './draft-history.component.html',
  styleUrls: ['./draft-history.component.css']
})
export class DraftHistoryComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Draft>;
  columnsToDisplay: string[] = ['id', 'state', 'timestampD', 'link'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  courseName: string;
  studentId: string;
  assignmentId: number;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private assignmentService: AssignmentService) {
    this.courseName = data.courseName;
    this.assignmentId = data.assignmentId;
    this.studentId = data.studentId;
    // const testData = [
    //   new Draft(1, '2020-09-25T22:00:00.000+0000', 0, 'READ', false),
    //   new Draft(2, '2020-09-25T22:00:00.000+0000', 30, 'REVIEWED', true),
    //   new Draft(3, '2020-09-25T22:00:00.000+0000', 0, 'SUBMITTED', false)
    // ];
    this.dataSource = new MatTableDataSource<Draft>([]);
  }

  ngOnInit(): void {
    // todo: riabilitare
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.update();
  }

  update(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  canOpen(element: Draft) {
    return (element.state !== 'READ' && element.state !== 'NULL');
  }

  private loadData() {
    this.assignmentService.getDraftForStudent(this.studentId, this.courseName, this.assignmentId)
      .subscribe(
        drafts => {
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
