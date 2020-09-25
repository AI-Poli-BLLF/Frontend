import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Student} from '../models/student.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {User} from '../models/user.model';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
// tabella per visualizzazione degli user (quindi sia professori che studenti)
export class UsersTableComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['photo', 'id', 'name', 'firstName'];
  dataSource: MatTableDataSource<User>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // tslint:disable-next-line:variable-name
  private _elements: User[] = [];

  @Input()
  students = false;

  @Input()
  set elements(value: User[]) {
    // console.log(value);
    // console.log(value);
    this._elements = value;
    this.refreshEnrolledStudents();
  }
  @Output()
  elementsChange = new EventEmitter<User[]>();

  // update(){
  //   this.refreshEnrolledStudents();
  // }

  constructor() {
    this.dataSource = new MatTableDataSource(this._elements);
  }

  // in caso si tratti di una tabella per gli studenti aggiungo
  // i campi del gruppo e l'opzione per selezionare
  ngOnInit() {
    if (this.students) {
      this.displayedColumns.push('groupName');
      this.displayedColumns.unshift('select');
    }
    this.update();
  }

  isChecked(){
    const length = this._elements.filter((a) => a.selected === true).length;
    return length !== 0;
  }

  isIntermediate(){
    const length = this._elements.filter((a) => a.selected === true).length;
    return length !== 0 && length !== this._elements.length;
  }

  selectChange($event: MatCheckboxChange, s: User) {
    s.selected = $event.checked;
    this.listChange();
    this.elementsChange.emit(this._elements);
  }

  listChange() {
    this.isChecked();
    this.isIntermediate();
  }

  numberSelected(){
    return this.dataSource.data.filter(e => e.selected === true).length;
  }

  notVisibleSelected(){
    return this.getPageData().filter(e => e.selected === true).length
      !== this.numberSelected();
  }
  elementNotSelected(){
    return this.dataSource.data.length > this.numberSelected();
  }

  isEntirePageSelected() {
    return this.getPageData().every((u) => u.selected) && this.dataSource.data.length !== 0;
  }
  isAtLeastOneSelected(onlyPage: boolean = true) {
    if (onlyPage) {
      return this.getPageData().findIndex((u) => u.selected === true) !== -1;
    }
    return this.dataSource.data.findIndex((u) => u.selected === true) !== -1;
  }

  areAllStudentSelected(){
    return this.dataSource.data.filter(u => u.selected).length === this.dataSource.data.length;
  }

  getPageData() {
    return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
  }

  selectHeaderChange($event: MatCheckboxChange) {
    this.getPageData().forEach(u => u.selected = $event.checked);
    // this._elements.forEach(s => s.selected = $event.checked);
  }

  refreshEnrolledStudents(){
    this.dataSource.data = this._elements;
    this.listChange();
  }

  update(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.update();
  }

  selectAll() {
    this.dataSource.data.forEach(u => u.selected = true);
  }

  numberAllStudents() {
    return this.dataSource.data.length;
  }

  gridColumnNumber() {
    if (this.isEntirePageSelected() && !this.areAllStudentSelected()){
      return 2;
    }
    return 1;
  }
}
