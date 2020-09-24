import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AssignmentService} from '../../services/assignment.service';
import {Assignment} from '../../models/assignment.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Draft} from '../../models/draft.model';
import {now} from 'moment';
import {Timestamp} from 'rxjs/internal-compatibility';
import {any} from 'codelyzer/util/function';
import {MatTableDataSource} from '@angular/material/table';
import {startWith} from 'rxjs/operators';
import {AssignmentStudentsComponent} from './assignment-students/assignment-students.component';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AssignmentComponent implements AfterViewInit {

  assignments: Array<Assignment> = [];
  columnsToDisplay: string[] = ['name', 'releaseDate', 'expiryDate', 'link'];
  expandedElement: Draft | null;

  @Input()
  courseName: string;

  dataSource: MatTableDataSource<Assignment>;
  // dataSource = ELEMENT_DATA;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  assignment: Assignment;

  constructor(
    private assignmentService: AssignmentService) {
    this.dataSource = new MatTableDataSource(this.assignments);
  }

  // setter degli assigments che aggiorna il paginator e ordina
  // gli elementi quando vengono aggiunti
  @Input()
  set Assignments(assignments: Array<Assignment>){
    this.assignments = assignments.sort((e1, e2) => e2.releaseDateT.getTime() - e1.releaseDateT.getTime());;
    this.dataSource.data = this.assignments;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onClick(column: Assignment) {
    this.assignment = column;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}