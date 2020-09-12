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

  columnsToDisplayDraft: string[] = ['firstName', 'name', 'id', 'state', 'timestamp'];
  expandedElement: Draft | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) dSort: MatSort;
  draft: Draft = null;

  dataSource: MatTableDataSource<Draft>;

  // private paginator2: MatPaginator;
  // private sort2: MatSort;

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
    this.dataSource.sort = this.dSort;
  }
  // @ViewChild(MatSort) set matSort(ms: MatSort){
  //   this.sort2 = ms;
  //   this.setDataSourceAttributes();
  // }
  //
  // @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator){
  //   this.paginator2 = mp;
  //   this.setDataSourceAttributes();
  // }
  //
  // setDataSourceAttributes(){
  //   this.dataSource.paginator = this.paginator2;
  //   this.dataSource.sort = this.sort2;
  // }


}
