import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
// dummy component che si occupa di visualizzare i dati degli studenti iscritti al corso
// ed eliminarli/aggiungerli e aggiungerli tramite file csv
export class StudentsComponent implements OnInit {

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
    this.myControl.setValue('');
  }

  constructor() {
    this.enrollByCsvEvent = new EventEmitter<File>();
  }

  @Input()
  set AllStudents(students: Array<Student>){
    this.allStudents = students;
    this.myControl.setValue('');
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

    this.enrollByCsvEvent.emit(selectedFile);
  }

  triggerDeleteButton(){
    return this.enrolledStudents.filter(s => s.selected).length === 0;
  }
}
