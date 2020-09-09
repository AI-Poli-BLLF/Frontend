import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Assignment} from '../../models/assignment.model';
import {Draft} from '../../models/draft.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

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

  drafts: Array<Draft> = [];

  columnsToDisplay: string[] = ['id', 'matricola', 'stato', 'ultima modifica'];
  expandedElement: Draft | null;

  dataSource: MatTableDataSource<Draft>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  draft: Draft = null;

  constructor() { }

  @Input()
  set Drafts(drafts: Array<Draft>){
    this.drafts = drafts;
    this.dataSource.data = this.drafts;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.drafts);
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
