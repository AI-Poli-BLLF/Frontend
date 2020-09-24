import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Course} from '../models/course.model';
import {MatSidenav} from '@angular/material/sidenav';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CourseService} from '../services/course.service';
import {AuthService} from '../services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AddCourseDialogComponent} from '../teacher/courses/add-course-dialog/add-course-dialog.component';
import {DeleteConfirmDialogComponent} from '../teacher/courses/delete-confirm-dialog/delete-confirm-dialog.component';
import {EditCourseDialogComponent} from '../teacher/courses/edit-course-dialog/edit-course-dialog.component';
import {EnrollCourseDialogComponent} from '../student/enroll-course-dialog/enroll-course-dialog.component';

@Component({
  selector: 'app-base-view',
  templateUrl: './base-view.component.html',
  styleUrls: ['./base-view.component.css']
})
export class BaseViewComponent implements OnInit, OnDestroy {
  homeS: Subscription;
  selectedItem: string;

  baseLink: string;

  courses: Array<Course> = [];

  @ViewChild(MatSidenav)
  sidenav: MatSidenav;

  constructor(private router: Router,
              private courseService: CourseService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private service: CourseService) {
    this.setBaseLink();
    this.homeS = router.events.subscribe(
      e => (e instanceof NavigationEnd && e.url === '/home') ? this.selectedItem = 'Seleziona un corso' : e
    );
  }

  setBaseLink(){
    switch (this.authService.getRole()) {
      case 'ROLE_ADMIN':
        this.baseLink = '/admin';
        break;
      case 'ROLE_PROFESSOR':
        this.baseLink = '/teacher';
        break;
      default:
        this.baseLink = '/student';
        break;
    }
  }

  isStudent(){
    return this.authService.getRole() === 'ROLE_STUDENT';
  }

  isTeacher(){
    return this.authService.getRole() === 'ROLE_PROFESSOR';
  }

  isAdmin(){
    return this.authService.getRole() === 'ROLE_ADMIN';
  }

  ngOnInit(): void {
    this.loadCourses();
    const courseName = this.route.firstChild.snapshot.params.name;
    this.selectedItem = courseName === undefined ? 'Seleziona un corso' : courseName;
  }

  toggleForMenuClick() {
    this.sidenav.toggle();
  }

  openAddCourseDialog(){
    // todo: unsubrscribe?
    const dialogRef = this.dialog.open(AddCourseDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.loadCourses();
    });
  }

  snackBarDelete() {
    if (this.courses.findIndex(c => c.name === this.selectedItem) === -1) {
      this.snackBar.open('Corso cancellato', 'Chiudi');
      this.selectedItem = 'Seleziona un corso';
      this.router.navigate([this.baseLink]);
    }
  }

  deleteCourseDialog(){
    // todo: unsubrscribe?
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {data: this.selectedItem});
    dialogRef.afterClosed().subscribe(value => {
      // tslint:disable-next-line:triple-equals
      if (value != 'true'){
        return;
      }
      this.service.deleteOne(this.selectedItem).subscribe(
        () => {
          this.courses = this.courses.filter(c => c.name !== this.selectedItem);
          this.snackBarDelete();
        },
        error => {
          console.log(error);
          this.snackBar.open('Si è verificato un errore', 'Chiudi');
        }
      );

    });
  }

  startToEditCourse(){
    const course: Course = this.courses.find(c => c.name === this.selectedItem);
    this.courseService.getCourseVmModel(course.name)
      .subscribe(
        vmModel => {
          const d = {course, vmModel};
          const dialogRef = this.dialog.open(EditCourseDialogComponent, {data: d});
          dialogRef.afterClosed().subscribe(data => {
            // console.log(course.enabled, '!=', data);
            this.loadCourses();
            // tslint:disable-next-line:triple-equals
            if (('' + course.enabled) != data) {
              this.selectedItem = 'Seleziona un corso';
              this.router.navigate([this.baseLink]);
            }
          });
        },
        error => {
          console.log(error);
          this.snackBar.open('Impossibile caricare il modello della Vm.', 'Chiudi');
        }
      );
  }

  handleClick(selectedItem: Course) {
    this.selectedItem = selectedItem.name;
  }

  ngOnDestroy(): void {
    this.homeS.unsubscribe();
  }

  loadCourses(){
    let obs: Observable<Array<Course>>;
    switch (this.authService.getRole()) {
      case 'ROLE_ADMIN':
        obs = this.courseService.getAll();
        break;
      case 'ROLE_PROFESSOR':
        obs = this.courseService.getAllByProfessor(this.authService.getId());
        break;
      default:
        obs = this.courseService.getAllByStudent(this.authService.getId());
        break;
    }
    obs.subscribe(
      data => {
        this.courses = data;
      },
      error => {
        console.log(error);
        this.snackBar.open('Si è verificato un errore nel caricamento dei corsi.', 'Chiudi');
      }
    );
  }


  getAcronym() {
    const course = this.courses.find(value => value.name === this.selectedItem);
    if (course === undefined) {
      return '';
    }
    return this.selectedItem !== 'Seleziona un corso' ?
      `${course.acronym} - ` : '';
  }

  isDisabled(element: Course) {
    return (this.authService.getRole() === 'ROLE_STUDENT' && !element.enabled);
  }

  adminToolsClick() {
    this.selectedItem = 'Admin Tools';
  }

  openEnrollDialog() {
    this.dialog.open(EnrollCourseDialogComponent);
  }
}
