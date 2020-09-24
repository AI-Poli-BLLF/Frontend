import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Course} from '../../models/course.model';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl} from '@angular/forms';
import {CourseService} from '../../services/course.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {debounceTime, startWith} from 'rxjs/operators';
import {MatDialogRef} from '@angular/material/dialog';
import {StudentService} from '../../services/student.service';

@Component({
  selector: 'app-enroll-course-dialog',
  templateUrl: './enroll-course-dialog.component.html',
  styleUrls: ['./enroll-course-dialog.component.css']
})
// componente che permette l'invio di una notifica al prof p
// er chiedere di essere iscritti al corso
export class EnrollCourseDialogComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  private _courses: Course[];
  filteredCourses: MatTableDataSource<Course>;
  displayedColumns: string[] = ['name', 'acronym', 'sendRequest'];
  formControl: FormControl;

  constructor(
    private dialogRef: MatDialogRef<EnrollCourseDialogComponent>,
    private courseService: CourseService,
    private studentService: StudentService,
    private snackBar: MatSnackBar) {

    this._courses = [];
    this.filteredCourses = new MatTableDataSource<Course>();
    this.filteredCourses.data = this._courses.map(value => value);
    this.formControl = new FormControl();
  }

  ngOnInit(): void {
    this.filteredCourses.paginator = this.paginator;
    this.filteredCourses.sort = this.sort;
    // carico i corsi a cui non sono iscritto e che sono attivi a cui potrei iscrivermi
    this.studentService.getAvailableCourse().subscribe(
      data => {
        this.courses = data;
      },
      () => this.snackBar.open('Errore nel caricamento dei corsi', 'Chiudi')
    );
  }

  ngAfterViewInit(): void {
    this.formControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
    ).subscribe(
      value => this.filteredCourses.data = this._courses.filter(c => c.name.toLowerCase().includes(value.toString().toLowerCase()))
    );
  }

  set courses(course: Course[]) {
    this._courses = course;
    this.filteredCourses.data = this._courses.map(value => value);
  }

  // invio la richiesta e notifico l'utente con una snackbar
  sendEnrollRequest(course: Course) {
    this.courseService.sendEnrollRequest(course).subscribe(
      () => {
        this.dialogRef.close();
        this.snackBar.open('Richiesta di iscrizione inviata', 'Chiudi');
      },
      err => {
        console.log(err);
        this.snackBar.open('Richiesta di iscrizione fallita', 'Chiudi');
      }
    );
  }
}
