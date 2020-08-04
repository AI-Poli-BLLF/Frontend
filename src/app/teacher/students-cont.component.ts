import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Student} from '../models/student.model';
import {forkJoin, Observable} from 'rxjs';
import {StudentsComponent} from './students.component';
import {StudentService} from '../services/student.service';

@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
  styleUrls: ['./students-cont.component.css']
})
export class StudentsContComponent implements AfterViewInit{

  @ViewChild(StudentsComponent)
  studentsComponent: StudentsComponent;

  constructor(private service: StudentService) {
  }

  add(student: Student){
    // this.service.updateEnrolled(student, 1)
    //   .subscribe(
    //     s => this.studentsComponent.addTableStudents(s),
    //     () => this.service.getEnrolled(1).subscribe(s2 => {
    //       this.studentsComponent.EnrolledStudents = s2;
    //       // console.log('GET ALL ENROLLED -=> ADD ERROR');
    //     })
    //   );
  }

  del(students: Array<Student>) {
    // const delObs: Array<Observable<Student>> = [];
    // students.forEach(s => delObs.push(this.service.updateEnrolled(s, 0)));
    // forkJoin(delObs).subscribe(
    //   s1 => {
    //     this.studentsComponent.deleteTableStudents(s1);
    //
    //   },
    //   () => {
    //     // console.log('GET ALL ENROLLED -=> DELETE ERROR');
    //     this.service.getEnrolled(1).subscribe(s2 => {
    //       this.studentsComponent.EnrolledStudents = s2;
    //       // console.log('GET ALL ENROLLED -=> DELETE ERROR');
    //     });
    //   }
    // );
  }

  ngAfterViewInit(): void {
    // this.service.getEnrolled(1).subscribe(s => this.studentsComponent.EnrolledStudents = s );
    // this.service.query().subscribe(s => this.studentsComponent.AllStudents = s);
  }
}
