import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Student} from '../../models/student.model';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {StudentsComponent} from './students.component';
import {StudentService} from '../../services/student.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
  styleUrls: ['./students-cont.component.css']
})
export class StudentsContComponent implements AfterViewInit, OnDestroy{
  courseName = '';
  private sub: Subscription;

  @ViewChild(StudentsComponent)
  studentsComponent: StudentsComponent;

  constructor(
    private service: StudentService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute) {
    this.sub = this.route.parent.params.subscribe(params => {
      this.courseName = params.name;
      console.log(params);
    });
  }

  add(student: Student){
    this.service.enrollStudent(this.courseName, student.id)
      .subscribe(
        () => this.studentsComponent.addTableStudents(student),
        () => this.service.getEnrolled(this.courseName).subscribe(s2 => {
          this.studentsComponent.EnrolledStudents = s2;
          // console.log('GET ALL ENROLLED -=> ADD ERROR');
        })
      );
  }

  del(students: Array<Student>) {
    const delObs: Array<Observable<Student>> = [];
    students.forEach(s => delObs.push(this.service.removeStudentFromCourse(this.courseName, s.id)));
    // todo: trovare un bel metodo
    forkJoin(delObs).subscribe(
      () => {
        this.studentsComponent.deleteTableStudents(students);
      },
      error => {
        console.log('Delete error: ', error);
        this.snackBar.open('Si è verificato un errore.', 'Chiudi');
        // console.log('GET ALL ENROLLED -=> DELETE ERROR');
        this.service.getEnrolled(this.courseName).subscribe(s2 => {
          this.studentsComponent.EnrolledStudents = s2;
        });
      }
    );
  }

  ngAfterViewInit(): void {
    this.service.getEnrolled(this.courseName).subscribe(s => this.studentsComponent.EnrolledStudents = s );
    this.service.getAll().subscribe(
      s => this.studentsComponent.AllStudents = s,
      error => {
        console.log(error);
        this.snackBar.open('Si è verificato un errore nel caricamento degli studenti.', 'Chiudi');
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
