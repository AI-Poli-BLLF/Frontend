import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Student} from '../../models/student.model';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit, AfterViewInit {

  enrolledStudents: Array<Student> = [];
  allStudents: Array<Student> = [];

  displayedColumns: string[] = ['select', 'id', 'name', 'firstName', 'group'];

  dataSource: MatTableDataSource<Student>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  student: Student = null;

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  @Output()
  add: EventEmitter<Student> = new EventEmitter();
  @Output()
  del: EventEmitter<Array<Student>> = new EventEmitter();

  @Input()
  set EnrolledStudents(students: Array<Student>){
    console.log('Enrolled setter');
    this.enrolledStudents = students;

    this.refreshEnrolledStudents();
  }

  deleteTableStudents(students: Array<Student>){
    this.enrolledStudents = this.enrolledStudents.filter(s => students.findIndex(s1 => s1.id === s.id) === -1);
    this.dataSource.data = this.enrolledStudents;
  }

  addTableStudents(student: Student){
    this.enrolledStudents.push(student);
    this.dataSource.data = this.enrolledStudents;
  }

  @Input()
  set AllStudents(students: Array<Student>){
    this.allStudents = students;
  }

  refreshEnrolledStudents(){
    this.dataSource.data = this.enrolledStudents;
    this.listChange();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.enrolledStudents);
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  isChecked(){
    const length = this.enrolledStudents.filter((a) => a.selected === true).length;
    return length !== 0;
  }

  isIntermediate(){
    const length = this.enrolledStudents.filter((a) => a.selected === true).length;
    return length !== 0 && length !== this.enrolledStudents.length;
    }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allStudents
      .filter(s => this.enrolledStudents.findIndex(s1 => s1.id === s.id) === -1)
      .map(s => s.toString())
      .filter(a => a.toLowerCase().includes(filterValue))
      .sort();
  }

  listChange() {
    this.isChecked();
    this.isIntermediate();

  }

  selectChange($event: MatCheckboxChange, s: Student) {
    s.selected = $event.checked;
    this.listChange();
  }

  selectHeaderChange($event: MatCheckboxChange) {
    this.enrolledStudents.forEach(s => s.selected = $event.checked);
    return;
  }

  deleteStudents() {
    this.del.emit(this.enrolledStudents.filter(s => s.selected === true));
  }

  studentSelected($event: MatAutocompleteSelectedEvent) {
    console.log($event.option.value);
    if (this.enrolledStudents.find(s => s.toString() === $event.option.value) != null) {
      this.student = null;
      return;
    }
    this.student = this.allStudents.find(s => s.toString() === $event.option.value);
  }

  addStudent() {
    this.myControl.setValue('');
    if (this.student == null) {
      return;
    }
    this.student.selected = false;
    this.add.emit(this.student);
    this.student = null;
  }

  uploadCsv($event) {
    console.log($event);
    const selectedFile: File = $event.target.files[0];
    console.log(selectedFile);
    if (selectedFile === undefined){
      return;
    }
    alert('Da implementare lato server');
    // this.service.uploadPhoto(this.profileData.roles[0], this.profileData.id, selectedFile).subscribe(
    //   data => {
    //     console.log(data);
    //     this.getPhoto(this.profileData.roles[0], this.profileData.id);
    //   },
    //   error => {
    //     console.log(error);
    //     this.snackBar.open(
    //       'Si è verificato un errore nell\'upload della foto. La massima dimensione consentita dei file è 3 MB.',
    //       'Chiudi');
    //   }
    // );
  }
}
