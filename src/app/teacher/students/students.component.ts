import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Student} from '../../models/student.model';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {UsersTableComponent} from '../../users-table/users-table.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  // todo: bug del primo elemento
  // todo: mettere selezione stile gmail

  enrolledStudents: Array<Student> = [];
  allStudents: Array<Student> = [];

  @ViewChild(UsersTableComponent)
  table: UsersTableComponent;

  student: Student = null;

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  @Output()
  enrollByCsvEvent: EventEmitter<File>;
  @Output()
  add: EventEmitter<Student> = new EventEmitter();
  @Output()
  del: EventEmitter<Array<Student>> = new EventEmitter();

  @Input()
  set EnrolledStudents(students: Array<Student>){
    this.enrolledStudents = students;
  }

  constructor() {
    this.enrollByCsvEvent = new EventEmitter<File>();
  }

  deleteTableStudents(students: Array<Student>){
    this.enrolledStudents = this.enrolledStudents.filter(s => students.findIndex(s1 => s1.id === s.id) === -1);
  }

  addTableStudents(student: Student){
    const v = [...this.enrolledStudents];
    v.unshift(student);
    this.enrolledStudents = v;
  }

  @Input()
  set AllStudents(students: Array<Student>){
    this.allStudents = students;
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allStudents
      .filter(s => this.enrolledStudents.findIndex(s1 => s1.id === s.id) === -1)
      .map(s => s.toString())
      .filter(a => a.toLowerCase().includes(filterValue))
      .sort();
  }

  deleteStudents() {
    this.del.emit(this.enrolledStudents.filter(s => s.selected === true));
  }

  studentSelected($event: MatAutocompleteSelectedEvent) {
    // console.log($event.option.value);
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
    // console.log($event);
    const selectedFile: File = $event.target.files[0];
    // console.log(selectedFile);
    if (selectedFile === undefined){
      return;
    }
    // alert('Da implementare lato server');
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

    this.enrollByCsvEvent.emit(selectedFile);
  }

  triggerDeleteButton(){
    return this.enrolledStudents.filter(s => s.selected).length === 0;
  }
}
