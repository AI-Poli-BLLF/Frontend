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
// todo: commenti
export class StudentsContComponent implements AfterViewInit, OnDestroy{
  courseName = '';
  students: Student[] = [];
  allStudents: Student[] = [];
  private sub: Subscription;

  constructor(
    private service: StudentService,
    private courseService: CourseService,
    private teamService: TeamService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer) {
    this.sub = this.route.parent.params.subscribe(params => {
      this.courseName = params.name;
      // console.log(params);
    });
  }

  // chiamata al backend per aggiungere uno studente ad un corso
  // se tutto va bene, prendo la foto e la setto per lo studente
  add(student: Student){
    this.service.enrollStudent(this.courseName, student.id)
      .subscribe(
        () => {
          this.getPhoto(student);
          // this.studentsComponent.addTableStudents(student);
          const v = [...this.students];
          v.unshift(student);
          this.students = v;
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
        this.students = this.students.filter(s => students.findIndex(s1 => s1.id === s.id) === -1);
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

  // vengono richiesti i dati al backend delle risorse
  // se si verificano errori li notifico con delle snackbar
  ngAfterViewInit(): void {
    this.getEnrolledStudent();

    this.service.getAll().subscribe(
      s => this.allStudents = s,
      error => {
        console.log(error);
        this.snackBar.open('Si è verificato un errore nel caricamento degli studenti.', 'Chiudi');
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private getEnrolledStudent(){
    this.service.getEnrolled(this.courseName).subscribe(s => {
      this.students = s;
      this.getTeams(this.courseName);
      this.getPhotos(this.students);
    });
  }

  getMembers(courseName: string, team: Team){
    this.teamService.getTeamMembers(courseName, team.id)
      .subscribe(
        members => {
          const v = [...this.students];
          members.forEach(m => v.find(s => s.id === m.id).groupName = team.name);
          this.students = v;
        },
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

  // scarica la foto per ogni studente nell'array
  getPhotos(students: Student[]){
    students.forEach(s => this.getPhoto(s));
  }

  // scarica la foto per singolo studente
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

  // chiamata al servizio di aggiunta al team tramite CSV
  enrollByCsv(file: File) {
    this.courseService.enrollByCsv(file, this.courseName).subscribe(
      () => this.getEnrolledStudent(),
      err => {
        console.log(err);
        this.snackBar.open('Ricontrollare la correttezza dei dati del file e che abbia estensione .csv', 'Chiudi');
      }
    );
  }
}
