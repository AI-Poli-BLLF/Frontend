import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {Student} from '../../models/student.model';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {StudentsComponent} from './students.component';
import {StudentService} from '../../services/student.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {CourseService} from '../../services/course.service';
import {TeamService} from '../../services/team.service';
import {Team} from '../../models/team.model';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
  styleUrls: ['./students-cont.component.css']
})
export class StudentsContComponent implements AfterViewInit, OnDestroy{
  courseName = '';
  students: Student[] = [];
  private sub: Subscription;

  @ViewChild(StudentsComponent)
  studentsComponent: StudentsComponent;

  constructor(
    private service: StudentService,
    private courseService: CourseService,
    private teamService: TeamService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer) {
    this.sub = this.route.parent.params.subscribe(params => {
      this.courseName = params.name;
      console.log(params);
    });
  }

  add(student: Student){
    this.service.enrollStudent(this.courseName, student.id)
      .subscribe(
        () => {
          this.getPhoto(student);
          this.studentsComponent.addTableStudents(student);
        },
        () => this.service.getEnrolled(this.courseName).subscribe(s2 => {
          this.students = s2;
          this.getTeams(this.courseName);
          this.getPhotos(this.students);
          // console.log('GET ALL ENROLLED -=> ADD ERROR');
        })
      );
  }

  del(students: Array<Student>) {
    const delObs: Array<Observable<Student>> = [];
    students.forEach(s => delObs.push(this.service.removeStudentFromCourse(this.courseName, s.id)));
    forkJoin(delObs).subscribe(
      () => {
        this.studentsComponent.deleteTableStudents(students);
      },
      error => {
        console.log('Delete error: ', error);
        this.snackBar.open('Si è verificato un errore.', 'Chiudi');
        // console.log('GET ALL ENROLLED -=> DELETE ERROR');
        this.service.getEnrolled(this.courseName).subscribe(s2 => {
          this.students = s2;
          this.getTeams(this.courseName);
          this.getPhotos(this.students);
        });
      }
    );
  }

  ngAfterViewInit(): void {
    this.service.getEnrolled(this.courseName).subscribe(s => {
      this.students = s;
      this.getTeams(this.courseName);
      this.getPhotos(this.students);
    });
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
  getMembers(courseName: string, team: Team){
    this.teamService.getTeamMembers(courseName, team.id)
      .subscribe(
        members => members.forEach(m => this.students.find(s => s.id === m.id).groupName = team.name),
        error => {
          console.log(error);
          this.snackBar.open('Si è verificato un errore nel recupero dei team.', 'Chiudi');
        }
      );
  }
  getTeams(courseName: string){
    this.courseService.getTeamsForCourse(courseName)
      .subscribe(
        data => data.forEach(t => this.getMembers(courseName, t)),
        error => {
          console.log(error);
          this.snackBar.open('Si è verificato un errore nel recupero dei team.', 'Chiudi');
        }
      );
  }

  getPhotos(students: Student[]){
    students.forEach(s => this.getPhoto(s));
  }

  getPhoto(student: Student){
    this.service.getPhoto(student.id)
      .subscribe(
        data => {
          const objectURL = URL.createObjectURL(data);
          student.photoUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        },
        error => {
          student.photoUrl = 'assets/img/default.png';
          console.log(error);
        }
      );
  }
}
