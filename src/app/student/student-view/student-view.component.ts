import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Course} from '../../models/course.model';
import {Subscription} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CourseService} from '../../services/course.service';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../services/auth.service';
import {EnrollCourseDialogComponent} from '../enroll-course-dialog/enroll-course-dialog.component';

@Component({
  selector: 'app-student-view',
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.css']
})
export class StudentViewComponent implements OnInit, OnDestroy {
  homeS: Subscription;
  selectedItem: string;
  courses: Array<Course> = [];

  @ViewChild(MatSidenav)
  sidenav: MatSidenav;

  constructor(private router: Router,
              private courseService: CourseService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private dialog: MatDialog) {
    this.homeS = router.events.subscribe(
      e => (e instanceof NavigationEnd && e.url === '/home') ? this.selectedItem = 'Seleziona un corso' : e
    );
  }

  ngOnInit(): void {
    this.loadCourses();
    const courseName = this.route.firstChild.snapshot.params.name;
    this.selectedItem = courseName === undefined ? 'Seleziona un corso' : courseName;
  }

  toggleForMenuClick() {
    this.sidenav.toggle();
  }

  handleClick(selectedItem: Course) {
    this.selectedItem = selectedItem.name;
  }

  ngOnDestroy(): void {
    this.homeS.unsubscribe();
  }

  loadCourses(){
    this.courseService.getAllByStudent(this.authService.getId()).subscribe(
      data => {
        // console.log(data);
        this.courses = data.length > 0 ? data : [new Course('Nessun corso', false, 0, 0, '')] ;
        this.selectedItem = this.courses.findIndex(c => c.name === this.selectedItem) === -1 ? 'Seleziona un corso' : this.selectedItem;
      },
      error => console.log(error)
    );
  }

  openEnrollDialog() {
    const dialogRef = this.dialog.open(EnrollCourseDialogComponent);
    const afterOpened = dialogRef.afterOpened();
  }

  getAcronym() {
    const course = this.courses.find(value => value.name === this.selectedItem);
    if (course === undefined) {
      return '';
    }
    return this.selectedItem !== 'Seleziona un corso' ?
      `${course.acronym} - ` : '';
  }
}
