import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Course} from '../../models/course.model';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl} from '@angular/forms';
import {CourseService} from '../../services/course.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {debounceTime, startWith} from 'rxjs/operators';
import {NotificationService} from '../../services/notification.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-enroll-course-dialog',
  templateUrl: './enroll-course-dialog.component.html',
  styleUrls: ['./enroll-course-dialog.component.css']
})
export class EnrollCourseDialogComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  private _courses: Course[];
  filteredCourses: MatTableDataSource<Course>;
  displayedColumns: string[] = ['courseName', 'active', 'sendRequest'];
  formControl: FormControl;

  constructor(
    private dialogRef: MatDialogRef<EnrollCourseDialogComponent>,
    private courseService: CourseService,
    private snackBar: MatSnackBar) {

    this._courses = [];
    this.filteredCourses = new MatTableDataSource<Course>();
    this.filteredCourses.data = this._courses.map(value => value);
    this.formControl = new FormControl();
  }

  ngOnInit(): void {
    this.filteredCourses.paginator = this.paginator;
    this.filteredCourses.sort = this.sort;

    this.courseService.getAll().subscribe(
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