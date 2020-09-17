import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {AssignmentService} from '../services/assignment.service';
import {Assignment} from '../models/assignment.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Draft} from '../models/draft.model';
import {now} from 'moment';
import {Timestamp} from 'rxjs/internal-compatibility';
import {any} from 'codelyzer/util/function';
import {MatTableDataSource} from '@angular/material/table';
import {startWith} from 'rxjs/operators';

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
export class AssignmentComponent implements OnInit, AfterViewInit {

  assignments: Array<Assignment> = [];

  columnsToDisplay: string[] = ['Id', 'Data di pubblicazione', 'Data di scadenza'];
  expandedElement: Draft | null;

  dataSource: MatTableDataSource<Assignment>;
  // dataSource = ELEMENT_DATA;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  assignment: Assignment = null;

  constructor(private assignmentService: AssignmentService) {
  }

  @Input()
  set Assignments(assignments: Array<Assignment>){
    this.assignments = assignments;
    this.dataSource.data = this.assignments;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.assignments);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }
}
// const ELEMENT_DATA: Assignment[] = [
//   new Assignment('ass1', new Timestamp(any, now()), new Timestamp(any, now())),
//   new Assignment('ass2', new Timestamp(any, now()), new Timestamp(any, now())),
//   new Assignment('ass3', new Timestamp(any, now()), new Timestamp(any, now())),
//   new Assignment('ass4', new Timestamp(any, now()), new Timestamp(any, now())),
//   new Assignment('ass5', new Timestamp(any, now()), new Timestamp(any, now())),
//   new Assignment('ass6', new Timestamp(any, now()), new Timestamp(any, now()))
// ];
