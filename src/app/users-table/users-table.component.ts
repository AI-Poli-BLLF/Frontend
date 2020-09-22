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
    console.log(value);
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

  ngOnInit() {
    if (this.students) {
      this.displayedColumns.push('group');
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

  selectHeaderChange($event: MatCheckboxChange) {
    this._elements.forEach(s => s.selected = $event.checked);
    return;
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

}
